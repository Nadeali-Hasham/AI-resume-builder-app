import { Navigate, Outlet } from 'react-router-dom'
import './App.css'
import { useUser } from '@clerk/clerk-react'
import Header from './components/custom/header';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { setApiUserEmail } from '../Service/GlobalApi';

function App() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    const email = user?.primaryEmailAddress?.emailAddress || '';
    setApiUserEmail(email);
  }, [user]);

  if (!isLoaded) {
    return (
      <div className="app-page flex min-h-screen items-center justify-center app-subtitle">
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
      <Toaster />
    </>
  );
}

export default App;
