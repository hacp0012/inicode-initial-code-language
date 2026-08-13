import CryptoJS from 'crypto-js';

const SECRET_KEY = 'inicode_secure_storage_key_v1';

/**
 * Utility for encrypted key-value storage wrapping localStorage and sessionStorage
 */
export const encryptedLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      const encryptedValue = localStorage.getItem(`enc_${key}`);
      if (!encryptedValue) return null;
      const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || null;
    } catch (e) {
      console.warn('Error reading encrypted localStorage:', e);
      // Fallback to unencrypted read if needed
      return localStorage.getItem(key);
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      const encryptedValue = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
      localStorage.setItem(`enc_${key}`, encryptedValue);
    } catch (e) {
      console.error('Error writing encrypted localStorage:', e);
      localStorage.setItem(key, value);
    }
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(`enc_${key}`);
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  },
};

export const encryptedSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      const encryptedValue = sessionStorage.getItem(`enc_${key}`);
      if (!encryptedValue) return null;
      const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || null;
    } catch (e) {
      console.warn('Error reading encrypted sessionStorage:', e);
      return sessionStorage.getItem(key);
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      const encryptedValue = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
      sessionStorage.setItem(`enc_${key}`, encryptedValue);
    } catch (e) {
      console.error('Error writing encrypted sessionStorage:', e);
      sessionStorage.setItem(key, value);
    }
  },

  removeItem: (key: string): void => {
    sessionStorage.removeItem(`enc_${key}`);
    sessionStorage.removeItem(key);
  },

  clear: (): void => {
    sessionStorage.clear();
  },
};
