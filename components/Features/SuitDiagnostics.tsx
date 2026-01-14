import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Shield, Zap, Activity, Wifi, Cpu, Crosshair } from 'lucide-react';

export const SuitDiagnostics: React.FC = () => {
  const { mode, config } = useTheme();
  const [hovered, setHovered] = useState<number | null>(null);

  const systems = [
    { name: 'Nanotech', icon: Cpu, value: 'OPTIMAL', color: 'text-blue-400' },
    { name: 'Web Fluid', icon: Activity, value: '84%', color: 'text-green-400' },
    { name: 'Defenses', icon: Shield, value: 'ACTIVE', color: 'text-yellow-400' },
    { name: 'Uplink', icon: Wifi, value: 'SECURE', color: 'text-purple-400' },
  ];

  const isSymbiote = mode === 'symbiote';

  return (
    <div className="h-full w-full relative overflow-hidden rounded-lg border border-white/10 bg-black/40 backdrop-blur-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <h2 className="font-hero text-2xl tracking-wider text-white">
            {isSymbiote ? 'HOST VITALS' : 'SUIT DIAGNOSTICS'}
        </h2>
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isSymbiote ? 'bg-purple-500' : 'bg-green-500'}`} />
            <span className="font-hud text-xs tracking-[0.2em] text-white/60">ONLINE</span>
        </div>
      </div>

      {/* Main Visual */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center h-[300px]">
        
        {/* Central HUD Ring */}
        <div className="relative w-48 h-48 flex items-center justify-center group">
           {/* Rotating Rings */}
           <motion.div 
             className={`absolute inset-0 rounded-full border-2 border-dashed ${isSymbiote ? 'border-purple-600' : 'border-blue-500/50'}`}
             animate={{ rotate: 360 }}
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
           />
           <motion.div 
             className={`absolute inset-4 rounded-full border border-t-transparent border-b-transparent ${isSymbiote ? 'border-white' : 'border-red-500/50'}`}
             animate={{ rotate: -360 }}
             transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
           />
           
           {/* Center Icon */}
           <div className="relative z-10 flex flex-col items-center justify-center text-center">
              {isSymbiote ? <Zap size={40} className="text-white mb-2" /> : <Crosshair size={40} className="text-red-500 mb-2" />}
              <span className="font-hud text-2xl font-bold">{isSymbiote ? '100%' : '100%'}</span>
              <span className="font-hud text-[10px] tracking-widest opacity-60">PWR_LVL</span>
           </div>

           {/* Pulse Effect */}
           <div className={`absolute inset-0 rounded-full opacity-20 animate-ping ${isSymbiote ? 'bg-purple-500' : 'bg-blue-500'}`} />
        </div>

        {/* System List */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            {systems.map((sys, idx) => (
                <motion.div 
                    key={sys.name}
                    className={`
                        p-3 rounded border bg-black/20 cursor-pointer transition-all
                        ${hovered === idx ? 'border-white/50 bg-white/10' : 'border-white/5'}
                    `}
                    whileHover={{ scale: 1.05 }}
                    onMouseEnter={() => setHovered(idx)}
                    onMouseLeave={() => setHovered(null)}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <sys.icon size={16} className={isSymbiote ? 'text-white' : sys.color} />
                        <span className="font-hud text-xs tracking-widest uppercase opacity-70">{sys.name}</span>
                    </div>
                    <div className="font-hero text-xl tracking-wide">{sys.value}</div>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};