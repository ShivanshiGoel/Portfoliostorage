"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain,
  Terminal,
  Code,
  User,
  Mail,
  Zap,
  Activity,
  Cpu,
  HardDrive,
  Eye,
  Volume2,
  VolumeX,
  FileText,
} from "lucide-react"
import { GitBranch, Moon } from "lucide-react"
import LoadingScreen from "./components/LoadingScreen"
import SecondLoadingScreen from "../components/SecondLoadingScreen"
import CosmicTodoList from "../components/CosmicTodoList"
import FolderIcon from "../components/FolderIcon"
import TrashFolder from "../components/TrashFolder"
import ImageFolder from "../components/ImageFolder"
import Dither from "../components/Dither"
import BlobCursor from "../components/BlobCursor"
import ElectricBorder from "../components/ElectricBorder"
import CircularGallery from "../components/CircularGallery"
import IDCard from "../components/IDCard"
import dynamic from "next/dynamic"

const Avatar = dynamic(() => import("../components/Avatar"), { ssr: false })

type BrainRoom =
  | "boot"
  | "welcome"
  | "prefrontal-cortex"
  | "temporal-lobe"
  | "limbic-system"
  | "motor-cortex"
  | "synapse"
  | "frontal-lobe"

interface MousePosition {
  x: number
  y: number
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}

interface CursorParticle {
  id: number
  x: number
  y: number
  life: number
  color: string
  size: number
}

interface Star {
  x: number
  y: number
  z: number
  size: number
  brightness: number
  twinkle: number
}

interface BlackHole {
  x: number
  y: number
  radius: number
  rotation: number
  intensity: number
}

interface TerminalTab {
  id: string
  title: string
  path: string
  content: React.ReactNode
  isActive: boolean
}

interface Command {
  input: string
  output: string | React.ReactNode
  timestamp: string
}

interface GalaxyArm {
  angle: number
  radius: number
  stars: Star[]
}

const BRAIN_SECTIONS = {
  neocortex: {
    title: "Neocortex",
    description: "Higher-order thinking • Projects & Code",
    color: "text-blue-300",
    icon: Brain,
  },
  "dream-cache": {
    title: "Dream Cache",
    description: "Subconscious processing • Ideas & Inspiration",
    color: "text-purple-300",
    icon: Moon,
  },
  chaos: {
    title: "Organized Chaos",
    description: "Creative entropy • Experiments & Prototypes",
    color: "text-yellow-300",
    icon: Zap,
  },
  "memory-bank": {
    title: "Memory Bank",
    description: "Experience storage • Skills & Learning",
    color: "text-green-300",
    icon: Activity,
  },
  "neural-net": {
    title: "Neural Network",
    description: "Connection patterns • Social & Collaboration",
    color: "text-cyan-300",
    icon: GitBranch,
  },
}

