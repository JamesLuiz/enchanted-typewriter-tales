import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface StarProps {
  delay: number;
  x: number;
  y: number;
  size: number;
}

const Star = ({ delay, x, y, size }: StarProps) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      left: x,
      top: y,
      width: size,
      height: size,
      background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(173, 216, 230, 0.8) 50%, transparent 100%)',
      filter: 'blur(0.5px)',
      boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.6)`,
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0.7, 1],
      scale: [0, 1, 1.2, 1]
    }}
    transition={{
      duration: 3 + Math.random() * 2,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

const ShootingStar = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-white rounded-full"
    style={{
      filter: 'blur(0.5px)',
      boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
    }}
    initial={{ 
      x: Math.random() * window.innerWidth,
      y: Math.random() * 200,
      opacity: 0 
    }}
    animate={{ 
      x: Math.random() * window.innerWidth + 200,
      y: Math.random() * 200 + 200,
      opacity: [0, 1, 0]
    }}
    transition={{
      duration: 1.5,
      delay,
      repeat: Infinity,
      repeatDelay: 8 + Math.random() * 10,
      ease: "easeOut"
    }}
  />
);

export const StarsEffect = () => {
  const stars = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 0.6,
      size: 2 + Math.random() * 4,
    })), 
  []);

  const shootingStars = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      delay: Math.random() * 10,
    })), 
  []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {stars.map((star) => (
        <Star
          key={star.id}
          delay={star.delay}
          x={star.x}
          y={star.y}
          size={star.size}
        />
      ))}
      {shootingStars.map((star) => (
        <ShootingStar
          key={star.id}
          delay={star.delay}
        />
      ))}
    </div>
  );
};