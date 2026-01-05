
import React from 'react';
import { useAuth } from './context/AuthContext.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { AuthScreen } from './components/AuthScreen.tsx';
import { SplashScreen } from './components/SplashScreen.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { DocsPage } from './components/DocsPage.tsx';

const App: React.FC = () => {
  const { view } = useAuth();

  switch (view) {
    case 'landing':
      return <LandingPage />;
    case 'auth':
      return <AuthScreen />;
    case 'splash':
      return <SplashScreen />;
    case 'app':
      return <Dashboard />;
    case 'docs':
      return <DocsPage />;
    default:
      return <LandingPage />;
  }
};

export default App;