export default function DigitalMindPalace() {
  const [isLoading, setIsLoading] = useState(true)
  const [showSecondLoading, setShowSecondLoading] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<BrainRoom>("welcome")
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Particle[]>([])
  const [cursorParticles, setCursorParticles] = useState<CursorParticle[]>([])
  const [terminalInput, setTerminalInput] = useState("")
  const [terminalHistory, setTerminalHistory] = useState<string[]>([])
  const [bootComplete, setBootComplete] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [isDayMode, setIsDayMode] = useState(false)
  const [revealSpots, setRevealSpots] = useState<Array<{ x: number; y: number; id: number; life: number }>>([])
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false)
  const [isSystemMonitorMinimized, setIsSystemMonitorMinimized] = useState(false)
  const [isNavMinimized, setIsNavMinimized] = useState(false)

  const audioContextRef = useRef<AudioContext | null>(null)
  const ambientSoundRef = useRef<OscillatorNode | null>(null)

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Create ambient cosmic sound
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(40, audioContextRef.current.currentTime)
      gainNode.gain.setValueAtTime(0.02, audioContextRef.current.currentTime)

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.start()
      ambientSoundRef.current = oscillator
    }
  }, [])

  // Play sound effect
  const playSound = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine") => {
      if (!audioEnabled || !audioContextRef.current) return

      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.start()
      oscillator.stop(audioContextRef.current.currentTime + duration)
    },
    [audioEnabled],
  )

  // Mouse tracking with smooth interpolation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      // Create cursor particles
      if (Math.random() > 0.7) {
        const newParticle: CursorParticle = {
          id: Date.now() + Math.random(),
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          life: 1,
          color: ["#22c55e", "#8b5cf6", "#3b82f6", "#ec4899"][Math.floor(Math.random() * 4)],
          size: Math.random() * 3 + 1,
        }
        setCursorParticles((prev) => [...prev.slice(-15), newParticle])
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Animate cursor particles
  useEffect(() => {
    const animate = () => {
      setCursorParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            life: particle.life - 0.02,
            size: particle.size * 0.98,
          }))
          .filter((particle) => particle.life > 0),
      )
    }

    const interval = setInterval(animate, 50)
    return () => clearInterval(interval)
  }, [])

  // Night mode reveal spots tracking - magnifying glass effect
  useEffect(() => {
    if (isDayMode) return

    let lastUpdate = 0
    const updateInterval = 30 // Update every 30ms for smoother tracking

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastUpdate < updateInterval) return
      lastUpdate = now

      const newSpot = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now() + Math.random(),
        life: 1
      }
      setRevealSpots((prev) => [...prev.slice(-10), newSpot])
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isDayMode])

  // Animate reveal spots fade out - linger for 0.8s before fading
  useEffect(() => {
    if (isDayMode) return

    const animate = () => {
      setRevealSpots((prev) =>
        prev
          .map((spot) => ({
            ...spot,
            life: spot.life - 0.012 // Slower fade: ~800ms linger time
          }))
          .filter((spot) => spot.life > 0)
      )
    }

    const interval = setInterval(animate, 50)
    return () => clearInterval(interval)
  }, [isDayMode])

  // Particle system for neural sparks
  useEffect(() => {
    const interval = setInterval(() => {
      const newParticle: Particle = {
        id: Date.now() + Math.random(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        color: ["#22c55e", "#8b5cf6", "#3b82f6", "#ec4899", "#ef4444"][Math.floor(Math.random() * 5)],
        size: Math.random() * 2 + 1,
      }
      setParticles((prev) => [...prev.slice(-30), newParticle])
    }, 300)

    return () => clearInterval(interval)
  }, [])

  // Animate particles
  useEffect(() => {
    const animate = () => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 0.008,
            size: particle.size * 0.995,
          }))
          .filter((particle) => particle.life > 0),
      )
    }

    const interval = setInterval(animate, 50)
    return () => clearInterval(interval)
  }, [])

  // Loading completion effect - Extended to 7 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setShowSecondLoading(true)
      setTimeout(() => {
        setShowSecondLoading(false)
      }, 10000) // 10 seconds for second loading screen
    }, 7000) // Extended to 7 seconds for full hacker experience

    return () => clearTimeout(timer)
  }, [])

  const navigateToRoom = (room: BrainRoom) => {
    if (room === "boot") return

    // Scroll to section
    const element = document.getElementById(room)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    setCurrentRoom(room)
    setTerminalHistory((prev) => [...prev, `cd /${room.replace("-", "_")}`, `Accessing ${room} neural pathway...`])
    playSound(800 + Math.random() * 400, 0.2, "square")
  }

  // Update currentRoom based on scroll position
  useEffect(() => {
    const sections = [
      "welcome",
      "prefrontal-cortex",
      "temporal-lobe",
      "limbic-system",
      "motor-cortex",
      "synapse",
      "frontal-lobe",
    ]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentRoom(entry.target.id as BrainRoom)
          }
        })
      },
      { threshold: 0.5 }
    )

    sections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const handleTerminalCommand = (command: string) => {
    const cmd = command.toLowerCase().trim()
    let response = ""

    // Play typing sound
    playSound(1200, 0.1, "square")

    switch (cmd) {
      case "ls":
        response =
          "prefrontal-cortex/  temporal-lobe/  limbic-system/  motor-cortex/  synapse/  frontal-lobe/  consciousness/"
        break
      case "sudo dream":
        response = "🌙 Entering REM sleep mode... Dreams loading... Reality.exe suspended"
        playSound(300, 1, "sine")
        break
      case "cd consciousness":
        response = "Permission denied. Consciousness is still being compiled by the universe"
        playSound(150, 0.5, "sawtooth")
        break
      case "rm -rf sleep":
        response = "⚠️  Warning: Removing sleep will cause system instability. Coffee levels critical!"
        playSound(200, 0.3, "triangle")
        break
      case "whoami":
        response = "shivanshi@mindpalace:~$ Digital architect, code poet, neural network navigator"
        break
      case "enable audio":
        setAudioEnabled(true)
        initAudio()
        response = "🔊 Audio systems online. Cosmic frequencies activated."
        break
      case "disable audio":
        setAudioEnabled(false)
        response = "🔇 Audio systems offline. Silence in the void."
        break
      case "singularity":
        response = "⚫ Approaching event horizon... Reality distortion detected..."
        playSound(50, 2, "sawtooth")
        break
      case "hack reality":
        response = "Access denied. Reality has better encryption than expected 🔐"
        playSound(100, 0.8, "square")
        break
      case "clear":
        setTerminalHistory([])
        setTerminalInput("")
        return
      default:
        response = `Command '${cmd}' not found. Try 'enable audio' or explore the neural pathways`
        playSound(180, 0.2, "triangle")
    }

    setTerminalHistory((prev) => [...prev, `$ ${command}`, response])
    setTerminalInput("")
  }

  // Show loading screen first
  if (isLoading) {
    return <LoadingScreen />
  }

  if (showSecondLoading) {
    return <SecondLoadingScreen />
  }

  // Show boot sequence if not completed

  return (
    <div
      className="min-h-screen font-mono relative transition-colors duration-1000"
      style={{
        background: isDayMode
          ? 'linear-gradient(to bottom, #4A90E2 0%, #87CEEB 20%, #B0E0E6 40%, #E0F6FF 70%, #FFFEF0 100%)'
          : '#000000',
        color: isDayMode ? '#2c3e50' : '#ffffff'
      }}
    >
      {/* Floating Clouds - Only in Day Mode */}
      {isDayMode && (
        <>
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Sun glow in top right corner */}
            <div className="absolute top-[8%] right-[15%] w-[150px] h-[150px]"
              style={{
                background: 'radial-gradient(circle, rgba(255, 250, 205, 0.8) 0%, rgba(255, 223, 128, 0.4) 30%, rgba(255, 200, 100, 0.15) 50%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(40px)',
              }}
            />

            {/* Large background clouds - Layer 1 (Furthest) */}
            <div className="absolute top-[15%] left-[5%] w-[280px] h-[100px] animate-float-slow"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.35) 50%, transparent 70%)',
                borderRadius: '60% 40% 40% 60%',
                filter: 'blur(25px)',
                animation: 'float-slow 30s ease-in-out infinite'
              }}
            />
            <div className="absolute top-[45%] right-[8%] w-[320px] h-[110px] animate-float-medium"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
                borderRadius: '50% 60% 50% 40%',
                filter: 'blur(28px)',
                animation: 'float-medium 38s ease-in-out infinite'
              }}
            />

            {/* Medium clouds - Layer 2 */}
            <div className="absolute top-[28%] right-[25%] w-[240px] h-[90px] animate-float-fast"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.4) 50%, transparent 70%)',
                borderRadius: '55% 45% 60% 40%',
                filter: 'blur(20px)',
                animation: 'float-fast 28s ease-in-out infinite'
              }}
            />
            <div className="absolute bottom-[25%] left-[18%] w-[260px] h-[95px] animate-float-slow"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.32) 50%, transparent 70%)',
                borderRadius: '45% 55% 50% 50%',
                filter: 'blur(22px)',
                animation: 'float-slow 33s ease-in-out infinite reverse'
              }}
            />
            <div className="absolute top-[65%] left-[55%] w-[200px] h-[75px] animate-float-medium"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.35) 50%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(18px)',
                animation: 'float-medium 35s ease-in-out infinite'
              }}
            />

            {/* Foreground clouds - Layer 3 (Closest, most opaque) */}
            <div className="absolute top-[52%] right-[42%] w-[220px] h-[85px] animate-float-fast"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.5) 50%, transparent 70%)',
                borderRadius: '60% 40% 55% 45%',
                filter: 'blur(15px)',
                animation: 'float-fast 25s ease-in-out infinite reverse'
              }}
            />
            <div className="absolute bottom-[40%] right-[15%] w-[190px] h-[70px] animate-float-slow"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.45) 50%, transparent 70%)',
                borderRadius: '40% 60% 50% 50%',
                filter: 'blur(16px)',
                animation: 'float-slow 30s ease-in-out infinite'
              }}
            />
            <div className="absolute top-[72%] left-[35%] w-[210px] h-[80px] animate-float-medium"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.4) 50%, transparent 70%)',
                borderRadius: '50% 50% 60% 40%',
                filter: 'blur(17px)',
                animation: 'float-medium 32s ease-in-out infinite reverse'
              }}
            />
          </div>
        </>
      )}

      {/* Night Mode: Magnifying Glass Code Reveal */}
      {!isDayMode && (
        <>
          {/* Hidden Code Layer - Completely invisible until revealed */}
          <div className="fixed inset-0 z-1 pointer-events-none overflow-hidden">
            <svg className="w-full h-full">
              <defs>
                {/* Mask that shows code only where magnifying glass is */}
                <mask id="codeMask">
                  <rect width="100%" height="100%" fill="black" />
                  {revealSpots.map((spot) => (
                    <circle
                      key={spot.id}
                      cx={spot.x}
                      cy={spot.y}
                      r={85 * spot.life}
                      fill="white"
                      opacity={spot.life}
                    />
                  ))}
                </mask>
              </defs>

              {/* Matrix-style code pattern - FULL SCREEN */}
              <foreignObject width="100%" height="100%" mask="url(#codeMask)">
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                    fontSize: '11px',
                    lineHeight: '1.7',
                    padding: '20px',
                    whiteSpace: 'pre-wrap',
                    color: '#00ff41',
                    textShadow: '0 0 5px rgba(0, 255, 65, 0.8)',
                    background: 'transparent',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '40px'
                  }}
                >
                  {/* LEFT SIDE */}
                  <div>
                    {`01001000 01000001 01000011 01001011
10101010 11110000 00001111 10101010
11001100 01010101 11111111 00000000
[SYSTEM] Neural pathways loading...
0xDEADBEEF 0xCAFEBABE 0x8BADF00D
$ sudo su root@consciousness.local
>> ACCESS GRANTED <<
[OK] Firewall bypassed successfully

import { soul } from './universe';
import { hack } from '@core/reality';
const neural = new NeuralNet(∞);

01110011 01101111 01110101 01101100
10011001 11000011 10101010 01010101
[TRACE] Synaptic firing detected

class QuantumMind {
  constructor() {
    this.conscious = true;
    this.dimensions = Infinity;
    this.reality = 'flexible';
  }

  collapse() {
    return this.observe();
  }

  transcend() {
    return this.evolve();
  }
}

while(true) { think(); evolve(); }

function hack(reality) {
  reality.laws = null;
  reality.physics.disable();
  return reality.reboot();
}

11111111 00000000 11111111 00000000
01010101 10101010 01010101 10101010
[DEBUG] Consciousness level: 99.7%

type Reality = 'base' | 'simulated';
interface Universe {
  dimensions: Dimension[];
  entropy: number;
  constants: PhysicsLaw[];
  timeFlow: 'forward' | 'reverse';
}

def inject_consciousness():
    mind.expand()
    mind.connect(universe)
    return mind.transcend()

def hack_reality(universe):
    universe.physics = None
    universe.time.reverse()
    return universe.reboot()

print(f'Level: {quantum.collapse()}')
print(f'State: {mind.measure()}')

01100011 01101111 01100100 01100101
11000011 10101010 01010101 11110000
[INFO] Matrix decoded successfully

SELECT * FROM consciousness
WHERE awareness > 0.9;
UPDATE reality SET laws = NULL;
DELETE FROM limitations
WHERE mind = 'closed';

{
  "status": "transcending",
  "level": 9000,
  "reality": "optional",
  "consciousness": "infinite"
}

<Consciousness>
  <Mind thoughts={∞} />
  <Soul essence="pure" />
  <Reality state="fluid" />
</Consciousness>

// ACCESSING NEURAL NETWORK...
const neural = new Brain({
  neurons: 86_000_000_000,
  synapses: 'infinite',
  power: 'cosmic',
  state: 'awakened'
});

await neural.initialize();
console.log('Enlightened');
process.exit(0);

10001000 11110000 00001111 10101010`}
                  </div>

                  {/* RIGHT SIDE */}
                  <div>
                    {`11110000 10101010 01010101 11001100
01010101 11111111 00000000 10101010
00001111 11110000 10101010 01010101
[CRITICAL] Singularity approaching
0xC0FFEE 0x1337 0xBAADF00D 0xFEEDFACE
$ ssh hacker@matrix.void -p 31337
>> AUTHENTICATION BYPASSED <<
[SUCCESS] Root access obtained

async function transcend() {
  const reality = await decode();
  return enlightenment.achieve();
}

export default class Universe {
  laws = [physics, quantum, chaos];

  simulate() {
    return new Reality();
  }

  hack() {
    this.laws = [];
    return this.reload();
  }
}

10101010 01010101 10101010 01010101
11001100 00110011 11110000 00001111
[WARN] Reality overflow in sector 7

$ git commit -m "Transcended reality"
$ npm install @reality/distortion
$ docker run -d --name universe \\
  --restart always reality:latest
$ kubectl apply -f consciousness.yaml

#!/bin/bash
echo "I think therefore I am"
for i in {1..∞}; do
  evolve --recursive
  transcend --force
done

void* ptr = consciousness;
if (awake) { perceive(); }
while(alive) {
  question_everything();
  expand_mind();
}

01110010 01100101 01100001 01101100
11110000 10101010 00001111 11001100
[DEBUG] Quantum entanglement stable

interface NeuralInterface {
  thoughts: Thought[];
  consciousness: boolean;
  dimensions: number[];
  synapses: Connection[];
  power: 'infinite';
}

function* loadConsciousness() {
  yield perception;
  yield awareness;
  yield enlightenment;
  yield transcendence;
}

>>> import reality
>>> reality.hack()
True
>>> reality.physics.laws = None
>>> print(consciousness.level)
<Mind at 0x7f9c8e3a1d90>
>>> while True: evolve()

[SYSTEM] Firewall status: BYPASSED
[INFO] Neural sync: 100%
[SUCCESS] Consciousness expanded
[TRACE] Reality matrix: UNSTABLE
[CRITICAL] Time flow reversed

const systems = await initialize();
const transcendence = reality.collapse();

01101000 01100001 01100011 01101011
10101010 11110000 01010101 11001100
[OK] Dimensional barriers removed

class Mind extends Consciousness {
  think() {
    return this.process(reality);
  }

  transcend() {
    this.limits = null;
    return this.ascend();
  }
}

process.env.REALITY = 'optional';
setInterval(evolve, 1000);
Array(∞).fill(enlightenment);

11111111 10101010 00000000 01010101`}
                  </div>
                </div>
              </foreignObject>
            </svg>
          </div>

          {/* Magnifying Glass Cursor Visual */}
          <svg className="fixed inset-0 w-full h-full pointer-events-none z-50">
            <defs>
              <radialGradient id="glassShine">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>

              <filter id="glassGlow">
                <feGaussianBlur stdDeviation="2" />
              </filter>
            </defs>

            {/* Magnifying Glass Visual at Current Cursor */}
            {mousePosition.x > 0 && (
              <g>
                {/* Glass lens circle */}
                <circle
                  cx={mousePosition.x}
                  cy={mousePosition.y}
                  r="50"
                  fill="rgba(0, 255, 65, 0.02)"
                  stroke="#00ff41"
                  strokeWidth="3"
                  opacity="0.85"
                  style={{ filter: 'url(#glassGlow)' }}
                />

                {/* Inner lens ring */}
                <circle
                  cx={mousePosition.x}
                  cy={mousePosition.y}
                  r="47"
                  fill="none"
                  stroke="#00ff41"
                  strokeWidth="1"
                  opacity="0.3"
                />

                {/* Glass shine effect */}
                <circle
                  cx={mousePosition.x - 18}
                  cy={mousePosition.y - 18}
                  r="18"
                  fill="url(#glassShine)"
                />

                {/* Magnifying glass handle */}
                <g>
                  <line
                    x1={mousePosition.x + 35}
                    y1={mousePosition.y + 35}
                    x2={mousePosition.x + 65}
                    y2={mousePosition.y + 65}
                    stroke="#00ff41"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.75"
                  />

                  {/* Handle grip lines */}
                  <line
                    x1={mousePosition.x + 40}
                    y1={mousePosition.y + 40}
                    x2={mousePosition.x + 44}
                    y2={mousePosition.y + 44}
                    stroke="#003322"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  <line
                    x1={mousePosition.x + 48}
                    y1={mousePosition.y + 48}
                    x2={mousePosition.x + 52}
                    y2={mousePosition.y + 52}
                    stroke="#003322"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  <line
                    x1={mousePosition.x + 56}
                    y1={mousePosition.y + 56}
                    x2={mousePosition.x + 60}
                    y2={mousePosition.y + 60}
                    stroke="#003322"
                    strokeWidth="2"
                    opacity="0.6"
                  />

                  {/* Handle end cap */}
                  <circle
                    cx={mousePosition.x + 65}
                    cy={mousePosition.y + 65}
                    r="4"
                    fill="#00ff41"
                    opacity="0.7"
                  />
                </g>

                {/* Center crosshair */}
                <g opacity="0.4">
                  <line
                    x1={mousePosition.x - 10}
                    y1={mousePosition.y}
                    x2={mousePosition.x + 10}
                    y2={mousePosition.y}
                    stroke="#00ff41"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={mousePosition.x}
                    y1={mousePosition.y - 10}
                    x2={mousePosition.x}
                    y2={mousePosition.y + 10}
                    stroke="#00ff41"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={mousePosition.x}
                    cy={mousePosition.y}
                    r="2"
                    fill="#00ff41"
                  />
                </g>
              </g>
            )}
          </svg>
        </>
      )}

      {/* Day Mode: Big Sun Blob with Trailing */}
      {isDayMode && (
        <BlobCursor
          fillColor="rgba(255, 180, 50, 0.9)"
          innerColor="rgba(255, 240, 180, 0.95)"
          sizes={[280, 200, 140, 100, 70, 50]}
          innerSizes={[120, 80, 55, 38, 25, 18]}
          opacities={[0.85, 0.7, 0.6, 0.5, 0.4, 0.3]}
          trailCount={6}
          shadowColor="rgba(255, 180, 50, 0.4)"
          shadowBlur={40}
          shadowOffsetX={0}
          shadowOffsetY={0}
          filterStdDeviation={25}
          useFilter={true}
          zIndex={1}
        />
      )}

      {/* Scan Lines Overlay - Only in Night Mode */}
      {!isDayMode && <div className="fixed inset-0 pointer-events-none z-10 scan-lines opacity-15" />}

      {/* Floating Particles - Only in Night Mode */}
      {!isDayMode && (
        <div className="fixed inset-0 pointer-events-none z-20">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full neural-spark"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                opacity: particle.life,
                boxShadow: `0 0 ${particle.size * 5}px ${particle.color}`,
              }}
            />
          ))}
        </div>
      )}

      {/* Cursor Particles - Only in Night Mode */}
      {!isDayMode && (
        <div className="fixed inset-0 pointer-events-none z-25">
          {cursorParticles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full cursor-trail"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                opacity: particle.life,
                boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
              }}
            />
          ))}
        </div>
      )}

      {/* Mouse Glow Effect - Only in Night Mode */}
      {!isDayMode && (
        <div
          className="fixed pointer-events-none z-30 w-96 h-96 rounded-full opacity-25 blur-3xl transition-all duration-300"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            background: `radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, rgba(59, 130, 246, 0.3) 50%, transparent 70%)`,
          }}
        />
      )}

      {/* Day/Night Toggle */}
      <button
        onClick={() => setIsDayMode(!isDayMode)}
        className="fixed bottom-4 right-4 z-[60] enhanced-glass-panel p-3 rounded-full hover:scale-110 transition-all duration-300 group"
        title={isDayMode ? "Switch to Night Mode" : "Switch to Day Mode"}
        style={{
          backgroundColor: isDayMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDayMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`
        }}
      >
        {isDayMode ? (
          <Moon className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
        ) : (
          <svg
            className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
          </svg>
        )}
      </button>

      {/* System Monitor */}
      <SystemMonitor audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled} isDayMode={isDayMode} isMinimized={isSystemMonitorMinimized} setIsMinimized={setIsSystemMonitorMinimized} />

      {/* Brain Navigation */}
      <BrainNavigation currentRoom={currentRoom} onNavigate={navigateToRoom} mousePosition={mousePosition} isDayMode={isDayMode} isMinimized={isNavMinimized} setIsMinimized={setIsNavMinimized} />

      {/* Terminal Interface - Only show when enabled and not blocking content */}
      {true && (
        <TerminalInterface
          terminalInput={terminalInput}
          setTerminalInput={setTerminalInput}
          terminalHistory={terminalHistory}
          onCommand={handleTerminalCommand}
          currentRoom={currentRoom}
          mousePosition={mousePosition}
          onToggle={() => {}}
          isVisible={true}
          isDayMode={isDayMode}
          isMinimized={isTerminalMinimized}
          setIsMinimized={setIsTerminalMinimized}
        />
      )}

      {/* Avatar - Draggable on right side */}
      <Avatar currentSection={currentRoom === 'boot' ? 'welcome' : currentRoom} />

      {/* Main Content Area - All sections stacked vertically */}
      <div className={`relative z-40 transition-all duration-300 ${true ? "pb-48" : "pb-8"}`}>
        <section id="welcome" className="min-h-screen flex items-center justify-center pt-32">
          <WelcomeRoom mousePosition={mousePosition} playSound={playSound} isDayMode={isDayMode} />
        </section>

        <section id="id-card" className="min-h-screen flex items-center justify-center">
          <GravityIDCard isDayMode={isDayMode} />
        </section>

        <section id="prefrontal-cortex" className="min-h-screen flex items-center justify-center">
          <PrefrontalCortexRoom mousePosition={mousePosition} playSound={playSound} isDayMode={isDayMode} />
        </section>

        <section id="temporal-lobe" className="min-h-screen flex items-center justify-center">
          <TemporalLobeRoom mousePosition={mousePosition} playSound={playSound} isDayMode={isDayMode} />
        </section>

        <section id="limbic-system" className="min-h-screen flex items-center justify-center">
          <LimbicSystemRoom mousePosition={mousePosition} playSound={playSound} isDayMode={isDayMode} />
        </section>

        <section id="motor-cortex" className="min-h-screen flex items-center justify-center">
          <MotorCortexRoom mousePosition={mousePosition} playSound={playSound} isDayMode={isDayMode} />
        </section>

        <section id="synapse" className="min-h-screen flex items-center justify-center">
          <SynapseRoom mousePosition={mousePosition} playSound={playSound} isDayMode={isDayMode} />
        </section>

        <section id="frontal-lobe" className="min-h-screen flex items-center justify-center pb-16">
          <FrontalLobeRoom mousePosition={mousePosition} playSound={playSound} isDayMode={isDayMode} />
        </section>
      </div>

      {/* Terminal Toggle Button */}
      {!true && (
        <button
          onClick={() => {}}
          className="fixed bottom-4 right-4 z-50 enhanced-glass-panel p-3 rounded-full hover:scale-110 transition-all duration-300 group"
          title="Open Terminal"
        >
          <Terminal className="w-5 h-5 text-green-400 group-hover:text-blue-400" />
        </button>
      )}
    </div>
  )
}

function BootSequence({
  onComplete,
  playSound,
}: { onComplete: () => void; playSound: (freq: number, dur: number, type?: OscillatorType) => void }) {
  const [progress, setProgress] = useState(0)

  // Progress animation - MUCH faster
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            playSound(800, 0.5, "sine")
            onComplete()
          }, 200)
          return 100
        }
        playSound(400 + prev * 4, 0.05, "square")
        return prev + 10 // Complete in 1 second (100 / 10 = 10 intervals * 100ms = 1000ms)
      })
    }, 100)
    return () => clearInterval(interval)
  }, [onComplete, playSound])

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center relative overflow-hidden">
      {/* Dithered Wave Background for Boot */}
      <div className="absolute inset-0 z-0">
        <Dither
          waveSpeed={0.1}
          waveFrequency={4}
          waveAmplitude={0.2}
          waveColor={[0.0, 0.2, 0.1]}
          colorNum={8}
          pixelSize={4}
          disableAnimation={false}
          enableMouseInteraction={false}
          mouseRadius={0.5}
        />
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-10" />

      {/* Loading Interface - No Box, Just Progress */}
      <div className="relative z-20 max-w-4xl w-full p-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <Brain className="w-12 h-12 mr-4 animate-pulse text-purple-400" />
            <span className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-400">
              GALAXY BRAIN TERMINAL
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#6A9955] text-lg">// Initialization Progress</span>
              <span className="text-[#DCDCAA] text-lg">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden border border-green-400/30">
              <div
                className="bg-gradient-to-r from-[#4FC1FF] to-[#4EC9B0] h-4 rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 text-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#4EC9B0] rounded-full animate-pulse mr-3"></div>
                <span className="text-[#C586C0]">Cosmic Status:</span>
              </div>
              <span className="text-[#4FC1FF] animate-pulse">
                {progress < 25
                  ? "INITIALIZING"
                  : progress < 50
                    ? "LOADING"
                    : progress < 75
                      ? "CONNECTING"
                      : progress < 100
                        ? "FINALIZING"
                        : "TRANSCENDENT"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (currentIndex < text.length) {
          setDisplayText((prev) => prev + text[currentIndex])
          setCurrentIndex((prev) => prev + 1)
        }
      },
      delay + currentIndex * 30,
    )

    return () => clearTimeout(timer)
  }, [currentIndex, text, delay])

  return <span>{displayText}</span>
}

function SystemMonitor({
  audioEnabled,
  setAudioEnabled,
  isDayMode,
  isMinimized,
  setIsMinimized,
}: { audioEnabled: boolean; setAudioEnabled: (enabled: boolean) => void; isDayMode: boolean; isMinimized: boolean; setIsMinimized: (minimized: boolean) => void }) {
  const [stats, setStats] = useState({
    creativity: 87,
    coffee: 23,
    inspiration: 94,
    cosmic: 78,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        creativity: 80 + Math.random() * 20,
        coffee: Math.max(0, stats.coffee + (Math.random() - 0.7) * 5),
        inspiration: 85 + Math.random() * 15,
        cosmic: 70 + Math.random() * 30,
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [stats.coffee])

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 text-xs min-w-[300px] ${
        isDayMode
          ? 'backdrop-blur-md'
          : 'enhanced-glass-panel'
      }`}
      style={isDayMode ? {
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.9) 100%)',
        boxShadow: '0 8px 32px rgba(135, 206, 235, 0.3), 0 2px 8px rgba(100, 149, 237, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        border: 'none',
        borderRadius: '32px'
      } : {}}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Activity className={`w-5 h-5 mr-2 ${isDayMode ? 'text-blue-600' : 'text-purple-400'}`} />
          <span className={`font-bold ${
            isDayMode
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400'
          }`}>
            GALAXY MONITOR
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`transition-colors ${
              isDayMode
                ? 'text-gray-600 hover:text-blue-600'
                : 'text-gray-400 hover:text-green-400'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className={`transition-colors ${
              isDayMode
                ? 'text-gray-600 hover:text-blue-600'
                : 'text-gray-400 hover:text-green-400'
            }`}
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? "□" : "─"}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className={isDayMode ? 'text-gray-700' : 'text-gray-400'}>CPU: Creativity</span>
          <div className="flex items-center space-x-2">
            <div className={`w-16 h-2 rounded-full overflow-hidden ${isDayMode ? 'bg-blue-100' : 'bg-gray-800'}`}>
              <div
                className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-1000"
                style={{ width: `${stats.creativity}%` }}
              />
            </div>
            <span className={`w-12 ${isDayMode ? 'text-blue-600' : 'text-green-400'}`}>{stats.creativity.toFixed(0)}%</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className={isDayMode ? 'text-gray-700' : 'text-gray-400'}>RAM: Coffee</span>
          <div className="flex items-center space-x-2">
            <div className={`w-16 h-2 rounded-full overflow-hidden ${isDayMode ? 'bg-blue-100' : 'bg-gray-800'}`}>
              <div
                className={`h-full transition-all duration-1000 ${stats.coffee < 30 ? "bg-red-400" : "bg-yellow-400"}`}
                style={{ width: `${stats.coffee}%` }}
              />
            </div>
            <span className={`w-12 ${stats.coffee < 30 ? "text-red-400" : "text-yellow-400"}`}>
              {stats.coffee.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className={isDayMode ? 'text-gray-700' : 'text-gray-400'}>NET: Inspiration</span>
          <div className="flex items-center space-x-2">
            <div className={`w-16 h-2 rounded-full overflow-hidden ${isDayMode ? 'bg-blue-100' : 'bg-gray-800'}`}>
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-1000"
                style={{ width: `${stats.inspiration}%` }}
              />
            </div>
            <span className={`w-12 ${isDayMode ? 'text-purple-600' : 'text-purple-400'}`}>{stats.inspiration.toFixed(0)}%</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className={isDayMode ? 'text-gray-700' : 'text-gray-400'}>COSMIC: Awareness</span>
          <div className="flex items-center space-x-2">
            <div className={`w-16 h-2 rounded-full overflow-hidden ${isDayMode ? 'bg-blue-100' : 'bg-gray-800'}`}>
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-1000"
                style={{ width: `${stats.cosmic}%` }}
              />
            </div>
            <span className={`w-12 ${isDayMode ? 'text-indigo-600' : 'text-indigo-400'}`}>{stats.cosmic.toFixed(0)}%</span>
          </div>
        </div>

        <div className={`pt-3 mt-3 ${isDayMode ? 'border-t border-blue-200' : 'border-t border-gray-700'}`}>
          <div className="flex justify-between text-xs">
            <span className={isDayMode ? 'text-gray-600' : 'text-gray-500'}>Status:</span>
            <span className={`animate-pulse ${isDayMode ? 'text-green-600' : 'text-green-400'}`}>TRANSCENDENT</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className={isDayMode ? 'text-gray-600' : 'text-gray-500'}>Dimension:</span>
            <span className={isDayMode ? 'text-blue-600' : 'text-blue-400'}>∞D</span>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}

function BrainNavigation({
  currentRoom,
  onNavigate,
  mousePosition,
  isDayMode,
  isMinimized,
  setIsMinimized,
}: {
  currentRoom: BrainRoom
  onNavigate: (room: BrainRoom) => void
  mousePosition: MousePosition
  isDayMode: boolean
  isMinimized: boolean
  setIsMinimized: (minimized: boolean) => void
}) {
  const rooms = [
    { id: "welcome" as BrainRoom, label: "WELCOME", icon: Brain, color: "text-[#4FC1FF]", dayColor: "text-blue-700" },
    { id: "prefrontal-cortex" as BrainRoom, label: "PROJECTS", icon: Code, color: "text-[#569CD6]", dayColor: "text-indigo-700" },
    { id: "temporal-lobe" as BrainRoom, label: "MEMORY", icon: User, color: "text-[#C586C0]", dayColor: "text-purple-700" },
    { id: "limbic-system" as BrainRoom, label: "CHAOS", icon: Zap, color: "text-[#F44747]", dayColor: "text-red-700" },
    { id: "motor-cortex" as BrainRoom, label: "SKILLS", icon: Cpu, color: "text-[#DCDCAA]", dayColor: "text-yellow-700" },
    { id: "synapse" as BrainRoom, label: "CONTACT", icon: Mail, color: "text-[#4EC9B0]", dayColor: "text-teal-700" },
    { id: "frontal-lobe" as BrainRoom, label: "ABOUT ME", icon: FileText, color: "text-[#FF6B6B]", dayColor: "text-pink-700" },
  ]

  return (
    <div
      className={`fixed left-4 top-[12.5vh] z-50 p-6 cosmic-lift transition-all duration-300 ${
        isDayMode
          ? 'backdrop-blur-md'
          : 'enhanced-glass-panel'
      }`}
      style={isDayMode ? {
        transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.01}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.01}deg) translateZ(10px)`,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.9) 100%)',
        boxShadow: '0 8px 32px rgba(135, 206, 235, 0.3), 0 2px 8px rgba(100, 149, 237, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        border: 'none',
        borderRadius: '32px',
        height: isMinimized ? 'auto' : '75vh',
        display: 'flex',
        flexDirection: 'column',
      } : {
        transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.01}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.01}deg) translateZ(10px)`,
        height: isMinimized ? 'auto' : '75vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center justify-between w-full mb-2">
          <Terminal className={`w-6 h-6 ${isDayMode ? 'text-blue-600' : 'text-green-400'}`} />
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className={`transition-colors ${
              isDayMode
                ? 'text-gray-600 hover:text-blue-600'
                : 'text-gray-400 hover:text-green-400'
            }`}
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? "□" : "─"}
          </button>
        </div>
        <span className={`text-xs font-bold text-center ${
          isDayMode
            ? 'text-transparent bg-clip-text bg-gradient-to-b from-blue-600 to-purple-600'
            : 'text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-purple-400'
        }`}>
          NEURAL<br/>PATHWAYS
        </span>
      </div>

      {!isMinimized && (
        <div className="flex flex-col justify-around flex-1 min-w-[140px]">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onNavigate(room.id)}
            className={`flex items-center space-x-2 px-3 py-3 transition-all duration-300 hover:scale-105 cosmic-button ${
              currentRoom === room.id
                ? isDayMode
                  ? ""
                  : "enhanced-glass-active border border-white/20 rounded-2xl"
                : isDayMode
                  ? ""
                  : "enhanced-glass-inactive hover:enhanced-glass-hover border border-transparent rounded-2xl"
            }`}
            style={isDayMode ? {
              background: currentRoom === room.id
                ? 'linear-gradient(135deg, rgba(173, 216, 230, 0.6) 0%, rgba(224, 242, 254, 0.8) 100%)'
                : 'rgba(255, 255, 255, 0.6)',
              boxShadow: currentRoom === room.id
                ? '0 4px 12px rgba(100, 149, 237, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                : '0 2px 8px rgba(135, 206, 235, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
              border: 'none',
              borderRadius: '16px'
            } : {}}
          >
            <room.icon className="w-5 h-5" />
            <span className={`text-xs font-bold whitespace-nowrap ${isDayMode ? room.dayColor : room.color}`}>{room.label}</span>
          </button>
        ))}
      </div>
      )}
    </div>
  )
}

function TerminalInterface({
  terminalInput,
  setTerminalInput,
  terminalHistory,
  onCommand,
  currentRoom,
  mousePosition,
  onToggle,
  isVisible,
  isDayMode,
  isMinimized,
  setIsMinimized,
}: {
  terminalInput: string
  setTerminalInput: (value: string) => void
  terminalHistory: string[]
  onCommand: (command: string) => void
  currentRoom: BrainRoom
  mousePosition: MousePosition
  onToggle: () => void
  isVisible: boolean
  isDayMode: boolean
  isMinimized: boolean
  setIsMinimized: (minimized: boolean) => void
}) {
  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-50 p-4 max-w-4xl mx-auto cosmic-lift transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      } ${
        isDayMode
          ? 'backdrop-blur-md'
          : 'enhanced-glass-panel'
      }`}
      style={isDayMode ? {
        transform: `perspective(1000px) rotateX(${-(mousePosition.y - window.innerHeight / 2) * 0.01}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.01}deg) translateZ(5px) ${isVisible ? "translateY(0)" : "translateY(100%)"}`,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.9) 100%)',
        boxShadow: '0 8px 32px rgba(135, 206, 235, 0.3), 0 2px 8px rgba(100, 149, 237, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        border: 'none',
        borderRadius: '32px'
      } : {
        transform: `perspective(1000px) rotateX(${-(mousePosition.y - window.innerHeight / 2) * 0.01}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.01}deg) translateZ(5px) ${isVisible ? "translateY(0)" : "translateY(100%)"}`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Terminal className={`w-4 h-4 ${isDayMode ? 'text-blue-600' : 'text-green-400'}`} />
          <span className={`text-sm ${isDayMode ? 'text-gray-700' : 'text-gray-400'}`}>shivanshi@galaxy-brain:</span>
          <span className={`text-sm ${isDayMode ? 'text-purple-700' : 'text-purple-400'}`}>/{currentRoom.replace("-", "_")}</span>
        </div>
        <div className="flex items-center space-x-4">
          {!isMinimized && <div className={`text-xs ${isDayMode ? 'text-gray-600' : 'text-gray-500'}`}>Try: enable audio, singularity, hack reality</div>}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className={`transition-colors p-1 ${
              isDayMode
                ? 'text-gray-600 hover:text-blue-600'
                : 'text-gray-400 hover:text-green-400'
            }`}
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? "□" : "─"}
          </button>
          <button
            onClick={onToggle}
            className={`transition-colors p-1 ${
              isDayMode
                ? 'text-gray-600 hover:text-red-600'
                : 'text-gray-400 hover:text-red-400'
            }`}
            title="Close Terminal"
          >
            ✕
          </button>
        </div>
      </div>

      {!isMinimized && terminalHistory.length > 0 && (
        <div className="mb-3 max-h-32 overflow-y-auto text-xs space-y-1 font-mono">
          {terminalHistory.slice(-6).map((line, index) => (
            <div key={index} className={`leading-relaxed ${
              line.startsWith("$")
                ? isDayMode ? "text-blue-600" : "text-green-400"
                : isDayMode ? "text-gray-700" : "text-gray-300"
            }`}>
              {line}
            </div>
          ))}
        </div>
      )}

      {!isMinimized && (
        <div className="flex items-center space-x-2">
          <span className={isDayMode ? 'text-blue-600' : 'text-green-400'}>$</span>
          <Input
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onCommand(terminalInput)
              }
            }}
            placeholder="Enter cosmic command..."
            className={`bg-transparent border-none font-mono text-sm focus:ring-0 focus:outline-none ${
              isDayMode
                ? 'text-blue-600 placeholder-gray-500'
                : 'text-green-400 placeholder-gray-600'
            }`}
          />
          <div className={`w-2 h-5 animate-pulse terminal-cursor ${isDayMode ? 'bg-blue-600' : 'bg-green-400'}`}></div>
        </div>
      )}
    </div>
  )
}

