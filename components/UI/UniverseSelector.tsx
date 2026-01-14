import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Globe, ChevronDown, Zap } from 'lucide-react';
import { SuitMode } from '../../types';

const UNIVERSE_DATA: Record<SuitMode, { name: string; icon: string; color: string; bgColor: string }> = {
  peter: { name: 'Peter Parker', icon: '🕷️', color: '#E62429', bgColor: 'bg-spidey-red' },
  miles: { name: 'Miles Morales', icon: '⚡', color: '#FF4D6D', bgColor: 'bg-miles-pink' },
  gwen: { name: 'Spider-Gwen', icon: '🎸', color: '#FF69B4', bgColor: 'bg-gwen-pink' },
  noir: { name: 'Spider-Noir', icon: '🔫', color: '#D4AF37', bgColor: 'bg-noir-gold' },
  peni: { name: 'Peni Parker', icon: '🤖', color: '#00D4FF', bgColor: 'bg-peni-cyan' },
};

export const UniverseSelector: React.FC = () => {
  const { mode, setMode, config, allModes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const currentUniverse = UNIVERSE_DATA[mode];

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Main Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-3 px-4 py-2 rounded-lg backdrop-blur-md border-2 transition-all duration-300"
        style={{ 
          borderColor: currentUniverse.color,
          backgroundColor: `${currentUniverse.color}20`,
          boxShadow: `0 0 20px ${currentUniverse.color}40`
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Portal Animation */}
        <motion.div 
          className="absolute inset-0 rounded-lg opacity-30"
          animate={{ 
            background: [
              `radial-gradient(circle at 0% 0%, ${currentUniverse.color}, transparent)`,
              `radial-gradient(circle at 100% 100%, ${currentUniverse.color}, transparent)`,
              `radial-gradient(circle at 0% 0%, ${currentUniverse.color}, transparent)`,
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        <div className="relative z-10 flex items-center gap-3">
          <span className="text-2xl">{currentUniverse.icon}</span>
          <div className="text-left hidden md:block">
            <div className="text-[10px] font-tech tracking-widest opacity-70" style={{ color: currentUniverse.color }}>
              {config.universeId}
            </div>
            <div className="text-sm font-bold text-white">
              {currentUniverse.name}
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={18} className="text-white" />
          </motion.div>
        </div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-64 rounded-lg overflow-hidden backdrop-blur-xl border border-white/20"
            style={{ backgroundColor: 'rgba(10, 10, 10, 0.95)' }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
              <Globe size={16} className="text-white/60" />
              <span className="text-xs font-tech tracking-widest text-white/60">SELECT DIMENSION</span>
            </div>

            {/* Universe Options */}
            <div className="p-2">
              {allModes.map((universeMode) => {
                const universe = UNIVERSE_DATA[universeMode];
                const isActive = mode === universeMode;
                
                return (
                  <motion.button
                    key={universeMode}
                    onClick={() => {
                      setMode(universeMode);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all
                      ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
                    `}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Active Indicator */}
                    <div 
                      className={`w-1 h-8 rounded-full transition-all ${isActive ? 'opacity-100' : 'opacity-0'}`}
                      style={{ backgroundColor: universe.color }}
                    />
                    
                    {/* Icon */}
                    <span className="text-2xl">{universe.icon}</span>
                    
                    {/* Info */}
                    <div className="flex-1 text-left">
                      <div className="text-white font-bold text-sm">{universe.name}</div>
                      <div className="text-[10px] font-tech tracking-wider" style={{ color: universe.color }}>
                        {universeMode === 'peter' && 'EARTH-616'}
                        {universeMode === 'miles' && 'EARTH-1610'}
                        {universeMode === 'gwen' && 'EARTH-65'}
                        {universeMode === 'noir' && 'EARTH-90214'}
                        {universeMode === 'peni' && 'EARTH-14512'}
                      </div>
                    </div>

                    {/* Portal Effect on Active */}
                    {isActive && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      >
                        <Zap size={16} style={{ color: universe.color }} />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/10 text-center">
              <span className="text-[10px] font-tech tracking-widest text-white/40">
                SPIDER-VERSE PROTOCOL ACTIVE
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
