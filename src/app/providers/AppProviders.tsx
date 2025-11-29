import type { ReactNode } from 'react'
import { AuthProvider } from '../../shared/hooks/useAuth'

type AppProvidersProps = {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return <AuthProvider>{children}</AuthProvider>
}