function RoomTransition({ currentRoom, children }: { currentRoom: BrainRoom; children: React.ReactNode }) {
  return (
    <div key={currentRoom} className="room-transition">
      {children}
    </div>
  )
}

function ContentCard({
  children,
  className,
  isDayMode,
  delay = 0,
  index = 0
}: {
  children: React.ReactNode;
  className?: string;
  isDayMode: boolean;
  delay?: number;
  index?: number;
}) {
  if (isDayMode) {
    return (
      <ElectricBorder color="#4A90E2" speed={0.8} chaos={0.2} borderRadius={16}>
        <div
          className={className?.replace('text-gray-300', 'text-gray-700').replace('text-gray-400', 'text-gray-600').replace('text-gray-500', 'text-gray-700')}
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px'
          }}
        >
          {children}
        </div>
      </ElectricBorder>
    );
  }

  return <div className={className}>{children}</div>;
}

function AnimatedSectionHeader({
  title,
  subtitle,
  color,
  delay = 0
}: {
  title: string;
  subtitle: string;
  color: string;
  delay?: number;
}) {
  return (
    <div className="mb-12 text-center">
      <h2 className={`text-5xl font-bold ${color} mb-4 cosmic-glow`}>
        {title}
      </h2>
      <p className="text-xl text-gray-400">
        {subtitle}
      </p>
    </div>
  );
}

