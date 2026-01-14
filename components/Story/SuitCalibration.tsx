import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Radio, SlidersHorizontal, Lock, Eye, ScanLine, Aperture } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const SuitCalibration: React.FC = () => {
  const { mode, config } = useTheme();
  const [stage, setStage] = useState<'audio' | 'optics' | 'complete'>('audio');

  // Audio Sync State
  const [frequency, setFrequency] = useState(50);
  const [amplitude, setAmplitude] = useState(50);
  const [audioLocked, setAudioLocked] = useState(false);
  const [audioMatch, setAudioMatch] = useState(0);

  // Optics State
  const [focus, setFocus] = useState(10);
  const [chromatic, setChromatic] = useState(90);
  const [opticsLocked, setOpticsLocked] = useState(false);
  const [opticsMatch, setOpticsMatch] = useState(0);

  // Audio Sync Logic
  useEffect(() => {
    if (stage !== 'audio') return;
    const targetFreq = 75;
    const targetAmp = 30;
    const freqDiff = Math.abs(frequency - targetFreq);
    const ampDiff = Math.abs(amplitude - targetAmp);
    const match = Math.max(0, 100 - (freqDiff + ampDiff) * 1.5);
    setAudioMatch(match);

    if (match > 95 && !audioLocked) {
      setAudioLocked(true);
      setTimeout(() => setStage('optics'), 1500);
    }
  }, [frequency, amplitude, audioLocked, stage]);

  // Optics Logic
  useEffect(() => {
    if (stage !== 'optics') return;
    const targetFocus = 85;
    const targetChromatic = 20;
    
    const focusDiff = Math.abs(focus - targetFocus);
    const chromDiff = Math.abs(chromatic - targetChromatic);
    const match = Math.max(0, 100 - (focusDiff + chromDiff) * 1.2);
    setOpticsMatch(match);

    if (match > 96 && !opticsLocked) {
      setOpticsLocked(true);
      setTimeout(() => setStage('complete'), 1500);
    }
  }, [focus, chromatic, opticsLocked, stage]);

  const blurAmount = Math.max(0, (100 - opticsMatch) / 10);
  const shiftAmount = Math.max(0, (100 - opticsMatch) / 5);

  const getAccentColor = () => {
    switch (mode) {
      case 'peter': return '#06b6d4';
      case 'miles': return '#FF4D6D';
      case 'gwen': return '#FF69B4';
      case 'noir': return '#D4AF37';
      case 'peni': return '#00D4FF';
      default: return '#06b6d4';
    }
  };

  const accentColor = getAccentColor();
  
  return (
    <div 
      className="relative w-full aspect-[4/5] md:aspect-[16/9] flex flex-col overflow-hidden font-tech selection:bg-cyan-500/30"
      style={{ backgroundColor: mode === 'noir' ? '#0d0d0d' : '#0B1026' }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(${accentColor}20 1px, transparent 1px), linear-gradient(90deg, ${accentColor}20 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#0B1026_100%)]" />
        {mode === 'peni' && <div className="absolute inset-0 scanlines opacity-20" />}
        {mode === 'noir' && <div className="absolute inset-0 film-grain opacity-30" />}
      </div>

      {/* Header */}
      <div 
        className="relative z-20 flex justify-between items-center px-4 md:px-6 py-3 md:py-4 border-b backdrop-blur-sm"
        style={{ 
          borderColor: `${accentColor}30`,
          backgroundColor: mode === 'noir' ? 'rgba(13,13,13,0.8)' : 'rgba(11,16,38,0.8)'
        }}
      >
        <div className="flex items-center gap-2 md:gap-3">
          <div 
            className="p-1.5 md:p-2 rounded border transition-colors duration-300"
            style={{ 
              borderColor: stage === 'complete' ? '#22c55e' : accentColor,
              backgroundColor: stage === 'complete' ? 'rgba(34,197,94,0.1)' : `${accentColor}10`
            }}
          >
            {stage === 'audio' && <Activity size={16} style={{ color: accentColor }} />}
            {stage === 'optics' && <Eye size={16} style={{ color: accentColor }} />}
            {stage === 'complete' && <Lock size={16} className="text-green-500" />}
          </div>
          <div>
            <h3 
              className={`font-bold tracking-widest text-sm md:text-lg leading-none ${mode === 'peni' ? 'font-anime text-xs md:text-sm' : ''}`}
              style={{ color: accentColor }}
            >
              {stage === 'audio' ? 'AUDIO_SYNC' : stage === 'optics' ? 'LENS_CALIB' : 'SYSTEM_READY'}
            </h3>
            <span className="text-[8px] md:text-[10px] tracking-[0.3em]" style={{ color: `${accentColor}80` }}>
              {stage === 'audio' ? 'STEP 1/2' : stage === 'optics' ? 'STEP 2/2' : 'ONLINE'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span 
            className={`text-[10px] md:text-xs tracking-widest transition-colors ${mode === 'peni' ? 'font-anime' : ''}`}
            style={{ color: (audioLocked && stage === 'audio') || (opticsLocked && stage === 'optics') || stage === 'complete' ? '#22c55e' : `${accentColor}80` }}
          >
            {(audioLocked && stage === 'audio') || (opticsLocked && stage === 'optics') ? 'LOCKED' : stage === 'complete' ? 'OPTIMIZED' : 'CALIBRATING...'}
          </span>
          <div 
            className={`w-2 h-2 rounded-full ${(audioLocked && stage === 'audio') || (opticsLocked && stage === 'optics') || stage === 'complete' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* Audio Stage */}
          {stage === 'audio' && (
            <motion.div 
              key="audio"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full h-full relative flex items-center justify-center"
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-[80%] aspect-square rounded-full border" style={{ borderColor: accentColor }} />
                <div className="absolute w-[60%] aspect-square rounded-full border border-dashed animate-spin" style={{ borderColor: accentColor, animationDuration: '20s' }} />
              </div>

              <div className="relative w-full h-[60%] flex items-center z-10">
                <motion.div className="w-full h-full">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ filter: `drop-shadow(0 0 8px ${accentColor})` }}>
                    <motion.path 
                      d={`M 0 50 
                      Q ${25 * (100/Math.max(10, frequency))} ${50 - (amplitude/3)} ${50 * (100/Math.max(10, frequency))} 50 
                      T ${100 * (100/Math.max(10, frequency))} 50 
                      T ${150 * (100/Math.max(10, frequency))} 50
                      T ${200 * (100/Math.max(10, frequency))} 50`}
                      fill="none" 
                      stroke={audioLocked ? '#22c55e' : accentColor} 
                      strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </motion.div>
              </div>
              <div className="absolute top-4 right-4 md:right-6 font-tech text-4xl md:text-6xl select-none" style={{ color: `${accentColor}20` }}>
                {Math.round(audioMatch)}<span className="text-xl md:text-2xl">%</span>
              </div>
            </motion.div>
          )}

          {/* Optics Stage */}
          {stage === 'optics' && (
            <motion.div 
              key="optics"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full h-full relative"
            >
              <div className="absolute inset-4 md:inset-8 overflow-hidden border rounded-sm bg-black" style={{ borderColor: `${accentColor}30` }}>
                <div 
                  className="w-full h-full bg-cover bg-center transition-all duration-100 ease-linear"
                  style={{ 
                    backgroundImage: `url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80)`,
                    filter: `blur(${blurAmount}px) brightness(${0.5 + (opticsMatch/200)}) ${mode === 'noir' ? 'grayscale(100%)' : ''}`,
                    transform: `scale(${1 + blurAmount/50})`
                  }}
                />
                <div 
                  className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-50 pointer-events-none transition-all duration-100"
                  style={{ 
                    backgroundImage: `url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80)`,
                    filter: `blur(${blurAmount}px) hue-rotate(90deg)`,
                    transform: `translate(${shiftAmount}px, 0)`
                  }}
                />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`transition-all duration-300 ${opticsLocked ? 'scale-110' : ''}`} style={{ color: opticsLocked ? '#22c55e' : `${accentColor}50` }}>
                    <ScanLine size={80} md:size={120} strokeWidth={1} />
                  </div>
                  {opticsLocked && (
                    <div className="absolute font-tech text-green-500 bg-black/80 px-4 py-1 tracking-[0.3em] animate-pulse">
                      VISUALS CLEAR
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Complete Stage */}
          {stage === 'complete' && (
            <motion.div 
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center z-30"
            >
              <div 
                className="flex flex-col items-center border-2 p-6 md:p-8 backdrop-blur-md"
                style={{ 
                  borderColor: '#22c55e',
                  backgroundColor: 'rgba(34,197,94,0.1)',
                  boxShadow: '0 0 30px rgba(34,197,94,0.3)'
                }}
              >
                <Lock size={32} className="text-green-400 mb-3 md:mb-4" />
                <h2 className={`text-xl md:text-3xl text-white font-bold tracking-widest mb-1 ${mode === 'peni' ? 'font-anime text-lg md:text-xl' : ''}`}>SYNC COMPLETE</h2>
                <div className="h-1 w-16 md:w-20 bg-green-500 mb-3 md:mb-4" />
                <p className="text-green-400 text-[10px] md:text-xs tracking-[0.3em]">ALL SYSTEMS GREEN</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div 
        className="relative z-20 border-t p-3 md:p-6 grid grid-cols-2 gap-3 md:gap-8"
        style={{ 
          backgroundColor: mode === 'noir' ? '#080808' : '#080c1f',
          borderColor: `${accentColor}20`
        }}
      >
        {stage === 'audio' && (
          <>
            <div className="space-y-1 md:space-y-2">
              <div className="flex justify-between items-end" style={{ color: accentColor }}>
                <label className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs font-bold tracking-widest">
                  <Radio size={10} /> FREQ_MOD
                </label>
                <span className="font-mono text-[10px] md:text-xs">{frequency}Hz</span>
              </div>
              <div className="relative h-5 md:h-6 flex items-center">
                <div className="absolute w-full h-1 rounded-full" style={{ backgroundColor: `${accentColor}30` }} />
                <input 
                  type="range" min="10" max="100" 
                  value={frequency} onChange={(e) => setFrequency(Number(e.target.value))}
                  className="relative z-10 w-full opacity-0 cursor-pointer"
                  disabled={audioLocked}
                />
                <div 
                  className="absolute h-3 md:h-4 w-1 pointer-events-none" 
                  style={{ 
                    left: `${((frequency - 10) / 90) * 100}%`,
                    backgroundColor: accentColor,
                    boxShadow: `0 0 10px ${accentColor}`
                  }} 
                />
              </div>
            </div>
            <div className="space-y-1 md:space-y-2">
              <div className="flex justify-between items-end" style={{ color: accentColor }}>
                <label className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs font-bold tracking-widest">
                  <SlidersHorizontal size={10} /> AMP_GAIN
                </label>
                <span className="font-mono text-[10px] md:text-xs">{amplitude}%</span>
              </div>
              <div className="relative h-5 md:h-6 flex items-center">
                <div className="absolute w-full h-1 rounded-full" style={{ backgroundColor: `${accentColor}30` }} />
                <input 
                  type="range" min="10" max="100" 
                  value={amplitude} onChange={(e) => setAmplitude(Number(e.target.value))}
                  className="relative z-10 w-full opacity-0 cursor-pointer"
                  disabled={audioLocked}
                />
                <div 
                  className="absolute h-3 md:h-4 w-1 pointer-events-none" 
                  style={{ 
                    left: `${((amplitude - 10) / 90) * 100}%`,
                    backgroundColor: accentColor,
                    boxShadow: `0 0 10px ${accentColor}`
                  }} 
                />
              </div>
            </div>
          </>
        )}

        {stage === 'optics' && (
          <>
            <div className="space-y-1 md:space-y-2">
              <div className="flex justify-between items-end" style={{ color: accentColor }}>
                <label className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs font-bold tracking-widest">
                  <Eye size={10} /> FOCUS
                </label>
                <span className="font-mono text-[10px] md:text-xs">{focus}%</span>
              </div>
              <div className="relative h-5 md:h-6 flex items-center">
                <div className="absolute w-full h-1 rounded-full" style={{ backgroundColor: `${accentColor}30` }} />
                <input 
                  type="range" min="0" max="100" 
                  value={focus} onChange={(e) => setFocus(Number(e.target.value))}
                  className="relative z-10 w-full opacity-0 cursor-pointer"
                  disabled={opticsLocked}
                />
                <div 
                  className="absolute h-3 md:h-4 w-1 pointer-events-none" 
                  style={{ 
                    left: `${focus}%`,
                    backgroundColor: accentColor,
                    boxShadow: `0 0 10px ${accentColor}`
                  }} 
                />
              </div>
            </div>
            <div className="space-y-1 md:space-y-2">
              <div className="flex justify-between items-end" style={{ color: accentColor }}>
                <label className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs font-bold tracking-widest">
                  <Aperture size={10} /> RGB_SHIFT
                </label>
                <span className="font-mono text-[10px] md:text-xs">{chromatic}%</span>
              </div>
              <div className="relative h-5 md:h-6 flex items-center">
                <div className="absolute w-full h-1 rounded-full" style={{ backgroundColor: `${accentColor}30` }} />
                <input 
                  type="range" min="0" max="100" 
                  value={chromatic} onChange={(e) => setChromatic(Number(e.target.value))}
                  className="relative z-10 w-full opacity-0 cursor-pointer"
                  disabled={opticsLocked}
                />
                <div 
                  className="absolute h-3 md:h-4 w-1 pointer-events-none" 
                  style={{ 
                    left: `${chromatic}%`,
                    backgroundColor: accentColor,
                    boxShadow: `0 0 10px ${accentColor}`
                  }} 
                />
              </div>
            </div>
          </>
        )}
        
        {stage === 'complete' && (
          <div className="col-span-2 flex items-center justify-center text-green-500 font-tech text-xs md:text-sm tracking-[0.2em] animate-pulse">
            :: CALIBRATION LOGGED ::
          </div>
        )}
      </div>
    </div>
  );
};
