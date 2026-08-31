import { useState } from 'react';
import './CircularGallery.css';

interface CircularGalleryProps {
  items?: { image: string; text: string }[];
}

export default function CircularGallery({ items }: CircularGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const certificates = items || [];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? certificates.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === certificates.length - 1 ? 0 : prev + 1));
  };

  if (certificates.length === 0) return null;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Certificate Image */}
      <div style={{
        width: '80%',
        maxWidth: '800px',
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px'
      }}>
        <img
          src={certificates[currentIndex].image}
          alt={certificates[currentIndex].text}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(79, 193, 255, 0.3)'
          }}
        />
        <div style={{
          color: '#4FC1FF',
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {certificates[currentIndex].text}
        </div>
      </div>

      {/* Previous Button */}
      <button
        onClick={handlePrev}
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(79, 193, 255, 0.2)',
          border: '2px solid rgba(79, 193, 255, 0.6)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          color: '#4FC1FF',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(79, 193, 255, 0.4)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(79, 193, 255, 0.2)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        ←
      </button>

      {/* Next Button */}
      <button
        onClick={handleNext}
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(79, 193, 255, 0.2)',
          border: '2px solid rgba(79, 193, 255, 0.6)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          color: '#4FC1FF',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(79, 193, 255, 0.4)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(79, 193, 255, 0.2)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        →
      </button>

      {/* Dots Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 10
      }}>
        {certificates.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              border: 'none',
              background: index === currentIndex ? '#4FC1FF' : 'rgba(79, 193, 255, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
}
