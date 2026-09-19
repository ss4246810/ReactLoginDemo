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

export default function AuthCard({
  mode,
  setMode,
  onClose,
  isExiting = false,
  onSuccessSubmit,
  onInputFocus,
  onInputBlur
}) {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    rememberMe: true
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

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
      if (!formData.name.trim()) newErrors.name = 'First name required'
      if (!formData.surname.trim()) newErrors.surname = 'Surname required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 characters'
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

      // Fire confetti cannon
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00C853', '#10B981', '#3B82F6', '#F59E0B', '#EC4899']
      })

      if (onSuccessSubmit) {
        onSuccessSubmit({ mode, formData })
      }
    }, 900)
  }

  const quickFill = (type) => {
    sound.playPop()
    if (type === 'register') {
      setMode('register')
      setFormData({
        name: 'Jordan',
        surname: 'Miller',
        email: 'jordan.miller@company.com',
        password: 'WebinarSecure2026!',
        rememberMe: true
      })
    } else {
      setMode('login')
      setFormData({
        name: 'Alex',
        surname: 'Rivers',
        email: 'alex.rivers@cloudtech.io',
        password: 'Password123!',
        rememberMe: true
      })
    }
    setErrors({})
  }

  const handleReset = () => {
    sound.playPop()
    setSubmitted(false)
    setFormData({
      name: '',
      surname: '',
      email: '',
      password: '',
      rememberMe: true
    })
  }

  return (
    <div
      className={`auth-card-wrapper ${isExiting ? 'card-exiting' : 'card-entering'}`}
      role="dialog"
      aria-labelledby="auth-card-title"
    >
      <div className="auth-card">
        {/* Close Button */}
        <button
          type="button"
          className="auth-close-btn"
          onClick={() => {
            sound.playClick()
            onClose && onClose()
          }}
          aria-label="Close dialog"
          title="Close dialog"
        >
          <CloseIcon className="w-4 h-4" />
        </button>

        {/* Card Header */}
        {!submitted ? (
          <>
            {/* Mode Switcher Tabs */}
            <div className="auth-tabs-container">
              <div className="auth-tabs-pill">
                <button
                  type="button"
                  className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                  onClick={() => {
                    if (mode !== 'register') {
                      sound.playSwitch()
                      setMode('register')
                      setErrors({})
                    }
                  }}
                >
                  Register
                </button>
                <button
                  type="button"
                  className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                  onClick={() => {
                    if (mode !== 'login') {
                      sound.playSwitch()
                      setMode('login')
                      setErrors({})
                    }
                  }}
                >
                  Login
                </button>
                <span
                  className="auth-tab-indicator"
                  style={{
                    transform: mode === 'register' ? 'translateX(0%)' : 'translateX(100%)'
                  }}
                />
              </div>
            </div>

            <div className="auth-header">
              <h2 id="auth-card-title" className="auth-title">
                {mode === 'register' ? 'Register now' : 'Welcome back'}
              </h2>
              <p className="auth-subtitle">
                {mode === 'register'
                  ? 'Secure your spot in our upcoming live webinar'
                  : 'Enter your credentials to access your dashboard'}
              </p>
            </div>

            {/* Quick Demo Pre-fill helper */}
            <div className="quick-fill-bar">
              <button
                type="button"
                className="quick-fill-btn"
                onClick={() => quickFill(mode)}
              >
                <SparklesIcon className="w-3.5 h-3.5" />
                Fill sample {mode === 'register' ? 'Webinar attendee' : 'Account user'}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="auth-form">
              {mode === 'register' && (
                <div className="form-group">
                  <label className="form-label">What's your name?</label>
                  <div className="name-inputs-row">
                    <div className="input-container">
                      <span className="input-icon">
                        <UserIcon />
                      </span>
                      <input
                        type="text"
                        name="name"
                        id="reg-name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => {
                          sound.playPop()
                          onInputFocus && onInputFocus('name')
                        }}
                        onBlur={onInputBlur}
                        placeholder="Name"
                        className={`auth-input ${errors.name ? 'input-error' : ''}`}
                      />
                      {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>

                    <div className="input-container">
                      <span className="input-icon">
                        <UserIcon />
                      </span>
                      <input
                        type="text"
                        name="surname"
                        id="reg-surname"
                        value={formData.surname}
                        onChange={handleChange}
                        onFocus={() => {
                          sound.playPop()
                          onInputFocus && onInputFocus('surname')
                        }}
                        onBlur={onInputBlur}
                        placeholder="Surname"
                        className={`auth-input ${errors.surname ? 'input-error' : ''}`}
                      />
                      {errors.surname && <span className="field-error">{errors.surname}</span>}
                    </div>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="auth-email">
                  {mode === 'register' ? 'Enter your email address *' : 'Email address *'}
                </label>
                <div className="input-container">
                  <span className="input-icon">
                    <MailIcon />
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

              <div className="form-group">
                <div className="label-with-action">
                  <label className="form-label" htmlFor="auth-password">
                    {mode === 'register' ? 'Create a password *' : 'Password *'}
                  </label>
                  {mode === 'login' && (
                    <a
                      href="#forgot"
                      className="forgot-link"
                      onClick={(e) => {
                        e.preventDefault()
                        alert('Password reset link has been dispatched to your email!')
                      }}
                    >
                      Forgot?
                    </a>
                  )}
                </div>
                <div className="input-container">
                  <span className="input-icon">
                    <LockIcon />
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
                    placeholder="••••••••"
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
                    {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                  {errors.password && <span className="field-error">{errors.password}</span>}
                </div>
              </div>

              {mode === 'login' && (
                <div className="checkbox-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="custom-checkbox"
                    />
                    <span>Remember me for 30 days</span>
                  </label>
                </div>
              )}

              {/* Submit Button (Vibrant Emerald Button matching video) */}
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
                    <span>{mode === 'register' ? 'Next' : 'Sign in'}</span>
                    <ArrowRightIcon className="w-4 h-4 btn-arrow" />
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
                      Register now
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
                <CheckIcon className="w-8 h-8 text-white" />
              </div>
              <div className="success-badge-ring" />
            </div>

            <h3 className="success-title">
              {mode === 'register' ? 'Spot Confirmed!' : 'Welcome Back!'}
            </h3>
            <p className="success-subtitle">
              {mode === 'register'
                ? `Thank you ${formData.name || 'Friend'}! We've sent a webinar calendar invite to ${formData.email}.`
                : `Successfully authenticated as ${formData.email}. Session is active.`}
            </p>

            <div className="success-ticket">
              <div className="ticket-header">
                <span className="ticket-tag">
                  {mode === 'register' ? 'Webinar VIP Pass' : 'Authorized Access'}
                </span>
                <span className="ticket-id">#WEB-2026-LIVE</span>
              </div>
              <div className="ticket-body">
                <div>
                  <span className="ticket-label">Attendee</span>
                  <span className="ticket-val">
                    {mode === 'register'
                      ? `${formData.name} ${formData.surname}`
                      : formData.email.split('@')[0]}
                  </span>
                </div>
                <div>
                  <span className="ticket-label">Access Level</span>
                  <span className="ticket-val green">All-Access Pass</span>
                </div>
              </div>
            </div>

            <div className="success-actions">
              <button
                type="button"
                className="auth-submit-btn"
                onClick={() => {
                  sound.playClick()
                  alert('Launching dashboard / webinar portal...')
                }}
              >
                <span>Go to Dashboard</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="secondary-text-btn"
                onClick={handleReset}
              >
                Register another person or log out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
