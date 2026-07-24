import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/site.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Homepage from './Home'
import Dashboard from './Dashboard'
import { ClerkProvider } from '@clerk/clerk-react'
import { ThemeProvider } from 'next-themes'
import SignInPage from './auth/sign-in'
import EditResume from './Dashboard/resume/[resumeId]/edit'
import ViewResume from './my-resume/[resumeId]/view'
import NotFound from './pages/NotFound'
import Terms from './pages/Terms'
import ErrorBoundary from './components/ErrorBoundary'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || ''

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

if (import.meta.env.PROD && /localhost|127\.0\.0\.1/.test(STRAPI_URL)) {
  console.error(
    '[config] VITE_STRAPI_URL still points at localhost in a production build. Redeploy with your live API URL.'
  )
}

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
        errorElement: <NotFound />,
      },
      {
        path: '/dashboard/resume/:resumeId/edit',
        element: <EditResume />,
        errorElement: <NotFound />,
      },
    ],
  },
  {
    path: '/',
    element: <Homepage />,
    errorElement: <NotFound />,
  },
  {
    path: '/auth/sign-in',
    element: <SignInPage />,
    errorElement: <NotFound />,
  },
  {
    path: '/my-resume/:resumeId/view',
    element: <ViewResume />,
    errorElement: <NotFound />,
  },
  {
    path: '/terms',
    element: <Terms />,
    errorElement: <NotFound />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          storageKey="resume-ui-theme"
        >
          <RouterProvider router={router} />
        </ThemeProvider>
      </ClerkProvider>
    </ErrorBoundary>
  </StrictMode>,
)
