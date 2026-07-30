import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { signInWithCredential, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebase';

export const isCapacitor = () => {
  return (window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform() !== 'web') || 
         window.location.origin.startsWith('capacitor://') || 
         window.location.pathname.includes('android_asset');
};

// Initialize Capacitor Google Auth if running inside native app
if (isCapacitor()) {
  try {
    GoogleAuth.initialize({
      clientId: '290508657488-fecc6pimf0tsv4vqdphn6pfd7372j2a5.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true
    });
  } catch (e) {
    console.warn('[Capacitor] GoogleAuth initialize warning:', e);
  }
}

export const clearUserSessionData = () => {
  try {
    localStorage.removeItem('user_profile');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_token');
    localStorage.removeItem('is_authenticated');
    localStorage.removeItem('last_trade');
    localStorage.removeItem('demo_balance');
    localStorage.removeItem('simulation_history');
    localStorage.removeItem('trademind_trade_history');
    localStorage.removeItem('trademind_journal');

    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('api_cache_') || key.startsWith('cache_'))) {
        localStorage.removeItem(key);
      }
    }
  } catch (e) {
    console.warn('[AuthService] Error clearing session storage:', e);
  }
};

export const authService = {
  async login() {
    try {
      let idToken;
      
      if (isCapacitor()) {
        // Native Google Sign-In
        const googleUser = await GoogleAuth.signIn();
        const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
        const userCredential = await signInWithCredential(auth, credential);
        idToken = await userCredential.user.getIdToken(true);
      } else {
        // Web PWA popup sign-in
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        try {
          const userCredential = await signInWithPopup(auth, provider);
          idToken = await userCredential.user.getIdToken(true);
        } catch (popupError) {
          if (popupError.code === 'auth/popup-blocked') {
            console.warn('[AuthService] Popup blocked. Falling back to redirect flow.');
            await signInWithRedirect(auth, provider);
            // The browser will redirect, so we return a promise that never resolves
            return new Promise(() => {});
          }
          throw popupError;
        }
      }
      
      // Verify token with backend
      return await this.syncWithBackend(idToken);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await firebaseSignOut(auth);
      if (isCapacitor()) {
        try {
          await GoogleAuth.signOut();
        } catch (e) {
          console.warn('[Capacitor] GoogleAuth.signOut warning:', e);
        }
      }
      clearUserSessionData();
    } catch (error) {
      console.error('Logout error:', error);
      clearUserSessionData();
      throw error;
    }
  },

  async syncWithBackend(idToken) {
    try {
      const response = await fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const detailMsg = typeof errData.detail === 'object' 
          ? JSON.stringify(errData.detail) 
          : errData.detail;
        throw new Error(detailMsg || 'Token sync with backend failed');
      }
      
      const data = await response.json();
      if (data && data.user) {
        clearUserSessionData();
        // Store profile details locally for instant access on next load
        localStorage.setItem('user_profile', JSON.stringify(data.user));
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('is_authenticated', 'true');
        if (data.user.balance !== undefined) {
          localStorage.setItem('demo_balance', data.user.balance.toString());
        }
        return data.user;
      }
      throw new Error('Invalid user profile response from server');
    } catch (err) {
      console.error('Sync failure:', err);
      throw err;
    }
  }
};
