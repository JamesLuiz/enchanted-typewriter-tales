import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface PetalProps {
  delay: number;
  duration: number;
  x: number;
  rotation: number;
}

const Petal = ({ delay, duration, x, rotation }: PetalProps) => (
  <motion.div
    className="absolute w-3 h-3 opacity-70"
    style={{
      background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.8) 0%, rgba(255, 218, 225, 0.6) 100%)',
      borderRadius: '50% 10% 50% 10%',
      filter: 'blur(0.5px)',
    }}
    initial={{ 
      y: -10, 
      x, 
      rotate: rotation,
      opacity: 0 
    }}
    animate={{ 
      y: window.innerHeight + 10,
      x: x + Math.sin(Date.now() / 1000) * 80,
      rotate: rotation + 360,
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

export const PetalsEffect = () => {
  const petals = useMemo(() => 
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
      x: Math.random() * window.innerWidth,
      rotation: Math.random() * 360,
    })), 
  []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {petals.map((petal) => (
        <Petal
          key={petal.id}
          delay={petal.delay}
          duration={petal.duration}
          x={petal.x}
          rotation={petal.rotation}
        />
      ))}
    </div>
  );
};