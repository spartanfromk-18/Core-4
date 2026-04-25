import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './components/layout/Dashboard';
import { ExamProvider } from './context/ExamContext';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <ExamProvider>
        <Dashboard />
      </ExamProvider>
    </ThemeProvider>
  );
}

export default App;
