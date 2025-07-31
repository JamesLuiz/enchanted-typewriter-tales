import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface LeafProps {
  delay: number;
  duration: number;
  x: number;
  rotation: number;
  color: string;
}

const Leaf = ({ delay, duration, x, rotation, color }: LeafProps) => (
  <motion.div
    className="absolute w-4 h-3 opacity-80"
    style={{
      background: color,
      borderRadius: '50% 10% 50% 10%',
      filter: 'blur(0.3px)',
    }}
    initial={{ 
      y: -10, 
      x, 
      rotate: rotation,
      opacity: 0 
    }}
    animate={{ 
      y: window.innerHeight + 10,
      x: x + Math.sin(Date.now() / 1000 + delay) * 120,
      rotate: rotation + 720,
      opacity: [0, 0.8, 0.6, 0]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
      opacity: { times: [0, 0.2, 0.8, 1] }
    }}
  />
);

export const LeavesEffect = () => {
  const leaves = useMemo(() => 
    Array.from({ length: 35 }, (_, i) => {
      const colors = [
        'linear-gradient(135deg, rgba(255, 140, 0, 0.8) 0%, rgba(255, 69, 0, 0.6) 100%)',
        'linear-gradient(135deg, rgba(255, 215, 0, 0.8) 0%, rgba(255, 165, 0, 0.6) 100%)',
        'linear-gradient(135deg, rgba(220, 20, 60, 0.8) 0%, rgba(255, 69, 0, 0.6) 100%)',
        'linear-gradient(135deg, rgba(139, 69, 19, 0.8) 0%, rgba(160, 82, 45, 0.6) 100%)',
      ];
      
      return {
        id: i,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 10,
        x: Math.random() * window.innerWidth,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    }), 
  []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {leaves.map((leaf) => (
        <Leaf
          key={leaf.id}
          delay={leaf.delay}
          duration={leaf.duration}
          x={leaf.x}
          rotation={leaf.rotation}
          color={leaf.color}
        />
      ))}
    </div>
  );
};