import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Homepage from './Home'
import Dashboard from './Dashboard'
import { ClerkProvider } from '@clerk/clerk-react'
import SignInPage from './auth/sign-in'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const router = createBrowserRouter([
  {
    
    element: <App />,
    children: [
      
      {
        path: '/dashboard',
        element: <Dashboard />,
      }
    ]
  },
  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: '/auth/sign-in',
    element: <SignInPage />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>,
)