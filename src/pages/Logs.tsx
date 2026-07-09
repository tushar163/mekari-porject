import { WorkspaceCard } from '../components/WorkspaceCard';
import { InputField } from '../components/atoms/InputField';
import { SelectField } from '../components/atoms/SelectField';
import { useQueryParam } from '../hooks/useQueryParams';
import './Logs.css';

const LEVEL_OPTIONS = [
  { value: '', label: 'All levels' },
  { value: 'info', label: 'Info' },
  { value: 'warn', label: 'Warning' },
  { value: 'error', label: 'Error' },
];

const SAMPLE_LOGS = [
  { id: 1, level: 'info', message: 'Workspace initialized' },
  { id: 2, level: 'warn', message: 'Slow query detected (420ms)' },
  { id: 3, level: 'error', message: 'Failed to sync record #88' },
  { id: 4, level: 'info', message: 'User settings saved' },
];

export default function LogsPage() {
  const [query, setQuery] = useQueryParam('q');
  const [level, setLevel] = useQueryParam('level');

  const filtered = SAMPLE_LOGS.filter((log) => {
    const matchesQuery = query ? log.message.toLowerCase().includes(query.toLowerCase()) : true;
    const matchesLevel = level ? log.level === level : true;
    return matchesQuery && matchesLevel;
  });

  return (
    <WorkspaceCard title="Logs">
      <div className="logs-filters">
        <InputField
          label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by message..."
        />
        <SelectField
          label="Level"
          options={LEVEL_OPTIONS}
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />
      </div>

      <ul className="logs-list">
        {filtered.map((log) => (
          <li key={log.id} className={`logs-list__item logs-list__item--${log.level}`}>
            <span className="logs-list__badge">{log.level}</span>
            {log.message}
          </li>
        ))}
        {filtered.length === 0 && <li className="logs-list__empty">No matching logs.</li>}
      </ul>
    </WorkspaceCard>
  );
}
