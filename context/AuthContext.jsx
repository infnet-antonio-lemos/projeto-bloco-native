import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { mockUsers } from '../data/mockUsers';

const STORAGE_KEY = 'cryptoview_user';
const PICTURE_KEY = (username) => `cryptoview_picture_${username}`;
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async function logout() {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(stored => {
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
              setUser(parsed);
            } else {
              AsyncStorage.removeItem(STORAGE_KEY);
            }
          } catch {
            AsyncStorage.removeItem(STORAGE_KEY);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Auto-logout when the session expires
  useEffect(() => {
    if (!user?.expiresAt) return;
    const remaining = user.expiresAt - Date.now();
    if (remaining <= 0) { logout(); return; }
    const timer = setTimeout(logout, remaining);
    return () => clearTimeout(timer);
  }, [user, logout]);

  async function login(username, password) {
    const found = mockUsers.find(
      u => u.username === username && u.password === password
    );
    if (!found) {
      return { success: false, error: 'Usuário ou senha incorretos.' };
    }
    const { password: _omit, ...safeUser } = found;

    if (FileSystem.documentDirectory) {
      const permanentUri = `${FileSystem.documentDirectory}profile_${username}.jpg`;
      const fileInfo = await FileSystem.getInfoAsync(permanentUri);
      if (fileInfo.exists) {
        safeUser.profilePicture = `${permanentUri}?t=${Date.now()}`;
      }
    } else {
      // Web: restore picture saved across sessions
      const savedPicture = await AsyncStorage.getItem(PICTURE_KEY(username));
      if (savedPicture) {
        safeUser.profilePicture = savedPicture;
      }
    }

    const session = { ...safeUser, expiresAt: Date.now() + SESSION_DURATION };
    setUser(session);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return { success: true };
  }

  function hasRole(role) {
    return user?.role === role;
  }

  async function blobUrlToDataUrl(blobUrl) {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function updateProfilePicture(uri) {
    let finalUri = uri;
    if (FileSystem.documentDirectory) {
      const permanentUri = `${FileSystem.documentDirectory}profile_${user.username}.jpg`;
      await FileSystem.deleteAsync(permanentUri, { idempotent: true });
      await FileSystem.copyAsync({ from: uri, to: permanentUri });
      finalUri = `${permanentUri}?t=${Date.now()}`;
    } else {
      // Web: blob URLs are ephemeral — convert to base64 data URL for persistence
      if (uri.startsWith('blob:')) {
        finalUri = await blobUrlToDataUrl(uri);
        URL.revokeObjectURL(uri);
      }
    }
    const updated = { ...user, profilePicture: finalUri };
    setUser(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    await AsyncStorage.setItem(PICTURE_KEY(user.username), finalUri);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, logout, hasRole, updateProfilePicture }}
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
