import React, { useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ComicCaption } from './components/UI/ComicCaption';
import { ComicPanel } from './components/Layout/ComicPanel';
import { UniverseSelector } from './components/UI/UniverseSelector';
import { Onomatopoeia } from './components/UI/Onomatopoeia';
import { ArrowDown, Sparkles, Zap, Globe } from 'lucide-react';

// Import Games
import { WebShooter } from './components/Story/WebShooter';
import { SuitCalibration } from './components/Story/SuitCalibration';
import { MilesVenomStrike } from './components/Story/MilesVenomStrike';
import { GwenWebSwing } from './components/Story/GwenWebSwing';
import { NoirDetective } from './components/Story/NoirDetective';
import { PeniMechBattle } from './components/Story/PeniMechBattle';

// Spider-Man Images - Using available PNG files with Unsplash fallbacks
const SPIDEY_IMAGES = {
  peter: {
    hero: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80', // Keep this one as Unsplash
    action1: '/images/peter/1.png',
    action2: '/images/peter/2.png',
    city: '/images/peter/3.png',
  },
  miles: {
    hero: '/images/miles/1.png',
    action1: '/images/miles/2.png',
    action2: '/images/miles/3.png',
    city: '/images/miles/4.png',
  },
  gwen: {
    hero: '/images/gwen/1.png',
    action1: '/images/gwen/2.png',
    action2: '/images/gwen/3.png',
    city: '/images/gwen/4.png',
  },
  noir: {
    hero: '/images/noir/1.png',
    action1: '/images/noir/2.png',
    action2: '/images/noir/3.png',
    city: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&q=80',
  },
  peni: {
    hero: '/images/peni/1.png',
    action1: '/images/peni/2.png',
    action2: '/images/peni/3.png',
    city: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80',
  },
};

