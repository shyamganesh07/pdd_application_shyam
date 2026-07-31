// Unified Storage Service bridging Web LocalStorage and Native AsyncStorage

export const storage = {
  getItem: async (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
      return null;
    } catch (e) {
      console.error('Storage getItem error:', e);
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('Storage setItem error:', e);
    }
  },
  removeItem: async (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.error('Storage removeItem error:', e);
    }
  },
  clear: async () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.clear();
      }
    } catch (e) {
      console.error('Storage clear error:', e);
    }
  }
};

export default storage;
