import { apiUrl } from './api';

export async function studioRequest(path: string, body?: unknown) {
  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      method: body === undefined ? 'GET' : 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch { throw new Error('Connection lost. Your changes have not been published. Please try again.'); }
  const result = await response.json().catch(() => ({}));
  if (response.status === 401) window.dispatchEvent(new Event('maati_session_expired'));
  if (!response.ok || !result.success) {
    throw new Error(response.status === 404
      ? 'The website server needs an update before this action can work. Please contact your website manager.'
      : result.error || 'This action could not be completed. Please try again.');
  }
  return result;
}
