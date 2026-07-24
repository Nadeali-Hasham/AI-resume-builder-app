import { Navigate, Outlet } from 'react-router-dom'
import './App.css'
import { useAuth, useUser } from '@clerk/clerk-react'
import Header from './components/custom/header';
import Footer from './components/custom/footer';
import { Toaster } from 'sonner';
import { useEffect, useState } from 'react';
import { setApiUserEmail, setAuthTokenGetter } from '../Service/GlobalApi';

function App() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const email = user?.primaryEmailAddress?.emailAddress || '';
    setApiUserEmail(email);
  }, [user]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setAuthReady(false);
      return;
    }

    setAuthTokenGetter(async () => getToken({ skipCache: true }));

    getToken({ skipCache: true })
      .then((token) => {
        if (!token) console.warn('[auth] Clerk getToken() returned null');
        setAuthReady(true);
      })
      .catch((err) => {
        console.error('[auth] getToken failed', err);
        setAuthReady(true);
      });
  }, [isLoaded, isSignedIn, getToken, user?.id]);

  if (!isLoaded || (isSignedIn && !authReady)) {
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}

export default App;
