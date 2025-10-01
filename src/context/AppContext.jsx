//  eslint-disable react/prop-types
import { createContext, useEffect, useState } from 'react';
import useOnlinePlayStore from '../store/onlinePlayStore';

export const AppContext = createContext(null);

export default function AppContextProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const { play, loop } = useOnlinePlayStore();
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
  }, [token]);

  // Global click sound
  useEffect(() => {
    const handleClick = () => {
      loop("click", false);
      play("click");
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [loop, play]);

  return (
    <AppContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AppContext.Provider>
  );
}
