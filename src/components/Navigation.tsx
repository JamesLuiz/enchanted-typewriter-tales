import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, PenTool, Volume2, VolumeX, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavigationProps {
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export const Navigation = ({ isMusicPlaying, onToggleMusic }: NavigationProps) => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const NavigationItems = ({ mobile = false, onItemClick = () => {} }) => (
    <>
      <Link to="/" onClick={onItemClick}>
        <Button 
          variant={location.pathname === '/' ? 'default' : 'ghost'}
          className={`flex items-center space-x-2 ${mobile ? 'w-full justify-start' : ''}`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Stories</span>
        </Button>
      </Link>
      
      <Link to="/create" onClick={onItemClick}>
        <Button 
          variant={location.pathname === '/create' ? 'default' : 'ghost'}
          className={`flex items-center space-x-2 ${mobile ? 'w-full justify-start' : ''}`}
        >
          <PenTool className="h-4 w-4" />
          <span>Create</span>
        </Button>
      </Link>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={mobile ? 'w-full justify-start' : ''}
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        {mobile && <span className="ml-2">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleMusic}
        className={mobile ? 'w-full justify-start' : ''}
      >
        {isMusicPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        {mobile && <span className="ml-2">{isMusicPlaying ? 'Mute Music' : 'Play Music'}</span>}
      </Button>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-3 sm:px-6 py-2 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <BookOpen className="h-5 w-5 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-base sm:text-2xl font-bold bg-gradient-mystical bg-clip-text text-transparent">
              <span className="hidden sm:inline">Enchanted Tales</span>
              <span className="sm:hidden">Tales</span>
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <NavigationItems />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[280px] bg-card/95 backdrop-blur-xl">
                <div className="flex flex-col space-y-3 mt-6">
                  <NavigationItems mobile={true} onItemClick={() => setIsOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};