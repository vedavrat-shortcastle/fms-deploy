'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { trpc } from '@/utils/trpc'; // Adjust the import if needed
import { PlayerCard } from '@/components/membership-components/PlayerMembershipCard';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';

const logo = '/assets/logoPlayersMembership.svg';

export default function PlayerSelectionPage() {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const router = useRouter();
  const limit = 20;
  const { status } = useSession();
  const { t } = useTranslation();

  const searchParams = useSearchParams();
  const membershipPlanId = searchParams.get('planId'); //TODO: Wire up the planId to the payment page

  const { data: plan } = trpc.membership.getPlanById.useQuery({
    id: membershipPlanId!,
  });

  // Handle authentication
  if (status === 'loading') {
    return <div>{t('playerSelectionPage_loading')}</div>;
  }
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  // Fetch players using the new endpoint
  // This is currently fetching the players list in parent profile from parent getPlayers endpoint.
  const { data, isLoading, error } = trpc.parent.getPlayers.useQuery({
    page: currentPage,
    limit,
    searchQuery: searchValue,
  });

  // Handle errors
  if (error) {
    if (error.data?.code === 'FORBIDDEN') {
      return <div>{t('playerSelectionPage_unauthorized')}</div>;
    } else if (error.data?.code === 'NOT_FOUND') {
      return <div>{t('playerSelectionPage_parentNotFound')}</div>;
    } else {
      return (
        <div>
          {t('playerSelectionPage_errorLoadingPlayers')} {error.message}
        </div>
      );
    }
  }
  // 5. Transform the fetched data to match what the PlayerCard expects
  const players =
    data?.players.map((player) => {
      const playerSubscription = data.playerSubscriptions.players.find(
        (sub) => sub.id === player.profile?.profileId
      );

      return {
        id: player.profile?.profileId ?? '',
        name: `${player.firstName} ${player.lastName}`,
        initials:
          `${player.firstName[0] ?? ''}${player.lastName[0] ?? ''}`.toUpperCase(),
        email: player.email,
        isPlanActive:
          playerSubscription?.subscriptions.some(
            (sub) => sub.planId === membershipPlanId
          ) ?? false,
        fideId: '00', // FIDE ID isn’t included; adjust if needed
        price: plan?.price ?? 45.0, // Hardcoded as before
      };
    }) || [];

  // 6. Toggle player selection on PlayerCard interaction
  const handleSelectPlayer = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedPlayers([...selectedPlayers, id]);
    } else {
      setSelectedPlayers(selectedPlayers.filter((playerId) => playerId !== id));
    }
  };

  const totalAmount = selectedPlayers.length * (plan?.price ?? 45.0);

  const handlePayNow = () => {
    const selectedPlayerDetails = players
      .filter((player) => selectedPlayers.includes(player.id))
      .map(({ id, name, email }) => ({ id, name, email }));

    if (selectedPlayerDetails.length === 0) {
      alert(t('playerSelectionPage_selectAtLeastOnePlayer'));
      return;
    }
    // Construct query string with planId and playerIds
    const queryParams = new URLSearchParams();
    queryParams.append('planId', membershipPlanId || ''); // Pass the planId
    queryParams.append('playerIds', selectedPlayers.join(',')); // Pass playerIds as a comma-separated string

    // Redirect to the payment page with query parameters
    router.push(`/memberships-payment?${queryParams.toString()}`);
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div className="flex min-h-svh">
      <div className="flex-1">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Image
              src={logo}
              alt="Players Membership Logo"
              width={25}
              height={25}
              className="mr-2"
            />
            <h1 className="text-xl font-bold text-gray-700">
              {t('playerSelectionPage_players')}
            </h1>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {t('playerSelectionPage_selectPlayers')}
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder={t('playerSelectionPage_search')}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-md w-[250px]"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {isLoading ? (
            <div>{t('playerSelectionPage_loading')}</div>
          ) : error ? (
            <div>{t('playerSelectionPage_errorLoadingPlayers')}</div>
          ) : (
            <div className="space-y-2 mb-6">
              {players.map((player) => (
                <div key={player.id} className="player-card-wrapper">
                  <PlayerCard
                    player={player}
                    onSelect={handleSelectPlayer}
                    isSelected={selectedPlayers.includes(player.id)}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-1">
              <button
                className="p-2 border border-gray-300 rounded"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`h-8 w-8 flex items-center justify-center ${
                      page === currentPage
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600'
                    } font-medium`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                className="p-2 border border-gray-300 rounded"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-lg text-primary">
              {t('playerSelectionPage_totalPlayers')} {selectedPlayers.length}
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gray-200 flex gap-x-8 py-2 px-6 rounded-md">
                <div className="font-bold text-2xl">
                  {t('playerSelectionPage_total')}
                </div>
                <div className="font-bold text-2xl">
                  ${totalAmount.toFixed(2)}
                </div>
              </div>
              <button
                onClick={handlePayNow}
                className="bg-primary text-white px-16 py-3 rounded-md hover:bg-red-400"
              >
                {t('playerSelectionPage_payNow')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
