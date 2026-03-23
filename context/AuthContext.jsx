import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers } from '../data/mockUsers';

const STORAGE_KEY = 'cryptoview_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(stored => {
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            AsyncStorage.removeItem(STORAGE_KEY);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    const found = mockUsers.find(
      u => u.username === username && u.password === password
    );
    if (!found) {
      return { success: false, error: 'Usuário ou senha incorretos.' };
    }
    const { password: _omit, ...safeUser } = found;
    setUser(safeUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    return { success: true };
  }

  async function logout() {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  async function updateProfilePicture(uri) {
    const updated = { ...user, profilePicture: uri };
    setUser(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, logout, updateProfilePicture }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
