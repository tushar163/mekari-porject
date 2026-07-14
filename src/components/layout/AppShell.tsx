import { useState, type ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import '../../styles/grid.css';
import 'react-toastify/dist/ReactToastify.css';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Header onOpenSidebar={() => setSidebarOpen(true)} />
      <div className="app-shell__body">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="app-shell__main">
          <main className="app-shell__content">{children}</main>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
