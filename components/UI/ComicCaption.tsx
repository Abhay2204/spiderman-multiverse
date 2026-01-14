import React, { useState, useEffect } from 'react';
import { getStoryBeat } from '../../services/geminiService';
import { StoryPhase } from '../../types';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface ComicCaptionProps {
  scene: string;
  phase: StoryPhase;
  className?: string;
  delay?: number;
}

export const ComicCaption: React.FC<ComicCaptionProps> = ({ scene, phase, className = '', delay = 0 }) => {
  const [content, setContent] = useState({ caption: "Scanning multiverse...", soundEffect: "" });
  const [loading, setLoading] = useState(true);
  const { mode, config } = useTheme();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getStoryBeat(scene, phase).then(data => {
      if (mounted) {
        setContent(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [scene, phase]);

  const getCharacterName = () => {
    switch (mode) {
      case 'peter': return 'Peter Parker';
      case 'miles': return 'Miles Morales';
      case 'gwen': return 'Gwen Stacy';
      case 'noir': return 'Spider-Noir';
      case 'peni': return 'Peni Parker';
      default: return 'Spider-Person';
    }
  };

  return (
    <div className={`relative z-20 max-w-sm ${className}`}>
      {/* Sound Effect */}
      {content.soundEffect && !loading && (
        <motion.div
          initial={{ scale: 0, rotate: -15, opacity: 0 }}
          whileInView={{ scale: 1, rotate: -5, opacity: 1 }}
          viewport={{ once: true }}
          className={`
            absolute -top-10 -right-4 md:-right-12 font-shout text-3xl md:text-5xl pointer-events-none z-50
            ${mode === 'peter' ? 'text-spidey-red' : ''}
            ${mode === 'miles' ? 'text-miles-pink glitch-text' : ''}
            ${mode === 'gwen' ? 'text-gwen-pink' : ''}
            ${mode === 'noir' ? 'text-noir-gold' : ''}
            ${mode === 'peni' ? 'text-peni-cyan font-anime text-xl md:text-3xl' : ''}
          `}
          style={{ 
            textShadow: mode === 'noir' ? 'none' : `3px 3px 0px ${config.colors.secondary || '#000'}`,
            WebkitTextStroke: mode === 'peni' ? '1px #FF6B9D' : mode === 'noir' ? 'none' : '2px black'
          }}
          data-text={content.soundEffect}
        >
          {content.soundEffect}!
        </motion.div>
      )}

      {/* Narrative Box */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className={`
          relative p-4 md:p-6
          ${mode === 'peter' ? 'bg-comic-paper border-4 border-comic-ink shadow-comic text-black' : ''}
          ${mode === 'miles' ? 'bg-black/90 border-2 border-miles-pink text-white shadow-neon-pink' : ''}
          ${mode === 'gwen' ? 'bg-gwen-black/90 border-2 border-gwen-pink text-white' : ''}
          ${mode === 'noir' ? 'bg-black border-2 border-noir-gold text-noir-white' : ''}
          ${mode === 'peni' ? 'bg-black/90 border-2 border-peni-cyan text-white rounded-lg shadow-neon-cyan' : ''}
        `}
      >
        {/* Corner Decoration */}
        {mode === 'peter' && (
          <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-gray-300 to-transparent z-10" />
        )}
        {mode === 'miles' && (
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-miles-pink opacity-50" />
        )}

        <p className={`
          font-bold text-base md:text-lg leading-tight uppercase
          ${loading ? 'animate-pulse opacity-50' : ''}
          ${mode === 'peter' ? 'font-body' : ''}
          ${mode === 'miles' ? 'font-body' : ''}
          ${mode === 'gwen' ? 'font-body' : ''}
          ${mode === 'noir' ? 'font-noir tracking-wide normal-case italic' : ''}
          ${mode === 'peni' ? 'font-body text-sm' : ''}
        `}>
          {content.caption}
        </p>

        {/* Caption Label */}
        <div className={`
          absolute -bottom-3 left-4 px-2 py-0.5 text-xs tracking-widest uppercase
          ${mode === 'peter' ? 'bg-spidey-yellow text-black border-2 border-black font-title' : ''}
          ${mode === 'miles' ? 'bg-miles-pink text-black font-shout skew-x-[-5deg]' : ''}
          ${mode === 'gwen' ? 'bg-gwen-cyan text-black font-title' : ''}
          ${mode === 'noir' ? 'bg-noir-gold text-black font-noir tracking-wider' : ''}
          ${mode === 'peni' ? 'bg-peni-pink text-black font-anime text-[10px] rounded' : ''}
        `}>
          {getCharacterName()}
        </div>
      </motion.div>
    </div>
  );
};
