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
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="85%" stopColor="#fdba74" />
              <stop offset="100%" stopColor="#ea580c" />
            </radialGradient>
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
              <stop offset="0%" stopColor="#333333" />
              <stop offset="100%" stopColor="#0d0d0d" />
            </linearGradient>
            <linearGradient id="pBriefcaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c4324" />
              <stop offset="100%" stopColor="#3b1d0e" />
            </linearGradient>
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
              />
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
                  <path d="M76 115 L108 115 L104 185 L78 185 Z" fill="url(#pSariRed)" />
                  {/* Black Pallu drape from left to right */}
                  <path d="M78 120 L106 170 L98 185 L76 130 Z" fill="url(#pSariBlack)" />
                  <path d="M84 120 L106 170" stroke="url(#pSariRed)" strokeWidth="5" />
                  <path d="M84 120 L106 170" stroke="url(#pGoldTrim)" strokeWidth="1.5" />
                </g>
              ) : (
                <g>
                  <path d="M76 115 L108 115 L104 185 L78 185 Z" fill="#dfcfba" />
                  <path d="M92 115 L90 185" stroke="#9d846a" strokeWidth="3" />
                </g>
              )}
            </g>

            {/* HEAD & FACE (SIDE PROFILE FACING RIGHT) */}
            <g className="profile-head">
              {/* Neck */}
              <rect x="84" y="98" width="14" height="20" fill="#fdba74" rx="3" />

              {/* Profile Face (Forehead, straight nose pointing right, lips, chin) */}
              <path
                d="M80 80 C80 60 90 50 104 50 C114 50 120 56 120 68 L124 74 L120 78 L122 84 L116 88 L114 96 C108 102 96 102 86 96 C80 90 80 85 80 80 Z"
                fill="url(#profileSkin)"
              />

              {/* Profile Eye (Looking forward to the right) */}
              <ellipse cx="112" cy="72" rx="3.5" ry="4" fill="#0f172a" />
              <circle cx="113.5" cy="71" r="1.3" fill="#ffffff" />
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

              {/* Hair & Long Braid trailing backward */}
              {avatarType === 'nepali' ? (
                <g className="profile-hair">
                  <path
                    d="M76 76 C74 54 86 44 104 44 C116 44 122 50 118 64 C112 56 100 52 90 60 C84 66 80 72 76 76 Z"
                    fill="#171717"
                  />
                  <circle cx="118" cy="52" r="3.5" fill="#ffffff" />
                  <circle cx="121" cy="56" r="3" fill="#dc2626" />
                  {/* Long Braid trailing behind while walking */}
                  <path
                    d="M78 78 C70 95 64 125 66 160 C68 185 64 205 60 215"
                    stroke="#171717"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                    className="profile-braid-trail"
                  />
                  <circle cx="60" cy="216" r="3.5" fill="#fde047" />
                  <path d="M60 217 L58 232" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
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
                      <path d="M16 4 L16 -6 L28 -6 L28 4" stroke="#d4af37" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                      <circle cx="22" cy="18" r="4.5" fill="#fde047" />
                      <circle cx="22" cy="18" r="2" fill="#ffffff" />
                    </g>
                  ) : (
                    /* Executive Leather Briefcase */
                    <g>
                      <rect x="0" y="4" width="52" height="36" rx="4" fill="url(#pBriefcaseGrad)" stroke="#38190c" strokeWidth="1" />
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
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="85%" stopColor="#fdba74" />
              <stop offset="100%" stopColor="#ea580c" />
            </radialGradient>
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
          </defs>

          {/* Ground Shadow */}
          <ellipse cx="110" cy="342" rx="60" ry="11" fill="rgba(10, 25, 60, 0.45)" />

          {/* LOWER BODY */}
          {avatarType === 'nepali' ? (
            <g className="nepali-sari-skirt">
              <path
                d="M84 185 C78 220 74 270 72 328 L148 328 C146 270 142 220 136 185 Z"
                fill="url(#fSariBlack)"
              />
              <path d="M72 312 L148 312 L148 328 L72 328 Z" fill="url(#fSariRed)" />
              <line x1="72" y1="312" x2="148" y2="312" stroke="url(#fGoldTrim)" strokeWidth="3" />
              <line x1="72" y1="328" x2="148" y2="328" stroke="url(#fGoldTrim)" strokeWidth="2" />
              <ellipse cx="98" cy="340" rx="14" ry="6" fill="#b91c1c" />
              <ellipse cx="98" cy="339" rx="6" ry="2" fill="#fde047" />
              <ellipse cx="126" cy="340" rx="14" ry="6" fill="#b91c1c" />
              <ellipse cx="126" cy="339" rx="6" ry="2" fill="#fde047" />
            </g>
          ) : (
            <g className="executive-legs">
              <path d="M92 205 L88 328 L104 328 L106 205 Z" fill="url(#fPantsGrad)" />
              <path d="M80 328 C80 324 88 322 104 322 C108 322 110 326 110 332 C110 336 102 338 82 338 C79 338 80 332 80 328 Z" fill="#3d2817" />
              <path d="M116 205 L118 328 L134 328 L130 205 Z" fill="url(#fPantsGrad)" />
              <path d="M114 328 C114 324 122 322 138 322 C142 322 146 326 146 332 C146 336 138 338 116 338 C113 338 114 332 114 328 Z" fill="#3d2817" />
            </g>
          )}

          {/* UPPER BODY & ATTIRE */}
          <g className="front-torso">
            {avatarType === 'nepali' ? (
              <g>
                <path d="M84 120 L136 120 L132 186 L88 186 Z" fill="url(#fSariRed)" />
                <path d="M100 120 C100 134 120 134 120 120" stroke="url(#fGoldTrim)" strokeWidth="2.5" fill="none" />
                <path d="M84 120 L110 186 L134 186 L136 120 Z" fill="url(#fSariBlack)" />
                <path d="M84 120 L96 186 L108 186 L94 120 Z" fill="url(#fSariRed)" />
                <line x1="84" y1="120" x2="96" y2="186" stroke="url(#fGoldTrim)" strokeWidth="2" />
                {/* Red Pote Necklace */}
                <path d="M97 122 C97 150 123 150 123 122" stroke="#dc2626" strokeWidth="4" strokeDasharray="4,2" fill="none" />
                <circle cx="110" cy="148" r="4" fill="#ffffff" stroke="#fde047" strokeWidth="1.5" />
              </g>
            ) : (
              <g>
                <path d="M95 116 L125 116 L122 205 L98 205 Z" fill="#f8fafc" />
                <path d="M102 116 L110 136 L118 116 Z" fill="#e2e8f0" />
                <path d="M86 118 L134 118 L130 205 L90 205 Z" fill="url(#fJacketGrad)" />
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
            <rect x="104" y="98" width="12" height="18" fill="#fdba74" rx="4" />
            <circle cx="110" cy="78" r="26" fill="url(#frontSkin)" filter="url(#fBodyShadow)" />

            {avatarType === 'nepali' ? (
              <g className="nepali-hair-front">
                <path
                  d="M84 72 C82 48 94 38 110 38 C126 38 138 48 136 72 C134 76 130 60 120 54 C112 50 98 52 94 62 C92 66 88 72 84 72 Z"
                  fill="#171717"
                />
                <ellipse cx="110" cy="46" rx="22" ry="11" fill="#0a0a0a" />
                {/* Long Braid over left shoulder */}
                <path
                  d="M128 72 C132 90 134 120 132 150 C130 170 128 185 126 195"
                  stroke="#171717"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="126" cy="195" r="3" fill="#fde047" />
                <path d="M126 195 L126 218" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" />
                {/* Flowers in hair */}
                <circle cx="132" cy="52" r="3.5" fill="#ffffff" />
                <circle cx="136" cy="56" r="3" fill="#dc2626" />
                {/* Red Tika on Forehead */}
                <ellipse cx="110" cy="67" rx="2.5" ry="3.2" fill="#dc2626" />
                {/* Earrings */}
                <circle cx="83" cy="80" r="3" fill="#fde047" />
                <circle cx="137" cy="80" r="3" fill="#fde047" />
              </g>
            ) : (
              <g className="exec-hair-front">
                <path
                  d="M86 70 C84 50 96 40 112 40 C128 40 138 48 136 66 C134 70 132 62 124 54 C114 46 100 50 96 62 C94 66 90 70 86 70 Z"
                  fill="#692d0c"
                />
                <ellipse cx="110" cy="46" rx="20" ry="10" fill="#451a03" />
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
                <ellipse cx={103 + eyeOffsetX} cy={75 + eyeOffsetY} rx="4.2" ry="5" fill="#0f172a" />
                <circle cx={104.5 + eyeOffsetX} cy={73.5 + eyeOffsetY} r="1.6" fill="#ffffff" />
                <ellipse cx={119 + eyeOffsetX} cy={75 + eyeOffsetY} rx="4.2" ry="5" fill="#0f172a" />
                <circle cx={120.5 + eyeOffsetX} cy={73.5 + eyeOffsetY} r="1.6" fill="#ffffff" />
              </>
            )}

            {/* Blush */}
            <circle cx="95" cy="84" r="5" fill="#fca5a5" opacity="0.55" />
            <circle cx="125" cy="84" r="5" fill="#fca5a5" opacity="0.55" />

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
