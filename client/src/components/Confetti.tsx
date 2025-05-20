import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

const Confetti: React.FC<ConfettiProps> = ({ active, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(active);
  
  useEffect(() => {
    if (active) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [active, duration]);
  
  if (!isVisible) return null;
  
  const confettiCount = 150;
  const confettiElements = Array.from({ length: confettiCount }).map((_, i) => {
    const size = Math.random() * 10 + 5;
    const left = Math.random() * 100;
    const animationDuration = Math.random() * 2 + 3;
    const delay = Math.random() * 3;
    const color = getRandomColor();
    
    return (
      <div
        key={i}
        className="confetti-piece absolute"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          left: `${left}%`,
          top: '-20px',
          opacity: '1',
          transform: 'rotate(0deg)',
          animation: `fall ${animationDuration}s ease-in forwards, sway ${animationDuration * 0.5}s ease-in-out infinite alternate`,
          animationDelay: `${delay}s`,
          borderRadius: Math.random() > 0.5 ? '50%' : '0%',
        }}
      />
    );
  });
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiElements}
      
      <style>{`
        @keyframes fall {
          0% {
            top: -20px;
            transform: rotate(0deg);
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            top: 100vh;
            transform: rotate(${Math.random() * 360}deg);
            opacity: 0;
          }
        }
        
        @keyframes sway {
          0% {
            margin-left: -30px;
          }
          100% {
            margin-left: 30px;
          }
        }
      `}</style>
    </div>
  );
};

function getRandomColor() {
  const colors = [
    '#22c55e', // Green for success
    '#3b82f6', // Blue
    '#f97316', // Orange
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#facc15', // Yellow
    '#14b8a6', // Teal
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

export default Confetti;