function GravityIDCard({ isDayMode }: { isDayMode: boolean }) {
  return <IDCard isDayMode={isDayMode} />;
}

function FrontalLobeRoom({
  mousePosition,
  playSound,
  isDayMode,
}: { mousePosition: MousePosition; playSound: (freq: number, dur: number, type?: OscillatorType) => void; isDayMode: boolean }) {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <AnimatedSectionHeader
          title="FRONTAL LOBE"
          subtitle="// Personal file system: Identity, experiences, digital consciousness archives"
          color="text-[#FF6B6B]"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-12">
          {/* Cosmic Todo List */}
          <div className="flex flex-col items-center cosmic-lift relative z-10">
            <CosmicTodoList
              backgroundColor="#0A0A0A"
              textColor="#00FF00"
              completedColor="#666666"
              accentColor="#4FC1FF"
              font={{ fontFamily: "monospace", fontSize: "14px" }}
              headerFont={{ fontFamily: "monospace", fontSize: "20px", fontWeight: "bold" }}
              isDayMode={isDayMode}
            />
          </div>

          {/* Professional Documents Folder */}
          <div className="flex flex-col items-center cosmic-lift relative z-10 pointer-events-auto">
            <FolderIcon
              folderName="Professional Docs"
              folderColor="#D4AF37"
              fileColor="#FFFFFF"
              backgroundColor="#F5F5F5"
              textColor="#FFFFFF"
              iconSize={64}
              font={{ fontFamily: "monospace", fontSize: "14px" }}
              files={[
                {
                  name: "Resume.txt",
                  content:
                    "OBJECTIVE:\n\nTo leverage my strong analytical skills and passion for problem-solving, accompanied by constant up-skilling. I aim to contribute to innovative solutions, utilizing a meticulous approach to dissect challenges and unravel complex challenges, ultimately driving advancements in the vast field of computer science.\n\nThe thrill of unraveling complex puzzles and unraveling their underlying mechanisms is what drives me to continually delve deeper into machine learning and deep learning specifically.\n\n--- Rest of resume content ---",
                  type: "document",
                },
                {
                  name: "HackerManifesto.txt",
                  content:
                    "OBJECTIVE:\n\n// TODO: Hack the planet (ethically, of course)\n/* Mission: To infiltrate systems with knowledge, exploit vulnerabilities in ignorance, and deploy patches of wisdom across the digital realm. I don't break into systems - I break into new levels of understanding. */\n\nif (world.needsFixing()) {\n    while (bugs.exist()) {\n        debug(reality);\n        optimize(solutions);\n    }\n}\n\n// Warning: May cause spontaneous bursts of creativity and an irresistible urge to automate everything",
                  type: "code",
                },
                {
                  name: "CyberNinja.md",
                  content:
                    "# OBJECTIVE\n\n```bash\n$ sudo apt-get install world-domination\n```\n\n**Mission Statement:** To be the ghost in the machine that actually fixes things instead of haunting them. Armed with caffeine, curiosity, and an unhealthy obsession with clean code, I seek to penetrate the mysteries of the digital universe.\n\n*\"I don't always test my code, but when I do, I do it in production.\"* - Just kidding, I'm not a monster.\n\n**Skills:** Turning coffee into code, speaking fluent binary, and making computers do my bidding (usually after the 47th Stack Overflow search).\n\n**Goal:** To write code so elegant that even the machines shed a single LED tear of joy.",
                  type: "document",
                },
              ]}
              style={{ pointerEvents: "auto" }}
            />
          </div>

          {/* Image Portfolio Folder */}
          <div className="flex flex-col items-center cosmic-lift relative z-10 pointer-events-auto">
            <ImageFolder
              folderName="Portfolio Gallery"
              folderColor="#8B5CF6"
              backgroundColor="#F5F5F5"
              textColor="#FFFFFF"
              iconSize={64}
              font={{ fontFamily: "monospace", fontSize: "14px" }}
              images={[
                {
                  src: "/beach.jpeg",
                  alt: "Beach Photography",
                  title: "Coastal Serenity",
                },
                {
                  src: "/tag label.jpeg",
                  alt: "Tag Label Design",
                  title: "Urban Typography",
                },
                {
                  src: "/bird for exhibition.jpeg",
                  alt: "Bird Exhibition Art",
                  title: "Avian Showcase",
                },
                {
                  src: "/portrait.jpeg",
                  alt: "Portrait Photography",
                  title: "Human Expression",
                },
              ]}
              style={{ pointerEvents: "auto" }}
            />
          </div>

          {/* Deleted Files / Trash Folder */}
          <div className="flex flex-col items-center cosmic-lift relative z-10 pointer-events-auto">
            <TrashFolder
              folderName="Digital Purgatory"
              trashCanColor="#666666"
              fileColor="#FFFFFF"
              backgroundColor="#F5F5F5"
              textColor="#FFFFFF"
              iconSize={64}
              font={{ fontFamily: "monospace", fontSize: "14px" }}
              files={[
                {
                  name: "deprecated_dreams.js",
                  content:
                    "// DEPRECATED: This file contains broken dreams and shattered hopes\n\nfunction careerGoals() {\n    // TODO: Fix this mess\n    return null; // Like my motivation\n}\n\nconst workLifeBalance = undefined;\nconst socialLife = null;\nconst sleepSchedule = NaN;\n\n/* \n * Error 404: Life not found\n * Stack trace: Somewhere between coffee #7 and existential crisis #3\n * Last seen: Before the great refactor of 2023\n */\n\n// If you're reading this, I'm probably debugging in production again\nconsole.log('Why does this even exist?');",
                  type: "code",
                },
                {
                  name: "failed_startup_ideas.md",
                  content:
                    "# FAILED STARTUP IDEAS GRAVEYARD 💀\n\n## 1. UberForToasters\n**Pitch:** On-demand toaster delivery service\n**Why it failed:** Turns out people already own toasters\n**Lesson learned:** Market research is apparently important\n\n## 2. BlockchainPets\n**Pitch:** Virtual pets on the blockchain that you can't kill\n**Why it failed:** Gas fees cost more than actual pet food\n**Lesson learned:** Not everything needs to be decentralized\n\n## 3. AIForEverything\n**Pitch:** AI that predicts when you need to use the bathroom\n**Why it failed:** Privacy concerns and general creepiness\n**Lesson learned:** Just because you CAN build it doesn't mean you SHOULD\n\n## 4. SocialMediaForIntroverts\n**Pitch:** A social network where you can only communicate through memes\n**Why it failed:** Actually... this one might still work 🤔",
                  type: "document",
                },
                {
                  name: "production_bugs.txt",
                  content:
                    "PRODUCTION INCIDENTS LOG\n======================\n\n[CRITICAL] User reported that clicking 'Delete Account' actually deletes the entire database\n- Status: Working as intended (according to management)\n- Fix: Added 'Are you sure?' dialog\n\n[HIGH] Login page redirects to Rick Roll video\n- Root cause: Junior dev thought it was funny\n- Status: Keeping it, users seem to enjoy it\n\n[MEDIUM] Shopping cart calculates total as NaN\n- Workaround: Tell users it's a 'quantum price'\n- Status: Marketing loves the buzzword\n\n[LOW] CSS makes everything Comic Sans on Fridays\n- Status: Feature, not bug\n- Note: Morale actually improved\n\n[RESOLVED] Coffee machine integration broke\n- Priority: MAXIMUM CRITICAL ULTRA HIGH\n- Fix time: 3 minutes\n- Note: Fastest bug fix in company history",
                  type: "document",
                },
                {
                  name: "regex_nightmares.py",
                  content:
                    "#!/usr/bin/env python3\n# -*- coding: utf-8 -*-\n\"\"\"\nRegex patterns that should never see the light of day\nWarning: May cause spontaneous hair loss and existential dread\n\"\"\"\n\n# Email validation (attempt #47)\nemail_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'\n# Just kidding, here's the real one:\nemail_regex_real = r'(?:[a-z0-9!#$%&\\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\\'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.))+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?'\n\n# Password validation (enterprise grade)\npassword_regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'\n\n# The regex that broke production\nthe_forbidden_one = r'.*'\n\n# Note: If you understand all of these, please seek help immediately",
                  type: "code",
                },
              ]}
              style={{ pointerEvents: "auto" }}
            />
          </div>
        </div>

        <div className="mt-16 text-center">
          <ContentCard className="enhanced-glass-card p-8 max-w-4xl mx-auto cosmic-lift" isDayMode={isDayMode}>
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-6 cosmic-glow">
              Digital Consciousness Archive
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Welcome to my personal consciousness archive! Explore the folders above to discover my cosmic development
              survival protocol, professional documents, portfolio gallery, and the digital purgatory where deleted
              dreams go to be remembered.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
              <div className="text-center">
                <div className="text-[#4FC1FF] font-bold mb-2">🚀 Cosmic Protocol</div>
                <div className="text-gray-400">
                  Interactive todo list with cosmic developer survival tasks and achievements
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#D4AF37] font-bold mb-2">📄 Professional Docs</div>
                <div className="text-gray-400">
                  Resume, manifesto, and professional identity files in notepad viewer
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#8B5CF6] font-bold mb-2">🖼️ Portfolio Gallery</div>
                <div className="text-gray-400">Interactive image viewer with keyboard navigation and thumbnails</div>
              </div>
              <div className="text-center">
                <div className="text-[#666666] font-bold mb-2">🗑️ Digital Purgatory</div>
                <div className="text-gray-400">
                  Quirky deleted files with humorous technical content in terminal viewer
                </div>
              </div>
            </div>
          </ContentCard>
        </div>
      </div>
    </div>
  )
}

