import '@fontsource-variable/archivo'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // 'always' wajib: dengan networkMode 'online' (default) query di-pause
      // tanpa batas begitu browser dianggap offline — status diam di 'pending'
      // dan UI nyangkut di "Memuat…" tanpa pernah jadi error. Backend kita
      // lokal, jadi status online browser tidak relevan.
      networkMode: 'always',
      // Cukup satu percobaan ulang supaya backend mati cepat kelihatan.
      retry: 1,
    },
    mutations: { networkMode: 'always' },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
