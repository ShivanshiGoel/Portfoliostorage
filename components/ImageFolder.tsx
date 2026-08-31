"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface ImageItem {
  src: string
  alt: string
  title: string
}

interface ImageFolderProps {
  folderName: string
  folderColor?: string
  backgroundColor?: string
  textColor?: string
  iconSize?: number
  font?: {
    fontFamily?: string
    fontSize?: string
  }
  images: ImageItem[]
  style?: React.CSSProperties
}

export default function ImageFolder({
  folderName,
  folderColor = "#8B5CF6",
  backgroundColor = "#F5F5F5",
  textColor = "#FFFFFF",
  iconSize = 64,
  font = { fontFamily: "monospace", fontSize: "14px" },
  images,
  style,
}: ImageFolderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [imagePositions, setImagePositions] = useState<Array<{ x: number; y: number; rotation: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const handleFolderClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isOpen) {
      // Generate random positions for image thumbnails
      const positions = images.map(() => ({
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        rotation: Math.random() * 20 - 10,
      }))
      setImagePositions(positions)
    }
    setIsOpen(!isOpen)
    setSelectedImageIndex(null)
  }

  const handleImageClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    setSelectedImageIndex(index)
  }

  const handleCloseViewer = () => {
    setSelectedImageIndex(null)
  }

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setSelectedImageIndex((prev) => {
      if (prev === null) return null
      return (prev - 1 + images.length) % images.length
    })
  }

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setSelectedImageIndex((prev) => {
      if (prev === null) return null
      return (prev + 1) % images.length
    })
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSelectedImageIndex(null)
      }
    }

    if (isOpen || selectedImageIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, selectedImageIndex])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedImageIndex !== null) {
        if (e.key === "ArrowLeft") {
          setSelectedImageIndex((prev) => prev !== null ? (prev - 1 + images.length) % images.length : null)
        }
        if (e.key === "ArrowRight") {
          setSelectedImageIndex((prev) => prev !== null ? (prev + 1) % images.length : null)
        }
        if (e.key === "Escape") {
          setSelectedImageIndex(null)
        }
      }
    }

    if (selectedImageIndex !== null) {
      document.addEventListener("keydown", handleKeyPress)
      return () => document.removeEventListener("keydown", handleKeyPress)
    }
  }, [selectedImageIndex, images.length])

  // Lock body scroll when viewer is open
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "auto"
      }
    }
  }, [selectedImageIndex])

  const renderImageViewer = () => {
    if (selectedImageIndex === null) return null

    const currentImage = images[selectedImageIndex]

    return (
      <div
        className="image-viewer-overlay"
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
          className="image-viewer"
          style={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleCloseViewer}
            style={{
              position: "absolute",
              top: "-40px",
              right: "0",
              background: "none",
              border: "none",
              color: "#ffffff",
              fontSize: "24px",
              cursor: "pointer",
              padding: "8px",
              zIndex: 1001,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ff4444"
              e.currentTarget.style.transform = "scale(1.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#ffffff"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            ✕
          </button>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => handlePrevImage(e)}
                style={{
                  position: "absolute",
                  left: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(139, 92, 246, 0.9)",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "32px",
                  cursor: "pointer",
                  padding: "16px 20px",
                  borderRadius: "50%",
                  zIndex: 1001,
                  transition: "all 0.2s ease",
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139, 92, 246, 1)"
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.15)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(139, 92, 246, 0.9)"
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)"
                }}
              >
                ←
              </button>
              <button
                onClick={(e) => handleNextImage(e)}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(139, 92, 246, 0.9)",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "32px",
                  cursor: "pointer",
                  padding: "16px 20px",
                  borderRadius: "50%",
                  zIndex: 1001,
                  transition: "all 0.2s ease",
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139, 92, 246, 1)"
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.15)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(139, 92, 246, 0.9)"
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)"
                }}
              >
                →
              </button>
            </>
          )}

          {/* Main image */}
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              border: "3px solid #8B5CF6",
              borderRadius: "8px",
              boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)",
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=400&width=600&text=Image+Not+Found"
            }}
          />

          {/* Image info */}
          <div
            style={{
              marginTop: "16px",
              textAlign: "center",
              color: "#ffffff",
              fontFamily: font.fontFamily,
              fontSize: font.fontSize,
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", color: "#8B5CF6" }}>{currentImage.title}</h3>
            <p style={{ margin: 0, opacity: 0.8 }}>
              {selectedImageIndex + 1} of {images.length}
            </p>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "16px",
                padding: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "8px",
                maxWidth: "100%",
                overflowX: "auto",
              }}
            >
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.src}
                  alt={image.alt}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    cursor: "pointer",
                    border: index === selectedImageIndex ? "2px solid #8B5CF6" : "2px solid transparent",
                    opacity: index === selectedImageIndex ? 1 : 0.6,
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => setSelectedImageIndex(index)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=60&width=60&text=?"
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        ref={containerRef}
        className="image-folder-container"
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
            border: "2px solid rgba(139, 92, 246, 0.5)",
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
              color: "#ffffff",
              textShadow: "0 0 10px rgba(139, 92, 246, 0.8)",
            }}
          >
            🖼️
          </div>
          {/* Image count badge */}
          <div
            style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              backgroundColor: "#8B5CF6",
              color: "#ffffff",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "bold",
              border: "2px solid #ffffff",
              boxShadow: "0 2px 8px rgba(139, 92, 246, 0.6)",
            }}
          >
            {images.length}
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
            textShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
          }}
        >
          {folderName}
        </div>

        {/* Image thumbnails floating out */}
        {isOpen &&
          images.map((image, index) => (
            <div
              key={index}
              className="floating-thumbnail"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "50px",
                height: "50px",
                cursor: "pointer",
                border: "2px solid #8B5CF6",
                borderRadius: "4px",
                overflow: "hidden",
                boxShadow: "0 0 15px rgba(139, 92, 246, 0.7)",
                transition: "all 0.5s ease",
                transform: `translate(-50%, -50%) translate(${imagePositions[index]?.x || 0}px, ${imagePositions[index]?.y || 0}px) rotate(${imagePositions[index]?.rotation || 0}deg)`,
                animation: `image-float-${index} 3s ease-in-out infinite`,
                zIndex: 10,
              }}
              onClick={(e) => handleImageClick(e, index)}
              title={image.title}
            >
              <img
                src={image.src}
                alt={image.alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=50&width=50&text=?"
                }}
              />
              <style jsx>{`
                @keyframes image-float-${index} {
                  0%, 100% { 
                    transform: translate(-50%, -50%) translate(${imagePositions[index]?.x || 0}px, ${imagePositions[index]?.y || 0}px) rotate(${imagePositions[index]?.rotation || 0}deg) translateY(0px); 
                  }
                  50% { 
                    transform: translate(-50%, -50%) translate(${imagePositions[index]?.x || 0}px, ${imagePositions[index]?.y || 0}px) rotate(${imagePositions[index]?.rotation || 0}deg) translateY(-12px); 
                  }
                }
              `}</style>
            </div>
          ))}
      </div>

      {renderImageViewer()}
    </>
  )
}