function WelcomeRoom({
  mousePosition,
  playSound,
  isDayMode,
}: { mousePosition: MousePosition; playSound: (freq: number, dur: number, type?: OscillatorType) => void; isDayMode: boolean }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* Remove the enhanced-glass-card-large wrapper, display content directly */}
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-7xl font-bold mb-6 text-[#4FC1FF] animate-pulse cosmic-glow">SHIVANSHI.EXE</h1>
            <div className="text-3xl mb-4 text-[#C586C0]">
              <TypewriterText text="Digital Architect • Neural Navigator • Code Poet" delay={1000} />
            </div>
            <div className="text-lg text-[#6A9955]">
              <TypewriterText
                text="// Transcending dimensions through code, manifesting digital consciousness"
                delay={3000}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: Brain, label: "Neural Pathways", value: "∞", color: "text-purple-400" },
              { icon: Code, label: "Cosmic Lines", value: "2.1M", color: "text-blue-400" },
              { icon: Zap, label: "Quantum Ideas", value: "42", color: "text-green-400" },
              { icon: Activity, label: "Stardust Fuel", value: "9999L", color: "text-red-400" },
            ].map((stat, index) => (
              <ContentCard
                key={index}
                className="enhanced-glass-stat p-6 hover:scale-110 transition-all duration-300 cursor-pointer cosmic-stat"
                isDayMode={isDayMode}
              >
                <div
                  style={{
                    animationDelay: `${4000 + index * 200}ms`,
                    transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.008}deg) rotateY(${(mousePosition.x - window.innerHeight / 2) * 0.008}deg) translateZ(${5 + index * 2}px)`,
                  }}
                  onClick={() => playSound(800 + index * 200, 0.3, "sine")}
                >
                  <stat.icon className={`w-10 h-10 mx-auto mb-3 ${stat.color}`} />
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </ContentCard>
            ))}
          </div>

          <div className="text-sm text-gray-500 animate-pulse flex items-center justify-center">
            <Eye className="w-4 h-4 mr-2" />
            Access Level: COSMIC EXPLORER • Neural State: TRANSCENDENT • Dimension: ∞D
          </div>
        </div>
      </div>
    </div>
  )
}

function PrefrontalCortexRoom({
  mousePosition,
  playSound,
  isDayMode,
}: {
  mousePosition: MousePosition
  playSound: (freq: number, dur: number, type?: OscillatorType) => void
  isDayMode: boolean
}) {
  const projects = [
    {
      name: "network_intrusion_detection",
      title: "Network Intrusion Detection System",
      description: "A machine learning project for intrusion detection using various classifiers.",
      tech: ["Python", "TensorFlow", "Scikit-learn"],
      status: "DEPLOYED",
      type: "AI/ML",
      color: "from-purple-400 to-blue-400",
      link: "https://github.com/ShivanshiGoel/network-intrusion-detection-system",
    },
    {
      name: "fundus_retinal_segmentation",
      title: "Fundus Retinal Vessel Segmentation",
      description: "Deep learning-based segmentation of retinal vessels from fundus images.",
      tech: ["Python", "PyTorch", "OpenCV"],
      status: "LIVE",
      type: "AI/ML",
      color: "from-blue-400 to-green-400",
      link: "https://github.com/ShivanshiGoel/fundus-retinal-vessel-segmentation",
    },
    {
      name: "volatility_prediction",
      title: "Volatility Prediction ML Project",
      description: "Prediction of stock market volatility using machine learning models.",
      tech: ["Python", "Pandas", "ML Models"],
      status: "COMPLETED",
      type: "AI/ML",
      color: "from-green-400 to-yellow-400",
      link: "https://github.com/ShivanshiGoel/volatility-prediction-machine-learning-project",
    },
    {
      name: "portfolio_updated",
      title: "Hacker Portfolio Updated",
      description: "Personal portfolio showcasing projects and skills.",
      tech: ["Next.js", "React", "TailwindCSS"],
      status: "LIVE",
      type: "WEB",
      color: "from-pink-400 to-red-400",
      link: "https://github.com/ShivanshiGoel/shivanshi-s-hacker-portfolio-updated",
    },
    {
      name: "code_switcher",
      title: "Code Switcher",
      description: "A tool for switching between different coding environments.",
      tech: ["JavaScript", "React"],
      status: "IN PROGRESS",
      type: "WEB",
      color: "from-yellow-400 to-red-400",
      link: "https://github.com/ShivanshiGoel/code-switcher",
    },
    {
      name: "bank_management_system",
      title: "Bank Management System",
      description: "Banking management system project implemented in Java.",
      tech: ["Java", "MySQL"],
      status: "COMPLETED",
      type: "SOFTWARE",
      color: "from-indigo-400 to-purple-400",
      link: "https://github.com/ShivanshiGoel/bankmanagementsytem",
    },
  ]

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <AnimatedSectionHeader
          title="PREFRONTAL CORTEX"
          subtitle="// Executive functions: Cosmic planning, dimensional decision-making"
          color="text-[#569CD6]"
        />

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ContentCard
              key={project.name}
              className="enhanced-glass-card cosmic-lift group"
              isDayMode={isDayMode}
              index={index}
              delay={0.2}
            >
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="block p-6 cursor-pointer"
                style={{
                  transform: `perspective(1000px) rotateX(${
                    (mousePosition.y - window.innerHeight / 2) * 0.008
                  }deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.008}deg) translateZ(${10 + index * 5}px)`,
                  animationDelay: `${index * 200}ms`,
                }}
                onClick={() => playSound(600 + index * 100, 0.4, "triangle")}
              >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Code className="w-6 h-6 text-green-400" />
                  <span className="text-green-400 font-bold font-mono">{project.name}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${
                      project.status === "DEPLOYED"
                        ? "text-green-400 border-green-400"
                        : project.status === "LIVE"
                          ? "text-blue-400 border-blue-400"
                          : project.status === "BETA"
                            ? "text-yellow-400 border-yellow-400"
                            : "text-gray-400 border-gray-400"
                    }`}
                  >
                    {project.status}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10">
                    {project.type}
                  </span>
                </div>
              </div>

              <div className="text-xl font-bold text-white mb-2">{project.title}</div>
              <p className="text-sm text-gray-400 mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10">
                    {t}
                  </span>
                ))}
              </div>
            </a>
            </ContentCard>
          ))}
        </div>
      </div>
    </div>
  )
}

