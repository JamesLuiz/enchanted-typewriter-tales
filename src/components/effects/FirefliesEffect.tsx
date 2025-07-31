import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface FireflyProps {
  delay: number;
  duration: number;
  x: number;
  y: number;
}

const Firefly = ({ delay, duration, x, y }: FireflyProps) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full"
    style={{
      background: 'radial-gradient(circle, rgba(255, 255, 150, 0.8) 0%, rgba(255, 255, 150, 0.3) 50%, transparent 100%)',
      filter: 'blur(0.5px)',
      boxShadow: '0 0 8px rgba(255, 255, 150, 0.6)',
    }}
    initial={{ x, y, opacity: 0 }}
    animate={{ 
      x: x + Math.sin(Date.now() / 1000) * 100,
      y: y + Math.cos(Date.now() / 1000) * 50,
      opacity: [0, 1, 0.7, 1, 0]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

export const FirefliesEffect = () => {
  const fireflies = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    })), 
  []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {fireflies.map((firefly) => (
        <Firefly
          key={firefly.id}
          delay={firefly.delay}
          duration={firefly.duration}
          x={firefly.x}
          y={firefly.y}
        />
      ))}
    </div>
  );
};