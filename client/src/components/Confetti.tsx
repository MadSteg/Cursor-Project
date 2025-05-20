import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  duration?: number;
}

const Confetti: React.FC<ConfettiProps> = ({ duration = 5000 }) => {
  const [particles, setParticles] = useState<React.ReactNode[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Create confetti pieces
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
    const pieces: React.ReactNode[] = [];
    
    for (let i = 0; i < 100; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 1 + 0.5; // Between 0.5 and 1.5rem
      const left = Math.random() * 100; // 0-100%
      const animationDuration = (Math.random() * 3) + 2; // 2-5s
      const delay = Math.random() * 0.5; // 0-0.5s
      
      pieces.push(
        <div
          key={i}
          className="confetti-piece"
          style={{
            position: 'absolute',
            width: `${size}rem`,
            height: `${size}rem`,
            backgroundColor: color,
            top: '-1rem',
            left: `${left}%`,
            opacity: Math.random() * 0.7 + 0.3,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `fall ${animationDuration}s linear ${delay}s forwards, sway ${animationDuration/2}s ease-in-out ${delay}s infinite alternate`
          }}
        />
      );
    }
    
    setParticles(pieces);
    
    // Hide after specified duration
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles}
      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(0) rotate(0); }
            100% { transform: translateY(100vh) rotate(360deg); }
          }
          
          @keyframes sway {
            0% { transform: translateX(-5px); }
            100% { transform: translateX(5px); }
          }
        `}
      </style>
    </div>
  );
};

export default Confetti;