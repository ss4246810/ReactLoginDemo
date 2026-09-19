import React, { useState } from 'react'
import confetti from 'canvas-confetti'
import {
  UserIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  CloseIcon,
  CheckIcon,
  SparklesIcon,
  ArrowRightIcon
} from './Icons'
import { sound } from '../utils/soundEffects'

// Production Social Login Brand SVGs
function GoogleIcon({ className = '', width = 18, height = 18 }) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  )
}

function GithubIcon({ className = '', width = 18, height = 18 }) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

export default function AuthCard({
  mode = 'register',
  setMode,
  onClose,
  isClosing = false,
  onSuccessSubmit,
  onInputFocus,
  onInputBlur
}) {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    rememberMe: true,
    agreeTerms: true
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [resetModal, setResetModal] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetDone, setResetDone] = useState(false)

  // Password strength calculator
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: '#e2e8f0' }
    let score = 0
    if (pass.length >= 8) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1

    if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' }
    if (score === 2) return { score: 2, label: 'Fair', color: '#f59e0b' }
    if (score === 3) return { score: 3, label: 'Good', color: '#3b82f6' }
    return { score: 4, label: 'Strong', color: '#10b981' }
  }

  const passStrength = getPasswordStrength(formData.password)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (mode === 'register') {
      if (!formData.name.trim()) newErrors.name = 'First name is required'
      if (!formData.surname.trim()) newErrors.surname = 'Last name is required'
      if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to continue'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (mode === 'register' && formData.password.length < 8) {
      newErrors.password = 'Must be at least 8 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sound.playClick()
    if (!validate()) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      sound.playSuccess()

      // Confetti burst
      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#00C853', '#10B981', '#3B82F6', '#F59E0B', '#6366F1']
      })

      if (onSuccessSubmit) {
        onSuccessSubmit({ mode, formData })
      }
    }, 850)
  }

  const handleSocialAuth = (provider) => {
    sound.playPop()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      sound.playSuccess()
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      })
      setFormData((prev) => ({
        ...prev,
        name: provider === 'Google' ? 'Alex' : 'Morgan',
        surname: 'Dev',
        email: `${provider.toLowerCase()}.user@example.com`
      }))
    }, 700)
  }

  const quickFill = (type) => {
    sound.playPop()
    if (type === 'register') {
      setMode('register')
      setFormData({
        name: 'Alex',
        surname: 'Vance',
        email: 'alex.vance@company.com',
        password: 'ProductionPass2026!',
        rememberMe: true,
        agreeTerms: true
      })
    } else {
      setMode('login')
      setFormData({
        name: 'Jordan',
        surname: 'Blake',
        email: 'jordan.blake@techcorp.io',
        password: 'SecureLogin2026!',
        rememberMe: true,
        agreeTerms: true
      })
    }
    setErrors({})
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
      alert('Please enter a valid email address')
      return
    }
    sound.playSuccess()
    setResetDone(true)
    setTimeout(() => {
      setResetDone(false)
      setResetModal(false)
      setResetEmail('')
    }, 2500)
  }

  return (
    <div
      className={`auth-card-wrapper ${isClosing ? 'card-folding-down' : 'card-spring-up'}`}
      role="dialog"
      aria-labelledby="auth-card-heading"
    >
      <div className="auth-card">
        {/* Close Button [X]: Triggers fold down and man walks away carrying bag */}
        <button
          type="button"
          id="close-auth-card-btn"
          className="auth-close-btn"
          onClick={() => {
            sound.playClick()
            onClose && onClose()
          }}
          aria-label="Close form"
          title="Close and pack bag"
        >
          <CloseIcon width={16} height={16} />
        </button>

        {!submitted ? (
          <>
            {/* Mode Switcher Segmented Control */}
            <div className="auth-segmented-control">
              <button
                type="button"
                className={`segment-btn ${mode === 'register' ? 'active' : ''}`}
                onClick={() => {
                  if (mode !== 'register') {
                    sound.playSwitch()
                    setMode('register')
                    setErrors({})
                  }
                }}
              >
                Create Account
              </button>
              <button
                type="button"
                className={`segment-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => {
                  if (mode !== 'login') {
                    sound.playSwitch()
                    setMode('login')
                    setErrors({})
                  }
                }}
              >
                Sign In
              </button>
              <div
                className="segment-pill-slider"
                style={{
                  transform: mode === 'register' ? 'translateX(0%)' : 'translateX(100%)'
                }}
              />
            </div>

            {/* Header */}
            <div className="auth-header">
              <h2 id="auth-card-heading" className="auth-title">
                {mode === 'register' ? 'Register now' : 'Welcome back'}
              </h2>
              <p className="auth-subtitle">
                {mode === 'register'
                  ? 'Join thousands of developers building the modern web'
                  : 'Enter your credentials to access your secure dashboard'}
              </p>
            </div>

            {/* Social Authentication Buttons */}
            <div className="social-auth-grid">
              <button
                type="button"
                className="social-auth-btn google"
                onClick={() => handleSocialAuth('Google')}
              >
                <GoogleIcon width={18} height={18} />
                <span>Google</span>
              </button>
              <button
                type="button"
                className="social-auth-btn github"
                onClick={() => handleSocialAuth('GitHub')}
              >
                <GithubIcon width={18} height={18} />
                <span>GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="auth-divider">
              <span>or continue with email</span>
            </div>

            {/* Quick Demo Pre-fill helper */}
            <div className="quick-fill-bar">
              <button
                type="button"
                className="quick-fill-btn"
                onClick={() => quickFill(mode)}
              >
                <SparklesIcon width={13} height={13} />
                <span>Sample {mode === 'register' ? 'Registration Data' : 'Login Credentials'}</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="auth-form">
              {/* REGISTER ONLY: Name & Surname */}
              {mode === 'register' && (
                <div className="form-group">
                  <label className="form-label">What's your name?</label>
                  <div className="name-inputs-row">
                    <div className="input-container">
                      <span className="input-icon">
                        <UserIcon width={17} height={17} />
                      </span>
                      <input
                        type="text"
                        name="name"
                        id="auth-first-name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => {
                          sound.playPop()
                          onInputFocus && onInputFocus('name')
                        }}
                        onBlur={onInputBlur}
                        placeholder="First name"
                        className={`auth-input ${errors.name ? 'input-error' : ''}`}
                      />
                      {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>

                    <div className="input-container">
                      <span className="input-icon">
                        <UserIcon width={17} height={17} />
                      </span>
                      <input
                        type="text"
                        name="surname"
                        id="auth-last-name"
                        value={formData.surname}
                        onChange={handleChange}
                        onFocus={() => {
                          sound.playPop()
                          onInputFocus && onInputFocus('surname')
                        }}
                        onBlur={onInputBlur}
                        placeholder="Last name"
                        className={`auth-input ${errors.surname ? 'input-error' : ''}`}
                      />
                      {errors.surname && <span className="field-error">{errors.surname}</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label" htmlFor="auth-email">
                  {mode === 'register' ? 'Enter your email address *' : 'Email address or username *'}
                </label>
                <div className="input-container">
                  <span className="input-icon">
                    <MailIcon width={17} height={17} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    id="auth-email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => {
                      sound.playPop()
                      onInputFocus && onInputFocus('email')
                    }}
                    onBlur={onInputBlur}
                    placeholder={mode === 'register' ? 'name@company.com' : 'you@company.com'}
                    className={`auth-input ${errors.email ? 'input-error' : ''}`}
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <div className="label-with-action">
                  <label className="form-label" htmlFor="auth-password">
                    {mode === 'register' ? 'Create a secure password *' : 'Password *'}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      className="forgot-link-btn"
                      onClick={() => {
                        sound.playClick()
                        setResetModal(true)
                      }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="input-container">
                  <span className="input-icon">
                    <LockIcon width={17} height={17} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="auth-password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => {
                      sound.playPop()
                      onInputFocus && onInputFocus('password')
                    }}
                    onBlur={onInputBlur}
                    placeholder="••••••••••••"
                    className={`auth-input ${errors.password ? 'input-error' : ''}`}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => {
                      sound.playClick()
                      setShowPassword(!showPassword)
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOffIcon width={17} height={17} /> : <EyeIcon width={17} height={17} />}
                  </button>
                  {errors.password && <span className="field-error">{errors.password}</span>}
                </div>

                {/* Password Strength Meter for Register Mode */}
                {mode === 'register' && formData.password && (
                  <div className="password-strength-container">
                    <div className="strength-bars">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className="strength-bar"
                          style={{
                            background:
                              passStrength.score >= level ? passStrength.color : '#e2e8f0'
                          }}
                        />
                      ))}
                    </div>
                    <span className="strength-text" style={{ color: passStrength.color }}>
                      {passStrength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Checkbox Rows */}
              {mode === 'login' ? (
                <div className="checkbox-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="custom-checkbox"
                    />
                    <span>Remember this device for 30 days</span>
                  </label>
                </div>
              ) : (
                <div className="checkbox-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="custom-checkbox"
                    />
                    <span>
                      I agree to the{' '}
                      <a href="#terms" onClick={(e) => e.preventDefault()} className="inline-link">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#privacy" onClick={(e) => e.preventDefault()} className="inline-link">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                  {errors.agreeTerms && <span className="field-error">{errors.agreeTerms}</span>}
                </div>
              )}

              {/* Submit Button (Vibrant Emerald Gradient matching video) */}
              <button
                type="submit"
                id="auth-submit-button"
                className={`auth-submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-spinner" />
                ) : (
                  <>
                    <span>{mode === 'register' ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRightIcon width={16} height={16} className="btn-arrow" />
                  </>
                )}
              </button>
            </form>

            {/* Footer switcher */}
            <div className="auth-card-footer">
              <p>
                {mode === 'register' ? (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="switch-inline-btn"
                      onClick={() => {
                        sound.playSwitch()
                        setMode('login')
                      }}
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="switch-inline-btn"
                      onClick={() => {
                        sound.playSwitch()
                        setMode('register')
                      }}
                    >
                      Create one now
                    </button>
                  </>
                )}
              </p>
            </div>
          </>
        ) : (
          /* Submission Success State */
          <div className="auth-success-state">
            <div className="success-badge-wrapper">
              <div className="success-badge">
                <CheckIcon width={32} height={32} className="text-white" />
              </div>
              <div className="success-badge-ring" />
            </div>

            <h3 className="success-title">
              {mode === 'register' ? 'Account Created Successfully!' : 'Welcome Back!'}
            </h3>
            <p className="success-subtitle">
              {mode === 'register'
                ? `Welcome aboard, ${formData.name || 'Developer'}! A verification link has been sent to ${formData.email}.`
                : `Authenticated successfully as ${formData.email}. Redirecting to your workspace...`}
            </p>

            <div className="success-ticket">
              <div className="ticket-header">
                <span className="ticket-tag">
                  {mode === 'register' ? 'PRO TIER ACCESS' : 'SESSION ACTIVE'}
                </span>
                <span className="ticket-id">JWT #2026-VERIFIED</span>
              </div>
              <div className="ticket-body">
                <div>
                  <span className="ticket-label">User Account</span>
                  <span className="ticket-val">
                    {mode === 'register'
                      ? `${formData.name} ${formData.surname}`
                      : formData.email.split('@')[0]}
                  </span>
                </div>
                <div>
                  <span className="ticket-label">Security Status</span>
                  <span className="ticket-val green">Encrypted (TLS 1.3)</span>
                </div>
              </div>
            </div>

            <div className="success-actions">
              <button
                type="button"
                className="auth-submit-btn"
                onClick={() => {
                  sound.playClick()
                  alert('Redirecting to dashboard...')
                }}
              >
                <span>Enter Dashboard</span>
                <ArrowRightIcon width={16} height={16} />
              </button>
              <button
                type="button"
                className="secondary-text-btn"
                onClick={() => {
                  sound.playPop()
                  setSubmitted(false)
                }}
              >
                Sign in with another account
              </button>
            </div>
          </div>
        )}

        {/* Forgot Password Modal Overlay */}
        {resetModal && (
          <div className="reset-modal-overlay">
            <div className="reset-modal-content">
              <h3>Reset Your Password</h3>
              <p>Enter your account email to receive a password reset link.</p>
              {resetDone ? (
                <div className="reset-done-alert">
                  <CheckIcon width={18} height={18} />
                  <span>Reset link dispatched! Check your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="reset-form">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="auth-input"
                    autoFocus
                  />
                  <div className="reset-modal-actions">
                    <button
                      type="button"
                      className="secondary-text-btn"
                      onClick={() => setResetModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="auth-submit-btn reset-btn">
                      Send Link
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
