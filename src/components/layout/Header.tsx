import { memo } from 'react';
import './Header.css';

interface HeaderProps {
  onOpenSidebar: () => void;
}

function HeaderBase({ onOpenSidebar }: HeaderProps) {
  return (
    <header className="app-header">
      <button
        type="button"
        className="app-header__menu-btn"
        onClick={onOpenSidebar}
        aria-label="Open navigation menu"
      >
        <span />
        <span />
        <span />
      </button>
      <div className="app-header__brand">Project Horizon</div>
      <div className="app-header__spacer" aria-hidden="true" />
    </header>
  );
}

export const Header = memo(HeaderBase);
