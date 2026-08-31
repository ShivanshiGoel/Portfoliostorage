"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface FileItem {
  name: string
  content: string
  type: "document" | "code" | "image"
}

interface TrashFolderProps {
  folderName: string
  trashCanColor?: string
  fileColor?: string
  backgroundColor?: string
  textColor?: string
  iconSize?: number
  font?: {
    fontFamily?: string
    fontSize?: string
  }
  files: FileItem[]
  style?: React.CSSProperties
}

export default function TrashFolder({
  folderName,
  trashCanColor = "#666666",
  fileColor = "#FFFFFF",
  backgroundColor = "#F5F5F5",
  textColor = "#FFFFFF",
  iconSize = 64,
  font = { fontFamily: "monospace", fontSize: "14px" },
  files,
  style,
}: TrashFolderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [filePositions, setFilePositions] = useState<Array<{ x: number; y: number; rotation: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTrashClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isOpen) {
      // Generate random positions for corrupted files
      const positions = files.map(() => ({
        x: Math.random() * 250 - 125,
        y: Math.random() * 250 - 125,
        rotation: Math.random() * 60 - 30,
      }))
      setFilePositions(positions)
    }
    setIsOpen(!isOpen)
    setSelectedFile(null)
  }

  const handleFileClick = (e: React.MouseEvent, file: FileItem) => {
    e.stopPropagation()
    setSelectedFile(file)
  }

  const handleCloseViewer = () => {
    setSelectedFile(null)
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false)
      setSelectedFile(null)
    }
  }

  useEffect(() => {
    if (isOpen || selectedFile) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, selectedFile])

  const renderFileViewer = () => {
    if (!selectedFile) return null

    return (
      <div
        className="file-viewer-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.95)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(10px)",
        }}
        onClick={handleCloseViewer}
      >
        <div
          className="terminal-viewer"
          style={{
            backgroundColor: "#000000",
            border: "2px solid #ff4444",
            borderRadius: "8px",
            padding: "20px",
            maxWidth: "80vw",
            maxHeight: "80vh",
            overflow: "auto",
            boxShadow: "0 0 30px rgba(255, 68, 68, 0.5)",
            fontFamily: "monospace",
            fontSize: "14px",
            color: "#00ff00",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              borderBottom: "1px solid #ff4444",
              paddingBottom: "8px",
            }}
          >
            <h3 style={{ color: "#ff4444", margin: 0, fontSize: "18px" }}>🗑️ CORRUPTED: {selectedFile.name}</h3>
            <button
              onClick={handleCloseViewer}
              style={{
                background: "none",
                border: "none",
                color: "#ff4444",
                fontSize: "20px",
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              ✕
            </button>
          </div>
          <div
            style={{
              color: "#00ff00",
              whiteSpace: "pre-wrap",
              lineHeight: "1.4",
              backgroundColor: "#111111",
              padding: "16px",
              borderRadius: "4px",
              border: "1px solid #333",
              fontFamily: "monospace",
              fontSize: "12px",
              textShadow: "0 0 5px #00ff00",
            }}
          >
            <div style={{ color: "#ff4444", marginBottom: "8px" }}>$ cat {selectedFile.name}</div>
            {selectedFile.content}
            <div style={{ color: "#666", marginTop: "16px", fontSize: "10px" }}>
              [WARNING: File recovered from digital purgatory - contents may be unstable]
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        ref={containerRef}
        className="trash-container"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          ...style,
        }}
        onClick={handleTrashClick}
      >
        {/* Trash Can Icon */}
        <div
          className="trash-icon"
          style={{
            width: iconSize,
            height: iconSize,
            backgroundColor: trashCanColor,
            borderRadius: "8px",
            position: "relative",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
            transition: "all 0.3s ease",
            transform: isOpen ? "scale(1.1) rotate(5deg)" : "scale(1)",
            border: "2px solid #444",
          }}
        >
          {/* Trash can lid */}
          <div
            style={{
              position: "absolute",
              top: "-6px",
              left: "-4px",
              width: iconSize + 8,
              height: "8px",
              backgroundColor: trashCanColor,
              borderRadius: "4px",
              border: "1px solid #444",
            }}
          />
          {/* Trash can handle */}
          <div
            style={{
              position: "absolute",
              top: "-12px",
              left: "50%",
              transform: "translateX(-50%)",
              width: iconSize * 0.3,
              height: "6px",
              border: "2px solid #444",
              borderRadius: "3px",
              backgroundColor: "transparent",
            }}
          />
          {/* Trash icon */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: iconSize * 0.4,
              color: "#ff4444",
              textShadow: "0 0 10px #ff4444",
            }}
          >
            🗑️
          </div>
        </div>

        {/* Folder Name */}
        <div
          style={{
            marginTop: "12px",
            color: textColor,
            fontSize: font.fontSize,
            fontFamily: font.fontFamily,
            textAlign: "center",
            maxWidth: iconSize + 20,
            wordWrap: "break-word",
            textShadow: "0 0 10px rgba(255, 68, 68, 0.5)",
          }}
        >
          {folderName}
        </div>

        {/* Corrupted files floating out */}
        {isOpen &&
          files.map((file, index) => (
            <div
              key={file.name}
              className="corrupted-file"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "45px",
                height: "55px",
                backgroundColor: "#1a1a1a",
                border: "2px solid #ff4444",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                boxShadow: "0 0 20px rgba(255, 68, 68, 0.8)",
                transition: "all 0.6s ease",
                transform: `translate(-50%, -50%) translate(${filePositions[index]?.x || 0}px, ${filePositions[index]?.y || 0}px) rotate(${filePositions[index]?.rotation || 0}deg)`,
                animation: `corrupt-float-${index} 4s ease-in-out infinite, glitch-${index} 2s ease-in-out infinite`,
                zIndex: 10,
                filter: "hue-rotate(180deg) saturate(1.5)",
              }}
              onClick={(e) => handleFileClick(e, file)}
              title={`CORRUPTED: ${file.name}`}
            >
              {file.type === "document" ? "💀" : file.type === "code" ? "⚠️" : "🔥"}
              <style jsx>{`
                @keyframes corrupt-float-${index} {
                  0%, 100% { 
                    transform: translate(-50%, -50%) translate(${filePositions[index]?.x || 0}px, ${filePositions[index]?.y || 0}px) rotate(${filePositions[index]?.rotation || 0}deg) translateY(0px); 
                  }
                  50% { 
                    transform: translate(-50%, -50%) translate(${filePositions[index]?.x || 0}px, ${filePositions[index]?.y || 0}px) rotate(${filePositions[index]?.rotation || 0}deg) translateY(-15px); 
                  }
                }
                @keyframes glitch-${index} {
                  0%, 100% { filter: hue-rotate(180deg) saturate(1.5); }
                  25% { filter: hue-rotate(200deg) saturate(2) brightness(1.2); }
                  50% { filter: hue-rotate(160deg) saturate(1.8) contrast(1.3); }
                  75% { filter: hue-rotate(220deg) saturate(1.2) brightness(0.8); }
                }
              `}</style>
            </div>
          ))}
      </div>

      {renderFileViewer()}
    </>
  )
}
