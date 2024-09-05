import { jwtDecode } from 'jwt-decode';


export function setToken(token) {
  localStorage.setItem('token', token);
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getUserFromToken() {
  const token = getToken();
  if (token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }
  return null;
}

export function removeToken() {
  localStorage.removeItem('token');
}
