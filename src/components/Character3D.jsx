import React, { useEffect, useState } from 'react'

export default function Character3D({
  avatarType = 'nepali', // 'nepali' | 'executive'
  pose = 'presenting',    // 'walking_in' | 'placing' | 'presenting' | 'picking_up' | 'walking_out'
  targetField = null,
  isCheering = false,
  isHoldingBag = false
}) {
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 180)
    }, 3600)
    return () => clearInterval(blinkInterval)
  }, [])

  // Profile mode applies to walking in from left, placing bag on floor, turning to bag, picking up bag, and walking out to right
  const isProfileMode =
    pose === 'walking_in' ||
    pose === 'placing' ||
    pose === 'turning_to_bag' ||
    pose === 'picking_up' ||
    pose === 'walking_out'

  // Eye and head angle tracking active input when in front view
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
    <div
      className={`character-root ${isProfileMode ? 'mode-profile-view' : 'mode-front-present'} pose-${pose} avatar-${avatarType} ${
        isCheering ? 'character-cheering' : ''
      }`}
    >
      {isProfileMode ? (
        /* ============================================================ */
        /* 1. SIDE PROFILE VIEW (NATURAL PROFILE WALK & BEND MECHANICS) */
        /* ============================================================ */
        <svg
          viewBox="0 0 180 340"
          className="character-svg profile-walk-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="profileSkin" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffe2c9" />
              <stop offset="48%" stopColor="#f3b486" />
              <stop offset="82%" stopColor="#d9875f" />
              <stop offset="100%" stopColor="#9f5a3d" />
            </radialGradient>
            <linearGradient id="profileSkinSideShade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b46b4b" stopOpacity="0.48" />
              <stop offset="48%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.38" />
            </linearGradient>
            <linearGradient id="pSariBlack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#262626" />
              <stop offset="60%" stopColor="#171717" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>
            <linearGradient id="pSariRed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id="pGoldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <linearGradient id="pHandbagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3f3f46" />
              <stop offset="48%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>
            <linearGradient id="pBriefcaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c4324" />
              <stop offset="100%" stopColor="#3b1d0e" />
            </linearGradient>
            <filter id="profileSoftShadow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#020617" floodOpacity="0.35" />
            </filter>
            <filter id="profileClothDepth" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="5" stdDeviation="3" floodColor="#020617" floodOpacity="0.28" />
            </filter>
          </defs>

          {/* Dynamic Ground Shadow */}
          <ellipse
            cx="90"
            cy="325"
            rx="45"
            ry="10"
            fill="rgba(10, 25, 60, 0.4)"
            className="profile-ground-shadow"
          />

          {/* BACK LEG (Swings opposite phase) */}
          <g className="profile-leg-back">
            {avatarType === 'nepali' ? (
              <g>
                <path d="M85 200 L75 270 L65 318" stroke="#991b1b" strokeWidth="16" strokeLinecap="round" />
                <path d="M55 316 L76 316 C80 316 80 324 76 324 L52 324 Z" fill="#b91c1c" />
                <ellipse cx="64" cy="320" rx="4" ry="2" fill="#fde047" />
              </g>
            ) : (
              <g>
                <path d="M85 200 L75 270 L65 318" stroke="#1f2937" strokeWidth="18" strokeLinecap="round" />
                <path d="M55 316 L76 316 C80 316 80 324 76 324 L52 324 Z" fill="#3d2817" />
              </g>
            )}
          </g>

          {/* SARI / SKIRT SIDE VIEW (Fluid cloth trailing back) */}
          {avatarType === 'nepali' ? (
            <g className="profile-sari-skirt">
              <path
                d="M75 180 C70 220 60 270 55 310 L115 310 C110 270 100 220 95 180 Z"
                fill="url(#pSariBlack)"
                className="sari-skirt-cloth"
                filter="url(#profileClothDepth)"
              />
              <path d="M80 188 C76 226 70 264 66 306" stroke="#404040" strokeWidth="3" opacity="0.58" strokeLinecap="round" />
              <path d="M94 188 C98 230 104 266 107 306" stroke="#050505" strokeWidth="3" opacity="0.55" strokeLinecap="round" />
              <path d="M72 194 C78 226 82 265 82 306" stroke="#f87171" strokeWidth="1.6" opacity="0.55" strokeLinecap="round" />
              <path d="M55 298 L115 298 L115 310 L55 310 Z" fill="url(#pSariRed)" />
              <line x1="55" y1="298" x2="115" y2="298" stroke="url(#pGoldTrim)" strokeWidth="2.5" />
            </g>
          ) : null}

          {/* FRONT LEG (Strides forward facing right) */}
          <g className="profile-leg-front">
            {avatarType === 'nepali' ? (
              <g>
                <path d="M92 200 L102 270 L112 318" stroke="#dc2626" strokeWidth="16" strokeLinecap="round" />
                <path d="M102 316 L124 316 C128 316 128 324 124 324 L100 324 Z" fill="#dc2626" />
                <ellipse cx="114" cy="320" rx="4" ry="2" fill="#fde047" />
              </g>
            ) : (
              <g>
                <path d="M92 200 L102 270 L112 318" stroke="#374151" strokeWidth="18" strokeLinecap="round" />
                <path d="M102 316 L124 316 C128 316 128 324 124 324 L100 324 Z" fill="#4a2412" />
              </g>
            )}
          </g>

          {/* UPPER BODY GROUP (Bends down realistically when placing or picking up bag) */}
          <g className="profile-upper-body">
            {/* TORSO (Side view facing right) */}
            <g className="profile-torso">
              {avatarType === 'nepali' ? (
                <g>
                  {/* Red Blouse */}
                  <path d="M76 115 L108 115 L104 185 L78 185 Z" fill="url(#pSariRed)" filter="url(#profileClothDepth)" />
                  <path d="M83 120 C87 142 86 164 82 181" stroke="#fca5a5" strokeWidth="2" opacity="0.45" strokeLinecap="round" />
                  {/* Black Pallu drape from left to right */}
                  <path d="M78 120 L106 170 L98 185 L76 130 Z" fill="url(#pSariBlack)" />
                  <path d="M84 120 L106 170" stroke="url(#pSariRed)" strokeWidth="5" />
                  <path d="M84 120 L106 170" stroke="url(#pGoldTrim)" strokeWidth="1.5" />
                </g>
              ) : (
                <g>
                  <path d="M76 115 L108 115 L104 185 L78 185 Z" fill="#dfcfba" filter="url(#profileClothDepth)" />
                  <path d="M92 115 L90 185" stroke="#9d846a" strokeWidth="3" />
                  <path d="M80 122 C88 136 92 156 90 180" stroke="#f8fafc" strokeWidth="2" opacity="0.55" strokeLinecap="round" />
                </g>
              )}
            </g>

            {/* HEAD & FACE (SIDE PROFILE FACING RIGHT) */}
            <g className="profile-head">
              {/* Neck */}
              <rect x="84" y="98" width="14" height="20" fill="#fdba74" rx="3" />

              {avatarType === 'nepali' && (
                <g className="profile-hair-back">
                  <path
                    d="M75 77 C72 55 86 42 104 42 C118 42 126 50 120 66 C114 57 101 53 91 60 C84 66 80 72 75 77 Z"
                    fill="#0a0a0a"
                  />
                  <path
                    d="M78 78 C70 96 64 125 66 160 C68 185 64 205 60 215"
                    stroke="#0a0a0a"
                    strokeWidth="9"
                    strokeLinecap="round"
                    fill="none"
                    className="profile-braid-trail"
                  />
                  <path
                    d="M79 84 C74 106 70 135 72 161 C73 184 68 204 64 214"
                    stroke="#3f3f46"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    fill="none"
                    className="profile-braid-trail"
                    opacity="0.7"
                  />
                  <circle cx="60" cy="216" r="3.5" fill="#fde047" />
                  <path d="M60 217 L58 232" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
                </g>
              )}

              {/* Profile Face (Forehead, straight nose pointing right, lips, chin) */}
              <path
                d="M80 80 C80 60 90 50 104 50 C114 50 120 56 120 68 L124 74 L120 78 L122 84 L116 88 L114 96 C108 102 96 102 86 96 C80 90 80 85 80 80 Z"
                fill="url(#profileSkin)"
                filter="url(#profileSoftShadow)"
              />
              <path
                d="M82 81 C84 94 96 101 110 96 C103 102 90 101 84 95 C80 91 80 86 82 81 Z"
                fill="url(#profileSkinSideShade)"
                opacity="0.75"
              />
              <path d="M119 68 C116 72 116 76 121 77" stroke="#a15c42" strokeWidth="1.6" strokeLinecap="round" opacity="0.65" />
              <path d="M108 92 C103 95 97 94 93 90" stroke="#b46b4b" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />

              {/* Profile Eye (Looking forward to the right) */}
              <path d="M108 72 C110 68 116 68 119 72 C116 75 111 75 108 72 Z" fill="#f8fafc" />
              <ellipse cx="113.8" cy="72" rx="2.1" ry="2.8" fill="#2a1a12" />
              <circle cx="114.6" cy="70.9" r="0.8" fill="#ffffff" />
              <path d="M108 65 Q113 62 117 65" stroke="#171717" strokeWidth="2" strokeLinecap="round" />

              {/* Red Tika on forehead in profile */}
              {avatarType === 'nepali' && (
                <circle cx="117" cy="62" r="2.5" fill="#dc2626" />
              )}

              {/* Profile Smile */}
              <path d="M114 83 Q118 85 116 88" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" />

              {/* Ear & Earring */}
              <circle cx="92" cy="76" r="4.5" fill="#f4b598" />
              {avatarType === 'nepali' && (
                <circle cx="92" cy="83" r="2.5" fill="#fde047" />
              )}
              {avatarType === 'nepali' && (
                <circle cx="120.5" cy="80" r="1.9" stroke="#facc15" strokeWidth="1.2" fill="none" />
              )}

              {/* Hair & Long Braid trailing backward */}
              {avatarType === 'nepali' ? (
                <g className="profile-hair">
                  <path
                    d="M78 72 C80 55 90 48 104 48 C114 48 120 54 119 64 C112 58 101 56 92 62 C86 66 82 70 78 72 Z"
                    fill="#171717"
                  />
                  <path d="M86 56 C96 48 111 48 119 58" stroke="#3f3f46" strokeWidth="2.2" opacity="0.7" strokeLinecap="round" />
                  <path d="M82 72 C86 62 94 56 105 55" stroke="#050505" strokeWidth="3" opacity="0.45" strokeLinecap="round" />
                  <circle cx="118" cy="52" r="3.5" fill="#ffffff" />
                  <circle cx="121" cy="56" r="3" fill="#dc2626" />
                </g>
              ) : (
                <path
                  d="M76 76 C74 50 88 44 106 44 C118 44 122 50 118 64 C112 56 100 52 92 60 C86 66 80 72 76 76 Z"
                  fill="#692d0c"
                />
              )}
            </g>

            {/* FRONT ARM (HOLDING BAG WITH NATURAL PENDULUM SWING) */}
            <g className="profile-arm-front">
              <path
                d="M90 125 L98 175 L102 215"
                stroke={avatarType === 'nepali' ? '#dc2626' : '#c5b299'}
                strokeWidth="14"
                strokeLinecap="round"
              />
              <circle cx="102" cy="215" r="7.5" fill="url(#profileSkin)" />

              {/* THE BAG IN HAND IN PROFILE (Facing walking direction) */}
              {isHoldingBag && (
                <g className="profile-bag-pendulum" transform="translate(85, 218)">
                  {avatarType === 'nepali' ? (
                    /* Black Handbag with Golden Flower Clasp */
                    <g>
                      <rect x="0" y="4" width="46" height="32" rx="4" fill="url(#pHandbagGrad)" stroke="#0a0a0a" strokeWidth="1" />
                      <path d="M4 10 C14 13 30 13 42 9" stroke="#71717a" strokeWidth="1.2" opacity="0.55" />
                      <path d="M16 4 L16 -6 L28 -6 L28 4" stroke="#d4af37" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                      <circle cx="22" cy="18" r="4.5" fill="#fde047" />
                      <circle cx="22" cy="18" r="2" fill="#ffffff" />
                    </g>
                  ) : (
                    /* Executive Leather Briefcase */
                    <g>
                      <rect x="0" y="4" width="52" height="36" rx="4" fill="url(#pBriefcaseGrad)" stroke="#38190c" strokeWidth="1" />
                      <path d="M4 10 C16 14 36 14 48 9" stroke="#b8733d" strokeWidth="1.4" opacity="0.5" />
                      <rect x="10" y="4" width="4" height="36" fill="#38190c" />
                      <rect x="38" y="4" width="4" height="36" fill="#38190c" />
                      <path d="M20 4 L20 -5 L32 -5 L32 4" stroke="#38190c" strokeWidth="4" strokeLinecap="round" fill="none" />
                      <rect x="22" y="16" width="7" height="6" rx="1" fill="#ffd700" />
                    </g>
                  )}
                </g>
              )}
            </g>
          </g>
        </svg>
      ) : (
        /* ============================================================ */
        /* 2. FRONT VIEW (TURNS TO FACE SCREEN AND PRESENT FORM)        */
        /* ============================================================ */
        <svg
          viewBox="0 0 220 360"
          className="character-svg front-present-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="frontSkin" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffe4cc" />
              <stop offset="42%" stopColor="#f5b98e" />
              <stop offset="78%" stopColor="#d88963" />
              <stop offset="100%" stopColor="#9a563b" />
            </radialGradient>
            <radialGradient id="frontCheekWarmth" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fb7185" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="frontFaceShade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="52%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.36" />
            </linearGradient>
            <linearGradient id="fJacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dfcfba" />
              <stop offset="50%" stopColor="#c5b299" />
              <stop offset="100%" stopColor="#a9947a" />
            </linearGradient>
            <linearGradient id="fPantsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#1f2937" />
            </linearGradient>
            <linearGradient id="fSariBlack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#262626" />
              <stop offset="60%" stopColor="#171717" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>
            <linearGradient id="fSariRed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id="fGoldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <filter id="fBodyShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.35" />
            </filter>
            <filter id="frontClothShadow" x="-18%" y="-18%" width="136%" height="136%">
              <feDropShadow dx="0" dy="7" stdDeviation="4" floodColor="#020617" floodOpacity="0.32" />
            </filter>
          </defs>

          {/* Ground Shadow */}
          <ellipse cx="110" cy="342" rx="60" ry="11" fill="rgba(10, 25, 60, 0.45)" />

          {/* LOWER BODY */}
          {avatarType === 'nepali' ? (
            <g className="nepali-sari-skirt">
              <path
                d="M86 184 C78 221 72 272 68 328 L152 328 C148 272 142 221 134 184 Z"
                fill="url(#fSariBlack)"
                filter="url(#frontClothShadow)"
              />
              <path d="M88 192 C80 235 78 281 76 322" stroke="#404040" strokeWidth="3" opacity="0.58" strokeLinecap="round" />
              <path d="M110 190 C112 236 112 286 112 326" stroke="#2b2b2b" strokeWidth="2.5" opacity="0.64" strokeLinecap="round" />
              <path d="M132 192 C140 236 142 282 144 322" stroke="#050505" strokeWidth="3" opacity="0.5" strokeLinecap="round" />
              <path d="M95 192 C101 232 101 280 97 324" stroke="#ef4444" strokeWidth="1.6" opacity="0.55" strokeLinecap="round" />
              <path d="M68 312 L152 312 L152 328 L68 328 Z" fill="url(#fSariRed)" />
              <line x1="68" y1="312" x2="152" y2="312" stroke="url(#fGoldTrim)" strokeWidth="3" />
              <line x1="68" y1="328" x2="152" y2="328" stroke="url(#fGoldTrim)" strokeWidth="2" />
              <ellipse cx="98" cy="340" rx="14" ry="6" fill="#b91c1c" />
              <ellipse cx="98" cy="339" rx="6" ry="2" fill="#fde047" />
              <ellipse cx="126" cy="340" rx="14" ry="6" fill="#b91c1c" />
              <ellipse cx="126" cy="339" rx="6" ry="2" fill="#fde047" />
            </g>
          ) : (
            <g className="executive-legs">
                <path d="M92 205 L88 328 L104 328 L106 205 Z" fill="url(#fPantsGrad)" filter="url(#frontClothShadow)" />
                <path d="M100 212 L98 320" stroke="#4b5563" strokeWidth="1.6" opacity="0.75" strokeLinecap="round" />
                <path d="M80 328 C80 324 88 322 104 322 C108 322 110 326 110 332 C110 336 102 338 82 338 C79 338 80 332 80 328 Z" fill="#3d2817" />
                <path d="M116 205 L118 328 L134 328 L130 205 Z" fill="url(#fPantsGrad)" filter="url(#frontClothShadow)" />
                <path d="M124 212 L126 320" stroke="#4b5563" strokeWidth="1.6" opacity="0.75" strokeLinecap="round" />
                <path d="M114 328 C114 324 122 322 138 322 C142 322 146 326 146 332 C146 336 138 338 116 338 C113 338 114 332 114 328 Z" fill="#3d2817" />
              </g>
          )}

          {/* UPPER BODY & ATTIRE */}
          <g className="front-torso">
            {avatarType === 'nepali' ? (
              <g>
                <path d="M86 120 C94 114 126 114 134 120 L130 186 L90 186 Z" fill="url(#fSariRed)" filter="url(#frontClothShadow)" />
                <path d="M92 126 C97 144 96 166 92 184" stroke="#fca5a5" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
                <path d="M128 126 C124 147 124 166 128 184" stroke="#7f1d1d" strokeWidth="2" opacity="0.42" strokeLinecap="round" />
                <path d="M100 120 C100 134 120 134 120 120" stroke="url(#fGoldTrim)" strokeWidth="2.5" fill="none" />
                <path d="M86 120 L110 186 L134 186 L136 120 Z" fill="url(#fSariBlack)" />
                <path d="M95 132 L112 184" stroke="#525252" strokeWidth="2" opacity="0.48" strokeLinecap="round" />
                <path d="M86 120 L96 186 L108 186 L94 120 Z" fill="url(#fSariRed)" />
                <path d="M91 124 C103 142 111 162 116 185" stroke="#fbbf24" strokeWidth="1.4" opacity="0.75" strokeLinecap="round" />
                <line x1="84" y1="120" x2="96" y2="186" stroke="url(#fGoldTrim)" strokeWidth="2" />
                {/* Red Pote Necklace */}
                <path d="M97 122 C97 150 123 150 123 122" stroke="#dc2626" strokeWidth="4" strokeDasharray="4,2" fill="none" />
                <circle cx="110" cy="148" r="4" fill="#ffffff" stroke="#fde047" strokeWidth="1.5" />
              </g>
            ) : (
              <g>
                <path d="M95 116 L125 116 L122 205 L98 205 Z" fill="#f8fafc" filter="url(#frontClothShadow)" />
                <path d="M102 116 L110 136 L118 116 Z" fill="#e2e8f0" />
                <path d="M86 118 L134 118 L130 205 L90 205 Z" fill="url(#fJacketGrad)" />
                <path d="M92 126 C101 146 101 174 96 198" stroke="#f8fafc" strokeWidth="2" opacity="0.42" strokeLinecap="round" />
                <path d="M128 126 C121 150 122 175 126 198" stroke="#7c6a55" strokeWidth="2" opacity="0.35" strokeLinecap="round" />
                <path d="M104 118 L102 205 L118 205 L116 118 Z" fill="#ffffff" />
              </g>
            )}
          </g>

          {/* ARMS: Gesturing and Presenting Form to User */}
          {pose === 'placing' || pose === 'picking_up' ? (
            /* Bending down towards floor */
            <g className="arms-bending-front">
              <path d="M86 128 L72 185 L90 245" stroke={avatarType === 'nepali' ? '#dc2626' : 'url(#fJacketGrad)'} strokeWidth="14" strokeLinecap="round" />
              <circle cx="90" cy="245" r="8" fill="url(#frontSkin)" />
              <path d="M134 128 L142 190 L156 255" stroke={avatarType === 'nepali' ? '#dc2626' : 'url(#fJacketGrad)'} strokeWidth="14" strokeLinecap="round" />
              <circle cx="156" cy="255" r="8" fill="url(#frontSkin)" />
            </g>
          ) : (
            /* Standing Proudly Presenting the Form to the User */
            <g className="arms-presenting-front">
              <path
                d="M86 126 C72 130 56 142 48 162 C44 172 52 182 62 176 C72 170 84 152 92 142"
                fill={avatarType === 'nepali' ? 'url(#fSariRed)' : 'url(#fJacketGrad)'}
              />
              <circle cx="48" cy="168" r="8" fill="url(#frontSkin)" />
              {avatarType === 'nepali' && (
                <circle cx="58" cy="166" r="3" stroke="#fde047" strokeWidth="3" fill="none" />
              )}

              <path
                d="M134 128 C152 132 170 140 180 150 C186 156 180 166 170 164 C158 162 146 150 130 140"
                fill={avatarType === 'nepali' ? 'url(#fSariRed)' : 'url(#fJacketGrad)'}
              />
              <circle cx="182" cy="156" r="8" fill="url(#frontSkin)" />
              <path d="M184 154 L192 155" stroke="#e29b79" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {/* HEAD & FACE (Facing user warmly) */}
          <g
            className="front-head"
            style={{
              transform: `rotate(${headTilt}deg)`,
              transformOrigin: '110px 106px',
              transition: 'transform 0.3s ease-out'
            }}
          >
            {avatarType === 'nepali' && (
              <g className="nepali-hair-back">
                <path
                  d="M80 80 C77 51 91 34 110 34 C130 34 143 51 140 80 C138 101 126 114 110 114 C94 114 82 101 80 80 Z"
                  fill="#0a0a0a"
                />
                <path
                  d="M135 76 C144 100 144 132 140 162 C137 188 132 207 127 222"
                  stroke="#0a0a0a"
                  strokeWidth="13"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M136 84 C139 110 138 154 130 214"
                  stroke="#3f3f46"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.75"
                />
                <circle cx="127" cy="222" r="4" fill="#fde047" />
                <path d="M127 223 L125 240" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" />
              </g>
            )}

            <rect x="104" y="98" width="12" height="18" fill="#fdba74" rx="4" />
            <path
              d="M84 78 C84 55 95 42 110 42 C126 42 137 55 136 78 C135 97 125 108 110 108 C95 108 85 97 84 78 Z"
              fill="url(#frontSkin)"
              filter="url(#fBodyShadow)"
            />
            <path
              d="M84 78 C84 55 95 42 110 42 C126 42 137 55 136 78 C135 97 125 108 110 108 C95 108 85 97 84 78 Z"
              fill="url(#frontFaceShade)"
              opacity="0.9"
            />
            <path d="M110 75 C107 80 107 84 111 85" stroke="#a15c42" strokeWidth="1.7" strokeLinecap="round" opacity="0.58" />
            <path d="M100 92 C106 96 114 96 120 92" stroke="#b46b4b" strokeWidth="1.3" strokeLinecap="round" opacity="0.45" />

            {avatarType === 'nepali' ? (
              <g className="nepali-hair-front">
                <path
                  d="M84 72 C86 53 96 42 111 42 C127 42 136 53 136 72 C130 62 121 56 111 56 C100 56 91 62 84 72 Z"
                  fill="#171717"
                />
                <path d="M92 60 C101 50 120 50 129 60" stroke="#3f3f46" strokeWidth="2.4" opacity="0.72" strokeLinecap="round" />
                <path d="M97 52 C107 47 120 49 127 56" stroke="#52525b" strokeWidth="1.4" opacity="0.55" strokeLinecap="round" />
                {/* Flowers in hair */}
                <circle cx="132" cy="55" r="3.5" fill="#ffffff" />
                <circle cx="136" cy="59" r="3" fill="#dc2626" />
                {/* Red Tika on Forehead */}
                <ellipse cx="110" cy="68" rx="2.5" ry="3.2" fill="#dc2626" />
                {/* Earrings */}
                <circle cx="83" cy="80" r="3" fill="#fde047" />
                <circle cx="137" cy="80" r="3" fill="#fde047" />
                <circle cx="118" cy="84" r="1.8" stroke="#facc15" strokeWidth="1.1" fill="none" />
              </g>
            ) : (
              <g className="exec-hair-front">
                <path
                  d="M86 70 C84 50 96 40 112 40 C128 40 138 48 136 66 C134 70 132 62 124 54 C114 46 100 50 96 62 C94 66 90 70 86 70 Z"
                  fill="#692d0c"
                />
                <ellipse cx="110" cy="46" rx="20" ry="10" fill="#451a03" />
                <path d="M94 60 C104 48 123 48 132 60" stroke="#854d0e" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
              </g>
            )}

            {/* Eyebrows */}
            <path d={`M${97 + eyeOffsetX * 0.5} 68 Q${103 + eyeOffsetX * 0.5} 64 ${108 + eyeOffsetX * 0.5} 68`} stroke="#171717" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d={`M${114 + eyeOffsetX * 0.5} 68 Q${119 + eyeOffsetX * 0.5} 64 ${125 + eyeOffsetX * 0.5} 68`} stroke="#171717" strokeWidth="2.2" strokeLinecap="round" fill="none" />

            {/* Eyes with Blinking */}
            {blink ? (
              <>
                <line x1={99 + eyeOffsetX} y1={75 + eyeOffsetY} x2={107 + eyeOffsetX} y2={75 + eyeOffsetY} stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
                <line x1={115 + eyeOffsetX} y1={75 + eyeOffsetY} x2={123 + eyeOffsetX} y2={75 + eyeOffsetY} stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                {avatarType === 'nepali' ? (
                  <>
                    <path d={`M${97 + eyeOffsetX} ${75 + eyeOffsetY} C${100 + eyeOffsetX} ${71 + eyeOffsetY} ${107 + eyeOffsetX} ${71 + eyeOffsetY} ${110 + eyeOffsetX} ${75 + eyeOffsetY} C${106 + eyeOffsetX} ${78 + eyeOffsetY} ${101 + eyeOffsetX} ${78 + eyeOffsetY} ${97 + eyeOffsetX} ${75 + eyeOffsetY} Z`} fill="#f8fafc" />
                    <ellipse cx={104 + eyeOffsetX} cy={75.2 + eyeOffsetY} rx="2.45" ry="3" fill="#2a1a12" />
                    <circle cx={105 + eyeOffsetX} cy={73.8 + eyeOffsetY} r="1" fill="#ffffff" />
                    <path d={`M${114 + eyeOffsetX} ${75 + eyeOffsetY} C${117 + eyeOffsetX} ${71 + eyeOffsetY} ${124 + eyeOffsetX} ${71 + eyeOffsetY} ${127 + eyeOffsetX} ${75 + eyeOffsetY} C${123 + eyeOffsetX} ${78 + eyeOffsetY} ${118 + eyeOffsetX} ${78 + eyeOffsetY} ${114 + eyeOffsetX} ${75 + eyeOffsetY} Z`} fill="#f8fafc" />
                    <ellipse cx={121 + eyeOffsetX} cy={75.2 + eyeOffsetY} rx="2.45" ry="3" fill="#2a1a12" />
                    <circle cx={122 + eyeOffsetX} cy={73.8 + eyeOffsetY} r="1" fill="#ffffff" />
                  </>
                ) : (
                  <>
                    <ellipse cx={103 + eyeOffsetX} cy={75 + eyeOffsetY} rx="4.5" ry="5.1" fill="#f8fafc" />
                    <ellipse cx={103.7 + eyeOffsetX} cy={75.4 + eyeOffsetY} rx="2.5" ry="3.1" fill="#2a1a12" />
                    <circle cx={105 + eyeOffsetX} cy={73.6 + eyeOffsetY} r="1.3" fill="#ffffff" />
                    <ellipse cx={119 + eyeOffsetX} cy={75 + eyeOffsetY} rx="4.5" ry="5.1" fill="#f8fafc" />
                    <ellipse cx={119.7 + eyeOffsetX} cy={75.4 + eyeOffsetY} rx="2.5" ry="3.1" fill="#2a1a12" />
                    <circle cx={121 + eyeOffsetX} cy={73.6 + eyeOffsetY} r="1.3" fill="#ffffff" />
                  </>
                )}
              </>
            )}

            {/* Blush */}
            <circle cx="95" cy="84" r="7" fill="url(#frontCheekWarmth)" />
            <circle cx="125" cy="84" r="7" fill="url(#frontCheekWarmth)" />

            {/* Smile */}
            <path
              d={isCheering ? 'M102 88 Q110 98 118 88 Z' : 'M102 88 Q110 95 118 88'}
              stroke="#991b1b"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill={isCheering ? '#b91c1c' : 'none'}
            />
          </g>
        </svg>
      )}
    </div>
  )
}
