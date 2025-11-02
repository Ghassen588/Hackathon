// Lightweight fetch-based API client to avoid external dependency on axios
const baseUrl = '/api';

async function request<T = any>(path: string, opts: RequestInit = {}) {
  const res = await fetch(baseUrl + path, { credentials: 'include', ...opts });
  if (!res.ok) {
    let body: any = null;
    try {
      body = await res.json();
    } catch (_) {
      body = await res.text();
    }
    throw new Error(body?.error || res.statusText || 'API error');
  }
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : (null as any) as T;
  } catch {
    return (text as unknown) as T;
  }
}

export const checkSession = async (): Promise<any> => {
  return request('/session');
};

export const login = async (cin: string, password: string): Promise<any> => {
  return request('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cin, password }),
  });
};

export const signup = async (username: string, cin: string, password: string): Promise<any> => {
  return request('/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, cin, password }),
  });
};

export const fetchMapData = async (): Promise<any> => {
  return request('/map_data'); 
};

export const updateSoil = async (plantType: string, zoneIndex: number, newState: any): Promise<any> => {
  return request('/update_soil', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plantType, zoneIndex, newState }),
  });
};

export const updatePump = async (plantType: string, zoneIndex: number, newState: any): Promise<any> => {
  return request('/update_pump', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plantType, zoneIndex, newState }),
  });
};

export const fetchWeather = async (): Promise<any> => {
  return request('/weather');
};

export const logout = async (): Promise<void> => {
  await request('/logout', { method: 'POST' });
};