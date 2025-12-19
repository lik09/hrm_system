// js/store/profileStore.js
const TOKEN_KEY = "token";
const USER_KEY = "user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const getProfile = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setProfile = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeProfile = () => localStorage.removeItem(USER_KEY);

export const clearAuth = () => {
  removeToken();
  removeProfile();
};

export const isLoggedIn = () => !!getToken();
