import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Scan, ShieldAlert, Zap, Radio, Activity } from 'lucide-react';

export const PowerBlueprint: React.FC = () => {
  const { mode } = useTheme();
  const [activeSystem, setActiveSystem] = useState<string | null>(null);

  // Correction: Check for 'symbiote' instead of 'venom' to match types
  const isVenom = mode === 'symbiote';
  const primaryColor = isVenom ? '#FFFFFF' : '#D7263D';
  const accentColor = isVenom ? '#a855f7' : '#0D1117';

  // HUD Data
  const systems = [
    { id: 'optics', label: 'Lenses', icon: Scan, val: 'ACTIVE', x: '50%', y: '20%' },
    { id: 'web', label: 'Shooters', icon: Radio, val: '98%', x: '20%', y: '50%' },
    { id: 'suit', label: 'Integrity', icon: ShieldAlert, val: '100%', x: '80%', y: '50%' },
    { id: 'core', label: 'Vitals', icon: Activity, val: 'NORMAL', x: '50%', y: '80%' },
  ];

  return (
    <div className={`relative h-full w-full p-6 overflow-hidden flex flex-col items-center justify-center
      ${isVenom ? 'bg-black' : 'bg-slate-50'}
    `}>
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10" 
        style={{ 
            backgroundImage: `linear-gradient(${primaryColor} 1px, transparent 1px), linear-gradient(90deg, ${primaryColor} 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
        }} 
      />

      {/* Rotating Radar Rings - The "HUD" Core */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer Ring */}
        <motion.div 
            className="absolute inset-0 border-2 rounded-full opacity-30 border-dashed"
            style={{ borderColor: primaryColor }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        {/* Middle Ring */}
        <motion.div 
            className="absolute inset-4 border border-t-transparent border-b-transparent rounded-full opacity-60"
            style={{ borderColor: primaryColor }}
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner Core */}
        <motion.div 
            className="w-32 h-32 rounded-full flex items-center justify-center border-4 relative z-10 bg-black/5 backdrop-blur-sm"
            style={{ borderColor: primaryColor }}
            whileHover={{ scale: 1.1 }}
        >
            <Zap size={48} color={primaryColor} className={isVenom ? 'animate-pulse' : ''} />
            
            {/* Scanning Line */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-20"
                animate={{ top: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
        </motion.div>

        {/* Floating System Nodes */}
        {systems.map((sys) => (
            <motion.button
                key={sys.id}
                className="absolute w-12 h-12 rounded-full bg-white border-2 shadow-lg flex items-center justify-center hover:z-20"
                style={{ 
                    left: sys.x, 
                    top: sys.y, 
                    borderColor: primaryColor,
                    color: accentColor,
                    x: '-50%',
                    y: '-50%'
                }}
                whileHover={{ scale: 1.2, backgroundColor: primaryColor, color: 'white' }}
                onMouseEnter={() => setActiveSystem(sys.id)}
                onMouseLeave={() => setActiveSystem(null)}
            >
                <sys.icon size={20} />
            </motion.button>
        ))}
      </div>

      {/* Data Readout Box */}
      <div className="mt-8 w-full">
         <div className={`border-l-4 pl-4 transition-colors duration-300`} style={{ borderColor: primaryColor }}>
             <h4 className="font-tech text-xs uppercase tracking-widest opacity-60">
                 {activeSystem ? `SYS_CHECK: ${activeSystem}` : 'SYSTEM_STATUS'}
             </h4>
             <h3 className="font-comic text-3xl uppercase">
                 {activeSystem 
                    ? systems.find(s => s.id === activeSystem)?.label 
                    : (isVenom ? "SYMBIOSIS: STABLE" : "ALL SYSTEMS GO")
                 }
             </h3>
             <div className="font-tech text-sm mt-1 flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${isVenom ? 'bg-green-400' : 'bg-green-600'} animate-pulse`} />
                 {activeSystem 
                    ? `Output: ${systems.find(s => s.id === activeSystem)?.val}` 
                    : "Running diagnostics..."
                 }
             </div>
         </div>
      </div>
    </div>
  );
};