// Section Data for each universe
const getSectionsForMode = (mode: string) => {
  const images = SPIDEY_IMAGES[mode as keyof typeof SPIDEY_IMAGES] || SPIDEY_IMAGES.peter;
  
  const sections = {
    peter: [
      { id: 'cover', type: 'cover' },
      { id: 'origin', type: 'panel', phase: 'origin', image: images.action1, scene: 'Peter Parker swinging through Manhattan, the city lights reflecting off his classic red and blue suit.', title: 'THE BITE', onomatopoeia: { text: 'THWIP!', x: '70%', y: '10%', rotate: 15 } },
      { id: 'calibration', type: 'interactive', phase: 'hero', title: 'SUIT CALIBRATION' },
      { id: 'power', type: 'panel', phase: 'hero', image: images.action2, scene: 'Spider-Man perched on a gargoyle, watching over New York City at sunset.', title: 'GREAT POWER', onomatopoeia: { text: 'WHOOSH!', x: '20%', y: '80%', rotate: -10 } },
      { id: 'game', type: 'interactive', phase: 'hero', title: 'WEB SHOOTER TRAINING' },
      { id: 'finale', type: 'panel', phase: 'hero', image: images.city, scene: 'The Amazing Spider-Man soaring between skyscrapers, leaving a trail of webs.', title: 'RESPONSIBILITY', onomatopoeia: { text: 'AMAZING!', x: '50%', y: '5%', rotate: 5 } },
    ],
    miles: [
      { id: 'cover', type: 'cover' },
      { id: 'awakening', type: 'panel', phase: 'miles', image: images.action1, scene: 'Miles Morales discovering his powers in Brooklyn, electricity crackling around his fingertips.', title: 'THE AWAKENING', onomatopoeia: { text: 'BZZT!', x: '75%', y: '15%', rotate: 20 } },
      { id: 'venom-game', type: 'interactive', phase: 'miles', title: 'VENOM STRIKE' },
      { id: 'leap', type: 'panel', phase: 'miles', image: images.action2, scene: 'Miles taking his leap of faith off a Brooklyn rooftop, the city sprawling below.', title: 'LEAP OF FAITH', onomatopoeia: { text: 'WHAT\'S UP DANGER!', x: '30%', y: '70%', rotate: -5 } },
      { id: 'training', type: 'interactive', phase: 'miles', title: 'INVISIBILITY TRAINING' },
      { id: 'hero', type: 'panel', phase: 'miles', image: images.city, scene: 'Miles Morales standing tall as the new Spider-Man of Brooklyn.', title: 'ANYONE CAN WEAR THE MASK', onomatopoeia: { text: 'EXCELENTE!', x: '60%', y: '10%', rotate: 10 } },
    ],
    gwen: [
      { id: 'cover', type: 'cover' },
      { id: 'drummer', type: 'panel', phase: 'gwen', image: images.action1, scene: 'Gwen Stacy on stage with The Mary Janes, drumsticks flying.', title: 'ROCK STAR', onomatopoeia: { text: 'CRASH!', x: '80%', y: '20%', rotate: 25 } },
      { id: 'swing-game', type: 'interactive', phase: 'gwen', title: 'WEB SWING' },
      { id: 'swing', type: 'panel', phase: 'gwen', image: images.action2, scene: 'Spider-Gwen gracefully swinging through her dimension, ballet meets superhero.', title: 'GHOST SPIDER', onomatopoeia: { text: 'WOOO!', x: '25%', y: '75%', rotate: -15 } },
      { id: 'calibration', type: 'interactive', phase: 'gwen', title: 'WEB CALIBRATION' },
      { id: 'hero', type: 'panel', phase: 'gwen', image: images.city, scene: 'Gwen standing on a rooftop, her white hood catching the wind.', title: 'UNMASKED', onomatopoeia: { text: 'PUNK ROCK!', x: '50%', y: '5%', rotate: 8 } },
    ],
    noir: [
      { id: 'cover', type: 'cover' },
      { id: 'shadows', type: 'panel', phase: 'noir', image: images.action1, scene: 'Spider-Man Noir lurking in the shadows of 1930s New York, fedora and trench coat.', title: 'THE SHADOWS', onomatopoeia: { text: 'CLICK...', x: '70%', y: '15%', rotate: 5 } },
      { id: 'detective', type: 'interactive', phase: 'noir', title: 'DETECTIVE MODE' },
      { id: 'justice', type: 'panel', phase: 'noir', image: images.action2, scene: 'Noir Spider-Man confronting criminals in a rain-soaked alley.', title: 'JUSTICE', onomatopoeia: { text: 'BANG!', x: '20%', y: '80%', rotate: -20 } },
      { id: 'calibration', type: 'interactive', phase: 'noir', title: 'WEAPON CHECK' },
      { id: 'hero', type: 'panel', phase: 'noir', image: images.city, scene: 'The Noir Spider standing on a fire escape, the city in black and white below.', title: 'NO COLOR', onomatopoeia: { text: '...', x: '50%', y: '10%', rotate: 0 } },
    ],
    peni: [
      { id: 'cover', type: 'cover' },
      { id: 'mech', type: 'panel', phase: 'peni', image: images.action1, scene: 'Peni Parker syncing with SP//dr, neon lights reflecting off the mech suit.', title: 'SYNC COMPLETE', onomatopoeia: { text: 'ビープ!', x: '75%', y: '10%', rotate: 15 } },
      { id: 'mech-game', type: 'interactive', phase: 'peni', title: 'MECH BATTLE' },
      { id: 'battle', type: 'panel', phase: 'peni', image: images.action2, scene: 'SP//dr mech in action, fighting through a neon-lit Neo Tokyo.', title: 'KAWAII POWER', onomatopoeia: { text: 'ドカーン!', x: '30%', y: '70%', rotate: -10 } },
      { id: 'calibration', type: 'interactive', phase: 'peni', title: 'SYSTEM DIAGNOSTIC' },
      { id: 'hero', type: 'panel', phase: 'peni', image: images.city, scene: 'Peni and SP//dr overlooking the futuristic cityscape.', title: 'FUTURE SPIDER', onomatopoeia: { text: 'すごい!', x: '60%', y: '5%', rotate: 12 } },
    ],
  };
  
  return sections[mode as keyof typeof sections] || sections.peter;
};


