import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import './Sidebar.css';

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: '◧' },
  { label: 'Network Sandbox', path: '/sandbox', icon: '◈' },
  { label: 'Settings', path: '/settings', icon: '⚙' },
  { label: 'Logs', path: '/logs', icon: '☰' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidebarBase({ isOpen, onClose }: SidebarProps) {

  const selected = useAppSelector((state) =>
    state.workspace.records.find((r) => r.id === state.workspace.selectedId)
  );

  return (
    <>
      
      {isOpen && <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__top">
          <div className="sidebar__brand">Project Horizon</div>
          <button
            type="button"
            className="sidebar__close-btn"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar__nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
            >
              <span className="sidebar__icon" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <span className="sidebar__footer-label">Selected workspace</span>
          <strong>{selected?.name ?? 'None'}</strong>
        </div>
      </aside>
    </>
  );
}

export const Sidebar = memo(SidebarBase);
