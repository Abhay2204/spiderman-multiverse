import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface OnomatopoeiaProps {
  text: string;
  x: string;
  y: string;
  rotate?: number;
  speed?: number;
}

export const Onomatopoeia: React.FC<OnomatopoeiaProps> = ({ 
  text, 
  x, 
  y, 
  rotate = 0,
  speed = 2 
}) => {
  const { mode, config } = useTheme();

  const getStyles = () => {
    switch (mode) {
      case 'peter':
        return {
          className: 'font-shout text-spidey-red',
          textShadow: '4px 4px 0px #000, -2px -2px 0px #F3D403',
          WebkitTextStroke: '3px black',
        };
      case 'miles':
        return {
          className: 'font-shout text-miles-pink glitch-text',
          textShadow: '3px 3px 0px #BE0AFF, -2px -2px 0px #00CED1',
          WebkitTextStroke: '2px white',
        };
      case 'gwen':
        return {
          className: 'font-title text-gwen-pink',
          textShadow: '3px 3px 0px #00CED1',
          WebkitTextStroke: '2px white',
        };
      case 'noir':
        return {
          className: 'font-noir text-noir-gold tracking-wider',
          textShadow: '2px 2px 0px #000',
          WebkitTextStroke: '1px #D4AF37',
        };
      case 'peni':
        return {
          className: 'font-anime text-peni-cyan',
          textShadow: '0 0 20px #00D4FF, 0 0 40px #FF6B9D',
          WebkitTextStroke: '1px #FF6B9D',
        };
      default:
        return {
          className: 'font-shout text-white',
          textShadow: '3px 3px 0px #000',
          WebkitTextStroke: '2px black',
        };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ scale: 0, rotate: rotate - 20, opacity: 0 }}
      whileInView={{ scale: 1, rotate: rotate, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 15,
        delay: 0.2 
      }}
      className={`
        absolute z-40 pointer-events-none select-none
        text-4xl md:text-6xl lg:text-8xl
        ${styles.className}
      `}
      style={{ 
        left: x, 
        top: y,
        textShadow: styles.textShadow,
        WebkitTextStroke: styles.WebkitTextStroke,
        transform: `rotate(${rotate}deg)`,
      }}
      data-text={text}
    >
      <motion.span
        animate={{ 
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          duration: speed, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </motion.div>
  );
};
