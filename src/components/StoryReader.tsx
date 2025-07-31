import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { TypewriterText } from './TypewriterText';
import { AnimatedBackground } from './AnimatedBackground';

interface Story {
  id: string;
  title: string;
  content: string;
  author: string;
}

interface StoryReaderProps {
  story: Story;
  onBack: () => void;
}

export const StoryReader = ({ story, onBack }: StoryReaderProps) => {
  const [isReading, setIsReading] = useState(false);

  const handleStartReading = () => {
    setIsReading(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 relative">
      <AnimatedBackground />
      
      <div className="relative z-20 container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-6 flex items-center space-x-2 bg-card/80 backdrop-blur-md border border-border hover:bg-card"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Stories</span>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="p-8 bg-card/90 backdrop-blur-xl shadow-enchanted border border-border/50">
            <div className="space-y-6">
              <motion.div 
                className="text-center border-b border-border pb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h1 className="text-3xl font-bold text-foreground mb-2">{story.title}</h1>
                <p className="text-accent font-medium">by {story.author}</p>
              </motion.div>

              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Button 
                  onClick={handleStartReading}
                  disabled={isReading}
                  className="flex items-center space-x-2 shadow-glow"
                >
                  {isReading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span>{isReading ? 'Reading...' : 'Begin Story'}</span>
                </Button>
              </motion.div>

              <motion.div 
                className="prose prose-lg max-w-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {isReading ? (
                  <TypewriterText 
                    text={story.content}
                    speed={50}
                    className="text-foreground leading-relaxed text-lg"
                  />
                ) : (
                  <div className="text-muted-foreground text-center py-12">
                    Click "Begin Story" to start the magical reading experience...
                  </div>
                )}
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};