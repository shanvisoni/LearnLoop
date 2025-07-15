import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryProvider } from './providers/query-provider.tsx';
import { AuthProvider } from './contexts/auth.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <App />
    </AuthProvider>
    </QueryProvider>
  </StrictMode>,
)