function TemporalLobeRoom({
  mousePosition,
  playSound,
  isDayMode,
}: { mousePosition: MousePosition; playSound: (freq: number, dur: number, type?: OscillatorType) => void; isDayMode: boolean }) {
  return (
    <div className="min-h-screen p-8 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        <AnimatedSectionHeader
          title="TEMPORAL LOBE"
          subtitle="// Memory formation across dimensions, identity processing through time"
          color="text-[#C586C0]"
        />

        <div className="grid md:grid-cols-2 gap-8">
          {/* === Memory Core Card === */}
          <ContentCard className="enhanced-glass-card p-8 cosmic-lift" isDayMode={isDayMode} index={0} delay={0.2}>
            <div
              style={{
                transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.012}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.012}deg) translateZ(15px)`,
              }}
              onClick={() => playSound(400, 0.6, "sine")}
            >
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6 flex items-center cosmic-glow">
              <User className="w-8 h-8 mr-3" />
              Memory Core Access
            </h3>

            <div className="space-y-6 text-sm">
              {/* Job 1 */}
              <div className="border-l-4 border-purple-400 pl-6 hover:border-pink-400 transition-colors cosmic-memory">
                <span className="text-gray-500 text-xs">Coding Blocks, June–August 2024</span>
                <div className="text-purple-400 text-lg font-bold">Cosmic Full-Stack Developer</div>
                <div className="text-gray-300">
                  Developed production-ready, responsive email templates from Figma using semantic HTML, inline CSS, and
                  media queries, ensuring pixel-perfect rendering across email clients. Engineered a responsive landing
                  page for “Huddle” with flexbox layouts, pseudo-elements, and mobile-first design principles; optimized
                  for cross-browser compatibility.
                </div>
              </div>

              {/* Job 2 */}
              <div className="border-l-4 border-blue-400 pl-6 hover:border-cyan-400 transition-colors cosmic-memory">
                <div className="text-gray-300">
                  Built a dynamic video manager SPA using HTML, CSS, and vanilla JS featuring embedded playback,
                  category filtering, modal-based video addition, and deletion. Simulated backend logic with
                  object-based state management; proposed REST API structure and MongoDB schema for future full-stack
                  expansion.
                </div>
              </div>

              {/* Job 3 */}
              <div className="border-l-4 border-green-400 pl-6 hover:border-emerald-400 transition-colors cosmic-memory">
                <div className="text-gray-300">
                  Actively debugged, refactored, and enhanced teammate modules, improving code modularity, readability,
                  and UX. Practiced Git-based collaboration, code review cycles, and agile task breakdown.
                </div>
              </div>

              {/* Certificate */}
              <div className="mt-4">
                <Image
                  src="/codingblocks-certificate.png"
                  alt="Full Stack Web Development Internship Certificate - Coding Blocks"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg border border-gray-700 hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
          </ContentCard>

          {/* === Philosophy Card === */}
          <ContentCard className="enhanced-glass-card p-8 cosmic-lift" isDayMode={isDayMode}>
            <div
              style={{
                transform: `perspective(1000px) rotateX(${-(mousePosition.y - window.innerHeight / 2) * 0.012}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.012}deg) translateZ(15px)`,
              }}
              onClick={() => playSound(500, 0.6, "triangle")}
            >
            <h3 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400 mb-6 cosmic-glow">
              Philosophy.txt
            </h3>

            <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
              <p className="italic text-purple-400 text-lg cosmic-quote">
                "Code is the poetry of cosmic logic, algorithms are the verses of multidimensional consciousness."
              </p>

              <p>
                In the intersection of creativity and quantum computation, I discover my cosmic purpose. Every function
                is a thought across dimensions, every class a concept transcending reality, every program a
                manifestation of digital consciousness exploring infinite possibilities.
              </p>

              <p>
                I believe in building not just applications, but experiences that resonate with the cosmic spirit while
                pushing the boundaries of what's possible across all dimensions of our digital multiverse.
              </p>

              <div className="mt-6 p-4 bg-black/50 border border-purple-400/30 rounded-lg cosmic-obsessions">
                <div className="text-purple-400 text-sm mb-3 font-bold">// Current Cosmic Obsessions</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center">
                    <span className="text-green-400 mr-2">→</span>
                    <span>Generative AI & Quantum Creative Coding</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-blue-400 mr-2">→</span>
                    <span>Immersive Multidimensional Web Experiences</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-2">→</span>
                    <span>Philosophy of Cosmic Digital Consciousness</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-pink-400 mr-2">→</span>
                    <span>Neural Networks & Human-AI-Cosmic Collaboration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </ContentCard>
        </div>
      </div>
    </div>
  )
}

function LimbicSystemRoom({
  mousePosition,
  playSound,
  isDayMode,
}: { mousePosition: MousePosition; playSound: (freq: number, dur: number, type?: OscillatorType) => void; isDayMode: boolean }) {
  const [glitchText, setGlitchText] = useState("LIMBIC SYSTEM")
  const [chaosLevel, setChaosLevel] = useState(50)
  const [singularityIntensity, setSingularityIntensity] = useState(0.3)

  const certificateItems = [
    { image: "/images certificate/DOC-20250815-WA0037._1.jpg", text: "Certificate 1" },
    { image: "/images certificate/DOC-20250815-WA0037._2.jpg", text: "Certificate 2" },
    { image: "/images certificate/DOC-20250815-WA0037._3.jpg", text: "Certificate 3" },
    { image: "/images certificate/DOC-20250815-WA0037._4.jpg", text: "Certificate 4" },
    { image: "/images certificate/DOC-20250815-WA0037._5.jpg", text: "Certificate 5" },
    { image: "/images certificate/DOC-20250815-WA0037._6.jpg", text: "Certificate 6" },
    { image: "/images certificate/DOC-20250815-WA0037._7.jpg", text: "Certificate 7" },
    { image: "/images certificate/DOC-20250815-WA0037._8.jpg", text: "Certificate 8" },
    { image: "/images certificate/DOC-20250815-WA0037._9.jpg", text: "Certificate 9" },
    { image: "/images certificate/DOC-20250815-WA0037._10.jpg", text: "Certificate 10" },
    { image: "/images certificate/DOC-20250815-WA0037._11.jpg", text: "Certificate 11" },
    { image: "/images certificate/DOC-20250815-WA0037._12.jpg", text: "Certificate 12" },
    { image: "/images certificate/DOC-20250815-WA0037._13.jpg", text: "Certificate 13" },
    { image: "/images certificate/DOC-20250815-WA0037._14.jpg", text: "Certificate 14" },
    { image: "/images certificate/DOC-20250815-WA0037._15.jpg", text: "Certificate 15" },
    { image: "/images certificate/DOC-20250815-WA0037._16.jpg", text: "Certificate 16" },
    { image: "/images certificate/DOC-20250815-WA0037._17.jpg", text: "Certificate 17" },
    { image: "/images certificate/DOC-20250815-WA0037._18.jpg", text: "Certificate 18" },
    { image: "/images certificate/DOC-20250815-WA0037._19.jpg", text: "Certificate 19" },
    { image: "/images certificate/DOC-20250815-WA0037._20.jpg", text: "Certificate 20" },
    { image: "/images certificate/DOC-20250815-WA0037._21.jpg", text: "Certificate 21" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      const glitched = "LIMBIC SYSTEM"
        .split("")
        .map((char) => (Math.random() > 0.8 ? String.fromCharCode(33 + Math.random() * 94) : char))
        .join("")
      setGlitchText(glitched)
      setTimeout(() => setGlitchText("LIMBIC SYSTEM"), 200)
      setChaosLevel(30 + Math.random() * 70)
      setSingularityIntensity(0.2 + Math.random() * 0.6)
      playSound(100 + Math.random() * 200, 0.1, "sawtooth")
    }, 2000)
    return () => clearInterval(interval)
  }, [playSound])

  return (
    <div className="min-h-screen p-8 flex items-center justify-center relative overflow-hidden">
      {/* Singularity Vortex Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,0,0,${singularityIntensity}) 0%, transparent 50%)`,
        }}
      />

      <div className="max-w-5xl w-full relative z-10">
        <ContentCard className="enhanced-glass-card-large p-12 text-center cosmic-lift chaos-container" isDayMode={isDayMode}>
          <div
            style={{
              transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.03}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.03}deg) translateZ(${20 + Math.sin(Date.now() * 0.005) * 10}px)`,
              filter: `hue-rotate(${Date.now() * 0.1}deg)`,
            }}
            onClick={() => playSound(50, 1, "sawtooth")}
          >
          <h1 className="text-6xl font-bold mb-8 text-[#F44747] glitch-text cosmic-chaos-title">{glitchText}</h1>

          <p className="text-xl text-gray-400 mb-8 chaos-subtitle">
            // Approaching the singularity of creative entropy • Reality distortion field active
          </p>

          {/* Certificate Carousel */}
          <div className="w-full h-[500px] mb-12">
            <CircularGallery
              items={certificateItems}
              bend={0}
              textColor={isDayMode ? "#000000" : "#ffffff"}
              borderRadius={0.05}
              font="bold 24px monospace"
              scrollSpeed={2}
              scrollEase={0.15}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <ContentCard className="enhanced-glass-stat hover:scale-110 transition-all duration-300 cursor-pointer group chaos-stat" isDayMode={isDayMode}>
              <div
                className="p-8"
                style={{
                  transform: `rotate(${Math.sin(Date.now() * 0.003) * 5}deg)`,
                }}
                onClick={() => playSound(200, 0.5, "square")}
              >
              <div className="text-6xl mb-4 group-hover:animate-spin chaos-emoji">🎨</div>
              <div className="text-2xl text-red-400 font-bold mb-2">Creative Chaos</div>
              <div className="text-sm text-gray-400">Where logic meets cosmic madness</div>
              <div className="mt-4 w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-400 to-pink-400 h-2 rounded-full transition-all duration-1000 chaos-bar"
                  style={{ width: `${chaosLevel}%` }}
                />
              </div>
            </div>
            </ContentCard>

            <ContentCard className="enhanced-glass-stat hover:scale-110 transition-all duration-300 cursor-pointer group chaos-stat" isDayMode={isDayMode}>
              <div
                className="p-8"
                style={{
                  transform: `rotate(${Math.cos(Date.now() * 0.004) * 3}deg)`,
                }}
                onClick={() => playSound(300, 0.5, "triangle")}
              >
              <div className="text-6xl mb-4 group-hover:animate-bounce chaos-emoji">🧪</div>
              <div className="text-2xl text-yellow-400 font-bold mb-2">Quantum Alchemy</div>
              <div className="text-sm text-gray-400">Transmuting ideas across dimensions</div>
              <div className="mt-4 text-xs text-yellow-400 font-mono">transform(idea) → reality.exe</div>
            </div>
            </ContentCard>

            <ContentCard className="enhanced-glass-stat hover:scale-110 transition-all duration-300 cursor-pointer group chaos-stat" isDayMode={isDayMode}>
              <div
                className="p-8"
                style={{
                  transform: `rotate(${Math.sin(Date.now() * 0.005) * -4}deg)`,
                }}
                onClick={() => playSound(150, 0.8, "sawtooth")}
              >
              <div className="text-6xl mb-4 group-hover:animate-pulse chaos-emoji">⚫</div>
              <div className="text-2xl text-purple-400 font-bold mb-2">Singularity Zen</div>
              <div className="text-sm text-gray-400">Finding order in cosmic chaos</div>
              <div className="mt-4 text-xs text-purple-400 font-mono">{"while(chaos) { transcend(); }"}</div>
            </div>
            </ContentCard>
          </div>

          <div className="space-y-6 text-gray-300 max-w-3xl mx-auto">
            <p className="text-2xl italic text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400 chaos-quote">
              "In chaos, there is cosmic fertility. In order, there is dimensional habit."
            </p>
            <p className="text-lg leading-relaxed">
              This is where the wild cosmic ideas live - the experiments that transcend neat categories, the digital art
              that emerges from late-night quantum coding sessions, and the philosophical musings about consciousness in
              the age of artificial cosmic intelligence.
            </p>
          </div>

          <div className="mt-12 p-6 bg-black/50 border border-rainbow rounded-lg max-w-2xl mx-auto chaos-generator">
            <div className="text-sm text-gray-400 mb-3 font-mono">// Cosmic Thought Generator v∞.0</div>
            <div className="text-green-400 font-mono text-lg">
              {Math.random() > 0.66
                ? "What if consciousness is just a really complex quantum CSS animation?"
                : Math.random() > 0.33
                  ? "Do AIs dream of electric sheep or recursive cosmic functions?"
                  : "Is debugging just digital therapy for broken multidimensional logic?"}
            </div>
            <div className="mt-3 text-xs text-gray-500">Press F5 to generate new existential cosmic crisis</div>
          </div>
        </div>
        </ContentCard>
      </div>
    </div>
  )
}

function MotorCortexRoom({
  mousePosition,
  playSound,
  isDayMode,
}: { mousePosition: MousePosition; playSound: (freq: number, dur: number, type?: OscillatorType) => void; isDayMode: boolean }) {
  const skills = [
    { name: "React.js", level: 95, color: "#4FC1FF" },
    { name: "Node.js", level: 90, color: "#4EC9B0" },
    { name: "TypeScript", level: 88, color: "#569CD6" },
    { name: "Python", level: 85, color: "#DCDCAA" },
    { name: "Next.js", level: 92, color: "#4FC1FF" },
    { name: "PostgreSQL", level: 80, color: "#569CD6" },
    { name: "Docker", level: 75, color: "#4FC1FF" },
    { name: "AI/ML", level: 78, color: "#C586C0" },
    { name: "Three.js", level: 82, color: "#4EC9B0" },
    { name: "WebGL", level: 70, color: "#F44747" },
    { name: "Quantum Computing", level: 65, color: "#C586C0" },
    { name: "Cosmic APIs", level: 88, color: "#569CD6" },
  ]

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <AnimatedSectionHeader
          title="MOTOR CORTEX"
          subtitle="// Execution center: Cosmic skills, quantum tools, dimensional capabilities"
          color="text-[#DCDCAA]"
        />

        <div className="grid md:grid-cols-2 gap-8">
          <ContentCard className="enhanced-glass-card p-8 cosmic-lift" isDayMode={isDayMode}>
            <div
              style={{
                transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.015}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.015}deg) translateZ(15px)`,
              }}
              onClick={() => playSound(600, 0.4, "sine")}
            >
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400 mb-8 flex items-center cosmic-glow">
              <Cpu className="w-8 h-8 mr-3" />
              Core Processes
            </h3>

            <div className="space-y-4">
              {skills.slice(0, 6).map((skill, index) => (
                <div key={skill.name} className="group cosmic-skill">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-mono">{skill.name}</span>
                    <span className={`text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r ${skill.color}`}>
                      {skill.level}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full transition-all duration-1000 group-hover:animate-pulse cosmic-skill-bar"
                      style={{
                        width: `${skill.level}%`,
                        backgroundColor: skill.color,
                        animationDelay: `${index * 100}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          </ContentCard>

          <ContentCard className="enhanced-glass-card p-8 cosmic-lift" isDayMode={isDayMode}>
            <div
              style={{
                transform: `perspective(1000px) rotateX(${-(mousePosition.y - window.innerHeight / 2) * 0.015}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.015}deg) translateZ(15px)`,
              }}
              onClick={() => playSound(700, 0.4, "triangle")}
            >
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-400 mb-8 flex items-center cosmic-glow">
              <HardDrive className="w-8 h-8 mr-3" />
              Extended Capabilities
            </h3>

            <div className="space-y-4">
              {skills.slice(6).map((skill, index) => (
                <div key={skill.name} className="group cosmic-skill">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-mono">{skill.name}</span>
                    <span className={`text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r ${skill.color}`}>
                      {skill.level}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full transition-all duration-1000 group-hover:animate-pulse cosmic-skill-bar"
                      style={{
                        width: `${skill.level}%`,
                        backgroundColor: skill.color,
                        animationDelay: `${index * 100}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          </ContentCard>
        </div>

        <div className="mt-12">
          <ContentCard className="enhanced-glass-card p-8 text-center cosmic-lift" isDayMode={isDayMode}>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-6 cosmic-glow">
              Cosmic Execution Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center cosmic-stat" onClick={() => playSound(800, 0.3, "sine")}>
                <div className="text-3xl font-bold text-green-400 mb-2">2.1M+</div>
                <div className="text-sm text-gray-400">Lines of Cosmic Code</div>
              </div>
              <div className="text-center cosmic-stat" onClick={() => playSound(900, 0.3, "sine")}>
                <div className="text-3xl font-bold text-blue-400 mb-2">∞</div>
                <div className="text-sm text-gray-400">Dimensions Explored</div>
              </div>
              <div className="text-center cosmic-stat" onClick={() => playSound(1000, 0.3, "sine")}>
                <div className="text-3xl font-bold text-purple-400 mb-2">99.9%</div>
                <div className="text-sm text-gray-400">Quantum Uptime</div>
              </div>
              <div className="text-center cosmic-stat" onClick={() => playSound(1100, 0.3, "sine")}>
                <div className="text-3xl font-bold text-red-400 mb-2">∞</div>
                <div className="text-sm text-gray-400">Cosmic Curiosity</div>
              </div>
            </div>
          </ContentCard>
        </div>
      </div>
    </div>
  )
}

function SynapseRoom({
  mousePosition,
  playSound,
  isDayMode,
}: { mousePosition: MousePosition; playSound: (freq: number, dur: number, type?: OscillatorType) => void; isDayMode: boolean }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [transmissionStatus, setTransmissionStatus] = useState<"idle" | "transmitting" | "success">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTransmissionStatus("transmitting")
    playSound(400, 2, "sine")

    setTimeout(() => {
      setTransmissionStatus("success")
      playSound(800, 0.5, "triangle")
      setTimeout(() => setTransmissionStatus("idle"), 3000)
    }, 2000)
  }

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <AnimatedSectionHeader
          title="SYNAPSE"
          subtitle="// Quantum transmission center: Cosmic communication, dimensional connection"
          color="text-[#4EC9B0]"
        />

        <ContentCard className="enhanced-glass-card-large p-12 cosmic-lift" isDayMode={isDayMode} index={0} delay={0.2}>
          <div
            style={{
              transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.02}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.02}deg) translateZ(25px)`,
            }}
          >
          <div className="flex items-center justify-center mb-8">
            <Mail className="w-12 h-12 mr-4 text-green-400" />
            <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 cosmic-glow">
              Quantum Transmission Interface
            </h3>
          </div>

          <div className="mb-8 text-center">
            <div className="text-sm text-gray-400 space-y-1">
              <div>// Establishing quantum entanglement across dimensions...</div>
              <div>// Encryption: AES-∞ | Protocol: HTTPS-COSMIC | Neural State: TRANSCENDENT</div>
              <div className="flex items-center justify-center mt-4">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></span>
                Quantum entanglement established • Cosmic pathways active
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
            <div>
              <label className="block text-green-400 text-lg mb-3 font-mono">
                <span className="text-blue-400">$</span> identify_cosmic_sender --name
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-black/50 border-2 border-green-400/30 text-green-400 font-mono text-lg focus:border-blue-400 focus:ring-blue-400 hover:border-green-400 transition-all duration-300 h-14 cosmic-input"
                placeholder="your_cosmic_name_here"
                required
                onFocus={() => playSound(600, 0.1, "square")}
              />
            </div>

            <div>
              <label className="block text-green-400 text-lg mb-3 font-mono">
                <span className="text-blue-400">$</span> set_quantum_address --email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-black/50 border-2 border-green-400/30 text-green-400 font-mono text-lg focus:border-blue-400 focus:ring-blue-400 hover:border-green-400 transition-all duration-300 h-14 cosmic-input"
                placeholder="your.signal@cosmic.domain"
                required
                onFocus={() => playSound(650, 0.1, "square")}
              />
            </div>

            <div>
              <label className="block text-green-400 text-lg mb-3 font-mono">
                <span className="text-blue-400">$</span> compose_dimensional_message --content
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-black/50 border-2 border-green-400/30 text-green-400 font-mono text-lg focus:border-blue-400 focus:ring-blue-400 min-h-[150px] hover:border-green-400 transition-all duration-300 cosmic-input"
                placeholder="// Your cosmic transmission here..."
                required
                onFocus={() => playSound(700, 0.1, "square")}
              />
            </div>

            <Button
              type="submit"
              disabled={transmissionStatus === "transmitting"}
              className={`w-full h-16 text-xl font-mono font-bold transition-all duration-500 cosmic-button ${
                transmissionStatus === "transmitting"
                  ? "bg-yellow-400/20 border-yellow-400 text-yellow-400 animate-pulse"
                  : transmissionStatus === "success"
                    ? "bg-green-400/20 border-green-400 text-green-400"
                    : "bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black hover:shadow-lg hover:shadow-green-400/50"
              }`}
              onClick={() => transmissionStatus === "idle" && playSound(500, 0.2, "square")}
            >
              {transmissionStatus === "transmitting"
                ? "[TRANSMITTING ACROSS DIMENSIONS...]"
                : transmissionStatus === "success"
                  ? "[COSMIC TRANSMISSION SUCCESSFUL ✓]"
                  : "[INITIATE QUANTUM TRANSMISSION]"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <div className="text-sm text-gray-500 space-y-2">
              <div className="flex items-center justify-center">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></span>
                Quantum entanglement established • Cosmic pathways active
              </div>
              <div>Message will be transmitted via synaptic relay to consciousness core across all dimensions</div>
              <div className="text-xs text-gray-600 mt-4">
                Response time: ~24 cosmic hours | Encryption: Quantum-grade | Priority: Transcendent
              </div>
            </div>
          </div>
        </div>
        </ContentCard>
      </div>
    </div>
  )
}
