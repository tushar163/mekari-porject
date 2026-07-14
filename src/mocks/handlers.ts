import { http, HttpResponse, delay } from 'msw';

const WORKSPACES = [
  { id: 'ws-1', name: 'Onboarding Flow', status: 'active' as const },
  { id: 'ws-2', name: 'Billing Revamp', status: 'active' as const },
  { id: 'ws-3', name: 'Legacy Reports', status: 'archived' as const },
];

export const handlers = [
  http.get('/api/workspaces', async () => {
    await delay(200);
    return HttpResponse.json(WORKSPACES);
  }),

  http.get('/api/test/slow', async () => {
    await delay(2000);
    return HttpResponse.json({ message: 'Finally responded after 2s' });
  }),

  http.get('/api/test/error/404', async () => {
    await delay(150);
    return HttpResponse.json({ message: 'Nothing here' }, { status: 404 });
  }),

  http.get('/api/test/error/401', async () => {
    await delay(150);
    return HttpResponse.json({ message: 'Session expired' }, { status: 401 });
  }),

  http.get('/api/test/error/500', async () => {
    await delay(150);
    return HttpResponse.json({ message: 'Something broke on our end' }, { status: 500 });
  }),
];
