'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type EditPlayerFormValues,
  editPlayerSchema,
} from '@/schemas/Player.schema';
import { trpc } from '@/utils/trpc';
import { useToast } from '@/hooks/useToast';

export function usePlayerDetails() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { toast } = useToast();
  const { playerId } = useParams<{ playerId: string }>();

  const [player, setPlayer] = useState<EditPlayerFormValues | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditPlayerFormValues>({
    resolver: zodResolver(editPlayerSchema),
  });

  // Check if the logged-in user is a parent
  const isParent = (sessionData?.user?.role as string) === 'PARENT';

  // Conditional Query based on user role
  const { data, error, isLoading, refetch } = isParent
    ? trpc.parent.getPlayerById.useQuery(
        { id: playerId },
        { enabled: !!playerId }
      )
    : trpc.player.getPlayerById.useQuery(
        { id: playerId },
        { enabled: !!playerId }
      );

  // Conditional Edit Mutation based on user role
  const editPlayerMutation = isParent
    ? trpc.parent.editPlayerById.useMutation({
        onSuccess: () => {
          setIsEditing(false);
          refetch();
          setIsSubmitting(false);
          toast({
            title: 'Success',
            description: 'Player details updated successfully!',
            variant: 'default',
          });
        },
        onError: (error) => {
          console.error('Failed to update player:', error.message);
          setIsSubmitting(false);
          toast({
            title: 'Error',
            description: `Failed to update player: ${error.message}`,
            variant: 'destructive',
          });
        },
      })
    : trpc.player.editPlayerById.useMutation({
        onSuccess: () => {
          setIsEditing(false);
          refetch();
          setIsSubmitting(false);
          toast({
            title: 'Success',
            description: 'Player details updated successfully!',
            variant: 'default',
          });
        },
        onError: (error) => {
          console.error('Failed to update player:', error.message);
          setIsSubmitting(false);
          toast({
            title: 'Error',
            description: `Failed to update player: ${error.message}`,
            variant: 'destructive',
          });
        },
      });

  // Conditional Delete Mutation based on user role
  const deletePlayerMutation = isParent
    ? trpc.parent.deletePlayerById.useMutation({
        onSuccess: () => router.push('/players'),
        onError: (error) => {
          console.error('Failed to delete player:', error.message);
          setIsSubmitting(false);
          setShowDeleteConfirm(false);
        },
      })
    : trpc.player.deletePlayerById.useMutation({
        onSuccess: () => router.push('/players'),
        onError: (error) => {
          console.error('Failed to delete player:', error.message);
          setIsSubmitting(false);
          setShowDeleteConfirm(false);
        },
      });

  return {
    router,
    playerId,
    player,
    setPlayer,
    isEditing,
    setIsEditing,
    isSubmitting,
    setIsSubmitting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    register,
    handleSubmit,
    errors,
    reset,
    isParent,
    data,
    error,
    isLoading,
    refetch,
    editPlayerMutation,
    deletePlayerMutation,
    toast,
  };
}
