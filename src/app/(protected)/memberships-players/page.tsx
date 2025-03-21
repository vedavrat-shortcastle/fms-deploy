'use client';

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

import { PlayerCard } from '@/components/membership-components/PlayerMembershipCard';
import Image from 'next/image';
const logo = '/assets/logoPlayersMembership.svg';

export default function PlayerSelectionPage() {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const players = [
    {
      id: '1',
      name: 'Spencer Jhon',
      initials: 'SJ',
      gender: 'Male' as const,
      email: 'riley.emerson@example.com',
      fideId: '829392',
      price: 45.0,
    },
    {
      id: '2',
      name: 'Emily Harper',
      initials: 'EH',
      gender: 'Female' as const,
      email: 'riley.emerson@example.com',
      fideId: '829392',
      price: 45.0,
    },
    {
      id: '3',
      name: 'Michael Reynolds',
      initials: 'MR',
      gender: 'Male' as const,
      email: 'riley.emerson@example.com',
      fideId: '829392',
      price: 45.0, // Added missing price here
    },
    {
      id: '4',
      name: 'Olivia Bennett',
      initials: 'OB',
      gender: 'Female' as const,
      email: 'riley.emerson@example.com',
      fideId: '829392',
      price: 45.0,
    },
    {
      id: '5',
      name: 'Michael Reynolds',
      initials: 'MR',
      gender: 'Male' as const,
      email: 'riley.emerson@example.com',
      fideId: '829392',
      price: 45.0,
    },
  ];

  const handleSelectPlayer = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedPlayers([...selectedPlayers, id]);
    } else {
      setSelectedPlayers(selectedPlayers.filter((playerId) => playerId !== id));
    }
  };

  const totalAmount = selectedPlayers.length * 45.0;

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center mb-6">
            {/* logo image */}
            <Image
              src={logo}
              alt="Players Membership Logo"
              width={25}
              height={25}
              className="mr-2"
            />
            {/* Players heading */}
            <h1 className="text-xl font-bold text-gray-700">Players</h1>
          </div>

          {/* Subheading */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Select Players</h2>
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-md w-[250px]"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

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

          {/* Pagination */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-1">
              <button className="p-2 border border-gray-300 rounded">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((page) => (
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
              ))}
              <span className="px-1">...</span>
              <button className="h-8 w-8 flex items-center justify-center text-gray-600 font-medium">
                20
              </button>
              <button className="p-2 border border-gray-300 rounded">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Bottom portion / Total amount / Pay now button */}
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
              <button className="bg-primary text-white px-16 py-3 rounded-md hover:bg-red-400">
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
