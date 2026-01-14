import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const SpiderSense: React.FC = () => {
  const { mode } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Calculate distance from center to determine "danger" intensity
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dist = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
      const maxDist = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
      
      // Invert: closer to edges/interactive areas could increase intensity
      // For this effect, let's make it pulse based on movement speed or general proximity
      setIntensity(1 - (dist / maxDist));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (mode === 'symbiote') return null; // Venom doesn't trigger spider-sense the same way

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div 
        className="absolute transition-transform duration-75 ease-out opacity-20"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <svg width="600" height="600" viewBox="0 0 600 600">
          {[1, 2, 3].map((ring) => (
            <circle
              key={ring}
              cx="300"
              cy="300"
              r={50 * ring}
              fill="none"
              stroke="#D7263D"
              strokeWidth="2"
              className="animate-ping"
              style={{
                animationDuration: `${2 / intensity}s`,
                opacity: intensity * 0.5
              }}
            />
          ))}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
             <line 
                key={angle}
                x1="300" y1="300" 
                x2={300 + 300 * Math.cos(angle * Math.PI / 180)} 
                y2={300 + 300 * Math.sin(angle * Math.PI / 180)}
                stroke="#D7263D"
                strokeWidth="1"
                opacity="0.3"
             />
          ))}
        </svg>
      </div>
    </div>
  );
};