export const getToken  = ()       => localStorage.getItem('token');
export const setToken  = (t)      => localStorage.setItem('token', t);
export const removeToken = ()     => localStorage.removeItem('token');
export const getUser   = ()       => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } };
export const setUser   = (u)      => localStorage.setItem('user', JSON.stringify(u));
export const removeUser = ()      => localStorage.removeItem('user');
export const isLoggedIn = ()      => !!getToken();

export const logout = () => {
  removeToken();
  removeUser();
};
