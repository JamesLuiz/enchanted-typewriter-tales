import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, PenTool, Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface NavigationProps {
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export const Navigation = ({ isMusicPlaying, onToggleMusic }: NavigationProps) => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-mystical bg-clip-text text-transparent">
              Enchanted Tales
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button 
                variant={location.pathname === '/' ? 'default' : 'ghost'}
                className="flex items-center space-x-2"
              >
                <BookOpen className="h-4 w-4" />
                <span>Stories</span>
              </Button>
            </Link>
            
            <Link to="/create">
              <Button 
                variant={location.pathname === '/create' ? 'default' : 'ghost'}
                className="flex items-center space-x-2"
              >
                <PenTool className="h-4 w-4" />
                <span>Create</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-4"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleMusic}
            >
              {isMusicPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};