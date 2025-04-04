import { AppRouter } from '@/app/server/routers';
import { trpc } from '@/utils/trpc';
import { Role } from '@prisma/client';
import { inferProcedureOutput } from '@trpc/server';
import { TRPCClientErrorLike } from '@trpc/client';

// Define types for the data structure
type PlayerData = inferProcedureOutput<AppRouter['player']['getPlayerById']>;
type ParentData = inferProcedureOutput<AppRouter['parent']['getPlayerById']>;

type QueryResult = {
  data: PlayerData | ParentData | undefined;
  error: TRPCClientErrorLike<AppRouter> | null;
  isLoading: boolean;
  refetch: () => Promise<any>;
};

type MutationResult = {
  mutate: (variables: any) => void;
  isLoading: boolean;
};

export function usePlayerApi(role: Role) {
  // Helper function to create a consistent query result interface
  const createNoOpQuery = (): QueryResult => ({
    data: undefined,
    error: null,
    isLoading: false,
    refetch: async () => {},
  });

  // Helper function to create a consistent mutation result interface
  const createNoOpMutation = (): MutationResult => ({
    mutate: () => {},
    isLoading: false,
  });

  const getPlayerQuery = (id: string, enabled: boolean): QueryResult => {
    switch (role) {
      case 'PARENT': {
        const query = trpc.parent.getPlayerById.useQuery({ id }, { enabled });
        return {
          data: query.data,
          error: query.error,
          isLoading: query.isLoading,
          refetch: query.refetch,
        };
      }
      case 'PLAYER': {
        const query = trpc.player.getPlayerById.useQuery({ id }, { enabled });
        return {
          data: query.data,
          error: query.error,
          isLoading: query.isLoading,
          refetch: query.refetch,
        };
      }
      case 'FED_ADMIN': {
        const query = trpc.player.getPlayerById.useQuery({ id }, { enabled });
        return {
          data: query.data,
          error: query.error,
          isLoading: query.isLoading,
          refetch: query.refetch,
        };
      }
      default:
        return createNoOpQuery();
    }
  };

  const getEditMutation = (options?: any): MutationResult => {
    switch (role) {
      case 'PARENT': {
        const mutation = trpc.parent.editPlayerById.useMutation(options);
        return {
          mutate: mutation.mutate,
          isLoading: mutation.isLoading,
        };
      }
      case 'PLAYER': {
        const mutation = trpc.player.editPlayerById.useMutation(options);
        return {
          mutate: mutation.mutate,
          isLoading: mutation.isLoading,
        };
      }
      case 'FED_ADMIN': {
        const mutation = trpc.federation.editPlayerById.useMutation(options);
        return {
          mutate: mutation.mutate,
          isLoading: mutation.isLoading,
        };
      }
      default:
        return createNoOpMutation();
    }
  };

  const getDeleteMutation = (options?: any): MutationResult => {
    switch (role) {
      case 'PARENT': {
        const mutation = trpc.parent.deletePlayerById.useMutation(options);
        return {
          mutate: mutation.mutate,
          isLoading: mutation.isLoading,
        };
      }
      case 'FED_ADMIN': {
        const mutation = trpc.federation.deletePlayerById.useMutation(options);
        return {
          mutate: mutation.mutate,
          isLoading: mutation.isLoading,
        };
      }
      default:
        return createNoOpMutation();
    }
  };

  return {
    fetchPlayer: (params: { id: string }, options: { enabled: boolean }) =>
      getPlayerQuery(params.id, options.enabled),
    editPlayer: getEditMutation,
    deletePlayer: getDeleteMutation,
  };
}
