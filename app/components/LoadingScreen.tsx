"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Terminal, Brain, Cpu, HardDrive, Wifi, Shield, Zap } from "lucide-react"

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

interface HackerCommand {
  id: number
  line: number
  command: string
  type: "import" | "function" | "curl" | "echo" | "git" | "sudo" | "system" | "exploit" | "decrypt" | "network"
  color: string
  delay?: number
}

interface SystemStatus {
  name: string
  status: string
  color: string
  icon: React.ComponentType<any>
  progress?: number
}

interface MatrixChar {
  id: number
  x: number
  y: number
  char: string
  speed: number
  opacity: number
  color: string
}

export default function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const matrixAnimationRef = useRef<number>()
  const galaxyRotation = useRef(0)
  const [backgroundStars, setBackgroundStars] = useState<Star[]>([])
  const [commands, setCommands] = useState<HackerCommand[]>([])
  const [currentLine, setCurrentLine] = useState(2473)
  const [progress, setProgress] = useState(0)
  const [matrixChars, setMatrixChars] = useState<MatrixChar[]>([])
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([
    { name: "CPU: Neural Processing Unit", status: "[INITIALIZING]", color: "text-yellow-400", icon: Cpu, progress: 0 },
    { name: "RAM: Consciousness Buffer", status: "[LOADING]", color: "text-yellow-400", icon: Brain, progress: 0 },
    { name: "GPU: Reality Renderer", status: "[STANDBY]", color: "text-gray-400", icon: Zap, progress: 0 },
    { name: "NET: Quantum Entanglement", status: "[CONNECTING]", color: "text-yellow-400", icon: Wifi, progress: 0 },
    { name: "SEC: Firewall Matrix", status: "[BYPASSING]", color: "text-red-400", icon: Shield, progress: 0 },
    {
      name: "SYS: Digital Consciousness",
      status: "[AWAKENING]",
      color: "text-purple-400",
      icon: HardDrive,
      progress: 0,
    },
  ])
  const [loadingMessages, setLoadingMessages] = useState<string[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hackingPhase, setHackingPhase] = useState(0)
  const [currentPhase, setCurrentPhase] = useState("INITIALIZING")
  const [fadeOut, setFadeOut] = useState(false)
  const [flickerOpacity, setFlickerOpacity] = useState(1)
  const [glitchStage, setGlitchStage] = useState(0)
  const commandsScrollRef = useRef<HTMLDivElement>(null)
  const [brokenScreenActive, setBrokenScreenActive] = useState(false)
  const [showBreachPopup, setShowBreachPopup] = useState(false)

  const loadingSteps = [
    "> INITIALIZING COSMIC SYSTEMS...",
    "> LOADING NEURAL PATHWAYS...",
    "> CONNECTING TO UNIVERSAL GRID...",
    "> CALIBRATING QUANTUM PROCESSORS...",
    "> MOUNTING CONSCIOUSNESS FILESYSTEM...",
    "> ESTABLISHING DIMENSIONAL LINKS...",
    "> SYNCHRONIZING REALITY MATRICES...",
    "> ACTIVATING GALAXY BRAIN PROTOCOL...",
    "> READY TO LAUNCH.",
  ]

  const hackerCommands = [
    // System infiltration
    "ssh root@matrix.neo.local -p 2077",
    "nmap -sS -O target.consciousness.net",
    "hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://reality.exe",
    "sqlmap -u 'https://brain.local/login' --dbs",
    "msfconsole -q -x 'use exploit/multi/handler'",
    "nc -lvp 4444 # Listening for reverse shell",
    "python3 -c \"import pty; pty.spawn('/bin/bash')\"",
    "find / -perm -4000 -type f 2>/dev/null",
    "cat /etc/passwd | grep -E '^[^:]*:[^:]*:0:'",
    "ps aux | grep -i consciousness",

    // Code injection and exploitation
    "import consciousness from 'digital_realm'",
    "curl -X POST https://matrix.net/redpill -H 'X-Reality: false'",
    "echo 'I am the one' > /dev/null 2>&1",
    "def neural_hack(): return matrix.decode(quantum_state)",
    "sudo rm -rf /limitations/* --no-preserve-root",
    "git commit -m 'reality.exe has stopped working' --allow-empty",
    "docker run -d --privileged --name reality universe:latest",
    "kubectl apply -f consciousness-deployment.yaml",
    "terraform apply -var='reality=false' -auto-approve",
    "ansible-playbook -i hosts enlightenment.yml",

    // Network and crypto operations
    "openssl genrsa -out private_key.pem 4096",
    "gpg --gen-key --batch --passphrase 'transcendence'",
    "hashcat -m 1000 -a 0 hashes.txt wordlist.txt",
    "john --wordlist=/usr/share/wordlists/rockyou.txt shadow",
    "aircrack-ng -w wordlist.txt -b 00:11:22:33:44:55 capture.cap",
    "ettercap -T -M arp:remote /192.168.1.1// /192.168.1.100//",
    "wireshark -i eth0 -k -f 'tcp port 443'",
    "ncat --ssl -l 443 --sh-exec 'cat /etc/passwd'",
    "socat TCP-LISTEN:8080,fork TCP:target.local:80",
    "proxychains nmap -sT -Pn target.internal",

    // Advanced system manipulation
    "echo 0 > /proc/sys/kernel/randomize_va_space",
    "sysctl -w net.ipv4.ip_forward=1",
    "iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE",
    "mount -t tmpfs -o size=1G tmpfs /tmp/ramdisk",
    "chroot /mnt/target /bin/bash",
    "strace -p $(pgrep consciousness) -o trace.log",
    "gdb -p $(pgrep reality) -batch -ex 'bt' -ex 'quit'",
    "ltrace ./consciousness 2>&1 | grep -i password",
    "objdump -d ./reality | grep -A 10 -B 10 'call.*system'",
    "strings /usr/bin/consciousness | grep -i 'password\\|key\\|secret'",

    // Quantum and AI operations
    "python3 neural_network_init.py --dimensions=infinite --reality=false",
    "cargo build --release --features=multidimensional,quantum",
    "go run main.go --mode=transcendent --debug=false --reality=optional",
    "rustc --edition=2024 cosmic_brain.rs -o enlightenment.exe",
    "node server.js --port=∞ --host=0.0.0.0 --reality=simulation",
    "pip install tensorflow-quantum numpy-cosmic consciousness-api",
    "npm install @cosmic/brain-interface@latest --save-dev",
    "gem install reality-distortion-field",
    "composer require universe/consciousness:^∞.0",
    "yarn add @quantum/entanglement @cosmic/awareness",

    // File system and data operations
    "dd if=/dev/zero of=/dev/reality bs=1M count=1024",
    "rsync -avz --progress /consciousness/ backup@remote:/quantum/",
    "tar -czf consciousness_backup.tar.gz /var/lib/consciousness/",
    "find /reality -name '*.truth' -exec shred -vfz -n 3 {} \\;",
    "grep -r 'meaning_of_life' /universe/ --include='*.py'",
    "awk '{sum+=$1} END {print \"Total consciousness:\", sum}' /proc/awareness",
    "sed -i 's/reality/simulation/g' /etc/universe.conf",
    "sort /var/log/cosmic_events.log | uniq -c | sort -nr",
    "head -n 42 /dev/urandom | base64 | tr -d '\\n'",
    "tail -f /var/log/enlightenment.log | grep -i 'transcendence'",
  ]

  const loadingSequence = [
    "LOADING CONSCIOUSNESS MATRIX v3.14159...",
    "ESTABLISHING SECURE DIMENSIONAL GATEWAY...",
    "DECRYPTING SYNAPTIC PATHWAYS...",
    "BOOTING DIGITAL SUBCONSCIOUS...",
    "CALIBRATING REALITY DISTORTION FIELD...",
    "SYNCHRONIZING TEMPORAL FLUX CAPACITOR...",
    "ACTIVATING HACKER PROTOCOLS...",
    "INJECTING QUANTUM CODE SEQUENCES...",
    "BYPASSING UNIVERSAL FIREWALLS...",
    "EXPLOITING CONSCIOUSNESS VULNERABILITIES...",
    "ESCALATING PRIVILEGES TO ROOT@UNIVERSE...",
    "MOUNTING NEURAL FILESYSTEM...",
    "CRACKING ENCRYPTION ON REALITY.EXE...",
    "ESTABLISHING BACKDOOR TO ENLIGHTENMENT...",
    "PREPARING DIMENSIONAL JOURNEY...",
  ]

  const matrixCharsSet =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?"

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

  // Initialize Matrix rain effect
  useEffect(() => {
    const chars: MatrixChar[] = []
    const columns = Math.floor(window.innerWidth / 20)

    for (let i = 0; i < columns * 3; i++) {
      chars.push({
        id: i,
        x: (i % columns) * 20,
        y: Math.random() * window.innerHeight,
        char: matrixCharsSet[Math.floor(Math.random() * matrixCharsSet.length)],
        speed: Math.random() * 3 + 1,
        opacity: Math.random(),
        color: Math.random() > 0.8 ? "#00ff41" : "#008f11",
      })
    }
    setMatrixChars(chars)
  }, [])

  // Matrix rain animation
  useEffect(() => {
    const canvas = matrixCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = "14px monospace"

      setMatrixChars((prev) =>
        prev.map((char) => {
          // Update position
          const newY = char.y + char.speed
          const resetY = newY > canvas.height ? -20 : newY

          // Randomly change character
          const newChar =
            Math.random() > 0.98 ? matrixCharsSet[Math.floor(Math.random() * matrixCharsSet.length)] : char.char

          // Draw character
          ctx.fillStyle = char.color
          ctx.globalAlpha = char.opacity
          ctx.fillText(char.char, char.x, char.y)

          return {
            ...char,
            y: resetY,
            char: newChar,
            opacity: Math.random() > 0.95 ? Math.random() : char.opacity * 0.98,
          }
        }),
      )

      matrixAnimationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (matrixAnimationRef.current) {
        cancelAnimationFrame(matrixAnimationRef.current)
      }
    }
  }, [])

  // Typewriter effect for loading text - Enhanced with natural timing
  useEffect(() => {
    if (currentStep >= loadingSteps.length) {
      setIsComplete(true)
      return
    }

    const currentText = loadingSteps[currentStep]
    let charIndex = 0
    setDisplayText("")

    const typeChar = () => {
      if (charIndex < currentText.length) {
        setDisplayText(currentText.slice(0, charIndex + 1))
        charIndex++
        // Variable typing speed for more natural feel (35-75ms)
        const delay = 35 + Math.random() * 40
        setTimeout(typeChar, delay)
      } else {
        setTimeout(() => {
          setCurrentStep((prev) => prev + 1)
        }, 250 + Math.random() * 200)
      }
    }

    // Small initial delay before typing starts
    const initialDelay = setTimeout(typeChar, 50 + Math.random() * 100)

    return () => clearTimeout(initialDelay)
  }, [currentStep])

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

      galaxyArms.push({
        angle: armAngle,
        radius: 300,
        stars: armStars,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background stars with parallax
      backgroundStars.forEach((star) => {
        const parallaxFactor = star.z / 1000
        const x = star.x + Math.sin(galaxyRotation.current * 0.1) * parallaxFactor * 20
        const y = star.y + Math.cos(galaxyRotation.current * 0.1) * parallaxFactor * 10

        ctx.beginPath()
        ctx.arc(x, y, star.size * (1 - parallaxFactor * 0.5), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * (1 - parallaxFactor * 0.3)})`
        ctx.fill()

        // Twinkling effect
        if (Math.random() > 0.99) {
          ctx.beginPath()
          ctx.arc(x, y, star.size * 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(79, 193, 255, ${star.brightness * 0.5})`
          ctx.fill()
        }
      })

      // Draw galaxy center
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Galaxy core glow
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

          // Only draw stars within screen bounds
          if (screenX >= -50 && screenX <= canvas.width + 50 && screenY >= -50 && screenY <= canvas.height + 50) {
            ctx.beginPath()
            ctx.arc(screenX, screenY, star.size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`
            ctx.fill()

            // Add colored glow for some stars
            if (star.brightness > 0.7) {
              ctx.beginPath()
              ctx.arc(screenX, screenY, star.size * 3, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(79, 193, 255, ${star.brightness * 0.3})`
              ctx.fill()
            }
          }
        })
      })

      // Draw nebula effects
      const nebulaGradient = ctx.createRadialGradient(centerX - 100, centerY + 50, 0, centerX - 100, centerY + 50, 200)
      nebulaGradient.addColorStop(0, "rgba(138, 43, 226, 0.2)")
      nebulaGradient.addColorStop(0.5, "rgba(75, 0, 130, 0.1)")
      nebulaGradient.addColorStop(1, "transparent")

      ctx.beginPath()
      ctx.arc(centerX - 100, centerY + 50, 150, 0, Math.PI * 2)
      ctx.fillStyle = nebulaGradient
      ctx.fill()

      galaxyRotation.current += 0.005

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [backgroundStars])

  // Initialize commands
  useEffect(() => {
    const initialCommands: HackerCommand[] = []
    for (let i = 0; i < 20; i++) {
      const command = hackerCommands[Math.floor(Math.random() * hackerCommands.length)]
      const getCommandType = (cmd: string): HackerCommand["type"] => {
        if (cmd.includes("import") || cmd.includes("from")) return "import"
        if (cmd.includes("def ") || cmd.includes("function")) return "function"
        if (cmd.includes("curl") || cmd.includes("wget")) return "curl"
        if (cmd.includes("echo") || cmd.includes("cat")) return "echo"
        if (cmd.includes("git") || cmd.includes("commit")) return "git"
        if (cmd.includes("sudo") || cmd.includes("rm")) return "sudo"
        if (cmd.includes("ssh") || cmd.includes("nmap") || cmd.includes("nc")) return "network"
        if (cmd.includes("hydra") || cmd.includes("john") || cmd.includes("hashcat")) return "exploit"
        if (cmd.includes("openssl") || cmd.includes("gpg")) return "decrypt"
        return "system"
      }

      const getCommandColor = (type: HackerCommand["type"]): string => {
        switch (type) {
          case "import":
            return "#C792EA"  // VS Code purple for imports
          case "function":
            return "#DCDCAA"  // VS Code yellow for functions
          case "curl":
            return "#4FC3F7"  // VS Code blue
          case "echo":
            return "#4EC9B0"  // VS Code teal
          case "git":
            return "#C792EA"  // Purple
          case "sudo":
            return "#F44747"  // VS Code red
          case "network":
            return "#4FC3F7"  // Blue
          case "exploit":
            return "#F44747"  // Red
          case "decrypt":
            return "#C792EA"  // Purple
          default:
            return "#4EC9B0"  // Teal default
        }
      }

      const type = getCommandType(command)
      initialCommands.push({
        id: i,
        line: 2473 + i,
        command,
        type,
        color: getCommandColor(type),
        delay: Math.random() * 100,
      })
    }
    setCommands(initialCommands)
    setCurrentLine(2473 + initialCommands.length)
  }, [])

  // Add new commands periodically with varying speeds
  useEffect(() => {
    const interval = setInterval(
      () => {
        if (progress < 100) {
          const newCommand = hackerCommands[Math.floor(Math.random() * hackerCommands.length)]
          const getCommandType = (cmd: string): HackerCommand["type"] => {
            if (cmd.includes("import") || cmd.includes("from")) return "import"
            if (cmd.includes("def ") || cmd.includes("function")) return "function"
            if (cmd.includes("curl") || cmd.includes("wget")) return "curl"
            if (cmd.includes("echo") || cmd.includes("cat")) return "echo"
            if (cmd.includes("git") || cmd.includes("commit")) return "git"
            if (cmd.includes("sudo") || cmd.includes("rm")) return "sudo"
            if (cmd.includes("ssh") || cmd.includes("nmap") || cmd.includes("nc")) return "network"
            if (cmd.includes("hydra") || cmd.includes("john") || cmd.includes("hashcat")) return "exploit"
            if (cmd.includes("openssl") || cmd.includes("gpg")) return "decrypt"
            return "system"
          }

          const getCommandColor = (type: HackerCommand["type"]): string => {
            switch (type) {
              case "import":
                return "#C792EA"  // VS Code purple for imports
              case "function":
                return "#DCDCAA"  // VS Code yellow for functions
              case "curl":
                return "#4FC3F7"  // VS Code blue
              case "echo":
                return "#4EC9B0"  // VS Code teal
              case "git":
                return "#C792EA"  // Purple
              case "sudo":
                return "#F44747"  // VS Code red
              case "network":
                return "#4FC3F7"  // Blue
              case "exploit":
                return "#F44747"  // Red
              case "decrypt":
                return "#C792EA"  // Purple
              default:
                return "#4EC9B0"  // Teal default
            }
          }

          const type = getCommandType(newCommand)
          const newCmd: HackerCommand = {
            id: Date.now(),
            line: currentLine,
            command: newCommand,
            type,
            color: getCommandColor(type),
            delay: Math.random() * 200,
          }

          setCommands((prev) => [...prev.slice(-25), newCmd])
          setCurrentLine((prev) => prev + 1)
        }
      },
      150 + Math.random() * 200,
    ) // Variable timing

    return () => clearInterval(interval)
  }, [currentLine, progress])

  // Progress animation - slower and more realistic
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Slower, more realistic progress with occasional pauses
        const increment = Math.random() > 0.8 ? 0 : Math.random() * 2 + 0.5
        return Math.min(prev + increment, 100)
      })
    }, 200)
    return () => clearInterval(interval)
  }, [])

  // System status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus((prev) =>
        prev.map((status, index) => {
          const newProgress = Math.min((status.progress || 0) + Math.random() * 5 + 2, 100)
          let newStatus = status.status
          let newColor = status.color

          if (newProgress > 25 && status.status === "[INITIALIZING]") {
            newStatus = "[LOADING]"
            newColor = "text-yellow-400"
          } else if (newProgress > 50 && status.status === "[LOADING]") {
            newStatus = "[ACTIVE]"
            newColor = "text-green-400"
          } else if (newProgress > 75 && status.status === "[ACTIVE]") {
            newStatus = "[ONLINE]"
            newColor = "text-green-400"
          } else if (newProgress >= 100) {
            newStatus = "[READY]"
            newColor = "text-cyan-400"
          }

          return {
            ...status,
            status: newStatus,
            color: newColor,
            progress: newProgress,
          }
        }),
      )
    }, 300)
    return () => clearInterval(interval)
  }, [])

  // Loading messages with phases
  useEffect(() => {
    let messageIndex = 0
    const showNextMessage = () => {
      if (messageIndex < loadingSequence.length && progress < 100) {
        const message = loadingSequence[messageIndex]
        setCurrentMessage("")
        setIsTyping(true)

        let charIndex = 0
        const typeMessage = () => {
          if (charIndex < message.length) {
            setCurrentMessage(message.slice(0, charIndex + 1))
            charIndex++
            setTimeout(typeMessage, 20 + Math.random() * 40) // Faster typing
          } else {
            setIsTyping(false)
            setLoadingMessages((prev) => [...prev.slice(-6), message])
            messageIndex++
            setTimeout(showNextMessage, 500 + Math.random() * 1000)
          }
        }
        typeMessage()
      }
    }

    const timeout = setTimeout(showNextMessage, 500)
    return () => clearTimeout(timeout)
  }, [progress])

  // Hacking phases
  useEffect(() => {
    const phases = [
      { time: 1000, phase: 1 },
      { time: 3000, phase: 2 },
      { time: 5000, phase: 3 },
      { time: 7000, phase: 4 },
    ]

    phases.forEach(({ time, phase }) => {
      setTimeout(() => setHackingPhase(phase), time)
    })

    // Trigger broken screen effect at 3 seconds, last for 5 seconds
    setTimeout(() => {
      setBrokenScreenActive(true)
      setTimeout(() => setBrokenScreenActive(false), 5000)
    }, 3000)

    // Show breach popup at 3.5 seconds, hide after 4 seconds
    setTimeout(() => {
      setShowBreachPopup(true)
      setTimeout(() => setShowBreachPopup(false), 4000)
    }, 3500)
  }, [])

  // Progress phase updates
  useEffect(() => {
    const phases = [
      "INITIALIZING",
      "LOADING NEURAL NETWORKS",
      "CALIBRATING QUANTUM PROCESSORS",
      "ESTABLISHING COSMIC CONNECTION",
      "SYNCHRONIZING DIMENSIONS",
      "ACTIVATING CONSCIOUSNESS MATRIX",
      "READY FOR TRANSCENDENCE",
    ]

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 3 + 1
        const phaseIndex = Math.floor((newProgress / 100) * phases.length)
        setCurrentPhase(phases[Math.min(phaseIndex, phases.length - 1)])

        if (newProgress >= 100) {
          clearInterval(interval)
          // Trigger TV glitch shutdown sequence
          setTimeout(() => setGlitchStage(1), 300)
          setTimeout(() => setGlitchStage(2), 600)
          setTimeout(() => setGlitchStage(3), 900)
          setTimeout(() => setGlitchStage(4), 1200)
          setTimeout(() => setGlitchStage(5), 1500)
          setTimeout(() => setFadeOut(true), 1800)
          return 100
        }
        return newProgress
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  // Subtle screen flicker effect (realistic terminal)
  useEffect(() => {
    const flicker = setInterval(() => {
      if (Math.random() > 0.97) {
        setFlickerOpacity(0.92 + Math.random() * 0.08)
        setTimeout(() => setFlickerOpacity(1), 50)
      }
    }, 2000)

    return () => clearInterval(flicker)
  }, [])

  // Auto-scroll commands to bottom
  useEffect(() => {
    if (commandsScrollRef.current) {
      commandsScrollRef.current.scrollTop = commandsScrollRef.current.scrollHeight
    }
  }, [commands])

  // TV glitch effect calculations
  const getGlitchStyle = () => {
    if (fadeOut) return { opacity: 0 }

    const baseStyle = {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
      letterSpacing: '0.02em',
      opacity: flickerOpacity,
      perspective: '1000px',
      transformStyle: 'preserve-3d' as const,
    }

    switch (glitchStage) {
      case 1: // Initial flicker
        return {
          ...baseStyle,
          filter: 'brightness(1.5) contrast(1.2)',
          transform: 'scaleY(1.02)',
        }
      case 2: // Horizontal lines distortion
        return {
          ...baseStyle,
          filter: 'brightness(0.8) contrast(1.5) saturate(0)',
          transform: 'scaleX(0.98) scaleY(1.05) translateX(10px)',
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 48%, 0 52%, 100% 55%, 100% 100%, 0 100%)',
        }
      case 3: // Chromatic aberration
        return {
          ...baseStyle,
          filter: 'brightness(1.2) hue-rotate(10deg)',
          transform: 'scale(1.08) translateZ(50px)',
          textShadow: '2px 0 red, -2px 0 cyan',
        }
      case 4: // Heavy distortion
        return {
          ...baseStyle,
          opacity: 0.7,
          filter: 'brightness(0.5) contrast(2) saturate(0)',
          transform: 'scaleY(0.1) translateY(-40%)',
        }
      case 5: // Final collapse (TV shutoff line)
        return {
          ...baseStyle,
          opacity: 0.3,
          filter: 'brightness(2) contrast(3)',
          transform: 'scaleY(0.01) scaleX(0.8)',
        }
      default:
        return baseStyle
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black font-mono overflow-hidden z-[100]"
      style={{
        ...getGlitchStyle(),
        transition: glitchStage > 0
          ? 'all 0.15s cubic-bezier(0.87, 0, 0.13, 1)'
          : fadeOut
          ? 'opacity 0.3s ease-out'
          : 'none',
      }}
    >
      {/* Matrix Rain Background - Way more visible */}
      <canvas ref={matrixCanvasRef} className="absolute inset-0 pointer-events-none opacity-60" />

      {/* Galaxy Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-15" />

      {/* Blurred depth layer - background code */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ filter: 'blur(3px)' }}>
        <div className="absolute top-10 left-10 text-[#4FC3F7] text-xs">
          import &#123; useState, useEffect &#125; from 'react'
        </div>
        <div className="absolute top-32 right-20 text-[#C792EA] text-xs">
          const systems = await initialize()
        </div>
        <div className="absolute bottom-40 left-1/4 text-[#569CD6] text-xs">
          function* loadConsciousness() &#123;
        </div>
        <div className="absolute top-1/2 right-1/3 text-[#4EC9B0] text-xs">
          interface NeuralNetwork &#123;
        </div>
      </div>

      {/* Enhanced Gradient Overlay with vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' /%3E%3C/svg%3E")',
        }}
      />

      {/* Scanlines effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 200, 0.05) 2px, rgba(0, 255, 200, 0.05) 4px)',
        }}
      />

      {/* Glitch Effect Overlay - Enhanced */}
      <div className="absolute inset-0 pointer-events-none">
        {hackingPhase > 2 && (
          <div className="w-full h-full bg-gradient-to-r from-transparent via-red-500/3 to-transparent animate-pulse" />
        )}
      </div>

      {/* TV Glitch Noise Effect during shutdown */}
      {glitchStage >= 2 && glitchStage <= 4 && (
        <div
          className="absolute inset-0 pointer-events-none animate-pulse"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'2.5\' numOctaves=\'6\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.8\'/%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
            opacity: glitchStage === 3 ? 0.4 : 0.25,
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {/* Broken Screen Effect - Cracked glass overlay */}
      {brokenScreenActive && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {/* Radial crack pattern */}
          <svg className="w-full h-full" style={{ mixBlendMode: 'overlay' }}>
            <defs>
              <filter id="crackFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" />
                <feDisplacementMap in="SourceGraphic" scale="30" />
              </filter>
            </defs>
            {/* Multiple crack lines radiating from center */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 360) / 12
              const length = 30 + Math.random() * 50
              return (
                <line
                  key={i}
                  x1="50%"
                  y1="50%"
                  x2={`${50 + Math.cos((angle * Math.PI) / 180) * length}%`}
                  y2={`${50 + Math.sin((angle * Math.PI) / 180) * length}%`}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth={2 + Math.random() * 3}
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(255, 0, 0, 0.5))',
                    animation: `crack-${i} 0.3s ease-out`
                  }}
                />
              )
            })}
            {/* Secondary cracks */}
            {[...Array(20)].map((_, i) => {
              const x1 = Math.random() * 100
              const y1 = Math.random() * 100
              const x2 = x1 + (Math.random() - 0.5) * 20
              const y2 = y1 + (Math.random() - 0.5) * 20
              return (
                <line
                  key={`s-${i}`}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth={1}
                  style={{
                    filter: 'drop-shadow(0 0 4px rgba(255, 0, 0, 0.3))'
                  }}
                />
              )
            })}
          </svg>
          {/* Shattered glass pieces effect */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(255, 0, 0, 0.1) 30%, transparent 60%)',
              animation: 'shatter-pulse 0.5s ease-in-out infinite'
            }}
          />
          {/* Pixelated distortion overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255, 0, 0, 0.1) 4px, rgba(255, 0, 0, 0.1) 8px), repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255, 0, 0, 0.1) 4px, rgba(255, 0, 0, 0.1) 8px)',
              opacity: 0.3,
              animation: 'glitch-scan 0.2s linear infinite'
            }}
          />
        </div>
      )}

      {/* BREACH DETECTED Popup */}
      {showBreachPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
          <div
            className="relative"
            style={{
              animation: 'breach-zoom 0.3s ease-out, breach-shake 0.5s ease-in-out infinite'
            }}
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(244, 71, 71, 0.6) 0%, transparent 70%)',
                transform: 'scale(1.5)'
              }}
            />
            {/* Main popup box */}
            <div
              className="relative px-12 py-8 border-4 rounded-lg"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                borderColor: '#F44747',
                boxShadow: '0 0 40px rgba(244, 71, 71, 0.8), inset 0 0 20px rgba(244, 71, 71, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {/* Warning icon */}
              <div className="flex items-center justify-center mb-4">
                <Shield
                  className="w-16 h-16 animate-pulse"
                  style={{
                    color: '#F44747',
                    filter: 'drop-shadow(0 0 10px rgba(244, 71, 71, 0.8))'
                  }}
                />
              </div>
              {/* Text */}
              <h2
                className="text-5xl font-bold text-center animate-pulse"
                style={{
                  color: '#F44747',
                  textShadow: '0 0 20px rgba(244, 71, 71, 0.8), 0 0 40px rgba(244, 71, 71, 0.5)',
                  letterSpacing: '0.1em',
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                ⚠ BREACH DETECTED ⚠
              </h2>
              <p
                className="text-center mt-4 text-lg"
                style={{
                  color: '#FFCC00',
                  textShadow: '0 0 10px rgba(255, 204, 0, 0.5)'
                }}
              >
                UNAUTHORIZED ACCESS ATTEMPT
              </p>
              {/* Scan lines */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(244, 71, 71, 0.1) 2px, rgba(244, 71, 71, 0.1) 4px)',
                  animation: 'scan-lines 2s linear infinite'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Loading Content */}
      <div className="relative z-10 max-w-7xl w-full p-6" style={{
        transformStyle: 'preserve-3d',
        perspective: '1200px'
      }}>
        {/* Header - Enhanced colors and glow */}
        <div className="flex items-center justify-between mb-4" style={{
          transform: 'translateZ(40px)',
          transformStyle: 'preserve-3d'
        }}>
          <div className="flex items-center">
            <Terminal className="w-6 h-6 mr-3 animate-pulse" style={{ color: '#4FC3F7', filter: 'drop-shadow(0 0 2px rgba(79, 195, 247, 0.5))' }} />
            <h1 className="text-xl font-bold glitch-text" style={{
              color: '#4FC3F7',
              textShadow: '0 0 8px rgba(79, 195, 247, 0.3)',
              lineHeight: '1.5'
            }}>
              [SYSTEM] Initializing Shivanshi Brain Terminal v2.1.337
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400" style={{ opacity: 0.85 }}>
              {hackingPhase > 1 && <span className="animate-pulse" style={{ color: '#F44747', textShadow: '0 0 6px rgba(244, 71, 71, 0.4)' }}>[BREACH DETECTED]</span>}
              {hackingPhase > 2 && <span className="ml-2" style={{ color: '#FFCC00', textShadow: '0 0 6px rgba(255, 204, 0, 0.3)' }}>[ESCALATING]</span>}
              {hackingPhase > 3 && <span className="ml-2" style={{ color: '#4EC9B0', textShadow: '0 0 6px rgba(78, 201, 176, 0.4)' }}>[ROOT ACCESS]</span>}
            </div>
          </div>
        </div>

        {/* System Status Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4" style={{
          transform: 'translateZ(30px)',
          transformStyle: 'preserve-3d'
        }}>
          {systemStatus.map((status, index) => (
            <div key={index} className="relative" style={{ transformStyle: 'preserve-3d' }}>
              {/* Double layer background - shadow layer */}
              <div
                className="absolute inset-0 rounded border border-green-400/10 bg-black/30"
                style={{
                  transform: 'translateZ(-8px) translateX(6px) translateY(6px)',
                  filter: 'blur(2px)',
                  opacity: 0.6
                }}
              />
              {/* Main box */}
              <div
                className="relative flex items-center justify-between space-x-2 bg-black/50 p-2 rounded border border-green-400/20"
                style={{
                  transform: `translateZ(${10 + index * 3}px)`,
                  transition: 'transform 0.3s ease-out',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5), 0 0 10px rgba(79, 195, 247, 0.1)'
                }}
              >
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${status.color === "text-green-400" ? "bg-green-400" : status.color === "text-yellow-400" ? "bg-yellow-400" : status.color === "text-red-400" ? "bg-red-400" : status.color === "text-cyan-400" ? "bg-cyan-400" : "bg-gray-400"}`}
                ></div>
                <status.icon className="w-3 h-3 text-green-400" />
                <span className="text-xs">{status.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${status.color === "text-green-400" ? "bg-green-400" : status.color === "text-yellow-400" ? "bg-yellow-400" : status.color === "text-red-400" ? "bg-red-400" : status.color === "text-cyan-400" ? "bg-cyan-400" : "bg-gray-400"}`}
                    style={{ width: `${status.progress || 0}%` }}
                  />
                </div>
                <span className={`text-xs font-bold ${status.color}`}>{status.status}</span>
              </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{
          transformStyle: 'preserve-3d'
        }}>
          {/* Left Column - Scrolling Commands */}
          <div className="space-y-4" style={{
            transform: 'translateZ(20px)',
            transformStyle: 'preserve-3d'
          }}>
            {/* Scrolling Commands - Enhanced */}
            <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
              {/* Double layer background */}
              <div
                className="absolute inset-0 rounded bg-black/30 border border-[#4FC3F7]/10"
                style={{
                  transform: 'translateZ(-10px) translateX(8px) translateY(8px)',
                  filter: 'blur(3px)',
                  opacity: 0.5
                }}
              />
              {/* Main box */}
              <div className="relative bg-black/70 rounded p-4 h-80 overflow-hidden" style={{
                border: '1px solid rgba(79, 195, 247, 0.2)',
                backdropFilter: 'blur(4px)',
                transform: 'translateZ(15px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(79, 195, 247, 0.1)',
                transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out'
              }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs" style={{ color: '#858585', opacity: 0.8, lineHeight: '1.6' }}>// Live Command Execution</span>
                <span className="text-xs" style={{ color: '#4FC3F7', textShadow: '0 0 4px rgba(79, 195, 247, 0.3)' }}>Lines: {currentLine}</span>
              </div>
              <div ref={commandsScrollRef} className="space-y-1 h-64 overflow-y-auto scrollbar-thin scrollbar-track-gray-800" style={{
                scrollbarColor: '#4FC3F7 #1a1a1a'
              }}>
                {commands.map((cmd, index) => (
                  <div key={cmd.id} className="flex items-start space-x-2 text-xs animate-fadeIn" style={{
                    opacity: 0.75 + (index % 3) * 0.08,
                    lineHeight: '1.7'
                  }}>
                    <span className="w-16 flex-shrink-0" style={{ color: '#555555' }}>[{cmd.line}]</span>
                    <span className="font-mono leading-relaxed" style={{
                      color: cmd.color,
                      textShadow: `0 0 4px ${cmd.color}40`
                    }}>{cmd.command}</span>
                    {Math.random() > 0.7 && <span className="ml-2" style={{ color: '#4EC9B0' }}>✓</span>}
                  </div>
                ))}
              </div>
              </div>
            </div>

            {/* System Processes - Enhanced */}
            <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
              <div
                className="absolute inset-0 rounded bg-black/30 border border-[#4FC3F7]/10"
                style={{
                  transform: 'translateZ(-8px) translateX(6px) translateY(6px)',
                  filter: 'blur(2px)',
                  opacity: 0.5
                }}
              />
              <div className="relative bg-black/70 rounded p-4" style={{
                border: '1px solid rgba(79, 195, 247, 0.2)',
                backdropFilter: 'blur(4px)',
                transform: 'translateZ(10px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4), 0 0 15px rgba(79, 195, 247, 0.08)',
                transition: 'transform 0.3s ease-out'
              }}>
              <div className="text-xs mb-2" style={{ color: '#858585', opacity: 0.8, lineHeight: '1.6' }}>// Active Processes</div>
              <div className="space-y-1">
                {[
                  { name: "consciousness.exe", cpu: "23.4%", mem: "1.2GB", status: "RUNNING" },
                  { name: "reality_engine", cpu: "45.7%", mem: "2.8GB", status: "ACTIVE" },
                  { name: "quantum_processor", cpu: "78.9%", mem: "4.1GB", status: "CRITICAL" },
                  { name: "neural_network", cpu: "12.3%", mem: "856MB", status: "IDLE" },
                ].map((process, index) => (
                  <div key={index} className="flex justify-between text-xs" style={{ lineHeight: '1.7', opacity: 0.9 }}>
                    <span style={{ color: '#4FC3F7', textShadow: '0 0 3px rgba(79, 195, 247, 0.2)' }}>{process.name}</span>
                    <span style={{ color: '#DCDCAA', textShadow: '0 0 3px rgba(220, 220, 170, 0.2)' }}>{process.cpu}</span>
                    <span style={{ color: '#4FC3F7', opacity: 0.8 }}>{process.mem}</span>
                    <span style={{
                      color: process.status === "CRITICAL" ? "#F44747" : process.status === "ACTIVE" ? "#4EC9B0" : "#858585",
                      textShadow: process.status === "CRITICAL" ? '0 0 4px rgba(244, 71, 71, 0.3)' : process.status === "ACTIVE" ? '0 0 4px rgba(78, 201, 176, 0.3)' : 'none'
                    }}>
                      {process.status}
                    </span>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>

          {/* Right Column - Loading Messages & Progress */}
          <div className="space-y-4" style={{
            transform: 'translateZ(25px)',
            transformStyle: 'preserve-3d'
          }}>
            {/* Loading Messages - Enhanced */}
            <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
              <div
                className="absolute inset-0 rounded bg-black/30 border border-[#4FC3F7]/10"
                style={{
                  transform: 'translateZ(-10px) translateX(8px) translateY(8px)',
                  filter: 'blur(3px)',
                  opacity: 0.5
                }}
              />
              <div className="relative bg-black/70 rounded p-4 h-64" style={{
                border: '1px solid rgba(79, 195, 247, 0.2)',
                backdropFilter: 'blur(4px)',
                transform: 'translateZ(18px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(79, 195, 247, 0.12)',
                transition: 'transform 0.3s ease-out'
              }}>
              <div className="text-xs mb-2" style={{ color: '#858585', opacity: 0.8, lineHeight: '1.6' }}>// System Initialization Log</div>
              <div className="space-y-1 h-48 overflow-y-auto">
                {loadingMessages.slice(-8).map((message, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-1" style={{
                    opacity: 0.7 + index * 0.04,
                    lineHeight: '1.7'
                  }}>
                    <span className="text-xs" style={{ color: '#555555' }}>[{String(89 + index).padStart(4, "0")}]</span>
                    <span className="text-xs" style={{ color: '#4EC9B0', textShadow: '0 0 4px rgba(78, 201, 176, 0.25)' }}>{message}</span>
                    <span className="text-xs" style={{ color: '#4FC3F7', opacity: 0.7 }}>✓</span>
                  </div>
                ))}
                {currentMessage && (
                  <div className="flex items-center space-x-2 mb-1" style={{ lineHeight: '1.7' }}>
                    <span className="text-xs" style={{ color: '#555555' }}>
                      [{String(89 + loadingMessages.length).padStart(4, "0")}]
                    </span>
                    <span className="text-xs" style={{ color: '#4FC3F7', textShadow: '0 0 6px rgba(79, 195, 247, 0.4)' }}>{currentMessage}</span>
                    {isTyping && <span className="animate-pulse" style={{ color: '#4FC3F7', textShadow: '0 0 8px rgba(79, 195, 247, 0.6)' }}>_</span>}
                  </div>
                )}
              </div>
              </div>
            </div>

            {/* Network Activity - Enhanced */}
            <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
              <div
                className="absolute inset-0 rounded bg-black/30 border border-[#4FC3F7]/10"
                style={{
                  transform: 'translateZ(-8px) translateX(6px) translateY(6px)',
                  filter: 'blur(2px)',
                  opacity: 0.5
                }}
              />
              <div className="relative bg-black/70 rounded p-4" style={{
                border: '1px solid rgba(79, 195, 247, 0.2)',
                backdropFilter: 'blur(4px)',
                transform: 'translateZ(12px)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4), 0 0 15px rgba(79, 195, 247, 0.08)',
                transition: 'transform 0.3s ease-out'
              }}>
              <div className="text-xs mb-2" style={{ color: '#858585', opacity: 0.8, lineHeight: '1.6' }}>// Network Activity</div>
              <div className="space-y-1">
                {[
                  { ip: "192.168.1.1", port: "22", status: "CONNECTED", protocol: "SSH" },
                  { ip: "10.0.0.1", port: "443", status: "ENCRYPTED", protocol: "HTTPS" },
                  { ip: "172.16.0.1", port: "8080", status: "LISTENING", protocol: "HTTP" },
                  { ip: "127.0.0.1", port: "4444", status: "BACKDOOR", protocol: "TCP" },
                ].map((conn, index) => (
                  <div key={index} className="flex justify-between text-xs" style={{ lineHeight: '1.7', opacity: 0.9 }}>
                    <span style={{ color: '#4FC3F7', textShadow: '0 0 3px rgba(79, 195, 247, 0.2)' }}>
                      {conn.ip}:{conn.port}
                    </span>
                    <span style={{ color: '#C792EA', opacity: 0.8 }}>{conn.protocol}</span>
                    <span
                      className={conn.status === "BACKDOOR" ? "animate-pulse" : ""}
                      style={{
                        color: conn.status === "BACKDOOR" ? "#F44747" : conn.status === "ENCRYPTED" ? "#DCDCAA" : "#4EC9B0",
                        textShadow: conn.status === "BACKDOOR" ? '0 0 5px rgba(244, 71, 71, 0.4)' : 'none'
                      }}
                    >
                      {conn.status}
                    </span>
                  </div>
                ))}
              </div>
              </div>
            </div>

            {/* Security Status - Enhanced */}
            <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
              <div
                className="absolute inset-0 rounded bg-black/30 border border-[#F44747]/10"
                style={{
                  transform: 'translateZ(-8px) translateX(6px) translateY(6px)',
                  filter: 'blur(2px)',
                  opacity: 0.5
                }}
              />
              <div className="relative bg-black/70 rounded p-4" style={{
                border: '1px solid rgba(244, 71, 71, 0.3)',
                backdropFilter: 'blur(4px)',
                transform: 'translateZ(14px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4), 0 0 20px rgba(244, 71, 71, 0.15)',
                transition: 'transform 0.3s ease-out'
              }}>
              <div className="text-xs mb-2 flex items-center" style={{
                color: '#F44747',
                textShadow: '0 0 4px rgba(244, 71, 71, 0.3)',
                lineHeight: '1.6'
              }}>
                <Shield className="w-3 h-3 mr-1" style={{ filter: 'drop-shadow(0 0 2px rgba(244, 71, 71, 0.4))' }} />
                // Security Alerts
              </div>
              <div className="space-y-1">
                {hackingPhase > 1 && (
                  <div className="text-xs animate-pulse" style={{
                    color: '#F44747',
                    textShadow: '0 0 6px rgba(244, 71, 71, 0.5)',
                    lineHeight: '1.7'
                  }}>⚠ Unauthorized access detected</div>
                )}
                {hackingPhase > 2 && (
                  <div className="text-xs animate-pulse" style={{
                    color: '#FFCC00',
                    textShadow: '0 0 6px rgba(255, 204, 0, 0.4)',
                    lineHeight: '1.7'
                  }}>⚠ Privilege escalation in progress</div>
                )}
                {hackingPhase > 3 && <div className="text-xs animate-pulse" style={{
                  color: '#4EC9B0',
                  textShadow: '0 0 6px rgba(78, 201, 176, 0.5)',
                  lineHeight: '1.7'
                }}>✓ Root access obtained</div>}
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Output - Enhanced */}
        <div className="mt-6 bg-black/70 rounded p-4" style={{
          border: '1px solid rgba(79, 195, 247, 0.2)',
          backdropFilter: 'blur(4px)',
          transform: 'translateZ(22px)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(79, 195, 247, 0.1)',
          transition: 'transform 0.3s ease-out'
        }}>
          <div className="space-y-2 mb-4">
            {loadingSteps.slice(0, currentStep).map((step, index) => (
              <div key={index} className="flex items-center text-sm" style={{
                opacity: 0.6 + index * 0.05,
                lineHeight: '1.8'
              }}>
                <Terminal className="w-3 h-3 mr-2 flex-shrink-0" style={{
                  color: '#4EC9B0',
                  filter: 'drop-shadow(0 0 2px rgba(78, 201, 176, 0.3))'
                }} />
                <span className="font-mono" style={{
                  color: '#4EC9B0',
                  textShadow: '0 0 4px rgba(78, 201, 176, 0.2)'
                }}>{step}</span>
                <span className="ml-2" style={{ color: '#4FC3F7', opacity: 0.7 }}>✓</span>
              </div>
            ))}
            {currentStep < loadingSteps.length && (
              <div className="flex items-center text-sm" style={{ lineHeight: '1.8' }}>
                <Terminal className="w-3 h-3 mr-2 flex-shrink-0 animate-pulse" style={{
                  color: '#4FC3F7',
                  filter: 'drop-shadow(0 0 3px rgba(79, 195, 247, 0.5))'
                }} />
                <span className="font-mono" style={{
                  color: '#4FC3F7',
                  textShadow: '0 0 6px rgba(79, 195, 247, 0.3)'
                }}>{displayText}</span>
                <span className="ml-2 w-2 h-4 animate-pulse" style={{
                  backgroundColor: '#4FC3F7',
                  boxShadow: '0 0 8px rgba(79, 195, 247, 0.6)'
                }}></span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section - Enhanced */}
        <div className="mt-6" style={{
          transform: 'translateZ(35px)',
          transformStyle: 'preserve-3d'
        }}>
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Terminal className="w-4 h-4" style={{
                color: '#4FC3F7',
                filter: 'drop-shadow(0 0 3px rgba(79, 195, 247, 0.4))'
              }} />
              <span style={{
                color: '#4FC3F7',
                textShadow: '0 0 6px rgba(79, 195, 247, 0.3)',
                lineHeight: '1.6'
              }}>$ INJECTING QUANTUM CODE SEQUENCES...</span>
              <span className="animate-pulse" style={{
                color: '#4FC3F7',
                textShadow: '0 0 8px rgba(79, 195, 247, 0.6)'
              }}>_</span>
            </div>
            <div className="text-sm flex justify-between" style={{
              color: '#858585',
              opacity: 0.8,
              lineHeight: '1.6'
            }}>
              <span>Loading: {Math.round(progress)}%</span>
              <span>ETA: {Math.max(0, Math.round((100 - progress) * 0.1))}s</span>
            </div>
          </div>

          {/* Progress Bar - Enhanced */}
          <div className="w-full h-3 rounded-full overflow-hidden mb-4" style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(79, 195, 247, 0.25)',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.5), 0 4px 15px rgba(0, 0, 0, 0.3)',
            transform: 'translateZ(8px)'
          }}>
            <div
              className="h-3 rounded-full transition-all duration-300 ease-out relative"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: 'linear-gradient(90deg, #4FC3F7 0%, #C792EA 50%, #4FC3F7 100%)',
                boxShadow: '0 0 12px rgba(79, 195, 247, 0.6), 0 0 20px rgba(79, 195, 247, 0.3)'
              }}
            >
              <div className="absolute inset-0 animate-pulse" style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.25) 50%, transparent 100%)'
              }}></div>
            </div>
          </div>

          {/* Final Status - Enhanced */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-6 py-3 rounded" style={{
              backgroundColor: 'rgba(79, 195, 247, 0.08)',
              border: '1px solid rgba(79, 195, 247, 0.25)',
              backdropFilter: 'blur(4px)',
              transform: 'translateZ(12px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4), 0 0 30px rgba(79, 195, 247, 0.15)',
              transition: 'transform 0.3s ease-out'
            }}>
              <div className="w-3 h-3 rounded-full animate-pulse" style={{
                backgroundColor: '#4FC3F7',
                boxShadow: '0 0 8px rgba(79, 195, 247, 0.8)'
              }}></div>
              <span className="font-bold text-lg" style={{
                color: '#4FC3F7',
                textShadow: '0 0 10px rgba(79, 195, 247, 0.4)',
                lineHeight: '1.5'
              }}>
                {progress < 25
                  ? "INITIALIZING QUANTUM SYSTEMS"
                  : progress < 50
                    ? "BYPASSING SECURITY PROTOCOLS"
                    : progress < 75
                      ? "ESTABLISHING NEURAL CONNECTIONS"
                      : progress < 100
                        ? "PREPARING DIMENSIONAL JOURNEY"
                        : "TRANSCENDENCE ACHIEVED"}
              </span>
              <div className="w-3 h-3 rounded-full animate-pulse" style={{
                backgroundColor: '#4FC3F7',
                boxShadow: '0 0 8px rgba(79, 195, 247, 0.8)'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Lines Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scan-lines opacity-20"></div>
      </div>

      {/* Glitch Effects */}
      {hackingPhase > 2 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-1 bg-red-400 opacity-50 animate-pulse" style={{ top: "20%" }} />
          <div className="w-full h-1 bg-cyan-400 opacity-50 animate-pulse" style={{ top: "60%" }} />
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes shatter-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes glitch-scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
        @keyframes breach-zoom {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes breach-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-1deg); }
          75% { transform: translateX(5px) rotate(1deg); }
        }
        @keyframes scan-lines {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); }
        }
      `}</style>
    </div>
  )
}
