import React from 'react'

export default function Suitcase3D({ isOpen = true, isOpening = false }) {
  return (
    <div className={`suitcase-scene ${isOpen ? 'suitcase-open' : 'suitcase-closed'} ${isOpening ? 'suitcase-animating' : ''}`}>
      {/* Ground soft shadow */}
      <div className="suitcase-shadow" />

      {/* Energy Glow Burst when open */}
      {isOpen && (
        <div className="suitcase-glow-burst">
          <div className="glow-ray ray-1" />
          <div className="glow-ray ray-2" />
          <div className="glow-ray ray-3" />
          <div className="spark-particle spark-1" />
          <div className="spark-particle spark-2" />
          <div className="spark-particle spark-3" />
          <div className="spark-particle spark-4" />
        </div>
      )}

      {/* 3D Suitcase Object */}
      <div className="suitcase-3d-box">
        {/* Lid (Opens backwards with 3D rotateX) */}
        <div className="suitcase-lid">
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
              <span>AGY 2026</span>
            </div>
          </div>
          <div className="base-interior">
            <div className="interior-silk" />
            <div className="interior-portal-beam" />
          </div>
        </div>
      </div>
    </div>
  )
}
