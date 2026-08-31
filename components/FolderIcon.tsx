"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface FileItem {
  name: string
  content: string
  type: "document" | "code" | "image"
}

interface FolderIconProps {
  folderName: string
  folderColor?: string
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

export default function FolderIcon({
  folderName,
  folderColor = "#FFD700",
  fileColor = "#FFFFFF",
  backgroundColor = "#F5F5F5",
  textColor = "#FFFFFF",
  iconSize = 64,
  font = { fontFamily: "monospace", fontSize: "14px" },
  files,
  style,
}: FolderIconProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [filePositions, setFilePositions] = useState<Array<{ x: number; y: number; rotation: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const handleFolderClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isOpen) {
      // Generate random positions for files when opening
      const positions = files.map(() => ({
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        rotation: Math.random() * 30 - 15,
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
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(10px)",
        }}
        onClick={handleCloseViewer}
      >
        <div
          className="file-viewer"
          style={{
            backgroundColor: "#1e1e1e",
            border: "2px solid #4FC1FF",
            borderRadius: "8px",
            padding: "20px",
            maxWidth: "80vw",
            maxHeight: "80vh",
            overflow: "auto",
            boxShadow: "0 0 30px rgba(79, 193, 255, 0.5)",
            fontFamily: font.fontFamily,
            fontSize: font.fontSize,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              borderBottom: "1px solid #4FC1FF",
              paddingBottom: "8px",
            }}
          >
            <h3 style={{ color: "#4FC1FF", margin: 0, fontSize: "18px" }}>📄 {selectedFile.name}</h3>
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
              color: textColor,
              whiteSpace: "pre-wrap",
              lineHeight: "1.5",
              backgroundColor: "#0a0a0a",
              padding: "16px",
              borderRadius: "4px",
              border: "1px solid #333",
              fontFamily: "monospace",
              fontSize: "14px",
            }}
          >
            {selectedFile.content}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        ref={containerRef}
        className="folder-container"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          ...style,
        }}
        onClick={handleFolderClick}
      >
        {/* Folder Icon */}
        <div
          className="folder-icon"
          style={{
            width: iconSize,
            height: iconSize * 0.8,
            backgroundColor: folderColor,
            borderRadius: "4px 4px 0 0",
            position: "relative",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            transition: "all 0.3s ease",
            transform: isOpen ? "scale(1.1)" : "scale(1)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-8px",
              left: "0",
              width: iconSize * 0.4,
              height: "12px",
              backgroundColor: folderColor,
              borderRadius: "4px 4px 0 0",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: iconSize * 0.3,
              color: "#333",
            }}
          >
            📁
          </div>
        </div>

        {/* Folder Name */}
        <div
          style={{
            marginTop: "8px",
            color: textColor,
            fontSize: font.fontSize,
            fontFamily: font.fontFamily,
            textAlign: "center",
            maxWidth: iconSize + 20,
            wordWrap: "break-word",
            textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
          }}
        >
          {folderName}
        </div>

        {/* Files floating out */}
        {isOpen &&
          files.map((file, index) => (
            <div
              key={file.name}
              className="floating-file"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "40px",
                height: "50px",
                backgroundColor: fileColor,
                border: "2px solid #4FC1FF",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                boxShadow: "0 0 15px rgba(79, 193, 255, 0.7)",
                transition: "all 0.5s ease",
                transform: `translate(-50%, -50%) translate(${filePositions[index]?.x || 0}px, ${filePositions[index]?.y || 0}px) rotate(${filePositions[index]?.rotation || 0}deg)`,
                animation: `float-${index} 3s ease-in-out infinite`,
                zIndex: 10,
              }}
              onClick={(e) => handleFileClick(e, file)}
              title={file.name}
            >
              {file.type === "document" ? "📄" : file.type === "code" ? "💻" : "🖼️"}
              <style jsx>{`
                @keyframes float-${index} {
                  0%, 100% { transform: translate(-50%, -50%) translate(${filePositions[index]?.x || 0}px, ${filePositions[index]?.y || 0}px) rotate(${filePositions[index]?.rotation || 0}deg) translateY(0px); }
                  50% { transform: translate(-50%, -50%) translate(${filePositions[index]?.x || 0}px, ${filePositions[index]?.y || 0}px) rotate(${filePositions[index]?.rotation || 0}deg) translateY(-10px); }
                }
              `}</style>
            </div>
          ))}
      </div>

      {renderFileViewer()}
    </>
  )
}