// Hero Section Component
const HeroSection: React.FC = () => {
  const { mode, config } = useTheme();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const images = SPIDEY_IMAGES[mode as keyof typeof SPIDEY_IMAGES] || SPIDEY_IMAGES.peter;

  const getHeroContent = () => {
    switch (mode) {
      case 'peter':
        return {
          title1: 'THE AMAZING',
          title2: 'SPIDER-MAN',
          subtitle: 'EARTH-616 • PETER PARKER',
          badge: 'AMAZING FANTASY #15',
        };
      case 'miles':
        return {
          title1: 'INTO THE',
          title2: 'SPIDER-VERSE',
          subtitle: 'EARTH-1610 • MILES MORALES',
          badge: 'WHAT\'S UP DANGER',
        };
      case 'gwen':
        return {
          title1: 'SPIDER',
          title2: 'GWEN',
          subtitle: 'EARTH-65 • GHOST SPIDER',
          badge: 'THE MARY JANES',
        };
      case 'noir':
        return {
          title1: 'SPIDER-MAN',
          title2: 'NOIR',
          subtitle: 'EARTH-90214 • THE SHADOWS',
          badge: 'GREAT DEPRESSION ERA',
        };
      case 'peni':
        return {
          title1: 'SP//dr',
          title2: 'PENI PARKER',
          subtitle: 'EARTH-14512 • NEO TOKYO',
          badge: 'メカスパイダー',
        };
      default:
        return {
          title1: 'SPIDER',
          title2: 'VERSE',
          subtitle: 'MULTIVERSE',
          badge: 'INFINITE DIMENSIONS',
        };
    }
  };

  const content = getHeroContent();

  return (
    <section className="h-[100dvh] w-full relative overflow-hidden flex items-center justify-center">
      {/* Dynamic Background */}
      <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
        {/* Background Image */}
        <div className="absolute inset-0 bg-black">
          <img 
            src={images.hero}
            alt="Spider-Verse Hero"
            className={`
              w-full h-full object-contain transition-all duration-1000
              ${mode === 'noir' ? 'noir-filter' : ''}
              ${mode === 'peni' ? 'anime-filter' : ''}
            `}
          />
        </div>
        
        {/* Mode-specific overlays */}
        {mode === 'peter' && (
          <div className="absolute inset-0 bg-gradient-to-b from-spidey-red/20 via-transparent to-spidey-blue/30" />
        )}
        {mode === 'miles' && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-miles-pink/40 via-transparent to-miles-purple/40" />
            <div className="absolute inset-0 halftone-overlay opacity-30" />
          </>
        )}
        {mode === 'gwen' && (
          <>
            <div className="absolute inset-0 bg-gradient-to-tr from-gwen-pink/30 via-transparent to-gwen-cyan/30" />
            <div className="absolute inset-0 punk-dots opacity-10" />
          </>
        )}
        {mode === 'noir' && (
          <>
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 film-grain opacity-40" />
          </>
        )}
        {mode === 'peni' && (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-peni-cyan/20 via-transparent to-peni-pink/30" />
            <div className="absolute inset-0 scanlines" />
          </>
        )}
        
        {/* Universal vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)]" />
      </motion.div>

      {/* Dimension Portal Effect (on mode change) */}
      <motion.div
        key={mode}
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute inset-0 z-10 pointer-events-none"
      >
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at center, ${config.colors.primary}40, transparent 70%)`
          }}
        />
      </motion.div>

      {/* Hero Text Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
        {/* Universe Badge */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <div 
            className={`
              px-4 py-1 text-xs font-tech tracking-[0.3em] border-2 backdrop-blur-sm
              ${mode === 'peter' ? 'border-spidey-red bg-spidey-red/20 text-white' : ''}
              ${mode === 'miles' ? 'border-miles-pink bg-miles-pink/20 text-white' : ''}
              ${mode === 'gwen' ? 'border-gwen-pink bg-gwen-pink/20 text-white' : ''}
              ${mode === 'noir' ? 'border-noir-gold bg-noir-gold/20 text-noir-white' : ''}
              ${mode === 'peni' ? 'border-peni-cyan bg-peni-cyan/20 text-white' : ''}
            `}
          >
            {content.subtitle}
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          className={`
            text-center leading-none
            ${mode === 'peter' ? 'font-title text-[12vw] md:text-[10rem] text-spidey-red drop-shadow-[4px_4px_0_#000]' : ''}
            ${mode === 'miles' ? 'font-shout text-[10vw] md:text-[8rem] graffiti-text glitch-text' : ''}
            ${mode === 'gwen' ? 'font-title text-[12vw] md:text-[10rem] text-gwen-pink' : ''}
            ${mode === 'noir' ? 'font-noir text-[10vw] md:text-[8rem] text-noir-white tracking-wider' : ''}
            ${mode === 'peni' ? 'font-anime text-[8vw] md:text-[5rem] text-peni-cyan' : ''}
          `}
          data-text={content.title1}
        >
          {content.title1}
        </motion.h1>

        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
          className={`
            text-center leading-none mt-2
            ${mode === 'peter' ? 'font-title text-[15vw] md:text-[14rem] text-spidey-blue drop-shadow-[4px_4px_0_#000]' : ''}
            ${mode === 'miles' ? 'font-shout text-[14vw] md:text-[12rem] text-white glitch-text' : ''}
            ${mode === 'gwen' ? 'font-title text-[15vw] md:text-[14rem] text-white drop-shadow-[0_0_30px_#FF69B4]' : ''}
            ${mode === 'noir' ? 'font-noir text-[12vw] md:text-[10rem] text-noir-gold' : ''}
            ${mode === 'peni' ? 'font-anime text-[10vw] md:text-[7rem] text-peni-pink drop-shadow-[0_0_20px_#FF6B9D]' : ''}
          `}
          data-text={content.title2}
        >
          {content.title2}
        </motion.h1>

        {/* Badge */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <div 
            className={`
              px-6 py-2 transform rotate-2 shadow-comic
              ${mode === 'peter' ? 'bg-spidey-yellow border-4 border-black' : ''}
              ${mode === 'miles' ? 'bg-miles-pink border-2 border-white skew-x-[-5deg]' : ''}
              ${mode === 'gwen' ? 'bg-gwen-cyan border-2 border-gwen-pink' : ''}
              ${mode === 'noir' ? 'bg-noir-black border-2 border-noir-gold' : ''}
              ${mode === 'peni' ? 'bg-peni-purple border-2 border-peni-cyan rounded-lg' : ''}
            `}
          >
            <span 
              className={`
                font-shout text-lg md:text-xl
                ${mode === 'peter' ? 'text-black' : ''}
                ${mode === 'miles' ? 'text-white' : ''}
                ${mode === 'gwen' ? 'text-gwen-black' : ''}
                ${mode === 'noir' ? 'text-noir-gold' : ''}
                ${mode === 'peni' ? 'text-peni-yellow' : ''}
              `}
            >
              {content.badge}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
        style={{ color: config.colors.primary }}
      >
        <span className="font-tech text-[10px] uppercase tracking-widest">ENTER DIMENSION</span>
        <ArrowDown size={24} />
      </motion.div>

      {/* Floating Spider Web Decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ stroke: config.colors.primary }}>
          <path d="M0,0 L100,100 M50,0 L50,100 M0,50 L100,50 M0,100 L100,0" strokeWidth="0.5" fill="none" />
          <circle cx="50" cy="50" r="20" strokeWidth="0.5" fill="none" />
          <circle cx="50" cy="50" r="40" strokeWidth="0.5" fill="none" />
        </svg>
      </div>
    </section>
  );
};


// Main App Content
const AppContent: React.FC = () => {
  const { mode, config, isTransitioning } = useTheme();
  const { scrollYProgress } = useScroll();
  
  const activeSections = getSectionsForMode(mode);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mode]);

  // Get the appropriate game component for each universe
  const getGameComponent = (sectionId: string, phase: string) => {
    // Universal calibration game
    if (sectionId === 'calibration') return <SuitCalibration />;
    
    // Mode-specific games
    switch (mode) {
      case 'peter':
        if (sectionId === 'game') return <WebShooter />;
        break;
      case 'miles':
        if (sectionId === 'venom-game') return <MilesVenomStrike />;
        if (sectionId === 'training') return <SuitCalibration />;
        break;
      case 'gwen':
        if (sectionId === 'swing-game') return <GwenWebSwing />;
        break;
      case 'noir':
        if (sectionId === 'detective') return <NoirDetective />;
        break;
      case 'peni':
        if (sectionId === 'mech-game') return <PeniMechBattle />;
        break;
    }
    return <SuitCalibration />;
  };

  return (
    <motion.div 
      key={mode}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ backgroundColor: config.colors.bg }}
      className="min-h-screen relative overflow-x-hidden"
    >
      <UniverseSelector />
      
      {/* Global Texture Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] bg-noise" />
        {mode === 'peter' && <div className="absolute inset-0 opacity-[0.05] bg-halftone" />}
        {mode === 'miles' && <div className="absolute inset-0 opacity-[0.08] halftone-overlay" />}
        {mode === 'gwen' && <div className="absolute inset-0 opacity-[0.05] punk-dots" />}
        {mode === 'noir' && <div className="absolute inset-0 film-grain opacity-20" />}
        {mode === 'peni' && <div className="absolute inset-0 scanlines opacity-30" />}
      </div>

      {/* Dimension Transition Flash */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, times: [0, 0.2, 0.8, 1] }}
            className="fixed inset-0 z-[100] pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${config.colors.primary}, ${config.colors.secondary}, transparent)`
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1 md:h-2 z-50 origin-left"
        style={{ 
          scaleX: scrollYProgress,
          background: `linear-gradient(90deg, ${config.colors.primary}, ${config.colors.secondary || config.colors.accent})`,
          boxShadow: `0 0 10px ${config.colors.glow}`
        }}
      />

      <div className="relative z-10 w-full flex flex-col items-center">
        
        {/* Render Sections */}
        {activeSections.map((section: any, index: number) => {
          if (section.type === 'cover') {
            return <HeroSection key={`${mode}-cover`} />;
          }

          const isOdd = index % 2 !== 0;

          // Interactive Sections
          if (section.type === 'interactive') {
            return (
              <section key={section.id} className="w-full py-16 md:py-24 px-4 flex justify-center relative">
                <div className="max-w-5xl w-full">
                  {/* Section Title */}
                  <div className="mb-8 md:mb-12 flex items-center justify-center">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      className={`
                        px-6 md:px-8 py-2 md:py-3 text-xl md:text-3xl shadow-comic transform
                        ${mode === 'peter' ? 'bg-spidey-yellow text-black border-4 border-black font-title -rotate-1' : ''}
                        ${mode === 'miles' ? 'bg-miles-pink text-white border-2 border-white font-shout skew-x-[-5deg]' : ''}
                        ${mode === 'gwen' ? 'bg-gwen-pink text-white border-2 border-gwen-cyan font-title rotate-1' : ''}
                        ${mode === 'noir' ? 'bg-noir-black text-noir-gold border-2 border-noir-gold font-noir tracking-wider' : ''}
                        ${mode === 'peni' ? 'bg-peni-cyan text-black border-2 border-peni-pink font-anime text-base md:text-xl rounded-lg' : ''}
                      `}
                    >
                      {section.title}
                    </motion.div>
                  </div>
                  
                  {/* Game Container */}
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className={`
                      relative z-10 overflow-hidden
                      ${mode === 'peter' ? 'border-4 border-black shadow-comic-lg' : ''}
                      ${mode === 'miles' ? 'border-2 border-miles-pink shadow-neon-pink' : ''}
                      ${mode === 'gwen' ? 'border-2 border-gwen-pink shadow-neon-pink' : ''}
                      ${mode === 'noir' ? 'border-2 border-noir-gold' : ''}
                      ${mode === 'peni' ? 'border-2 border-peni-cyan shadow-neon-cyan rounded-lg' : ''}
                    `}
                  >
                    {getGameComponent(section.id, section.phase)}
                  </motion.div>
                </div>
              </section>
            );
          }

          // Narrative Panels
          return (
            <section key={section.id} className="w-full py-16 md:py-24 px-4 md:px-8 flex justify-center relative">
              {/* Connector Line */}
              {index < activeSections.length - 1 && (
                <div 
                  className="absolute left-1/2 bottom-0 w-1 h-16 md:h-24 -translate-x-1/2 z-0 hidden md:block"
                  style={{ backgroundColor: `${config.colors.primary}30` }}
                />
              )}

              {section.onomatopoeia && (
                <Onomatopoeia 
                  text={section.onomatopoeia.text}
                  x={section.onomatopoeia.x}
                  y={section.onomatopoeia.y}
                  rotate={section.onomatopoeia.rotate}
                />
              )}

              <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16 items-center">
                {/* Narrative */}
                <div className={`
                  md:col-span-5 relative z-20 
                  ${isOdd ? 'md:order-1 md:text-right flex md:justify-end' : 'md:order-2 md:text-left flex md:justify-start'}
                `}>
                  <ComicCaption scene={section.scene || ''} phase={section.phase} />
                </div>

                {/* Visual Panel */}
                <div className={`
                  md:col-span-7 relative z-10
                  ${isOdd ? 'md:order-2' : 'md:order-1'}
                `}>
                  <ComicPanel 
                    title={section.title}
                    image={section.image}
                    className={`
                      transition-transform duration-500 
                      ${isOdd ? 'rotate-1' : '-rotate-1'}
                    `}
                  />
                </div>
              </div>
            </section>
          );
        })}

        {/* Footer */}
        <footer 
          className="w-full py-24 md:py-32 text-center relative mt-16 md:mt-24 overflow-hidden"
          style={{ backgroundColor: config.colors.panel }}
        >
          <div 
            className="absolute top-0 left-0 w-full h-4 md:h-8"
            style={{ 
              background: `linear-gradient(90deg, ${config.colors.primary}, ${config.colors.secondary || config.colors.accent})` 
            }}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ margin: '-100px' }}
            className="relative z-10 px-4"
          >
            <h2 
              className={`
                text-4xl md:text-7xl lg:text-9xl mb-4 md:mb-6 glitch-text
                ${mode === 'peter' ? 'font-title text-spidey-yellow drop-shadow-[4px_4px_0_#E62429]' : ''}
                ${mode === 'miles' ? 'font-shout text-miles-pink' : ''}
                ${mode === 'gwen' ? 'font-title text-gwen-pink' : ''}
                ${mode === 'noir' ? 'font-noir text-noir-gold tracking-wider' : ''}
                ${mode === 'peni' ? 'font-anime text-2xl md:text-4xl lg:text-6xl text-peni-cyan' : ''}
              `}
              data-text="TO BE CONTINUED..."
            >
              TO BE CONTINUED...
            </h2>
            <div className="flex items-center justify-center gap-4 mt-6 md:mt-8">
              <Globe size={24} className="md:w-8 md:h-8" style={{ color: config.colors.primary }} />
              <p className="font-tech text-xs md:text-sm tracking-[0.3em] md:tracking-[0.5em] uppercase opacity-60" style={{ color: config.colors.text }}>
                {config.universeName} // SPIDER-VERSE // 2025
              </p>
            </div>
          </motion.div>
        </footer>
      </div>
    </motion.div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
