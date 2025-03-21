'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { trpc } from '@/utils/trpc'; // Adjust the import if needed
import { PlayerCard } from '@/components/membership-components/PlayerMembershipCard';
import Image from 'next/image';

const logo = '/assets/logoPlayersMembership.svg';

export default function PlayerSelectionPage() {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const router = useRouter();
  const limit = 20;

  // Access the getPlayers procedure from the player router
  const { data, isLoading, error } = trpc.player.getPlayers.useQuery({
    page: currentPage,
    limit,
    searchQuery: searchValue,
  });

  // 5. Transform the fetched data to match what the PlayerCard expects
  const players =
    data?.players.map((player) => ({
      id: player.id,
      name: `${player.firstName} ${player.lastName}`,
      initials:
        `${player.firstName[0] ?? ''}${player.lastName[0] ?? ''}`.toUpperCase(),
      gender: (player as any).gender || 'N/A',
      email: player.email,
      fideId: (player as any).fideId || '',
      price: 45.0,
    })) || [];

  // 6. Toggle player selection on PlayerCard interaction
  const handleSelectPlayer = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedPlayers([...selectedPlayers, id]);
    } else {
      setSelectedPlayers(selectedPlayers.filter((playerId) => playerId !== id));
    }
  };

  const totalAmount = selectedPlayers.length * 45.0;

  const handlePayNow = () => {
    const selectedPlayerDetails = players
      .filter((player) => selectedPlayers.includes(player.id))
      .map(({ id, name, gender, email }) => ({ id, name, gender, email }));

    if (selectedPlayerDetails.length === 0) {
      alert('Please select at least one player.');
      return;
    }

    const query = new URLSearchParams();
    selectedPlayerDetails.forEach((player, index) => {
      query.append(`players[${index}][id]`, player.id);
      query.append(`players[${index}][name]`, player.name);
      query.append(`players[${index}][gender]`, player.gender);
      query.append(`players[${index}][email]`, player.email);
    });

    router.push(`/memberships-payment?${query.toString()}`);
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Image
              src={logo}
              alt="Players Membership Logo"
              width={25}
              height={25}
              className="mr-2"
            />
            <h1 className="text-xl font-bold text-gray-700">Players</h1>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Select Players</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-md w-[250px]"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error loading players</div>
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
              Total Players: {selectedPlayers.length}
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gray-200 flex gap-x-8 py-2 px-6 rounded-md">
                <div className="font-bold text-2xl">Total</div>
                <div className="font-bold text-2xl">
                  ${totalAmount.toFixed(2)}
                </div>
              </div>
              <button
                onClick={handlePayNow}
                className="bg-primary text-white px-16 py-3 rounded-md hover:bg-red-400"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
