import React from 'react'

export default function Suitcase3D({ state = 'open', isHeld = false }) {
  const isOpen = state === 'open' || state === 'opening'

  return (
    <div className={`suitcase-component ${isHeld ? 'held-mode' : 'floor-mode'} state-${state}`}>
      {/* Ground soft shadow (only when resting on floor) */}
      {!isHeld && <div className="suitcase-shadow" />}

      {/* Energy Glow Burst when open */}
      {isOpen && !isHeld && (
        <div className="suitcase-glow-burst">
          <div className="glow-ray ray-1" />
          <div className="glow-ray ray-2" />
          <div className="glow-ray ray-3" />
          <div className="spark-particle spark-1" />
          <div className="spark-particle spark-2" />
          <div className="spark-particle spark-3" />
        </div>
      )}

      {/* 3D Suitcase Object */}
      <div className="suitcase-box-3d">
        {/* Lid (Opens backwards with 3D rotateX) */}
        <div className={`suitcase-lid ${isOpen ? 'lid-open' : 'lid-closed'}`}>
          <div className="lid-face lid-front">
            <div className="leather-texture" />
            <div className="brass-corner corner-tl" />
            <div className="brass-corner corner-tr" />
            <div className="leather-strap strap-left" />
            <div className="leather-strap strap-right" />
            <div className="suitcase-handle">
              <div className="handle-metal metal-l" />
              <div className="handle-grip" />
              <div className="handle-metal metal-r" />
            </div>
            <div className="brass-lock lock-center">
              <div className="keyhole" />
            </div>
          </div>
          <div className="lid-face lid-inner">
            <div className="inner-silk-lining" />
          </div>
        </div>

        {/* Base / Bottom Half of suitcase */}
        <div className="suitcase-base">
          <div className="base-face base-front">
            <div className="leather-texture" />
            <div className="brass-corner corner-bl" />
            <div className="brass-corner corner-br" />
            <div className="leather-strap strap-left" />
            <div className="leather-strap strap-right" />
            <div className="lock-clasp clasp-l" />
            <div className="lock-clasp clasp-r" />
            <div className="brass-plate">
              <span>AGY AUTH</span>
            </div>
          </div>
          <div className="base-interior">
            <div className="interior-silk" />
          </div>
        </div>
      </div>
    </div>
  )
}
