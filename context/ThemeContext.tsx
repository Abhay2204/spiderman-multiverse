import React, { createContext, useContext, useState } from 'react';
import { SuitMode, UniverseConfig } from '../types';

interface ThemeContextType {
  mode: SuitMode;
  setMode: (mode: SuitMode) => void;
  cycleMode: () => void;
  config: UniverseConfig;
  isTransitioning: boolean;
  allModes: SuitMode[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Earth-616 - Peter Parker (Classic)
const PETER_CONFIG: UniverseConfig = {
  mode: 'peter',
  universeName: 'EARTH-616',
  universeId: 'E-616',
  spiderPerson: 'Peter Parker',
  colors: {
    primary: '#E62429',
    secondary: '#004499',
    accent: '#F3D403',
    bg: '#f5f5f5',
    text: '#0e0e0e',
    panel: '#ffffff',
    glow: 'rgba(230, 36, 41, 0.5)',
  },
  animation: { stiffness: 100, damping: 20, mass: 1 },
  fonts: { heading: 'font-title', body: 'font-body' },
  style: 'classic',
};

// Earth-1610 - Miles Morales (Graffiti/Street Art)
const MILES_CONFIG: UniverseConfig = {
  mode: 'miles',
  universeName: 'EARTH-1610',
  universeId: 'E-1610',
  spiderPerson: 'Miles Morales',
  colors: {
    primary: '#E62429',
    secondary: '#000000',
    accent: '#FF4D6D',
    bg: '#0a0a0a',
    text: '#ffffff',
    panel: '#1a1a2e',
    glow: 'rgba(255, 77, 109, 0.6)',
  },
  animation: { stiffness: 150, damping: 15, mass: 0.8 },
  fonts: { heading: 'font-shout', body: 'font-body' },
  style: 'graffiti',
};

// Earth-65 - Gwen Stacy (Punk/Pastel)
const GWEN_CONFIG: UniverseConfig = {
  mode: 'gwen',
  universeName: 'EARTH-65',
  universeId: 'E-65',
  spiderPerson: 'Gwen Stacy',
  colors: {
    primary: '#FF69B4',
    secondary: '#00CED1',
    accent: '#FFFFFF',
    bg: '#1a1a2e',
    text: '#ffffff',
    panel: '#16213e',
    glow: 'rgba(255, 105, 180, 0.6)',
  },
  animation: { stiffness: 200, damping: 12, mass: 0.6 },
  fonts: { heading: 'font-title', body: 'font-body' },
  style: 'punk',
};

// Earth-90214 - Spider-Man Noir
const NOIR_CONFIG: UniverseConfig = {
  mode: 'noir',
  universeName: 'EARTH-90214',
  universeId: 'E-90214',
  spiderPerson: 'Peter Parker (Noir)',
  colors: {
    primary: '#2C2C2C',
    secondary: '#8B8B8B',
    accent: '#D4AF37',
    bg: '#0d0d0d',
    text: '#e5e5e5',
    panel: '#1a1a1a',
    glow: 'rgba(212, 175, 55, 0.4)',
  },
  animation: { stiffness: 80, damping: 25, mass: 1.5 },
  fonts: { heading: 'font-noir', body: 'font-body' },
  style: 'noir',
};

// Earth-14512 - Peni Parker (Anime)
const PENI_CONFIG: UniverseConfig = {
  mode: 'peni',
  universeName: 'EARTH-14512',
  universeId: 'E-14512',
  spiderPerson: 'Peni Parker',
  colors: {
    primary: '#FF6B9D',
    secondary: '#00D4FF',
    accent: '#FFE66D',
    bg: '#0f0f23',
    text: '#ffffff',
    panel: '#1a1a3e',
    glow: 'rgba(0, 212, 255, 0.6)',
  },
  animation: { stiffness: 250, damping: 10, mass: 0.5 },
  fonts: { heading: 'font-anime', body: 'font-body' },
  style: 'anime',
};

const CONFIGS: Record<SuitMode, UniverseConfig> = {
  peter: PETER_CONFIG,
  miles: MILES_CONFIG,
  gwen: GWEN_CONFIG,
  noir: NOIR_CONFIG,
  peni: PENI_CONFIG,
};

const ALL_MODES: SuitMode[] = ['peter', 'miles', 'gwen', 'noir', 'peni'];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<SuitMode>('peter');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const setMode = (newMode: SuitMode) => {
    if (newMode === mode) return;
    setIsTransitioning(true);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    
    setTimeout(() => {
      setModeState(newMode);
      setTimeout(() => setIsTransitioning(false), 800);
    }, 300);
  };

  const cycleMode = () => {
    const currentIndex = ALL_MODES.indexOf(mode);
    const nextIndex = (currentIndex + 1) % ALL_MODES.length;
    setMode(ALL_MODES[nextIndex]);
  };

  const config = CONFIGS[mode];

  return (
    <ThemeContext.Provider value={{ mode, setMode, cycleMode, config, isTransitioning, allModes: ALL_MODES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
