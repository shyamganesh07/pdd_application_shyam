import React, { useState } from 'react'
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { authService, clearUserSessionData } from '../services/authService'

export default function Login({ onLogin, onGoogleLoginSuccess, onSwitchToRegister, onForgotPassword }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    setError('')

    const emailVal = formData.email ? formData.email.trim() : ''
    const passVal = formData.password ? formData.password.trim() : ''

    if (!emailVal || !passVal) {
      setError('Please enter both email and password')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailVal,
          password: passVal
        })
      })

      const data = await res.json()
      if (res.ok && data.user) {
        localStorage.setItem('user_profile', JSON.stringify(data.user))
        localStorage.setItem('userEmail', data.user.email)
        localStorage.setItem('is_authenticated', 'true')
        setLoading(false)
        onLogin(data.user)
        return
      } else if (data && data.detail) {
        clearUserSessionData()
        setError(typeof data.detail === 'string' ? data.detail : 'Invalid credentials')
        setLoading(false)
        return
      }
    } catch (err) {
      console.warn("Backend server fetch error in Login:", err)
    }
    
    // Fallback to local profile session if backend offline
    const userObj = {
      email: emailVal.toLowerCase(),
      username: emailVal.split('@')[0],
      name: emailVal.split('@')[0],
      password: passVal,
      balance: 10000.0,
      xp: 150
    }
    localStorage.setItem('user_profile', JSON.stringify(userObj))
    localStorage.setItem('userEmail', userObj.email)
    localStorage.setItem('is_authenticated', 'true')
    setLoading(false)
    onLogin(userObj)
  }

  const handleGoogleLogin = async () => {
    setError('')
    setGoogleLoading(true)
    try {
      const userProfile = await authService.login()
      setGoogleLoading(false)
      if (onGoogleLoginSuccess) {
        onGoogleLoginSuccess(userProfile)
      }
    } catch (err) {
      console.error('Google Auth flow error:', err)
      let friendlyMessage = err.message || 'Authentication failed. Please try again.'
      const errMsg = err.message || ''
      const errCode = err.code || ''
      
      if (errCode) {
        friendlyMessage = `[${errCode}] ${friendlyMessage}`
      }
      
      if (errCode === 'auth/invalid-api-key') {
        friendlyMessage = `[${errCode}] The Firebase API Key in frontend/.env is a placeholder. Please configure it with your actual Firebase API Key from the Firebase Console.`
      } else if (errCode === 'auth/operation-not-allowed') {
        friendlyMessage = `[${errCode}] Google Sign-In is not enabled in your Firebase Console. Go to Build > Authentication > Sign-in method and enable Google.`
      } else if (errCode === 'auth/popup-closed-by-user') {
        friendlyMessage = 'Sign-in cancelled. Please click the button again to authenticate.'
      }
      
      setGoogleLoading(false)
      setError(friendlyMessage)
    }
  }

  return (
    <div className="auth-container fade-in">
      <div className="auth-header slide-up">
        <div className="auth-brand-icon neural-pulse">
          <ShieldCheck size={36} color="white" />
        </div>
        <h1 className="auth-title">TradeMind AI</h1>
        <p className="auth-subtitle">
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#39FF14', boxShadow: '0 0 8px #39FF14' }}></span>
          Neural Trading Terminal &bull; Localhost:5173
        </p>
      </div>

      {/* Tab bar for switching between Sign In & Register */}
      <div className="auth-tab-bar slide-up slide-up-delay-1" style={{ maxWidth: '440px', width: '100%' }}>
        <button type="button" className="auth-tab active">
          <LogIn size={16} /> Sign In
        </button>
        <button type="button" className="auth-tab" onClick={onSwitchToRegister}>
          Register
        </button>
      </div>

      <div className="auth-card holographic slide-up slide-up-delay-1">
        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error shake">
              {error}
            </div>
          )}

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email / Gmail ID"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
            <Mail size={18} className="input-icon" />
          </div>

          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              style={{ paddingRight: '48px' }}
            />
            <Lock size={18} className="input-icon" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                zIndex: 2
              }}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-4px' }}>
            <button
              type="button"
              className="btn-auth-link"
              style={{ fontSize: '0.8rem', opacity: 0.8 }}
              onClick={onForgotPassword}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="btn-auth-primary"
            disabled={loading || googleLoading}
            style={{ marginTop: '4px' }}
          >
            {loading ? (
              'Verifying Uplink...'
            ) : (
              <>
                Sign In to Terminal
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <button 
          className="btn-google" 
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
        >
          {googleLoading ? (
            'Connecting Google...'
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </>
          )}
        </button>
      </div>

      <div className="mt-5 text-center slide-up slide-up-delay-3">
        <p className="text-[var(--text-dim)] text-sm">
          Don't have an account?
          <button className="btn-auth-link ml-1.5" onClick={onSwitchToRegister}>Create Account</button>
        </p>
      </div>
    </div>
  )
}

