import { useState } from 'react';
import { BootSequence } from './components/BootSequence';
import { LandingPage } from './components/LandingPage';
import { IntelligenceEngine } from './components/IntelligenceEngine';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';

type AppState = 'boot' | 'landing' | 'engine';

function App() {
  const [appState, setAppState] = useState<AppState>('boot');

  return (
    <ThemeProvider>
      {appState === 'boot' && (
        <BootSequence onComplete={() => setAppState('landing')} />
      )}

      {appState === 'landing' && (
        <ErrorBoundary componentName="Landing Page" onReset={() => setAppState('boot')}>
          <LandingPage onLaunch={() => setAppState('engine')} />
        </ErrorBoundary>
      )}

      {appState === 'engine' && (
        <ErrorBoundary componentName="Core-4 Engine" onReset={() => setAppState('landing')}>
          <IntelligenceEngine />
        </ErrorBoundary>
      )}
    </ThemeProvider>
  );
}

export default App;
