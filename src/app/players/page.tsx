// page.tsx
'use client';
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Sidebar from '@/components/SideBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import PlayerCard from '@/components/player-components/PlayerCard';
import { Player, initialPlayers } from '@/dummydata/initialPlayers';

export default function Page() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter players based on the search term
  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.phone.includes(searchTerm)
  );

  // Delete player
  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this player?')) {
      setPlayers(players.filter((player) => player.id !== id));
    }
  };

  // Edit player: navigate to the edit page for the given player id
  const handleEdit = (player: Player, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/players/${player.id}`);
  };

  // Navigate to add player page
  const handleAddPlayer = () => {
    router.push('/players/add-player');
  };

  // View player details
  const handleViewPlayerDetails = (playerId: number) => {
    router.push(`/players/${playerId}`);
  };

  // Import functionality
  const handleImport = () => {
    alert('Import functionality would open file dialog');
  };

  // Export functionality
  const handleExport = () => {
    alert('Export functionality would download player data');
  };

  // Pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
            <h1 className="text-lg font-medium text-gray-700">Players</h1>
          </div>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white rounded"
            onClick={handleAddPlayer}
          >
            Add Player
          </Button>
        </div>

        <div className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 rounded-md border-gray-200"
              placeholder="Search"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="border-gray-200 text-gray-600 rounded-md"
            onClick={handleImport}
          >
            <svg
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Import
          </Button>
          <Button
            variant="outline"
            className="border-gray-200 text-gray-600 rounded-md"
            onClick={handleExport}
          >
            <svg
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onView={handleViewPlayerDetails}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded border-gray-200 text-gray-600 h-8 w-8 p-0"
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </Button>
          {[1, 2, 3, 4, 5].map((page) => (
            <Button
              key={page}
              variant="outline"
              size="sm"
              className={`rounded h-8 w-8 p-0 ${
                currentPage === page
                  ? 'bg-red-50 border-red-100 text-red-500'
                  : 'border-gray-200 text-gray-600'
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <span className="text-gray-400">...</span>
          <Button
            variant="outline"
            size="sm"
            className="rounded border-gray-200 text-gray-600 h-8 w-8 p-0"
            onClick={() => handlePageChange(10)}
          >
            10
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded border-gray-200 text-gray-600 h-8 w-8 p-0"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === 10}
          >
            &gt;
          </Button>
        </div>
      </main>
    </div>
  );
}
