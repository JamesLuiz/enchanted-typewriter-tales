import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SnowEffect } from './effects/SnowEffect';
import { FireEffect } from './effects/FireEffect';
import { FirefliesEffect } from './effects/FirefliesEffect';
import { PetalsEffect } from './effects/PetalsEffect';
import { LeavesEffect } from './effects/LeavesEffect';
import { StarsEffect } from './effects/StarsEffect';

// Import all background images
import snowyNight from '@/assets/bg-snowy-night.jpg';
import fireplace from '@/assets/bg-fireplace.jpg';
import mysticalFireflies from '@/assets/bg-mystical-fireflies.jpg';
import moonlitLake from '@/assets/bg-moonlit-lake.jpg';
import cherryBlossoms from '@/assets/bg-cherry-blossoms.jpg';
import autumnLeaves from '@/assets/bg-autumn-leaves.jpg';
import auroraStars from '@/assets/bg-aurora-stars.jpg';
import lavenderField from '@/assets/bg-lavender-field.jpg';

interface BackgroundConfig {
  image: string;
  effect?: React.ComponentType;
  name: string;
}

const backgrounds: BackgroundConfig[] = [
  { image: snowyNight, effect: SnowEffect, name: 'Snowy Night Forest' },
  { image: fireplace, effect: FireEffect, name: 'Cozy Fireplace' },
  { image: mysticalFireflies, effect: FirefliesEffect, name: 'Mystical Fireflies' },
  { image: moonlitLake, name: 'Moonlit Lake' },
  { image: cherryBlossoms, effect: PetalsEffect, name: 'Cherry Blossoms' },
  { image: autumnLeaves, effect: LeavesEffect, name: 'Autumn Forest' },
  { image: auroraStars, effect: StarsEffect, name: 'Aurora Stars' },
  { image: lavenderField, name: 'Lavender Field' },
];

export const AnimatedBackground = () => {
  const [currentBackground, setCurrentBackground] = useState<BackgroundConfig>(
    () => backgrounds[Math.floor(Math.random() * backgrounds.length)]
  );

  // Change background every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const nextBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
      setCurrentBackground(nextBg);
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  const EffectComponent = currentBackground.effect;

  return (
    <>
      <motion.div
        key={currentBackground.image}
        className="fixed inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          backgroundImage: `url(${currentBackground.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="fixed inset-0 bg-background/30 dark:bg-background/50 z-[1]" />
      {EffectComponent && <EffectComponent />}
    </>
  );
};