import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { TypewriterText } from './TypewriterText';

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
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Stories</span>
        </Button>

        <Card className="p-8 bg-gradient-story shadow-enchanted">
          <div className="space-y-6">
            <div className="text-center border-b border-border pb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">{story.title}</h1>
              <p className="text-accent font-medium">by {story.author}</p>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handleStartReading}
                disabled={isReading}
                className="flex items-center space-x-2"
              >
                {isReading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isReading ? 'Reading...' : 'Begin Story'}</span>
              </Button>
            </div>

            <div className="prose prose-lg max-w-none">
              {isReading ? (
                <TypewriterText 
                  text={story.content}
                  speed={80}
                  className="text-foreground leading-relaxed text-lg"
                />
              ) : (
                <div className="text-muted-foreground text-center py-12">
                  Click "Begin Story" to start the magical reading experience...
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};