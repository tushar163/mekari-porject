import { WorkspaceCard } from '../components/WorkspaceCard';
import { Button } from '../components/atoms/Button';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectRecord, toggleArchived } from '../store/slices/workspaceSlice';
import { notify } from '../lib/toast';
import './Dashboard.css';


export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const records = useAppSelector((state) => state.workspace.records);
  const selectedId = useAppSelector((state) => state.workspace.selectedId);

  function handleToggleArchived(id: string, name: string, status: string) {
    dispatch(toggleArchived(id));
    const action = status === 'active' ? 'Archived' : 'Restored';
    notify.success(`${action} "${name}".`);
  }

  return (
    <div className="dashboard-grid">
      {records.map((record) => (
        <WorkspaceCard
          key={record.id}
          title={record.name}
          actions={
            <Button
              variant="secondary"
              onClick={() => handleToggleArchived(record.id, record.name, record.status)}
            >
              {record.status === 'active' ? 'Archive' : 'Restore'}
            </Button>
          }
        >
          <p className={`dashboard-card__status dashboard-card__status--${record.status}`}>
            {record.status}
          </p>
          <Button
            disabled={record.status === 'archived'}
            variant={record.id === selectedId ? 'primary' : 'secondary'}
            onClick={() => dispatch(selectRecord(record.id))}
          >
            {record.id === selectedId ? 'Selected' : 'Select'}
          </Button>
        </WorkspaceCard>
      ))}
    </div>
  );
}
