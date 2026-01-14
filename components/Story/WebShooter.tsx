import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, RefreshCw, Target, Trophy } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const WebShooter: React.FC = () => {
  const { mode, config } = useTheme();
  const [targets, setTargets] = useState([
    { id: 1, x: 20, y: 30, hit: false },
    { id: 2, x: 70, y: 60, hit: false },
    { id: 3, x: 40, y: 80, hit: false },
    { id: 4, x: 85, y: 25, hit: false },
  ]);
  const [score, setScore] = useState(0);

  const handleShoot = (id: number) => {
    setTargets(prev => prev.map(t => t.id === id ? { ...t, hit: true } : t));
    setScore(s => s + 100);
  };

  const resetGame = () => {
    setTargets(targets.map(t => ({ ...t, hit: false })));
    setScore(0);
  };

  const allHit = targets.every(t => t.hit);

  return (
    <div className="relative w-full h-[500px] flex flex-col overflow-hidden rounded-sm bg-black select-none">
      
      {/* Mask Vignette */}
      <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.8)_100%)]" />
      
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-30" />

      {/* HUD */}
      <div className="absolute top-4 left-4 z-30 flex items-start gap-4">
        <div 
          className="border px-3 py-1 text-xs tracking-widest backdrop-blur-sm"
          style={{ 
            backgroundColor: `${config.colors.primary}20`,
            borderColor: config.colors.primary,
            color: config.colors.primary
          }}
        >
          OBJ: NEUTRALIZE
        </div>
        <div 
          className="border px-3 py-1 text-xs tracking-widest backdrop-blur-sm"
          style={{ 
            backgroundColor: `${config.colors.secondary}20`,
            borderColor: config.colors.secondary,
            color: config.colors.secondary
          }}
        >
          WEB_FLUID: 98%
        </div>
      </div>

      <div className="absolute top-4 right-4 z-30">
        <div 
          className="border px-4 py-2 backdrop-blur-sm"
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderColor: config.colors.accent
          }}
        >
          <div className="font-title text-2xl" style={{ color: config.colors.accent }}>{score}</div>
          <div className="text-white/60 text-xs font-tech">SCORE</div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-30">
        <button 
          onClick={resetGame} 
          className="flex items-center gap-2 text-white/70 hover:text-white font-tech text-xs hover:bg-white/10 px-3 py-1 rounded border border-transparent hover:border-white/50 transition-all"
        >
          <RefreshCw size={14} /> REBOOT_SYSTEM
        </button>
      </div>

      {/* Game World */}
      <div className="relative flex-1 cursor-crosshair group">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 grayscale-[50%] contrast-125"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80)'
          }}
        />
        
        {/* Grid */}
        <div 
          className="absolute inset-0 bg-[size:50px_50px] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${config.colors.primary}10 1px, transparent 1px), linear-gradient(90deg, ${config.colors.primary}10 1px, transparent 1px)`
          }}
        />

        {/* Center Reticle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          <Crosshair size={40} className="text-white/50 opacity-50" />
        </div>

        {/* Targets */}
        {targets.map((target) => (
          <motion.button
            key={target.id}
            className="absolute z-10 focus:outline-none"
            style={{ left: `${target.x}%`, top: `${target.y}%` }}
            onClick={() => handleShoot(target.id)}
            disabled={target.hit}
            initial={{ scale: 0 }}
            animate={{ 
              scale: target.hit ? 0 : 1,
              x: [0, 10, -10, 0],
              y: [0, -10, 10, 0]
            }}
            transition={{ 
              scale: { duration: 0.2 },
              x: { repeat: Infinity, duration: 3 + target.id, ease: "easeInOut" },
              y: { repeat: Infinity, duration: 4 + target.id, ease: "easeInOut" }
            }}
            whileHover={{ scale: 1.1 }}
          >
            <div className="relative group">
              <Target 
                size={48} 
                style={{ 
                  color: config.colors.primary,
                  filter: `drop-shadow(0 0 10px ${config.colors.glow})`
                }}
              />
              
              {/* Targeting Rings */}
              <div 
                className="absolute inset-0 -m-4 rounded-full animate-ping opacity-30"
                style={{ border: `1px solid ${config.colors.primary}` }}
              />
              <div 
                className="absolute inset-0 -m-8 rounded-full animate-pulse opacity-10"
                style={{ border: `1px solid ${config.colors.primary}` }}
              />
            </div>
          </motion.button>
        ))}

        {/* Web Lines */}
        <svg className="absolute inset-0 pointer-events-none z-10">
          {targets.map(t => t.hit && (
            <motion.line
              key={`line-${t.id}`}
              x1="50%" y1="100%"
              x2={`${t.x}%`} y2={`${t.y}%`}
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 1 }}
              animate={{ pathLength: 1, opacity: [1, 0.5, 0] }}
              transition={{ duration: 0.2, opacity: { delay: 0.5, duration: 1 } }}
            />
          ))}
        </svg>

        {/* Victory */}
        <AnimatePresence>
          {allHit && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center z-40 bg-black/80 backdrop-blur-sm"
            >
              <div 
                className="text-center p-8 border-y-2 bg-black/50 w-full"
                style={{ borderColor: config.colors.secondary }}
              >
                <Trophy size={48} className="mx-auto mb-4" style={{ color: config.colors.accent }} />
                <h2 
                  className="font-title text-4xl md:text-5xl italic mb-2 tracking-wider"
                  style={{ color: config.colors.secondary }}
                >
                  THREAT ELIMINATED
                </h2>
                <p className="font-tech text-white text-sm tracking-[0.3em]">AREA SECURE // RESUME PATROL</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
