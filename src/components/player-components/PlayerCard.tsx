'use client';
import React from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Player } from '@/dummydata/initialPlayers';
import { Trash, Edit } from 'lucide-react';

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
          <Image
            src={player.image}
            alt={player.name}
            width={80}
            height={80}
            className="rounded-lg object-cover mb-3"
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
            <Trash width={16} height={16} />
          </button>
          <button
            className="p-1 rounded-full bg-gray-100 text-gray-500"
            onClick={(e) => onEdit(player, e)}
          >
            <Edit width={16} height={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
