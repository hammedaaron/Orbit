import React from 'react';
import { useAuth } from './context/AuthContext';
import { LandingPage } from './components/LandingPage';
import { AuthScreen } from './components/AuthScreen';
import { SplashScreen } from './components/SplashScreen';
import { Dashboard } from './components/Dashboard';
import { DocsPage } from './components/DocsPage';

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