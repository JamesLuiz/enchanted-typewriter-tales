import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface SnowflakeProps {
  delay: number;
  duration: number;
  x: number;
}

const Snowflake = ({ delay, duration, x }: SnowflakeProps) => (
  <motion.div
    className="absolute w-1 h-1 bg-white rounded-full opacity-80"
    initial={{ y: -10, x, opacity: 0 }}
    animate={{ 
      y: window.innerHeight + 10, 
      x: x + Math.random() * 100 - 50,
      opacity: [0, 1, 1, 0]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "linear",
      opacity: { times: [0, 0.1, 0.9, 1] }
    }}
    style={{ 
      filter: 'blur(0.5px)',
      boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)'
    }}
  />
);

export const SnowEffect = () => {
  const snowflakes = useMemo(() => 
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 12,
      x: Math.random() * window.innerWidth,
    })), 
  []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {snowflakes.map((flake) => (
        <Snowflake
          key={flake.id}
          delay={flake.delay}
          duration={flake.duration}
          x={flake.x}
        />
      ))}
    </div>
  );
};