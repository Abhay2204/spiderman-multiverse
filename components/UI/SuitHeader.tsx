import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

export const SuitHeader: React.FC = () => {
  const { mode, toggleMode, config } = useTheme();
  const isSymbiote = mode === 'symbiote';

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-sm bg-gradient-to-b from-black/80 to-transparent">
      {/* Brand */}
      <div className="flex items-center gap-4">
        <div className={`w-8 h-8 flex items-center justify-center border-2 rounded ${isSymbiote ? 'border-white bg-purple-600' : 'border-red-500 bg-red-600'}`}>
            <span className="font-hero text-white text-lg">M</span>
        </div>
        <div className="hidden md:block">
            <h1 className="font-hero text-xl text-white tracking-widest uppercase">
                {config.systemName}
            </h1>
            <div className="h-0.5 w-full bg-white/20 mt-1">
                <motion.div 
                    className={`h-full ${isSymbiote ? 'bg-purple-500' : 'bg-blue-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2 }}
                />
            </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={toggleMode}
        className={`
            group relative px-6 py-2 overflow-hidden border transition-all duration-300
            ${isSymbiote ? 'border-white hover:bg-white/10' : 'border-red-500 hover:bg-red-500/20'}
        `}
      >
        <span className="relative z-10 font-hud font-bold tracking-[0.2em] text-sm uppercase text-white">
            {isSymbiote ? 'DETACH SYMBIOTE' : 'ENGAGE BLACK SUIT'}
        </span>
        
        {/* Hover Fill Effect */}
        <div className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-20 ${isSymbiote ? 'bg-white' : 'bg-red-600'}`} />
      </button>
    </header>
  );
};