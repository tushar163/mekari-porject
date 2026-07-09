import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import DashboardPage from './pages/Dashboard';
import SettingsPage from './pages/Settings';
import LogsPage from './pages/Logs';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/logs" element={<LogsPage />} />
      </Routes>
    </AppShell>
  );
}
