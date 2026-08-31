'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';

export interface BlobCursorProps {
  blobType?: 'circle' | 'square';
  fillColor?: string;
  trailCount?: number;
  sizes?: number[];
  innerSizes?: number[];
  innerColor?: string;
  opacities?: number[];
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  filterId?: string;
  filterStdDeviation?: number;
  filterColorMatrixValues?: string;
  useFilter?: boolean;
  zIndex?: number;
}

interface BlobPosition {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  visible: boolean;
}

export default function BlobCursor({
  blobType = 'circle',
  fillColor = '#5227FF',
  trailCount = 3,
  sizes = [60, 125, 75],
  innerSizes = [20, 35, 25],
  innerColor = 'rgba(255,255,255,0.8)',
  opacities = [0.6, 0.6, 0.6],
  shadowColor = 'rgba(0,0,0,0.75)',
  shadowBlur = 5,
  shadowOffsetX = 10,
  shadowOffsetY = 10,
  filterId = 'blob',
  filterStdDeviation = 30,
  filterColorMatrixValues = '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10',
  useFilter = true,
  zIndex = 100
}: BlobCursorProps) {
  const [blobPositions, setBlobPositions] = useState<BlobPosition[]>(
    Array.from({ length: trailCount }).map((_, i) => ({
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      visible: i === 0 // Only first blob visible initially
    }))
  );

  const animationRef = useRef<number>();
  const lastMoveTime = useRef<number>(Date.now());
  const isMoving = useRef<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastMoveTime.current = Date.now();
      isMoving.current = true;

      setBlobPositions((prev) =>
        prev.map((pos, i) => ({
          ...pos,
          targetX: i === 0 ? e.clientX : prev[i - 1].x,
          targetY: i === 0 ? e.clientY : prev[i - 1].y,
          visible: true // Show all blobs when moving
        }))
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const animate = () => {
      const timeSinceMove = Date.now() - lastMoveTime.current;
      const shouldHideTrail = timeSinceMove > 300; // Hide trailing blobs after 300ms of no movement

      setBlobPositions((prev) =>
        prev.map((pos, i) => {
          // Gradually slower easing for each trailing blob
          const ease = i === 0 ? 0.15 : 0.08 / (i * 0.5);

          return {
            ...pos,
            x: pos.x + (pos.targetX - pos.x) * ease,
            y: pos.y + (pos.targetY - pos.y) * ease,
            visible: i === 0 ? true : !shouldHideTrail // Always show main blob, hide trail when stopped
          };
        })
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      className="blob-container fixed inset-0"
      style={{ zIndex }}
    >
      {useFilter && (
        <svg className="absolute w-0 h-0">
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={filterStdDeviation} />
            <feColorMatrix in="blur" values={filterColorMatrixValues} />
          </filter>
        </svg>
      )}

      <div
        className="blob-main"
        style={{ filter: useFilter ? `url(#${filterId})` : undefined }}
      >
        {blobPositions.map((pos, i) =>
          pos.visible ? (
            <div
              key={i}
              className="blob"
              style={{
                width: sizes[i],
                height: sizes[i],
                borderRadius: blobType === 'circle' ? '50%' : '0',
                background: i === 0
                  ? `radial-gradient(circle, ${innerColor} 0%, ${fillColor} 60%, ${fillColor} 100%)`
                  : fillColor,
                opacity: opacities[i],
                boxShadow: i === 0
                  ? `0 0 ${shadowBlur * 2}px ${shadowBlur}px ${shadowColor}, 0 0 ${shadowBlur * 3}px ${shadowBlur * 1.5}px rgba(255, 180, 50, 0.2)`
                  : `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 0 ${shadowColor}`,
                transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`,
                transition: 'opacity 0.3s ease-out'
              }}
            >
              {i === 0 && (
                <div
                  className="inner-dot"
                  style={{
                    width: innerSizes[i],
                    height: innerSizes[i],
                    top: (sizes[i] - innerSizes[i]) / 2,
                    left: (sizes[i] - innerSizes[i]) / 2,
                    background: `radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, ${innerColor} 70%, transparent 100%)`,
                    borderRadius: blobType === 'circle' ? '50%' : '0',
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
                  }}
                />
              )}
              {i > 0 && (
                <div
                  className="inner-dot"
                  style={{
                    width: innerSizes[i],
                    height: innerSizes[i],
                    top: (sizes[i] - innerSizes[i]) / 2,
                    left: (sizes[i] - innerSizes[i]) / 2,
                    backgroundColor: innerColor,
                    borderRadius: blobType === 'circle' ? '50%' : '0'
                  }}
                />
              )}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
