'use client';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Player } from '@/dummydata/initialPlayers';

interface PlayerCardProps {
  player: Player;
  onDelete: (id: number, e: React.MouseEvent) => void;
  onEdit: (player: Player, e: React.MouseEvent) => void;
  onView: (playerId: number) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onDelete,
  onEdit,
  onView,
}) => {
  return (
    <div
      className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden cursor-pointer"
      onClick={() => onView(player.id)}
    >
      <div className="p-4 flex flex-col items-center">
        {player.image ? (
          <img
            src={player.image}
            alt={player.name}
            className="w-20 h-20 rounded-lg object-cover mb-3"
          />
        ) : (
          <Avatar className="w-20 h-20 mb-3">
            <AvatarImage src="/default-avatar.png" alt={player.name} />
            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <h3 className="font-medium text-center">{player.name}</h3>
        <p className="text-sm text-gray-500 text-center">{player.email}</p>
        <p className="text-sm text-gray-500 text-center">{player.phone}</p>
        <p className="text-sm text-gray-500 text-center mb-3">
          {player.gender}
        </p>
        <div className="flex justify-center gap-2">
          <button
            className="p-1 rounded-full bg-red-100 text-red-500"
            onClick={(e) => onDelete(player.id, e)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
          <button
            className="p-1 rounded-full bg-gray-100 text-gray-500"
            onClick={(e) => onEdit(player, e)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
