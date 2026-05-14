import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('lr_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/api/auth/me')
        .then(res => setUser({ ...res.data, token }))
        .catch(() => { localStorage.removeItem('lr_token'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const res = await axios.post('/api/auth/login', { username, password });
    const { token, ...userData } = res.data;
    localStorage.setItem('lr_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser({ ...userData, token });
    return res.data;
  };

  const register = async (username, password) => {
    const res = await axios.post('/api/auth/register', { username, password });
    const { token, ...userData } = res.data;
    localStorage.setItem('lr_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser({ ...userData, token });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('lr_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
