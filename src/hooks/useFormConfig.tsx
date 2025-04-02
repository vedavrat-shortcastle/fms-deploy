import { trpc } from '@/hooks/trpcProvider';
import { FormType } from '@prisma/client';

export const useFormConfig = (formType: FormType) => {
  const { data, isLoading, error } = trpc.config.getFormConfig.useQuery(
    { formType },
    {
      staleTime: 5 * 60 * 1000, // Consider config stale after 5 minutes
      cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    }
  );

  return {
    config: data,
    isLoading,
    error,
    isConfigured: !!data?.fields?.length,
  };
};
