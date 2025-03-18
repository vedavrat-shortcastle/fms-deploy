'use client';

import type React from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2, Edit, Mail, User, ActivitySquare } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { PlayerCardTypes } from '@/schemas/Player.schema';

interface PlayerCardProps {
  player: PlayerCardTypes;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onEdit: (player: PlayerCardTypes, e: React.MouseEvent) => void;
  onView: (playerId: string) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onDelete,
  onEdit,
  onView,
}) => {
  const fullName = `${player.firstName} ${player.lastName}`;

  // Generate a gradient based on the first letter of the name
  const getGradient = (name: string) => {
    const gradients = ['from-red-400 to-red-300', 'from-gray-400 to-gray-300'];

    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  const gradient = getGradient(player.firstName);

  return (
    <div
      className="group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700"
      onClick={() => onView(player.id)} //TODO: Change it to a button component if we are going to keep the onClick event
    >
      {/* Card Header with Gradient */}
      <div className={cn('h-24 w-full bg-gradient-to-r', gradient)} />

      {/* Avatar */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
        {player.avatarUrl ? (
          <div className="rounded-full border-4 border-white dark:border-gray-900 overflow-hidden">
            <Image
              src={player.avatarUrl || '/placeholder.svg'}
              alt={fullName}
              width={80}
              height={80}
              className="object-cover w-20 h-20"
            />
          </div>
        ) : (
          <Avatar className="w-20 h-20 border-4 border-white dark:border-gray-900">
            <AvatarImage src="/default-avatar.png" alt={fullName} />
            <AvatarFallback
              className={cn(
                'text-xl font-semibold text-white bg-gradient-to-r',
                gradient
              )}
            >
              {player.firstName.charAt(0)}
              {player.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Card Content */}
      <div className="pt-14 p-5">
        <h3 className="text-center font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">
          {fullName}
        </h3>

        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{player.email}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <User className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="capitalize">
              {player.gender || 'Not specified'}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <ActivitySquare className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="capitalize">
              {player.profile?.isActive ? (
                <Badge variant="green">Active</Badge>
              ) : (
                <Badge variant="destructive">Inactive</Badge>
              )}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(player, e);
            }}
            aria-label="Edit player"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(player.id, e);
            }}
            aria-label="Delete player"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};

export default PlayerCard;
