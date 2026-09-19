import React, { useState, useEffect, useRef } from 'react'
import AuthCard from './AuthCard'
import Character3D from './Character3D'
import Suitcase3D from './Suitcase3D'
import { RotateCcwIcon, VolumeIcon, VolumeXIcon, SparklesIcon } from './Icons'
import { sound } from '../utils/soundEffects'

export default function AnimatedStage() {
  // Stage animation state: 'walking' | 'placing' | 'opening' | 'revealed' | 'closed'
  const [animStep, setAnimStep] = useState('revealed')
  const [activeMode, setActiveMode] = useState('register') // 'register' | 'login'
  const [focusedField, setFocusedField] = useState(null)
  const [isCheering, setIsCheering] = useState(false)
  const [muted, setMuted] = useState(false)
  const [renderEngine, setRenderEngine] = useState('css3d') // 'css3d' | 'video'
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [videoOverlayActive, setVideoOverlayActive] = useState(true)

  const videoRef = useRef(null)
  const animationTimerRef = useRef([])

  const clearAllTimers = () => {
    animationTimerRef.current.forEach(clearTimeout)
    animationTimerRef.current = []
  }

  // Handle replaying animation
  const handleReplay = () => {
    clearAllTimers()
    setIsCheering(false)
    sound.playPop()

    if (renderEngine === 'video') {
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play()
        setVideoOverlayActive(false)
      }
      setAnimStep('walking')

      // At 4.2s in video, form opens
      const t1 = setTimeout(() => {
        sound.playWhoosh()
        setAnimStep('revealed')
        setVideoOverlayActive(true)
      }, 4200)

      animationTimerRef.current = [t1]
    } else {
      // CSS 3D Timeline
      setAnimStep('walking')

      // Step 1: Walking in (0 to 1.4s)
      const t1 = setTimeout(() => {
        setAnimStep('placing')
      }, 1400)

      // Step 2: Placing suitcase & tapping (1.4s to 2.4s)
      const t2 = setTimeout(() => {
        setAnimStep('opening')
        sound.playPop()
      }, 2400)

      // Step 3: Suitcase opens, light burst, form shoots up (2.4s to 3.2s)
      const t3 = setTimeout(() => {
        sound.playWhoosh()
        setAnimStep('revealed')
      }, 3100)

      animationTimerRef.current = [t1, t2, t3]
    }
  }

  // Handle video playback events
  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return
    const ct = videoRef.current.currentTime
    if (ct >= 4.2 && !videoOverlayActive) {
      setVideoOverlayActive(true)
      setAnimStep('revealed')
    }
    // Loop before the TikTok outro (outro starts at ~7s)
    if (ct >= 7.2) {
      videoRef.current.currentTime = 4.8
    }
  }

  // Handle mute toggling
  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    sound.muted = next
  }

  // Initial autoplay on mount
  useEffect(() => {
    handleReplay()
    return () => clearAllTimers()
  }, [renderEngine])

  const handleCloseCard = () => {
    sound.playPop()
    setAnimStep('closed')
  }

  const handleOpenCard = () => {
    sound.playWhoosh()
    setAnimStep('revealed')
  }

  const handleSuccessSubmit = () => {
    setIsCheering(true)
  }

  return (
    <div className="stage-wrapper">
      {/* Dynamic Background with Modern Radial Vignette */}
      <div className="stage-backdrop">
        <div className="backdrop-radial-light" />
        <div className="backdrop-grid-glow" />
        <div className="backdrop-particles">
          <span className="bg-orb orb-1" />
          <span className="bg-orb orb-2" />
          <span className="bg-orb orb-3" />
        </div>
      </div>

      {/* Top Floating Control Bar */}
      <header className="stage-navbar">
        <div className="brand-badge">
          <div className="brand-dot" />
          <span className="brand-title">3D Webinar Experience</span>
        </div>

        <div className="controls-group">
          {/* Engine Switcher */}
          <div className="engine-switch">
            <button
              type="button"
              className={`engine-btn ${renderEngine === 'css3d' ? 'active' : ''}`}
              onClick={() => {
                setRenderEngine('css3d')
              }}
              title="Interactive Vector 3D Stage"
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Interactive 3D Stage</span>
            </button>
            <button
              type="button"
              className={`engine-btn ${renderEngine === 'video' ? 'active' : ''}`}
              onClick={() => {
                setRenderEngine('video')
              }}
              title="Synchronized Video Reveal"
            >
              <span>Video Sync Demo</span>
            </button>
          </div>

          {/* Replay Button */}
          <button
            type="button"
            className="control-btn replay-btn"
            onClick={handleReplay}
            title="Replay Entrance Animation"
          >
            <RotateCcwIcon className="w-4 h-4" />
            <span>Replay Animation</span>
          </button>

          {/* Audio Mute Button */}
          <button
            type="button"
            className="control-btn mute-btn"
            onClick={toggleMute}
            title={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeXIcon className="w-4 h-4" /> : <VolumeIcon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* --- MAIN STAGE SCENE --- */}
      <main className="stage-viewport">
        {renderEngine === 'video' ? (
          /* ============================================================ */
          /* ENGINE A: Synchronized Video Reveal (Plays demo video clip) */
          /* ============================================================ */
          <div className="video-stage-container">
            <div className="video-crop-box">
              <video
                ref={videoRef}
                src="/animation.mp4"
                className="synced-video-player"
                playsInline
                autoPlay
                muted
                onTimeUpdate={handleVideoTimeUpdate}
                onLoadedMetadata={() => setIsVideoReady(true)}
              />
            </div>

            {/* Seamless Interactive Form Overlay */}
            {animStep === 'revealed' && videoOverlayActive && (
              <div className="video-interactive-overlay">
                <AuthCard
                  mode={activeMode}
                  setMode={setActiveMode}
                  onClose={handleCloseCard}
                  onSuccessSubmit={handleSuccessSubmit}
                  onInputFocus={(field) => setFocusedField(field)}
                  onInputBlur={() => setFocusedField(null)}
                />
              </div>
            )}
          </div>
        ) : (
          /* ============================================================ */
          /* ENGINE B: Full CSS/SVG 3D Animated Vector Experience         */
          /* ============================================================ */
          <div className={`scene-content step-${animStep}`}>
            {/* Ground Reflection & Shadow Line */}
            <div className="stage-floor">
              <div className="floor-light-spot" />
            </div>

            {/* Stage Character & Form Row */}
            <div className="stage-actors-row">
              {/* 3D Character (Positioned to the left of the card, matching video!) */}
              <div
                className={`actor-character-slot ${
                  animStep === 'walking'
                    ? 'char-walking-in'
                    : animStep === 'placing'
                    ? 'char-placing-down'
                    : animStep === 'opening'
                    ? 'char-tapping'
                    : 'char-presenting'
                }`}
              >
                <Character3D
                  pose={
                    animStep === 'walking'
                      ? 'walking'
                      : animStep === 'placing'
                      ? 'placing'
                      : animStep === 'opening'
                      ? 'tapping'
                      : 'presenting'
                  }
                  targetField={focusedField}
                  isCheering={isCheering}
                />
              </div>

              {/* Central Area: Suitcase + Emerging Form Modal */}
              <div className="actor-center-slot">
                {/* 3D Suitcase at the base */}
                <div className="suitcase-anchor">
                  <Suitcase3D
                    isOpen={animStep === 'opening' || animStep === 'revealed'}
                    isOpening={animStep === 'opening'}
                  />

                  {/* Button to reopen if closed */}
                  {animStep === 'closed' && (
                    <button
                      type="button"
                      className="open-suitcase-btn"
                      onClick={handleOpenCard}
                    >
                      <SparklesIcon className="w-4 h-4" />
                      <span>Open Register Form</span>
                    </button>
                  )}
                </div>

                {/* Form Modal Emerging upwards out of the briefcase */}
                {animStep === 'revealed' && (
                  <div className="form-emerge-container">
                    <AuthCard
                      mode={activeMode}
                      setMode={setActiveMode}
                      onClose={handleCloseCard}
                      onSuccessSubmit={handleSuccessSubmit}
                      onInputFocus={(field) => setFocusedField(field)}
                      onInputBlur={() => setFocusedField(null)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Status & Instruction Footer */}
      <footer className="stage-footer-bar">
        <span className="live-indicator">
          <span className="live-dot" /> LIVE DEMO
        </span>
        <span className="footer-text">
          Interactive recreation of the 3D briefcase entrance & form unfold animation
        </span>
      </footer>
    </div>
  )
}
