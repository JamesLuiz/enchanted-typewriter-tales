import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, Download } from 'lucide-react';
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

  const handleDownload = () => {
    const storyText = `${story.title}\nBy ${story.author}\n\n${story.content}`;
    const blob = new Blob([storyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-8 sm:pb-12 relative">
      <AnimatedBackground />
      
      <div className="relative z-20 container mx-auto px-4 sm:px-6 max-w-4xl">
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
          <Card className="p-4 sm:p-6 lg:p-8 bg-card/90 backdrop-blur-xl shadow-enchanted border border-border/50">
            <div className="space-y-4 sm:space-y-6">
              <motion.div 
                className="text-center border-b border-border pb-4 sm:pb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 mb-2">
                  <div className="text-center sm:text-left">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{story.title}</h1>
                    <p className="text-accent font-medium text-sm sm:text-base">by {story.author}</p>
                  </div>
                  <Button 
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    className="bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground border-secondary/30 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </div>
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
                  className="flex items-center space-x-2 shadow-glow text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                  size="lg"
                >
                  {isReading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span>{isReading ? 'Reading...' : 'Begin Story'}</span>
                </Button>
              </motion.div>

              <motion.div 
                className="prose prose-sm sm:prose-base lg:prose-lg max-w-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {isReading ? (
                  <TypewriterText 
                    text={story.content}
                    speed={50}
                    className="text-foreground leading-relaxed text-base sm:text-lg"
                  />
                ) : (
                  <div className="text-muted-foreground text-center py-8 sm:py-12 text-sm sm:text-base">
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