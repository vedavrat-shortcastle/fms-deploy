'use client';

import React, { useCallback, useState, useRef } from 'react';
import { Search, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { trpc } from '@/utils/trpc';
import { Pagination } from '@/components/ui/pagination';
import PlayerCard from '@/components/player-components/PlayerCard';
import { PlayerCardTypes } from '@/schemas/Player.schema';
import Loader from '@/components/Loader';
import { PERMISSIONS } from '@/config/permissions';
import { ProtectedRoute } from '@/hooks/protectedRoute';
import { Input } from '@/components/ui/input';
import { debounce } from 'lodash';

// Assuming you have a hook to get session data (including the user's role)
import { useSession } from 'next-auth/react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');

  // File input ref for CSV upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Check user role for conditional query
  const isParent = session?.user?.role === 'PARENT';

  // Conditional API call: if parent, use parent's getPlayers route; otherwise, use player's route.
  const playersQuery = isParent
    ? trpc.parent.getPlayers.useQuery({
        limit,
        page: currentPage,
        searchQuery: debounceSearchTerm,
      })
    : trpc.player.getPlayers.useQuery({
        limit,
        page: currentPage,
        searchQuery: debounceSearchTerm,
      });

  // CSV export remains unchanged (always using the player endpoint)
  const exportCSVQuery = trpc.player.getPlayersCSV.useQuery(
    { searchQuery: debounceSearchTerm },
    { enabled: false }
  );

  // Mutation for deleting a player
  const deletePlayerMutation = trpc.player.deletePlayerById.useMutation({
    onSuccess: () => {
      playersQuery.refetch();
    },
    onError: (error) => {
      console.error('Failed to delete player:', error.message);
      alert('Delete failed. Please try again.');
    },
  });

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebounceSearchTerm(value);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const players = playersQuery.data?.players || [];

  // Delete player using tRPC mutation
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this player?')) {
      deletePlayerMutation.mutate({ id });
    }
  };

  // Edit player: navigate to the edit page for the given player id
  const handleEdit = (player: PlayerCardTypes, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/players/${player.id}`);
  };

  // Navigate to add player page
  const handleAddPlayer = () => {
    router.push('/players/add-player');
  };

  // View player details
  const handleViewPlayerDetails = (playerId: string) => {
    router.push(`/players/${playerId}`);
  };

  // Handle CSV upload: trigger file picker by clicking hidden file input
  const handleUploadCSV = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection from file picker
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected CSV file:', file.name);
      // TODO: Process the CSV file here (e.g., read content, send to API, etc.)
    }
  };

  // Handle sample CSV download (CSV with just the header row)
  const handleSampleCSV = () => {
    const header =
      'Email,Password,First Name,Last Name,Middle Name,Name Suffix,Birth Date,Gender,AvatarUrl,AgeProof,Street Address,Street Address2,Country,State,City,Postal Code,Phone Number,Country Code,FideId,School Name,Graduation Year,Grade In School,Grade Date,Club Name\n';
    const blob = new Blob([header], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_players.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export functionality: remains unchanged
  const handleExport = async () => {
    try {
      const result = await exportCSVQuery.refetch();
      if (result.data) {
        const csvContent = result.data;
        const blob = new Blob([csvContent], {
          type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'players.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        alert('No data available for export.');
      }
    } catch (error) {
      console.error('Export failed', error);
      alert('Export failed. Please try again.');
    }
  };

  // Implement pagination logic
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.PLAYER_VIEW}>
      <div className="flex h-screen bg-gray-50">
        <main className="flex-1 flex flex-col overflow-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
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
                onChange={handleSearchChange}
              />
            </div>
            {/* Dropdown for Import options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-200 text-gray-600 rounded-md"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleUploadCSV}>
                  Upload CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSampleCSV}>
                  Sample CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              className="border-gray-200 text-gray-600 rounded-md"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Hidden file input for CSV upload */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {playersQuery.isLoading ? (
            <div className="flex justify-center items-center flex-grow">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {players.map((player: any) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onView={handleViewPlayerDetails}
                />
              ))}
            </div>
          )}

          <div className="mt-auto">
            <Pagination
              totalRecords={playersQuery.data?.total || 0}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              itemsPerPage={limit}
              onItemsPerPageChange={setLimit}
            />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
