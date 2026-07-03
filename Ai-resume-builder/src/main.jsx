import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignIn from './auth/sign-in'
import Homepage from './Home'
import Dashboard from './Dashboard'

const router = createBrowserRouter([
  {
    
    element: <App />,
    children: [
      {
        path: '/',
        element: <Homepage />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      }
    ]
  },
  {
    path: '/auth/sign-in',
    element: <SignIn />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)