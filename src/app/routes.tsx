import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { LeadsPage } from '../features/leads/pages/LeadsPage'
import { LeadDetailPage } from '../features/leads/pages/LeadDetailPage'
import { PropertiesPage } from '../features/properties/pages/PropertiesPage'
import { AgentInsightsPage } from '../features/agents/pages/AgentInsightsPage'
import { AnalyticsDashboard } from '../features/analytics/pages/AnalyticsDashboard'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { LandingPage } from '../features/auth/pages/LandingPage'
import { NotFoundPage } from '../shared/components/NotFoundPage'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/auth', element: <LoginPage /> },
  { path: '/auth/login', element: <LoginPage /> },
  { path: '/auth/register', element: <LoginPage initialMode="register" /> },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: 'dashboard', element: <AnalyticsDashboard /> },
      { path: 'leads', element: <LeadsPage /> },
      { path: 'leads/:id', element: <LeadDetailPage /> },
      { path: 'properties', element: <PropertiesPage /> },
      { path: 'agent', element: <AgentInsightsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
