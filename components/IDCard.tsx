"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function IDCard({ isDayMode }: { isDayMode: boolean }) {
  const [isSwinging, setIsSwinging] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSwinging(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background cosmic effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDayMode
            ? 'radial-gradient(circle at 50% 50%, rgba(135, 206, 235, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(79, 193, 255, 0.15) 0%, transparent 70%)'
        }}
      />

      <div className="relative flex flex-col items-center">
        {/* Lanyard rope */}
        <div
          className={`lanyard-rope ${isSwinging ? 'swing' : ''}`}
          style={{
            width: '4px',
            height: '200px',
            background: isDayMode
              ? 'linear-gradient(180deg, #4FC1FF 0%, #8B5CF6 100%)'
              : 'linear-gradient(180deg, #4FC1FF 0%, #8B5CF6 100%)',
            borderRadius: '2px',
            marginBottom: '-10px',
            position: 'relative',
            transformOrigin: 'top center',
            boxShadow: isDayMode
              ? '0 0 10px rgba(79, 193, 255, 0.3)'
              : '0 0 10px rgba(79, 193, 255, 0.5)'
          }}
        >
          {/* Top clip */}
          <div
            style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '20px',
              height: '15px',
              background: isDayMode ? '#666' : '#8B5CF6',
              borderRadius: '3px 3px 0 0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}
          />
        </div>

        {/* ID Card */}
        <div
          className={`id-card ${isSwinging ? 'swing' : ''}`}
          style={{
            width: '350px',
            background: isDayMode
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(15, 15, 35, 0.95) 0%, rgba(25, 25, 45, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: isDayMode
              ? '0 20px 60px rgba(100, 149, 237, 0.3), 0 0 0 1px rgba(100, 149, 237, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              : '0 20px 60px rgba(79, 193, 255, 0.3), 0 0 0 2px rgba(79, 193, 255, 0.3)',
            border: isDayMode ? 'none' : '2px solid rgba(139, 92, 246, 0.3)',
            transformOrigin: 'top center',
            cursor: 'grab',
            userSelect: 'none'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.cursor = 'grabbing'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.cursor = 'grab'
          }}
        >
          {/* Header */}
          <div className="text-center mb-4">
            <h2
              className="text-2xl font-bold"
              style={{
                color: isDayMode ? '#1e40af' : '#4FC1FF',
                textShadow: isDayMode ? 'none' : '0 0 10px rgba(79, 193, 255, 0.5)'
              }}
            >
              DIGITAL IDENTITY
            </h2>
            <div
              className="text-xs font-mono mt-1"
              style={{
                color: isDayMode ? '#6366f1' : '#8B5CF6'
              }}
            >
              // COSMIC DEVELOPER ACCESS CARD
            </div>
          </div>

          {/* Photo */}
          <div className="flex justify-center mb-4">
            <div
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: isDayMode
                  ? '3px solid #4FC1FF'
                  : '3px solid #8B5CF6',
                boxShadow: isDayMode
                  ? '0 8px 24px rgba(79, 193, 255, 0.3)'
                  : '0 8px 24px rgba(139, 92, 246, 0.5)'
              }}
            >
              <Image
                src="/id-card/my-image-for-id.jpeg"
                alt="Shivanshi ID Photo"
                width={150}
                height={150}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <div
              className="text-center"
              style={{
                color: isDayMode ? '#1f2937' : '#ffffff'
              }}
            >
              <div className="text-xl font-bold mb-1">SHIVANSHI GOEL</div>
              <div
                className="text-sm font-mono"
                style={{
                  color: isDayMode ? '#4b5563' : '#9ca3af'
                }}
              >
                DIGITAL ARCHITECT • NEURAL NAVIGATOR
              </div>
            </div>

            <div
              className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono"
              style={{
                color: isDayMode ? '#4b5563' : '#9ca3af'
              }}
            >
              <div>
                <span style={{ color: isDayMode ? '#6366f1' : '#8B5CF6' }}>ID:</span> DEV-2024
              </div>
              <div>
                <span style={{ color: isDayMode ? '#6366f1' : '#8B5CF6' }}>ACCESS:</span> COSMIC
              </div>
              <div>
                <span style={{ color: isDayMode ? '#6366f1' : '#8B5CF6' }}>STATUS:</span> ACTIVE
              </div>
              <div>
                <span style={{ color: isDayMode ? '#6366f1' : '#8B5CF6' }}>LEVEL:</span> ∞
              </div>
            </div>
          </div>

          {/* Barcode effect */}
          <div className="mt-4 flex justify-center gap-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: Math.random() > 0.5 ? '3px' : '2px',
                  height: '40px',
                  background: isDayMode ? '#1e40af' : '#4FC1FF',
                  opacity: 0.6 + Math.random() * 0.4
                }}
              />
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes swing {
            0%,
            100% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(3deg);
            }
            75% {
              transform: rotate(-3deg);
            }
          }

          .swing {
            animation: swing 3s ease-in-out infinite;
          }

          .id-card:active {
            cursor: grabbing !important;
          }
        `}</style>
      </div>
    </div>
  )
}
