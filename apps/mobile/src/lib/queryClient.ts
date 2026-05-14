import { QueryClient } from '@tanstack/react-query';

/**
 * Global React Query client.
 * - Stale time tuned for ride data (somewhat fresh; refetch on screen focus).
 * - Single retry to avoid hammering the network on flaky connections.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
