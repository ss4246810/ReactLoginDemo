import React, { useEffect, useState } from 'react'

export default function Character3D({
  pose = 'presenting', // 'walking' | 'placing' | 'tapping' | 'presenting' | 'typing' | 'cheering'
  targetField = null,
  isCheering = false
}) {
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 200)
    }, 3600)
    return () => clearInterval(blinkInterval)
  }, [])

  // Eye and head angle based on which field is focused
  let eyeOffsetX = 0
  let eyeOffsetY = 0
  let headTilt = 0

  if (targetField === 'name' || targetField === 'surname') {
    eyeOffsetX = 2.5
    eyeOffsetY = -1
    headTilt = 4
  } else if (targetField === 'email') {
    eyeOffsetX = 3
    eyeOffsetY = 1
    headTilt = 6
  } else if (targetField === 'password') {
    eyeOffsetX = 2.5
    eyeOffsetY = 2.5
    headTilt = 7
  } else if (isCheering) {
    headTilt = -3
  }

  return (
    <div className={`character-container pose-${pose} ${isCheering ? 'character-cheering' : ''}`}>
      <svg
        viewBox="0 0 160 320"
        className="character-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="skinGlow" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffdfcb" />
            <stop offset="85%" stopColor="#f4c0a5" />
            <stop offset="100%" stopColor="#df9f82" />
          </radialGradient>
          <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dfcfba" />
            <stop offset="50%" stopColor="#c5b299" />
            <stop offset="100%" stopColor="#a9947a" />
          </linearGradient>
          <linearGradient id="pantsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>
          <linearGradient id="shoeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5c4033" />
            <stop offset="100%" stopColor="#3d2817" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <filter id="charShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Soft ground shadow beneath feet */}
        <ellipse
          cx="80"
          cy="308"
          rx="52"
          ry="10"
          fill="rgba(10, 25, 60, 0.35)"
          className="character-floor-shadow"
        />

        {/* --- LEGS & PANTS --- */}
        <g className="char-legs">
          {/* Left Leg */}
          <path
            d="M62 188 L58 280 L72 280 L74 188 Z"
            fill="url(#pantsGrad)"
          />
          {/* Right Leg */}
          <path
            d="M86 188 L88 280 L102 280 L98 188 Z"
            fill="url(#pantsGrad)"
          />
          {/* Left Shoe */}
          <path
            d="M50 280 C50 276 56 274 72 274 C75 274 76 278 76 284 C76 288 68 290 52 290 C49 290 50 284 50 280 Z"
            fill="url(#shoeGrad)"
          />
          {/* Right Shoe */}
          <path
            d="M84 280 C84 276 90 274 106 274 C110 274 114 278 114 284 C114 288 108 290 86 290 C83 290 84 284 84 280 Z"
            fill="url(#shoeGrad)"
          />
        </g>

        {/* --- TORSO & JACKET --- */}
        <g className="char-torso">
          {/* Inner White Shirt */}
          <path
            d="M65 106 L95 106 L92 190 L68 190 Z"
            fill="#f8fafc"
          />
          {/* Shirt Collar V-neck */}
          <path
            d="M72 106 L80 126 L88 106 Z"
            fill="#e2e8f0"
          />
          {/* Beige Cardigan / Jacket Body */}
          <path
            d="M56 108 L104 108 L100 188 L60 188 Z"
            fill="url(#jacketGrad)"
          />
          {/* Open Jacket Placket */}
          <path
            d="M74 108 L72 188 L88 188 L86 108 Z"
            fill="#ffffff"
          />
          {/* Jacket Lapels */}
          <path
            d="M60 108 L74 150 L64 188"
            stroke="#9d846a"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M100 108 L86 150 L96 188"
            stroke="#9d846a"
            strokeWidth="3"
            fill="none"
          />
        </g>

        {/* --- ARMS (Dynamic depending on pose) --- */}
        {pose === 'presenting' || isCheering ? (
          /* Arms Spread Wide in Presentation / "Ta-Da!" Pose (matches video!) */
          <g className="char-arms-presenting">
            {/* Left Arm gesturing towards form */}
            <path
              d="M58 112 C44 116 28 128 20 148 C16 158 24 168 34 162 C44 156 56 138 64 128"
              fill="url(#jacketGrad)"
            />
            {/* Left Hand open gesturing */}
            <circle cx="20" cy="154" r="8" fill="url(#skinGlow)" />
            <path d="M14 150 C12 144 20 142 22 148" stroke="#f4c0a5" strokeWidth="2" />

            {/* Right Arm extended pointing towards the form card */}
            <path
              d="M102 114 C120 118 138 126 148 136 C154 142 148 152 138 150 C126 148 114 136 98 126"
              fill="url(#jacketGrad)"
              className="arm-pointing"
            />
            {/* Right Hand pointing */}
            <circle cx="150" cy="142" r="8" fill="url(#skinGlow)" />
            <path
              d="M152 140 L160 141"
              stroke="#e29b79"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        ) : pose === 'placing' || pose === 'tapping' ? (
          /* Bending / Tapping Briefcase Pose */
          <g className="char-arms-tapping">
            <path
              d="M58 114 L50 156 L72 190"
              stroke="url(#jacketGrad)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="72" cy="192" r="8" fill="url(#skinGlow)" />
            <path
              d="M102 114 L106 156 L88 190"
              stroke="url(#jacketGrad)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="88" cy="192" r="8" fill="url(#skinGlow)" />
          </g>
        ) : (
          /* Walking with Briefcase Pose */
          <g className="char-arms-walking">
            <path
              d="M58 112 L48 150 L56 182"
              stroke="url(#jacketGrad)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="56" cy="184" r="8" fill="url(#skinGlow)" />
            {/* Right arm carrying suitcase */}
            <path
              d="M102 112 L108 154 L106 186"
              stroke="url(#jacketGrad)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="106" cy="188" r="8" fill="url(#skinGlow)" />
          </g>
        )}

        {/* --- HEAD & FACE --- */}
        <g
          className="char-head"
          style={{
            transform: `rotate(${headTilt}deg)`,
            transformOrigin: '80px 96px',
            transition: 'transform 0.3s ease-out'
          }}
        >
          {/* Neck */}
          <rect x="74" y="90" width="12" height="18" fill="#e8ad91" rx="4" />

          {/* Head Base */}
          <circle
            cx="80"
            cy="70"
            r="26"
            fill="url(#skinGlow)"
            filter="url(#charShadow)"
          />

          {/* Stylized Modern 3D Hair (Combed to the side like in video) */}
          <path
            d="M56 62 C54 42 66 32 82 32 C98 32 108 40 106 58 C104 62 102 54 94 46 C84 38 70 42 66 54 C64 58 60 62 56 62 Z"
            fill="url(#hairGrad)"
          />
          {/* Hair volume puff */}
          <ellipse cx="80" cy="38" rx="20" ry="10" fill="#692d0c" />

          {/* Ears */}
          <circle cx="54" cy="70" r="5" fill="#f4b598" />
          <circle cx="106" cy="70" r="5" fill="#f4b598" />

          {/* Eyebrows */}
          <path
            d={`M${67 + eyeOffsetX * 0.5} 58 Q${73 + eyeOffsetX * 0.5} 54 ${78 + eyeOffsetX * 0.5} 58`}
            stroke="#451a03"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M${84 + eyeOffsetX * 0.5} 58 Q${89 + eyeOffsetX * 0.5} 54 ${95 + eyeOffsetX * 0.5} 58`}
            stroke="#451a03"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Eyes */}
          {blink ? (
            // Blinking state
            <>
              <line
                x1={69 + eyeOffsetX}
                y1={65 + eyeOffsetY}
                x2={77 + eyeOffsetX}
                y2={65 + eyeOffsetY}
                stroke="#2b1507"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1={85 + eyeOffsetX}
                y1={65 + eyeOffsetY}
                x2={93 + eyeOffsetX}
                y2={65 + eyeOffsetY}
                stroke="#2b1507"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          ) : (
            // Open 3D friendly eyes
            <>
              <ellipse
                cx={73 + eyeOffsetX}
                cy={65 + eyeOffsetY}
                rx="4.2"
                ry="5"
                fill="#1e293b"
              />
              <circle
                cx={74.5 + eyeOffsetX}
                cy={63.5 + eyeOffsetY}
                r="1.6"
                fill="#ffffff"
              />

              <ellipse
                cx={89 + eyeOffsetX}
                cy={65 + eyeOffsetY}
                rx="4.2"
                ry="5"
                fill="#1e293b"
              />
              <circle
                cx={90.5 + eyeOffsetX}
                cy={63.5 + eyeOffsetY}
                r="1.6"
                fill="#ffffff"
              />
            </>
          )}

          {/* Cute subtle blush */}
          <circle cx="65" cy="74" r="5" fill="#fca5a5" opacity="0.45" />
          <circle cx="95" cy="74" r="5" fill="#fca5a5" opacity="0.45" />

          {/* Nose */}
          <path
            d="M80 66 Q82 72 80 75"
            stroke="#df9f82"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Smile (Happy, warm grin) */}
          <path
            d={
              isCheering
                ? 'M73 78 Q80 88 88 78 Z'
                : 'M73 78 Q80 85 88 78'
            }
            stroke="#9f1239"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill={isCheering ? '#be123c' : 'none'}
          />
        </g>
      </svg>
    </div>
  )
}
