import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react'; // Add this import

const queryClient = new QueryClient();

interface QueryProviderProps {
  children: ReactNode; // More explicit type definition
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children} {/* Wrap children in curly braces */}
      <ReactQueryDevtools initialIsOpen={false} /> {/* Properly close the component */}
    </QueryClientProvider>
  );
};