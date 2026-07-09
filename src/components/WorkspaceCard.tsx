import { memo, type ReactNode } from 'react';
import './WorkspaceCard.css';

export interface WorkspaceCardProps {
  title: string;
  actions?: ReactNode; // slot: header-right action buttons
  footer?: ReactNode; // slot: card footer
  children: ReactNode; // slot: card body
}

function WorkspaceCardBase({ title, actions, footer, children }: WorkspaceCardProps) {
  return (
    <section className="workspace-card">
      <header className="workspace-card__header">
        <h3>{title}</h3>
        {actions && <div className="workspace-card__actions">{actions}</div>}
      </header>
      <div className="workspace-card__body">{children}</div>
      {footer && <footer className="workspace-card__footer">{footer}</footer>}
    </section>
  );
}

export const WorkspaceCard = memo(WorkspaceCardBase);
