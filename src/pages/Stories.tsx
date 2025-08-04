import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { StoryCard } from '@/components/StoryCard';
import { StoryReader } from '@/components/StoryReader';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Input } from '@/components/ui/input';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  type CarouselApi 
} from '@/components/ui/carousel';

interface Story {
  id: string;
  title: string;
  content: string;
  author: string;
  preview: string;
  readTime: string;
}

const sampleStories: Story[] = [
  {
    id: '1',
    title: 'The Whispering Woods',
    author: 'Luna Silvermoon',
    readTime: '5 min',
    preview: 'Deep in the enchanted forest, where moonbeams dance between ancient oak trees, a young girl discovers a secret that will change her life forever...',
    content: `Deep in the enchanted forest, where moonbeams dance between ancient oak trees, a young girl named Aria discovered a secret that would change her life forever.

The trees seemed to whisper her name as she wandered deeper into the mystical woods. Their branches swayed gently, creating patterns of light and shadow that guided her path.

"Follow the silver stream," whispered the wind through the leaves. Aria looked down and noticed a thin ribbon of glittering water weaving between the moss-covered stones.

As she followed the magical stream, she came upon a clearing where fireflies danced in the air like tiny stars. In the center stood an ancient willow tree, its trunk glowing with a soft, ethereal light.

"Welcome, young dreamer," spoke a voice as gentle as morning dew. From behind the willow emerged a figure cloaked in moonlight and stardust.

Aria's heart filled with wonder as she realized she had found the Guardian of Dreams, the keeper of all the world's most beautiful stories and wishes.

"I have been waiting for you," the Guardian smiled. "You have the gift of storytelling, and the forest needs your voice to keep its magic alive."

From that day forward, Aria became the forest's storyteller, weaving tales that brought joy to all the woodland creatures and kept the magic of the enchanted woods alive for generations to come.`
  },
  {
    id: '2',
    title: 'The Crystal of Forgotten Dreams',
    author: 'Sage Moonglow',
    readTime: '7 min',
    preview: 'In a tower made of clouds and starlight, an old wizard keeps a crystal that holds all the dreams the world has forgotten...',
    content: `In a tower made of clouds and starlight, high above the realm of mortals, lived an old wizard named Celestius who kept the most precious treasure in all the worlds: the Crystal of Forgotten Dreams.

This magnificent crystal, no larger than a child's fist, contained within its faceted depths all the dreams that people had lost, forgotten, or given up on throughout the ages.

Every evening, as the first stars appeared in the twilight sky, Celestius would hold the crystal up to catch the starlight. The dreams within would begin to glow, swirling like captured galaxies, each one a tiny universe of hope and wonder.

One particularly quiet night, a small crack appeared in the crystal. From this crack emerged a single dream - the dream of a little boy who had wished to fly among the clouds.

The dream took the form of a glowing butterfly with wings like aurora borealis. It fluttered around the tower, desperate to find its way back to the boy who had dreamed it.

Celestius knew what he must do. He opened the tower's great window and whispered an ancient spell: "Let forgotten dreams find their way home, on wings of hope and starlight's foam."

The butterfly soared out into the night, followed by hundreds of other dreams escaping through the crack - each one seeking the heart that had first dreamed it.

Below in the mortal world, people began to remember their forgotten dreams. Children dreamed of magical adventures, artists rediscovered their inspiration, and hope returned to hearts that had grown weary.

The crystal had fulfilled its purpose, and Celestius smiled, knowing that sometimes the most beautiful magic happens when we let go and allow dreams to find their own way home.`
  },
  {
    id: '3',
    title: 'The Garden of Seasons',
    author: 'Willow Thornfield',
    readTime: '6 min',
    preview: 'Four sisters tend a magical garden where each season blooms eternal in its own corner, until the day when winter refuses to leave...',
    content: `In a hidden valley where time moved differently than in the outside world, four sisters tended the most extraordinary garden ever to exist: the Garden of Seasons.

Spring lived in the eastern corner, where cherry blossoms bloomed eternal and baby animals played among beds of daffodils and tulips. Her laughter was like the sound of rain on new leaves.

Summer ruled the southern quarter, where roses climbed trellises of golden sunbeams and butterfly houses sheltered creatures with wings like stained glass. Her voice was warm as honey.

Autumn dwelt in the western section, where maple trees wore crowns of red and gold, and pumpkin vines created cozy nooks filled with the scent of cinnamon and woodsmoke. Her wisdom was deep as the earth.

Winter claimed the northern realm, where ice sculptures told stories in crystal and snow flowers bloomed in patterns of perfect symmetry. Her beauty was pure as starlight.

For countless years, the sisters maintained perfect harmony, each season flowing gently into the next around the garden's central fountain, which sparkled with water from the Stream of Time.

But one year, Winter refused to leave her corner when Spring tried to begin her cycle. The magical balance began to shift, and frost started creeping toward the other seasons' domains.

"Sister," pleaded Spring, "the world outside needs renewal. You must let me begin."

Winter turned away, her ice-blue eyes filled with sadness. "I am afraid," she whispered. "Each time I leave, I fear I may not return."

Understanding bloomed in Spring's heart like the first flower of dawn. She reached out and took Winter's frozen hand in her warm one.

"We are eternal," Spring said gently. "Each season lives within the others. Look - in my spring rain are the memories of your snow. In Summer's warmth lives the promise of your return. In Autumn's harvest grows the seeds that will sleep under your blanket of white."

Winter felt the truth in her sister's words. She released her hold on the garden, watching as Spring's green magic began to flow, carrying within it the silver threads of Winter's own essence.

The garden returned to its natural rhythm, but now each sister understood that they were not separate forces, but parts of one eternal dance of renewal, each precious and necessary in the great cycle of life.`
  }
];

