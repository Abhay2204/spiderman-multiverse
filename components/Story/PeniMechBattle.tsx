import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Shield, Zap, Heart, Target, RotateCcw } from 'lucide-react';

interface Enemy {
  id: number;
  x: number;
  health: number;
  maxHealth: number;
  type: 'drone' | 'mech' | 'boss';
}

export const PeniMechBattle: React.FC = () => {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [energy, setEnergy] = useState(100);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerY, setPlayerY] = useState(50);
  const [isShielding, setIsShielding] = useState(false);
  const [projectiles, setProjectiles] = useState<{id: number, x: number, y: number}[]>([]);
  const [effects, setEffects] = useState<{id: number, x: number, y: number, type: string}[]>([]);

  const spawnWave = useCallback(() => {
    const newEnemies: Enemy[] = [];
    const enemyCount = Math.min(3 + wave, 8);
    
    for (let i = 0; i < enemyCount; i++) {
      const type = wave >= 5 && i === 0 ? 'boss' : wave >= 3 && Math.random() > 0.7 ? 'mech' : 'drone';
      newEnemies.push({
        id: Date.now() + i,
        x: 100 + (i * 15),
        health: type === 'boss' ? 50 : type === 'mech' ? 20 : 10,
        maxHealth: type === 'boss' ? 50 : type === 'mech' ? 20 : 10,
        type,
      });
    }
    setEnemies(newEnemies);
  }, [wave]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      // Move enemies
      setEnemies(prev => {
        const updated = prev.map(e => ({ ...e, x: e.x - 0.5 }));
        
        // Check collision with player
        updated.forEach(enemy => {
          if (enemy.x <= 15 && !isShielding) {
            setPlayerHealth(h => {
              const damage = enemy.type === 'boss' ? 20 : enemy.type === 'mech' ? 10 : 5;
              const newHealth = Math.max(0, h - damage);
              if (newHealth <= 0) setGameOver(true);
              return newHealth;
            });
          }
        });

        return updated.filter(e => e.x > 10);
      });

      // Move projectiles
      setProjectiles(prev => {
        const updated = prev.map(p => ({ ...p, x: p.x + 3 }));
        return updated.filter(p => p.x < 100);
      });

      // Check projectile hits
      setProjectiles(prev => {
        const remaining: typeof prev = [];
        prev.forEach(proj => {
          let hit = false;
          setEnemies(enemies => {
            return enemies.map(enemy => {
              if (!hit && Math.abs(proj.x - enemy.x) < 8 && Math.abs(proj.y - (30 + (enemy.id % 40))) < 15) {
                hit = true;
                const newHealth = enemy.health - 10;
                if (newHealth <= 0) {
                  setScore(s => s + (enemy.type === 'boss' ? 500 : enemy.type === 'mech' ? 200 : 100));
                  addEffect(enemy.x, 30 + (enemy.id % 40), 'explosion');
                  return { ...enemy, health: 0 };
                }
                addEffect(proj.x, proj.y, 'hit');
                return { ...enemy, health: newHealth };
              }
              return enemy;
            }).filter(e => e.health > 0);
          });
          if (!hit) remaining.push(proj);
        });
        return remaining;
      });

      // Recharge energy
      setEnergy(e => Math.min(100, e + 0.5));
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, isShielding]);

  // Spawn new wave when enemies cleared
  useEffect(() => {
    if (gameStarted && !gameOver && enemies.length === 0) {
      setTimeout(() => {
        setWave(w => w + 1);
        spawnWave();
      }, 1000);
    }
  }, [enemies.length, gameStarted, gameOver, spawnWave]);

  const addEffect = (x: number, y: number, type: string) => {
    const effect = { id: Date.now() + Math.random(), x, y, type };
    setEffects(prev => [...prev, effect]);
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== effect.id));
    }, 300);
  };

  const shoot = () => {
    if (energy < 10) return;
    setEnergy(e => e - 10);
    setProjectiles(prev => [...prev, { id: Date.now(), x: 15, y: playerY }]);
  };

  const activateShield = () => {
    if (energy < 30 || isShielding) return;
    setEnergy(e => e - 30);
    setIsShielding(true);
    setTimeout(() => setIsShielding(false), 2000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPlayerY(Math.max(20, Math.min(80, y)));
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setPlayerHealth(100);
    setEnergy(100);
    setScore(0);
    setWave(1);
    setEnemies([]);
    setProjectiles([]);
    spawnWave();
  };

  return (
    <div 
      className="relative w-full h-[500px] bg-gradient-to-r from-peni-purple/20 via-black to-peni-cyan/20 overflow-hidden select-none cursor-crosshair"
      onMouseMove={handleMouseMove}
      onClick={shoot}
    >
      {/* Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none z-40" />
      
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(#00D4FF 1px, transparent 1px), linear-gradient(90deg, #00D4FF 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Neo Tokyo Skyline */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30">
        <div className="absolute bottom-0 left-[10%] w-8 h-24 bg-peni-cyan" />
        <div className="absolute bottom-0 left-[20%] w-12 h-32 bg-peni-pink" />
        <div className="absolute bottom-0 left-[35%] w-6 h-20 bg-peni-cyan" />
        <div className="absolute bottom-0 left-[50%] w-16 h-28 bg-peni-yellow" />
        <div className="absolute bottom-0 left-[70%] w-10 h-36 bg-peni-pink" />
        <div className="absolute bottom-0 left-[85%] w-8 h-22 bg-peni-cyan" />
      </div>

      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-start pointer-events-none">
        <div className="space-y-2">
          {/* Health */}
          <div className="bg-black/80 border border-peni-pink px-3 py-2 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Heart size={14} className="text-peni-pink" />
              <span className="text-[10px] font-anime text-peni-pink">HP</span>
            </div>
            <div className="w-24 h-2 bg-black rounded overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-peni-pink to-red-500"
                animate={{ width: `${playerHealth}%` }}
              />
            </div>
          </div>
          
          {/* Energy */}
          <div className="bg-black/80 border border-peni-cyan px-3 py-2 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-peni-cyan" />
              <span className="text-[10px] font-anime text-peni-cyan">ENERGY</span>
            </div>
            <div className="w-24 h-2 bg-black rounded overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-peni-cyan to-blue-500"
                animate={{ width: `${energy}%` }}
              />
            </div>
          </div>
        </div>

        <div className="text-right space-y-2">
          <div className="bg-black/80 border border-peni-yellow px-4 py-2 rounded-lg">
            <div className="text-peni-yellow font-anime text-xl">{score}</div>
            <div className="text-white/60 text-[8px] font-anime">SCORE</div>
          </div>
          <div className="bg-black/80 border border-peni-purple px-4 py-2 rounded-lg">
            <div className="text-peni-purple font-anime">WAVE {wave}</div>
          </div>
        </div>
      </div>

      {/* Player Mech */}
      <motion.div
        className="absolute left-[5%] z-20"
        animate={{ top: `${playerY}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ transform: 'translateY(-50%)' }}
      >
        <div className={`relative ${isShielding ? 'animate-pulse' : ''}`}>
          {/* Shield Effect */}
          {isShielding && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-[-20px] rounded-full border-4 border-peni-cyan bg-peni-cyan/20"
              style={{ boxShadow: '0 0 30px #00D4FF' }}
            />
          )}
          
          {/* Mech Body */}
          <div className="w-16 h-20 relative">
            <Cpu size={64} className="text-peni-cyan drop-shadow-[0_0_10px_#00D4FF]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-peni-pink animate-pulse" />
          </div>
        </div>
      </motion.div>

      {/* Projectiles */}
      {projectiles.map(proj => (
        <motion.div
          key={proj.id}
          className="absolute w-8 h-2 bg-gradient-to-r from-peni-cyan to-peni-pink rounded-full z-10"
          style={{ 
            left: `${proj.x}%`, 
            top: `${proj.y}%`,
            boxShadow: '0 0 10px #00D4FF, 0 0 20px #FF6B9D',
          }}
        />
      ))}

      {/* Enemies */}
      {enemies.map(enemy => (
        <motion.div
          key={enemy.id}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute z-10"
          style={{ 
            left: `${enemy.x}%`, 
            top: `${30 + (enemy.id % 40)}%`,
            transform: 'translateY(-50%)',
          }}
        >
          <div className="relative">
            <Target 
              size={enemy.type === 'boss' ? 48 : enemy.type === 'mech' ? 36 : 24} 
              className={`
                ${enemy.type === 'boss' ? 'text-red-500' : enemy.type === 'mech' ? 'text-orange-500' : 'text-yellow-500'}
              `}
              style={{ 
                filter: `drop-shadow(0 0 10px ${enemy.type === 'boss' ? '#ef4444' : enemy.type === 'mech' ? '#f97316' : '#eab308'})` 
              }}
            />
            {/* Health Bar */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full h-1 bg-black/50 rounded">
              <div 
                className="h-full bg-red-500 rounded transition-all"
                style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      ))}

      {/* Effects */}
      <AnimatePresence>
        {effects.map(effect => (
          <motion.div
            key={effect.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="absolute pointer-events-none z-30"
            style={{ left: `${effect.x}%`, top: `${effect.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {effect.type === 'explosion' ? (
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-peni-yellow to-peni-pink" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-peni-cyan" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Shield Button */}
      {gameStarted && !gameOver && (
        <button
          onClick={(e) => { e.stopPropagation(); activateShield(); }}
          disabled={energy < 30 || isShielding}
          className={`
            absolute bottom-4 right-4 z-30 px-4 py-2 rounded-lg font-anime text-xs
            flex items-center gap-2 transition-all pointer-events-auto
            ${energy >= 30 && !isShielding 
              ? 'bg-peni-cyan/20 border border-peni-cyan text-peni-cyan hover:bg-peni-cyan/40' 
              : 'bg-gray-800/50 border border-gray-600 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <Shield size={16} />
          SHIELD (30)
        </button>
      )}

      {/* Instructions */}
      {gameStarted && !gameOver && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-[10px] font-anime z-20 pointer-events-none">
          MOVE MOUSE • CLICK TO SHOOT
        </div>
      )}

      {/* Start/Game Over Screen */}
      {(!gameStarted || gameOver) && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-8 border-2 border-peni-cyan bg-black/90 rounded-lg max-w-md"
            style={{ boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)' }}
          >
            {gameOver ? (
              <>
                <Cpu size={48} className="text-peni-pink mx-auto mb-4" />
                <h2 className="font-anime text-2xl text-peni-cyan mb-2">SYSTEM OFFLINE</h2>
                <p className="font-anime text-peni-yellow text-xl mb-2">SCORE: {score}</p>
                <p className="font-anime text-white/60 text-sm mb-4">WAVE REACHED: {wave}</p>
              </>
            ) : (
              <>
                <Cpu size={48} className="text-peni-cyan mx-auto mb-4 animate-pulse" />
                <h2 className="font-anime text-2xl text-white mb-2">SP//dr ONLINE</h2>
                <p className="font-body text-white/60 text-sm mb-6">
                  Move mouse to control. Click to shoot. Defend Neo Tokyo!
                </p>
              </>
            )}
            
            <button 
              onClick={startGame}
              className="px-8 py-3 bg-peni-cyan hover:bg-cyan-400 text-black font-anime text-sm tracking-wider rounded-lg border-2 border-peni-pink shadow-[0_0_20px_rgba(0,212,255,0.5)] transition-all"
            >
              {gameOver ? "REBOOT" : "START MISSION"}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
