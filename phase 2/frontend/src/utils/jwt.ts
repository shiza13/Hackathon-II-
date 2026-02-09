// JWT utility functions for the frontend

export interface JwtPayload {
  user_id: string;
  email: string;
  exp: number;
  iat: number;
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJwt(token);
  if (!payload) {
    return true; // If we can't parse it, consider it expired
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

export function getTokenExpiry(token: string): Date | null {
  const payload = parseJwt(token);
  if (!payload) {
    return null;
  }

  return new Date(payload.exp * 1000);
}

export function storeToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

export function isTokenValid(token: string): boolean {
  if (!token) {
    return false;
  }

  if (isTokenExpired(token)) {
    removeToken();
    return false;
  }

  return true;
}