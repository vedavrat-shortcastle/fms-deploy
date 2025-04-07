'use client';

import React, { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { debounce } from 'lodash';
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AddMemberFormValues } from '@/schemas/Membership.schema';

export default function MemberFormFields() {
  // State for search terms
  const [playerSearchTerm, setPlayerSearchTerm] = useState('');
  const [planSearchTerm, setPlanSearchTerm] = useState('');
  const [debouncedPlayerSearch, setDebouncedPlayerSearch] = useState('');
  const [debouncedPlanSearch, setDebouncedPlanSearch] = useState('');

  // State for combobox dropdowns
  const [playerOpen, setPlayerOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);

  const { control } = useFormContext<AddMemberFormValues>();

  // Create debounced search functions
  const debouncedPlayerSearchHandler = useCallback(
    debounce((value: string) => {
      setDebouncedPlayerSearch(value);
    }, 300),
    []
  );

  const debouncedPlanSearchHandler = useCallback(
    debounce((value: string) => {
      setDebouncedPlanSearch(value);
    }, 300),
    []
  );

  // Handler for player search input
  const handlePlayerSearchChange = (value: string) => {
    setPlayerSearchTerm(value);
    debouncedPlayerSearchHandler(value);
  };

  // Handler for plan search input
  const handlePlanSearchChange = (value: string) => {
    setPlanSearchTerm(value);
    debouncedPlanSearchHandler(value);
  };

  // Fetch players for dropdown using debounced search term
  const { data: playersData, isLoading: playersLoading } =
    trpc.player.getPlayers.useQuery({
      page: 1,
      limit: 100,
      searchQuery: debouncedPlayerSearch,
    });

  // Fetch subscription plans for dropdown using debounced search term
  const { data: plansData, isLoading: plansLoading } =
    trpc.membership.getPlans.useQuery({
      page: 1,
      limit: 10,
      searchQuery: debouncedPlanSearch,
    });

  // Updated player data formatting
  const availablePlayers = React.useMemo(() => {
    if (!playersData?.players) return [];

    return playersData.players.map((player) => ({
      value: player.profile?.profileId,
      label: `${player.firstName} ${player.lastName} (${player.email || ''})`,
    }));
  }, [playersData]);

  // Updated plan data formatting
  const availablePlans = React.useMemo(() => {
    if (!plansData) return [];

    const allPlans = [
      ...(plansData.activePlans || []),
      ...(plansData.inactivePlans || []),
    ];

    return allPlans.map((plan) => ({
      value: plan.id,
      label: `${plan.name} (${plan.price} ${plan.currency})`,
    }));
  }, [plansData]);
  // Define subscription types
  const subscriptionTypes = ['INDIVIDUAL', 'EVENT'];

  // Define payment modes
  const paymentModes = [
    'Credit Card',
    'Debit Card',
    'UPI',
    'Net Banking',
    'Wallet',
    'Cash',
  ];

  return (
    <>
      {/* Player Combobox Field */}
      <FormField
        control={control}
        name="playerId"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Player</FormLabel>
            <Popover open={playerOpen} onOpenChange={setPlayerOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={playerOpen}
                    className={cn(
                      'w-full justify-between',
                      !field.value && 'text-muted-foreground'
                    )}
                    disabled={playersLoading}
                  >
                    {field.value
                      ? availablePlayers.find(
                          (player) => player.value === field.value
                        )?.label
                      : 'Select a player...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search player..."
                    value={playerSearchTerm}
                    onValueChange={handlePlayerSearchChange}
                  />
                  <CommandEmpty>
                    {playersLoading ? 'Loading...' : 'No player found.'}
                  </CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {availablePlayers.map((player) => (
                        <CommandItem
                          key={player.value}
                          value={player.label}
                          onSelect={() => {
                            field.onChange(player.value);
                            setPlayerOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value === player.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {player.label}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Plan Combobox Field */}
      <FormField
        control={control}
        name="planId"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Membership Plan</FormLabel>
            <Popover open={planOpen} onOpenChange={setPlanOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={planOpen}
                    className={cn(
                      'w-full justify-between',
                      !field.value && 'text-muted-foreground'
                    )}
                    disabled={plansLoading}
                  >
                    {field.value
                      ? availablePlans.find(
                          (plan) => plan.value === field.value
                        )?.label
                      : 'Select a plan...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search plan..."
                    value={planSearchTerm}
                    onValueChange={handlePlanSearchChange}
                  />
                  <CommandEmpty>
                    {plansLoading ? 'Loading...' : 'No plan found.'}
                  </CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {availablePlans.map((plan) => (
                        <CommandItem
                          key={plan.value}
                          value={plan.label}
                          onSelect={() => {
                            field.onChange(plan.value);
                            setPlanOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value === plan.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {plan.label}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Subscription Type Field */}
      <FormField
        control={control}
        name="subscriptionType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subscription Type</FormLabel>
            <FormControl>
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subscription Type" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Payment Mode Field */}
      <FormField
        control={control}
        name="paymentMode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Mode</FormLabel>
            <FormControl>
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Payment Mode" />
                </SelectTrigger>
                <SelectContent>
                  {paymentModes.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
