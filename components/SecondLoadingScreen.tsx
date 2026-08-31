"use client"

import { useEffect, useRef, useState } from "react"
import { Brain } from "lucide-react"

interface Star {
  x: number
  y: number
  z: number
  size: number
  brightness: number
  speed: number
}

interface GalaxyArm {
  angle: number
  radius: number
  stars: Star[]
}

// This is your second loading screen component with galaxy animation
function GalaxyLoadingScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const galaxyRotation = useRef(0)
  const [backgroundStars, setBackgroundStars] = useState<Star[]>([])
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Initialize background stars
  useEffect(() => {
    const stars: Star[] = []
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 1000,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random(),
        speed: Math.random() * 0.5 + 0.1,
      })
    }
    setBackgroundStars(stars)
  }, [])

  useEffect(() => {
    const startTime = Date.now()
    const duration = 10000 // 10 seconds

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min((elapsed / duration) * 100, 100)
      setLoadingProgress(progress)

      if (progress < 100) {
        requestAnimationFrame(updateProgress)
      }
    }

    updateProgress()
  }, [])

  // Galaxy animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create galaxy arms
    const galaxyArms: GalaxyArm[] = []
    const numArms = 4
    const starsPerArm = 80

    for (let arm = 0; arm < numArms; arm++) {
      const armAngle = (arm * Math.PI * 2) / numArms
      const armStars: Star[] = []

      for (let i = 0; i < starsPerArm; i++) {
        const t = i / starsPerArm
        const radius = 50 + t * 300
        const angle = armAngle + t * Math.PI * 1.5
        const spiralX = Math.cos(angle) * radius
        const spiralY = Math.sin(angle) * radius

        armStars.push({
          x: spiralX,
          y: spiralY,
          z: Math.random() * 100,
          size: Math.random() * 3 + 1,
          brightness: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.02 + 0.01,
        })
      }

      galaxyArms.push({ angle: armAngle, radius: 300, stars: armStars })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background stars
      backgroundStars.forEach((star) => {
        const parallaxFactor = star.z / 1000
        const x = star.x + Math.sin(galaxyRotation.current * 0.1) * parallaxFactor * 20
        const y = star.y + Math.cos(galaxyRotation.current * 0.1) * parallaxFactor * 10

        ctx.beginPath()
        ctx.arc(x, y, star.size * (1 - parallaxFactor * 0.5), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * (1 - parallaxFactor * 0.3)})`
        ctx.fill()
      })

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw galaxy core
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100)
      coreGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
      coreGradient.addColorStop(0.3, "rgba(79, 193, 255, 0.6)")
      coreGradient.addColorStop(0.6, "rgba(138, 43, 226, 0.4)")
      coreGradient.addColorStop(1, "transparent")

      ctx.beginPath()
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2)
      ctx.fillStyle = coreGradient
      ctx.fill()

      // Draw galaxy arms
      galaxyArms.forEach((arm) => {
        arm.stars.forEach((star) => {
          const rotatedX = star.x * Math.cos(galaxyRotation.current) - star.y * Math.sin(galaxyRotation.current)
          const rotatedY = star.x * Math.sin(galaxyRotation.current) + star.y * Math.cos(galaxyRotation.current)

          const screenX = centerX + rotatedX
          const screenY = centerY + rotatedY

          if (screenX >= -50 && screenX <= canvas.width + 50 && screenY >= -50 && screenY <= canvas.height + 50) {
            ctx.beginPath()
            ctx.arc(screenX, screenY, star.size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`
            ctx.fill()
          }
        })
      })

      galaxyRotation.current += 0.005
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [backgroundStars])

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center">
        <Brain className="w-12 h-12 text-[#4FC1FF] animate-pulse mb-4" />
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4FC1FF] to-[#C586C0] mb-8">
          GALAXY BRAIN TERMINAL
        </h1>
        <div className="w-80 bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#4FC1FF] to-[#C586C0] transition-all duration-100 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <div className="mt-2 text-[#4FC1FF] text-sm font-mono">{Math.round(loadingProgress)}%</div>
      </div>
    </div>
  )
}

export default function SecondLoadingScreen() {
  return <GalaxyLoadingScreen />
}
