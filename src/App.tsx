import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import DashboardPage from './pages/Dashboard';
import SettingsPage from './pages/Settings';
import LogsPage from './pages/Logs';
import NetworkSandbox from './pages/Networksandbox';


export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/sandbox" element={<NetworkSandbox />} />
      </Routes>
    </AppShell>
  );
}