export const Stories = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  const onSlideChange = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCurrentSlide(api.selectedScrollSnap());
  }, []);

  // Effect to listen for slide changes
  useEffect(() => {
    if (!api) return;

    api.on("select", () => onSlideChange(api));
  }, [api, onSlideChange]);

  const handleReadStory = (story: Story) => {
    setSelectedStory(story);
  };

  const handleBackToStories = () => {
    setSelectedStory(null);
  };

  const filteredStories = sampleStories.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedStory) {
    return <StoryReader story={selectedStory} onBack={handleBackToStories} />;
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-8 sm:pb-12 relative">
      <AnimatedBackground />
      
      <div className="relative z-20 container mx-auto px-4 sm:px-6">
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-mystical bg-clip-text text-transparent mb-4">
            Enchanted Tales
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Discover magical stories that transport you to mystical realms where anything is possible
          </p>
          
          <div className="relative max-w-md mx-auto px-4">
            <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stories, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/80 backdrop-blur-md border-border text-sm sm:text-base"
            />
          </div>
        </motion.div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {filteredStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <StoryCard
                title={story.title}
                preview={story.preview}
                author={story.author}
                readTime={story.readTime}
                content={story.content}
                onRead={() => handleReadStory(story)}
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel View */}
        <div className="md:hidden">
          <Carousel 
            setApi={setApi}
            className="w-full max-w-[320px] sm:max-w-md mx-auto px-4"
            opts={{
              align: "center",
              loop: true,
              skipSnaps: false,
              dragFree: false,
              duration: 25,
            }}
          >
            <CarouselContent className="ml-0">
              {filteredStories.map((story, index) => {
                const isActive = index === currentSlide;
                const distance = Math.abs(index - currentSlide);
                
                return (
                  <CarouselItem key={story.id} className="pl-2 basis-full">
                    <motion.div 
                      className="p-1 relative"
                      style={{ 
                        transformStyle: "preserve-3d",
                        perspective: "1200px"
                      }}
                      animate={{
                        rotateY: isActive ? 0 : distance > 1 ? (index < currentSlide ? -45 : 45) : (index < currentSlide ? -25 : 25),
                        scale: isActive ? 1 : distance > 1 ? 0.7 : 0.85,
                        opacity: isActive ? 1 : distance > 1 ? 0.3 : 0.6,
                        x: isActive ? 0 : distance > 1 ? (index < currentSlide ? -100 : 100) : (index < currentSlide ? -50 : 50),
                        z: isActive ? 0 : -distance * 100,
                      }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: 0.8
                      }}
                      initial={{ 
                        rotateY: -90, 
                        scale: 0.5, 
                        opacity: 0,
                        x: 100
                      }}
                      whileInView={{ 
                        rotateY: isActive ? 0 : -15,
                        scale: isActive ? 1 : 0.85,
                        opacity: 1,
                        x: 0,
                        transition: { 
                          duration: 0.8, 
                          ease: "easeOut",
                          delay: index * 0.1
                        }
                      }}
                    >
                      <div
                        className="relative"
                        style={{
                          transformOrigin: "center center",
                          filter: isActive ? "none" : "blur(1px)",
                        }}
                      >
                        <StoryCard
                          title={story.title}
                          preview={story.preview}
                          author={story.author}
                          readTime={story.readTime}
                          content={story.content}
                          onRead={() => handleReadStory(story)}
                        />
                        {!isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-background/30 pointer-events-none" />
                        )}
                      </div>
                    </motion.div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            
            {/* Pagination Dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {filteredStories.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentSlide 
                      ? 'bg-primary w-6' 
                      : 'bg-muted-foreground/30 hover:bg-primary/50'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (api) {
                      api.scrollTo(index);
                    }
                  }}
                />
              ))}
            </div>
          </Carousel>
        </div>

        {filteredStories.length === 0 && searchQuery && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-muted-foreground text-lg">
              No stories found matching "{searchQuery}"
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};