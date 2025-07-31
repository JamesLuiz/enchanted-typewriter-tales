import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Download } from 'lucide-react';

interface StoryCardProps {
  title: string;
  preview: string;
  author: string;
  readTime: string;
  content?: string;
  onRead: () => void;
}

export const StoryCard = ({ title, preview, author, readTime, content, onRead }: StoryCardProps) => {
  const handleDownload = () => {
    if (!content) return;
    
    const storyText = `${title}\nBy ${author}\n\n${content}`;
    const blob = new Blob([storyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <Card className="p-4 sm:p-6 bg-gradient-story hover:shadow-enchanted transition-all duration-500 group cursor-pointer animate-fade-in">
      <div onClick={onRead} className="space-y-3 sm:space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {readTime}
          </div>
        </div>
        
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
          {preview}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs sm:text-sm text-accent font-medium">by {author}</span>
          <div className="flex items-center gap-2">
            {content && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className="bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground border-secondary/30 p-2"
              >
                <Download className="h-3 w-3" />
              </Button>
            )}
            <Button size="sm" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <BookOpen className="h-3 w-3" />
              <span className="hidden sm:inline">Read Story</span>
              <span className="sm:hidden">Read</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};