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
import { useSession } from 'next-auth/react';
import Papa from 'papaparse';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/useToast';

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null); // State for upload status
  const { toast } = useToast();

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
      setCurrentPage(1); // Reset to first page on new search
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

  const uploadPlayersCSV = trpc.federation.uploadPlayersCSV.useMutation();

  // Handle CSV upload: trigger file picker by clicking hidden file input
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('Uploading...');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: { data: any[] }) => {
        try {
          // Format CSV data to match the schema
          const players = results.data.map((player: any) => ({
            baseUser: {
              email: player.Email?.trim() || '',
              password: player.Password?.trim() || 'arunsrinivaas',
              firstName: player.FirstName?.trim() || '',
              lastName: player.LastName?.trim() || '',
              middleName: player.MiddleName?.trim() || null,
              nameSuffix: player.NameSuffix?.trim() || null,
            },
            playerDetails: {
              birthDate: player.BirthDate
                ? new Date(player.BirthDate)
                : new Date(),
              gender: player.Gender?.trim() || '',
              avatarUrl: player.AvatarUrl?.trim() || null,
              ageProof: player.AgeProof?.trim() || null,
              streetAddress: player.StreetAddress?.trim() || '',
              streetAddress2: player.StreetAddress2?.trim() || null,
              country: player.Country?.trim() || '',
              state: player.State?.trim() || '',
              city: player.City?.trim() || '',
              postalCode: player.PostalCode?.trim() || '',
              phoneNumber: player.PhoneNumber?.trim() || null,
              fideId: player.FideId?.trim() || null,
              schoolName: player.SchoolName?.trim() || null,
              graduationYear: player.GraduationYear
                ? parseInt(player.GraduationYear, 10)
                : null,
              gradeInSchool: player.GradeInSchool?.trim() || null,
              gradeDate: player.GradeDate
                ? new Date(player.GradeDate)
                : new Date(),
              clubName: player.ClubName?.trim() || null,
            },
          }));

          // Call the mutation with formatted players' data
          const response = await uploadPlayersCSV.mutateAsync(players);

          if (response.success) {
            setUploadStatus(null);
            toast({
              title: 'Success',
              description: 'Players uploaded successfully!',
              variant: 'default',
            });
            playersQuery.refetch(); // Refresh player list
          } else {
            toast({
              title: 'Failed',
              description: 'Failed to Upload!',
              variant: 'destructive',
            });
          }
        } catch (error) {
          console.error('Upload error:', error);
          toast({
            title: 'Failed',
            description: 'Failed to Upload! Try Again',
            variant: 'destructive',
          });
        }
      },
      error: (error: any) => {
        console.error('CSV Parsing Error:', error);
        setUploadStatus('Error parsing CSV file.');
      },
    });

    // Clear the file input value so the same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle sample CSV download (CSV with just the header row)
  const handleSampleCSV = () => {
    const header =
      'Email,Password,FirstName,LastName,MiddleName,NameSuffix,BirthDate,Gender,AvatarUrl,AgeProof,StreetAddress,StreetAddress2,Country,State,City,PostalCode,PhoneNumber,CountryCode,FideId,SchoolName,GraduationYear,GradeInSchool,GradeDate,ClubName\n';
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
      <div className="flex min-h-svh bg-gray-50">
        <main className="flex-1 flex flex-col p-6">
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
                <DropdownMenuItem onClick={triggerFileUpload}>
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
              disabled={players.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Hidden file input for CSV upload */}
          <Input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />

          {uploadStatus && (
            <div className="mb-4 rounded-md bg-blue-100 p-3 text-sm text-blue-700">
              {uploadStatus}
            </div>
          )}

          {playersQuery.isLoading ? (
            <div className="flex justify-center items-center flex-grow">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {players?.map((player: any) => (
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
