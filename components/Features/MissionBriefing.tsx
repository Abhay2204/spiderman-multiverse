import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getSuitAnalysis } from '../../services/geminiService';
import { Terminal, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export const MissionBriefing: React.FC = () => {
  const { mode, config } = useTheme();
  const [intel, setIntel] = useState<string>("ESTABLISHING SECURE UPLINK...");
  const [loading, setLoading] = useState(false);

  const fetchIntel = async () => {
    setLoading(true);
    setIntel(mode === 'symbiote' ? "HUNTING..." : "CALCULATING...");
    const data = await getSuitAnalysis(mode === 'symbiote');
    setIntel(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchIntel();
  }, [mode]);

  const isSymbiote = mode === 'symbiote';

  return (
    <div className={`
        relative h-full flex flex-col p-6 rounded-lg border backdrop-blur-md overflow-hidden
        ${isSymbiote ? 'bg-purple-900/10 border-purple-500/30' : 'bg-blue-900/10 border-blue-500/30'}
    `}>
      {/* Decorative Scan Line */}
      <motion.div 
        className={`absolute top-0 left-0 w-full h-1 opacity-50 ${isSymbiote ? 'bg-purple-500' : 'bg-blue-400'}`}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
            <Terminal size={18} className={isSymbiote ? 'text-purple-400' : 'text-blue-400'} />
            <span className="font-hero text-xl tracking-wider uppercase text-white">
                {isSymbiote ? 'INTERNAL_VOICE' : 'TACTICAL_FEED'}
            </span>
        </div>
        <button 
            onClick={fetchIntel} 
            disabled={loading}
            className="hover:rotate-180 transition-transform duration-500"
        >
            <RefreshCcw size={16} className="text-white/60" />
        </button>
      </div>

      <div className="flex-1 relative font-hud text-xl md:text-2xl leading-relaxed text-white/90">
         {/* Typing effect could be added here, but for simplicity/performance we use simple render */}
         <p className={isSymbiote ? 'font-bold tracking-tight' : 'font-light tracking-wide'}>
            "{intel}"
         </p>
         
         {/* Blinking cursor */}
         <motion.span 
            className={`inline-block w-2 h-6 ml-1 align-middle ${isSymbiote ? 'bg-white' : 'bg-blue-500'}`}
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
         />
      </div>

      <div className="mt-4 flex items-center gap-4 text-[10px] font-hud tracking-[0.2em] text-white/40">
        <span>ENC: AES-256</span>
        <span>LAT: 40.7128</span>
        <span>LON: -74.0060</span>
      </div>
    </div>
  );
};