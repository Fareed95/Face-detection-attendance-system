'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export const AuthContext = createContext({
  isLoggedIn: false,
  email: '',
  name: '',
  setEmail: () => {},
  setName: () => {},
  setIsLoggedIn: () => {},
});

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (session?.user) {
      setIsLoggedIn(true);
      setEmail(session.user.email || '');
      setName(session.user.name || '');
    } else {
      setIsLoggedIn(false);
      setEmail('');
      setName('');
    }
  }, [session]);

  return (
    <AuthContext.Provider 
      value={{
        isLoggedIn,
        email,
        name,
        setEmail,
        setName,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 