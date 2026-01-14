import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { ComicPanelProps } from '../../types';
import { Pencil } from 'lucide-react';

interface ExtendedComicPanelProps extends ComicPanelProps {
  image?: string;
}

export const ComicPanel: React.FC<ExtendedComicPanelProps> = ({ 
  children, 
  className = '', 
  title,
  image,
}) => {
  const { mode, config } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px", amount: 0.3 });
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yContainer = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const rotateContainer = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0, -1]);

  const getImageFilter = () => {
    switch (mode) {
      case 'peter': return 'comic-filter';
      case 'miles': return 'contrast-110 saturate-120';
      case 'gwen': return 'saturate-110';
      case 'noir': return 'noir-filter';
      case 'peni': return 'anime-filter';
      default: return '';
    }
  };

  return (
    <motion.div
      ref={ref}
      style={{ y: yContainer, rotate: rotateContainer }}
      className={`relative w-full max-w-3xl mx-auto my-8 md:my-16 ${className}`}
    >
      {/* Shadow Layer */}
      <div className={`
        absolute top-0 left-0 w-full h-full transform translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-4
        transition-colors duration-500 z-0
        ${mode === 'peter' ? 'bg-comic-ink' : ''}
        ${mode === 'miles' ? 'bg-miles-pink/30' : ''}
        ${mode === 'gwen' ? 'bg-gwen-pink/30' : ''}
        ${mode === 'noir' ? 'bg-noir-gold/20' : ''}
        ${mode === 'peni' ? 'bg-peni-cyan/30 rounded-lg' : ''}
      `} />

      {/* Panel Frame */}
      <div className={`
        relative z-10 overflow-hidden transition-all duration-500 aspect-[4/3] md:aspect-[16/9]
        ${mode === 'peter' ? 'bg-white border-4 md:border-[5px] border-comic-ink rounded-sm' : ''}
        ${mode === 'miles' ? 'bg-black border-2 border-miles-pink' : ''}
        ${mode === 'gwen' ? 'bg-gwen-black border-2 border-gwen-pink' : ''}
        ${mode === 'noir' ? 'bg-black border-2 border-noir-gold' : ''}
        ${mode === 'peni' ? 'bg-black border-2 border-peni-cyan rounded-lg' : ''}
      `}>
        
        {/* Decorative Elements */}
        {mode === 'peter' && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 md:w-32 h-6 md:h-8 bg-comic-paper opacity-90 rotate-2 z-30 shadow-sm border border-black/10 flex items-center justify-center">
            <span className="font-shout text-[8px] md:text-[10px] text-gray-500 opacity-50">TAPE-01</span>
          </div>
        )}
        
        {mode === 'miles' && (
          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-miles-pink animate-pulse z-30" />
        )}

        {mode === 'peni' && (
          <div className="absolute top-2 left-2 right-2 h-1 bg-gradient-to-r from-peni-cyan via-peni-pink to-peni-yellow rounded z-30" />
        )}

        {/* Header Strip */}
        {title && (
          <div className={`
            absolute top-0 left-0 z-30 px-2 md:px-3 py-1 border-r-2 md:border-r-[3px] border-b-2 md:border-b-[3px]
            ${mode === 'peter' ? 'bg-spidey-yellow border-comic-ink' : ''}
            ${mode === 'miles' ? 'bg-miles-pink border-white' : ''}
            ${mode === 'gwen' ? 'bg-gwen-pink border-gwen-cyan' : ''}
            ${mode === 'noir' ? 'bg-noir-black border-noir-gold' : ''}
            ${mode === 'peni' ? 'bg-peni-cyan border-peni-pink rounded-br-lg' : ''}
          `}>
            <h3 className={`
              text-base md:text-xl tracking-wide uppercase leading-none
              ${mode === 'peter' ? 'font-title text-comic-ink' : ''}
              ${mode === 'miles' ? 'font-shout text-black' : ''}
              ${mode === 'gwen' ? 'font-title text-white' : ''}
              ${mode === 'noir' ? 'font-noir text-noir-gold tracking-wider' : ''}
              ${mode === 'peni' ? 'font-anime text-black text-xs md:text-sm' : ''}
            `}>
              {title}
            </h3>
          </div>
        )}

        {/* Content */}
        <div className="relative w-full h-full bg-gray-900 group flex items-center justify-center">
          {image ? (
            <>
              {/* Skeleton Loader */}
              {!isLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-400">
                  <Pencil size={32} className="animate-bounce mb-2" />
                  <span className="font-shout text-sm">SKETCHING...</span>
                </div>
              )}
              
              {/* Image */}
              <motion.img 
                src={image} 
                alt={title}
                onLoad={() => setIsLoaded(true)}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={isLoaded ? { scale: isInView ? 1 : 1.1, opacity: 1 } : {}}
                transition={{ duration: 0.7 }}
                className={`max-w-full max-h-full object-contain ${getImageFilter()}`}
              />

              {/* Texture Overlays */}
              {mode === 'peter' && (
                <div className="absolute inset-0 bg-halftone bg-[length:4px_4px] md:bg-[length:6px_6px] opacity-20 pointer-events-none mix-blend-overlay" />
              )}
              {mode === 'miles' && (
                <div className="absolute inset-0 halftone-overlay opacity-30 pointer-events-none" />
              )}
              {mode === 'gwen' && (
                <div className="absolute inset-0 punk-dots opacity-10 pointer-events-none" />
              )}
              {mode === 'noir' && (
                <div className="absolute inset-0 film-grain opacity-40 pointer-events-none" />
              )}
              {mode === 'peni' && (
                <div className="absolute inset-0 scanlines pointer-events-none" />
              )}

              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="p-8 h-full flex items-center justify-center bg-comic-paper relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-50" />
              {children}
            </div>
          )}
        </div>

        {/* Mode-specific overlays */}
        {mode === 'miles' && (
          <div className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay opacity-20 bg-gradient-to-br from-miles-pink to-transparent" />
        )}
        {mode === 'peni' && (
          <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-t from-peni-cyan/10 to-transparent" />
        )}
      </div>
    </motion.div>
  );
};
