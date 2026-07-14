import { useState } from 'react';
import { httpClient } from '../lib/axios';
import type { NormalizedError } from '../lib/axios';
import { notify } from '../lib/toast';
import './NetworkSandbox.css';

// one row in the results table
interface TestResult {
  id: number;
  label: string;
  status: number | string;
  duration: number;
  success: boolean;
  message: string;
  timestamp: string;
}

const TEST_CASES = [
  { label: 'Get Workspaces (normal)', method: 'get' as const, url: '/workspaces' },
  { label: 'Slow Request (2s delay)', method: 'get' as const, url: '/test/slow' },
  { label: 'Force 404', method: 'get' as const, url: '/test/error/404' },
  { label: 'Force 401 (session expiry)', method: 'get' as const, url: '/test/error/401' },
  { label: 'Force 500 (server error)', method: 'get' as const, url: '/test/error/500' },
];

// simple counter so every result row gets a unique key
let resultId = 0;

const NetworkSandbox = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [runningLabel, setRunningLabel] = useState<string | null>(null);

  // pushes a new row to the top of the results list
  const addResult = (data: Omit<TestResult, 'id' | 'timestamp'>) => {
    setResults((prev) => [
      { ...data, id: resultId++, timestamp: new Date().toLocaleTimeString() },
      ...prev,
    ]);
  };

  // fires one request and records how long it took + what came back
  const runTest = async (testCase: (typeof TEST_CASES)[number]) => {
    setRunningLabel(testCase.label);
    const startedAt = performance.now();

    try {
      const response = await httpClient.request({
        method: testCase.method,
        url: testCase.url,
      });

      addResult({
        label: testCase.label,
        status: response.status,
        duration: Math.round(performance.now() - startedAt),
        success: true,
        message: 'OK',
      });
      notify.success(`${testCase.label} — ${response.status} in ${Math.round(performance.now() - startedAt)}ms`);
    } catch (err) {
      const normalized = err as NormalizedError;

      addResult({
        label: testCase.label,
        status: normalized.status ?? 'ERR',
        duration: Math.round(performance.now() - startedAt),
        success: false,
        message: normalized.message || 'Request failed',
      });

      if (normalized.status === 404) {
        notify.error(normalized.message);
      }
    } finally {
      setRunningLabel(null);
    }
  };

  // runs every test case back to back, one at a time
  const runAllTests = async () => {
    for (const testCase of TEST_CASES) {
      await runTest(testCase);
    }
  };

  const clearResults = () => setResults([]);

  return (
    <div className="sandbox-page">
      <div className="sandbox-header">
        <h1>Network Connectivity Sandbox</h1>
        <p>Fires requests through the shared axios client so we can check timing and error handling safely.</p>
      </div>

      <div className="sandbox-actions">
        {TEST_CASES.map((testCase) => (
          <button
            key={testCase.label}
            className="sandbox-btn"
            disabled={runningLabel !== null}
            onClick={() => runTest(testCase)}
          >
            {runningLabel === testCase.label ? 'Running…' : testCase.label}
          </button>
        ))}

        <button className="sandbox-btn sandbox-btn-primary" disabled={runningLabel !== null} onClick={runAllTests}>
          Run All
        </button>

        <button className="sandbox-btn sandbox-btn-ghost" onClick={clearResults}>
          Clear
        </button>
      </div>

      <div className="sandbox-results">
        {results.length === 0 && <p className="sandbox-empty">No tests run yet.</p>}

        {results.map((result) => (
          <div
            key={result.id}
            className={`sandbox-row ${result.success ? 'sandbox-row-ok' : 'sandbox-row-fail'}`}
          >
            <span className="sandbox-row-label">{result.label}</span>
            <span className="sandbox-row-status">{result.status}</span>
            <span className="sandbox-row-duration">{result.duration}ms</span>
            <span className="sandbox-row-message">{result.message}</span>
            <span className="sandbox-row-time">{result.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkSandbox;