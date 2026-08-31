"use client"

import { useGLTF, OrbitControls } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { useRef, useState, useEffect, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import * as THREE from 'three'

interface ModelProps {
  modelPath: string
  onAvatarClick: () => void
}

function Model({ modelPath, onAvatarClick }: ModelProps) {
  const groupRef = useRef<Group>(null)
  const { scene, animations } = useGLTF(modelPath)
  const [mixer] = useState(() => new THREE.AnimationMixer(scene))

  useEffect(() => {
    if (animations && animations.length) {
      const action = mixer.clipAction(animations[0])
      action.play()
    }
    return () => {
      mixer.stopAllAction()
    }
  }, [animations, mixer, modelPath])

  useFrame((state, delta) => {
    mixer.update(delta)
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation()
        onAvatarClick()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <primitive object={scene} scale={1.5} />
    </group>
  )
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#8B5CF6" wireframe />
    </mesh>
  )
}

interface AvatarProps {
  currentSection?: string
}

const sectionAnimations: { [key: string]: string } = {
  'welcome': '/avatars/static-run-position.glb',
  'prefrontal-cortex': '/avatars/flexing-biceps.glb',
  'temporal-lobe': '/avatars/looking-around-time.glb',
  'limbic-system': '/avatars/backflip.glb',
  'motor-cortex': '/avatars/get-set-ready-go.glb',
  'synapse': '/avatars/catwalk.glb',
  'frontal-lobe': '/avatars/sitting-cross-legged.glb'
}

const clickAnimations = [
  '/avatars/dancing.glb',
  '/avatars/oh-no.glb',
  '/avatars/sneaking-around.glb',
  '/avatars/here-i-come.glb'
]

export default function Avatar({ currentSection = 'welcome' }: AvatarProps) {
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [currentAnimation, setCurrentAnimation] = useState(sectionAnimations['welcome'])
  const [isInteracting, setIsInteracting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    setPosition({ x: window.innerWidth - 350, y: 100 })
  }, [])

  useEffect(() => {
    if (!isInteracting) {
      const animation = sectionAnimations[currentSection] || sectionAnimations['welcome']
      setCurrentAnimation(animation)
    }
  }, [currentSection, isInteracting])

  const handleAvatarClick = () => {
    // TODO: Add Hugging Face integration here for AI responses
    // For now, play a random fun animation
    const randomAnimation = clickAnimations[Math.floor(Math.random() * clickAnimations.length)]
    setCurrentAnimation(randomAnimation)
    setIsInteracting(true)

    // Return to section-specific animation after 5 seconds
    setTimeout(() => {
      setIsInteracting(false)
      const animation = sectionAnimations[currentSection] || sectionAnimations['welcome']
      setCurrentAnimation(animation)
    }, 5000)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setIsDragging(true)
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  if (!mounted) {
    return null
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '300px',
        height: '75vh',
        zIndex: 48,
        cursor: isDragging ? 'grabbing' : 'grab',
        pointerEvents: 'auto'
      }}
      onMouseDown={handleMouseDown}
    >
      <Canvas
        camera={{ position: [0, 1, 4], fov: 50 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <pointLight position={[0, 2, 2]} intensity={0.5} color="#8B5CF6" />
        <Suspense fallback={<Loader />}>
          <Model modelPath={currentAnimation} onAvatarClick={handleAvatarClick} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          target={[0, 1, 0]}
        />
      </Canvas>
    </div>
  )
}

// Preload all animations
Object.values(sectionAnimations).forEach(path => useGLTF.preload(path))
clickAnimations.forEach(path => useGLTF.preload(path))
