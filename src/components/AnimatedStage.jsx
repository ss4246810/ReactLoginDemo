import React, { useState, useEffect, useRef } from 'react'
import AuthCard from './AuthCard'
import Character3D from './Character3D'
import Suitcase3D from './Suitcase3D'
import { RotateCcwIcon, VolumeIcon, VolumeXIcon, SparklesIcon, UserIcon } from './Icons'
import { sound } from '../utils/soundEffects'

export default function AnimatedStage() {
  // Exact user requested state machine:
  // 1. 'walking_in'   -> Character enters from left walking naturally in profile facing right, holding bag
  // 2. 'placing_bag'  -> Arrives at center, bends down and places the bag on the floor
  // 3. 'turning'      -> Turns to face the screen/audience as bag opens
  // 4. 'form_open'    -> Form emerges up from the bag, character presents form facing user
  // 5. 'closing_form' -> Form collapses back inside the bag
  // 6. 'closing_bag'  -> Bag lid snaps shut
  // 7. 'picking_up'   -> Character bends down and picks up the bag
  // 8. 'walking_out'  -> Character turns right and walks away to the right carrying the bag
  // 9. 'vacant'       -> Character is off-screen; summon button available
  const [phase, setPhase] = useState('walking_in')
  const [avatarType, setAvatarType] = useState('executive') // 'nepali' | 'executive'
  const [activeMode, setActiveMode] = useState('register') // 'register' | 'login'
  const [focusedField, setFocusedField] = useState(null)
  const [isCheering, setIsCheering] = useState(false)
  const [muted, setMuted] = useState(false)
  const [isHoldingBag, setIsHoldingBag] = useState(true)
  const [isBagOnFloor, setIsBagOnFloor] = useState(false)

  const timersRef = useRef([])

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  // Sequence:
  // 1. Walk in from left in side profile facing right, holding bag (0 - 4s)
  // 2. Reach center beside box spot, bend down in profile, place bag on floor (4s - 5s)
  // 3. Release bag onto floor at 4.55s
  // 4. Turn to face screen/audience (5s - 5.6s) -> "ani uslya screen tira hyarxa"
  // 5. Box opens, Form emerges upwards from box (5.6s)
  const startEntranceSequence = () => {
    clearTimers()
    setIsCheering(false)
    setIsHoldingBag(true)
    setIsBagOnFloor(false)
    sound.playPop()

    // Step 1: Walk in from left facing right in natural side profile
    setPhase('walking_in')

    // Step 2: Reached center! Still in side profile! Bends down to place bag on floor
    const t1 = setTimeout(() => {
      setPhase('placing_bag')
    }, 4000)

    // Hand sets bag down on floor
    const t1_drop = setTimeout(() => {
      setIsHoldingBag(false)
      setIsBagOnFloor(true)
      sound.playClick()
    }, 4550)

    // Step 3: Straightens up and turns to face the screen/audience
    const t2 = setTimeout(() => {
      setPhase('turning')
      sound.playPop()
    }, 5000)

    // Step 4: Box lid opens, Form unfolds up from the box, character presents to user
    const t3 = setTimeout(() => {
      setPhase('form_open')
      sound.playWhoosh()
    }, 5600)

    timersRef.current = [t1, t1_drop, t2, t3]
  }

  // Sequence on Close [X]:
  // 1. Form collapses down into box (0 - 0.4s) -> "ani jaani bela form box vitra jaanxa"
  // 2. Box snaps shut with click (0.4s - 0.7s)
  // 3. Character turns from front to side profile facing box (0.7s - 1.0s)
  // 4. Character bends down in profile to pick up bag (1.0s - 1.9s)
  // 5. Hand lifts bag off floor at 1.45s
  // 6. Character strides away to the right carrying bag (1.9s - 5.9s) -> "ani uu daaya tira lagxa"
  // 7. Vacant screen with summon button (5.9s)
  const handleCloseForm = () => {
    clearTimers()
    sound.playPop()

    // Step 1: Form collapses down into box
    setPhase('closing_form')

    // Step 2: Box lid snaps shut
    const t1 = setTimeout(() => {
      setPhase('closing_bag')
      sound.playClick()
    }, 400)

    // Step 3: Character turns back to side profile facing the box
    const t2 = setTimeout(() => {
      setPhase('turning_to_bag')
    }, 700)

    // Step 4: Character bends down in side profile to pick up bag
    const t3 = setTimeout(() => {
      setPhase('picking_up')
    }, 1000)

    // Hand grips handle and lifts bag off floor
    const t3_grab = setTimeout(() => {
      setIsBagOnFloor(false)
      setIsHoldingBag(true)
      sound.playClick()
    }, 1450)

    // Step 5: Character stands up with bag and walks away to the right
    const t4 = setTimeout(() => {
      setPhase('walking_out')
    }, 1900)

    // Step 6: Character is off-screen
    const t5 = setTimeout(() => {
      setPhase('vacant')
    }, 5900)

    timersRef.current = [t1, t2, t3, t3_grab, t4, t5]
  }

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    sound.muted = next
    if (!next) {
      sound.unlock()
      sound.playSwitch()
    }
  }

  const toggleAvatar = () => {
    sound.playSwitch()
    setAvatarType((prev) => (prev === 'nepali' ? 'executive' : 'nepali'))
  }

  useEffect(() => {
    startEntranceSequence()
    return () => clearTimers()
  }, [])

  useEffect(() => {
    const unlockAudio = () => {
      sound.unlock()
    }

    window.addEventListener('pointerdown', unlockAudio, { once: true })
    window.addEventListener('keydown', unlockAudio, { once: true })

    return () => {
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }
  }, [])

  const handleSuccessSubmit = () => {
    setIsCheering(true)
  }

  const getCharacterPose = () => {
    switch (phase) {
      case 'walking_in':
        return 'walking_in'
      case 'placing_bag':
        return 'placing'
      case 'turning':
        return 'turning'
      case 'form_open':
        return 'presenting'
      case 'closing_form':
      case 'closing_bag':
        return 'presenting'
      case 'turning_to_bag':
        return 'turning_to_bag'
      case 'picking_up':
        return 'picking_up'
      case 'walking_out':
        return 'walking_out'
      default:
        return 'presenting'
    }
  }

  return (
    <div className="stage-wrapper">
      {/* Background Lighting */}
      <div className="stage-backdrop">
        <div className="backdrop-radial-light" />
        <div className="backdrop-grid-glow" />
        <div className="backdrop-particles">
          <span className="bg-orb orb-1" />
          <span className="bg-orb orb-2" />
          <span className="bg-orb orb-3" />
        </div>
      </div>

      {/* Top Navbar */}
      <header className="stage-navbar">
        <a
          className="brand-badge"
          href="https://sureshshrestha9848.com.np/"
          target="_blank"
          rel="noreferrer"
          aria-label="Visit Suresh Shrestha website"
        >
          <svg
            className="brand-logo-mark"
            viewBox="0 0 96 64"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M86 5 L39 22 C32 24 25 30 21 36 L63 36 C70 36 74 40 71 47 C69 52 64 55 58 56 L9 62 L44 43 L22 43 C14 43 10 39 14 32 L32 14 L86 5 Z" />
            <path d="M71 24 L58 37 L42 37 L55 28 L71 24 Z" fill="currentColor" opacity="0.9" />
          </svg>
          <span className="brand-title">Suresh Shrestha</span>
        </a>

        <div className="controls-group">
          {/* Avatar Switcher */}
          <button
            type="button"
            className="control-btn avatar-toggle-btn"
            onClick={toggleAvatar}
            title="Switch Character"
          >
            <UserIcon width={16} height={16} />
            <span>Character: {avatarType === 'nepali' ? 'Nepali Lady' : 'Executive'}</span>
          </button>

          {/* Replay Sequence Button */}
          <button
            type="button"
            className="control-btn replay-btn"
            onClick={startEntranceSequence}
            title="Replay Entrance Sequence"
          >
            <RotateCcwIcon width={16} height={16} />
            <span>Replay Walk</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            type="button"
            className="control-btn mute-btn"
            onClick={toggleMute}
            title={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeXIcon width={16} height={16} /> : <VolumeIcon width={16} height={16} />}
          </button>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="stage-viewport">
        <div className={`scene-content phase-${phase}`}>
          {/* Floor Reflection Line */}
          <div className="stage-floor">
            <div className="floor-light-spot" />
          </div>

          {/* STAGE ACTORS: Character + Suitcase + Form */}
          <div className="stage-actors-row">
            {/* 3D Character */}
            {phase !== 'vacant' && (
              <div
                className={`actor-character-slot slot-${phase}`}
              >
                <Character3D
                  avatarType={avatarType}
                  pose={getCharacterPose()}
                  targetField={focusedField}
                  isCheering={isCheering}
                  isHoldingBag={isHoldingBag}
                />
              </div>
            )}

            {/* Central Form & Suitcase Unit */}
            {phase !== 'vacant' && (
              <div className="actor-center-slot">
                {/* Emerging Form Modal */}
                {(phase === 'form_open' || phase === 'closing_form') && (
                  <div
                    className={`form-emerge-container ${
                      phase === 'closing_form' ? 'form-closing-down' : 'form-opening-up'
                    }`}
                  >
                    <AuthCard
                      mode={activeMode}
                      setMode={setActiveMode}
                      onClose={handleCloseForm}
                      isClosing={phase === 'closing_form'}
                      onSuccessSubmit={handleSuccessSubmit}
                      onInputFocus={(field) => setFocusedField(field)}
                      onInputBlur={() => setFocusedField(null)}
                    />
                  </div>
                )}

                {/* 3D Bag / Box Resting on the Floor */}
                {isBagOnFloor && (
                  <div className="floor-suitcase-slot">
                    <Suitcase3D
                      state={phase === 'form_open' ? 'open' : 'closed'}
                      isHeld={false}
                    />
                  </div>
                )}
              </div>
            )}

            {/* If Character has walked away, show Summon Card */}
            {phase === 'vacant' && (
              <div className="vacant-summon-card">
                <div className="summon-icon-bubble">
                  <SparklesIcon width={32} height={32} />
                </div>
                <h3>Representative packed the bag and walked away!</h3>
                <p>Click below to summon the representative back with the registration/login bag.</p>
                <button
                  type="button"
                  className="auth-submit-btn summon-btn"
                  onClick={startEntranceSequence}
                >
                  <SparklesIcon width={16} height={16} />
                  <span>Bring Bag Back & Open Form</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="stage-footer-bar">
        <span className="live-indicator">
          <span className="live-dot" /> PRODUCTION READY
        </span>
        <span className="footer-text">
          Natural Profile Walking from Left &bull; Places Box & Turns to Screen &bull; Form Closes into Box & Representative Walks Right
        </span>
      </footer>
    </div>
  )
}
