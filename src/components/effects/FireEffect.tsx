import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface FlameProps {
  delay: number;
  x: number;
  scale: number;
}

const Flame = ({ delay, x, scale }: FlameProps) => (
  <motion.div
    className="absolute bottom-0 w-2 h-8 rounded-full"
    style={{
      background: `linear-gradient(to top, 
        rgba(255, 100, 0, 0.8) 0%, 
        rgba(255, 200, 0, 0.6) 50%, 
        rgba(255, 255, 0, 0.3) 100%)`,
      left: `${x}%`,
      filter: 'blur(1px)',
    }}
    initial={{ scaleY: 0, opacity: 0 }}
    animate={{ 
      scaleY: [0, scale, scale * 0.8, scale],
      scaleX: [1, 1.2, 0.8, 1],
      opacity: [0, 0.8, 0.6, 0.8]
    }}
    transition={{
      duration: 2 + Math.random(),
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

const Ember = ({ delay, x }: { delay: number; x: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-orange-400 rounded-full"
    style={{ left: `${x}%`, bottom: '10%' }}
    initial={{ y: 0, opacity: 0.8 }}
    animate={{ 
      y: -200,
      x: Math.random() * 40 - 20,
      opacity: 0
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeOut"
    }}
  />
);

export const FireEffect = () => {
  const flames = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 2,
      x: 20 + (i * 3) + Math.random() * 5,
      scale: 0.5 + Math.random() * 0.8,
    })), 
  []);

  const embers = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      delay: Math.random() * 3,
      x: 25 + Math.random() * 50,
    })), 
  []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32">
        {flames.map((flame) => (
          <Flame
            key={flame.id}
            delay={flame.delay}
            x={flame.x}
            scale={flame.scale}
          />
        ))}
        {embers.map((ember) => (
          <Ember
            key={ember.id}
            delay={ember.delay}
            x={ember.x}
          />
        ))}
      </div>
    </div>
  );
};