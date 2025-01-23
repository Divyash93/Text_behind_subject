'use client';

import { useEffect, useState } from 'react';

export default function AnimatedBackground() {
  const [glowPositions, setGlowPositions] = useState([
    { x: 25, y: 25, angle: 0 },
    { x: 75, y: 75, angle: 120 },
    { x: 25, y: 75, angle: 240 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowPositions(prev => prev.map(glow => ({
        ...glow,
        angle: (glow.angle + 0.5) % 360,
        x: 25 + 50 * Math.cos(glow.angle * Math.PI / 180),
        y: 25 + 50 * Math.sin(glow.angle * Math.PI / 180)
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {glowPositions.map((glow, index) => (
        <div
          key={index}
          className="absolute w-[800px] h-[800px] rounded-full opacity-50 blur-3xl transition-all duration-500 ease-in-out"
          style={{
            left: `${glow.x}%`,
            top: `${glow.y}%`,
            transform: 'translate(-50%, -50%)',
            background: index === 0 
              ? 'radial-gradient(circle, rgba(2, 20, 33 ,0.3) 50%, rgba(50,200,50,0.1) 50%, transparent 80%)'
              : index === 1
              ? 'radial-gradient(circle, rgba(2, 20, 33 ,0.3 ) 50%, rgba(200,50,50,0.1) 90%, transparent 20%)'
              : 'radial-gradient(circle, rgba(2, 20, 33 ,0.3) 50%, rgba(50,200,50,0.1) 50%, transparent 50%)'
          }}
        />
      ))}
    </div>
  );
}
