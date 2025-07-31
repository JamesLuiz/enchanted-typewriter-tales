import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock } from 'lucide-react';

interface StoryCardProps {
  title: string;
  preview: string;
  author: string;
  readTime: string;
  onRead: () => void;
}

export const StoryCard = ({ title, preview, author, readTime, onRead }: StoryCardProps) => {
  return (
    <Card className="p-6 bg-gradient-story hover:shadow-enchanted transition-all duration-500 group cursor-pointer animate-fade-in">
      <div onClick={onRead} className="space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {readTime}
          </div>
        </div>
        
        <p className="text-muted-foreground leading-relaxed line-clamp-3">
          {preview}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-accent font-medium">by {author}</span>
          <Button size="sm" className="flex items-center space-x-2">
            <BookOpen className="h-3 w-3" />
            <span>Read Story</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};