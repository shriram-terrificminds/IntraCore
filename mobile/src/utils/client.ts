import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'https://apparent-noted-panther.ngrok-free.app/api';

const BASE_URL = API_BASE_URL;

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function getToken(): Promise<string | null> {
  return await AsyncStorage.getItem('userToken');
}

async function request(method: HTTPMethod, path: string, body: any = null): Promise<any> {
  const token = await getToken();
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const options: RequestInit = {
    method,
    headers,
  };
  if (body) (options as any).body = JSON.stringify(body);
  console.log('[API] Request:', method, url, options);
  const response = await fetch(url, options);
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = text;
  }
  console.log('[API] Response:', method, url, response.status, data);
  if (!response.ok) {
    throw new Error(data?.message || 'API Error');
  }
  return data;
}

const client = {
  get: (path: string) => request('GET', path),
  post: (path: string, body: any) => request('POST', path, body),
  put: (path: string, body: any) => request('PUT', path, body),
  delete: (path: string) => request('DELETE', path),
};

export default client; 