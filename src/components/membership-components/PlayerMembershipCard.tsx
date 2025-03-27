'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox'; // shadcn checkbox
import { cn } from '@/lib/utils'; // To combine classes

// Props for this component
interface PlayerCardProps {
  // Player Object
  player: {
    id: string;
    name: string;
    initials: string;
    email: string;
    fideId: string;
    price: number;
  };
  onSelect?: (id: string, selected: boolean) => void;
  isSelected?: boolean;
}

export function PlayerCard({
  player,
  onSelect,
  isSelected = false,
}: PlayerCardProps) {
  const [selected, setSelected] = useState(isSelected);

  // Determine alternating color based on player's id.
  const alternatingColor = parseInt(player.id, 10) % 2 === 0 ? 'blue' : 'red';

  const handleCheckboxChange = (checked: boolean) => {
    setSelected(checked);
    if (onSelect) {
      onSelect(player.id, checked);
    }
  };

  // Combined function for both text and background colors
  const getInitialsStyles = () => {
    switch (alternatingColor) {
      case 'red':
        return { textColor: 'text-red-600', backgroundColor: 'bg-red-100' };
      case 'blue':
        return { textColor: 'text-blue-700', backgroundColor: 'bg-blue-100' };
      default:
        return { textColor: 'text-gray-700', backgroundColor: 'bg-white' };
    }
  };

  const { textColor, backgroundColor } = getInitialsStyles();

  return (
    <div className="flex items-center border border-gray-200 shadow-md rounded-md overflow-hidden">
      {/* Checkbox */}
      <div className="p-4">
        <Checkbox
          checked={selected}
          onCheckedChange={handleCheckboxChange}
          className="h-8 w-8"
        />
      </div>

      {/* Initials tile */}
      <div
        className={cn(
          'flex items-center justify-center w-20 self-stretch text-xl font-bold',
          backgroundColor,
          textColor
        )}
      >
        {player.initials}
      </div>

      <div className="flex-1 p-4">
        <div className="font-medium text-lg">{player.name}</div>
        <div className="text-sm text-gray-600 mt-1">
          <span>Email: {player.email}</span>
          <span className="ml-4">FIDE ID: {player.fideId}</span>
        </div>
      </div>

      {/* Price */}
      <div className="pr-16 font-bold text-xl text-primary">
        $ {player.price.toFixed(2)}
      </div>
    </div>
  );
}
