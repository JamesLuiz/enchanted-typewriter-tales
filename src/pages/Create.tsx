import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import snowyForestBg from '@/assets/snowy-forest-bg.jpg';

export const Create = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const fileContent = await readFileContent(file);
      setContent(fileContent);
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
      
      toast({
        title: "File uploaded successfully!",
        description: "Your story content has been loaded.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Could not read the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        reader.readAsText(file);
      } else {
        toast({
          title: "File type not supported",
          description: "Please upload a .txt file. PDF and DOCX support coming soon!",
          variant: "destructive",
        });
        reject(new Error('Unsupported file type'));
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !author || !content) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically save to a database
    // For now, we'll simulate success
    setUploadSuccess(true);
    
    toast({
      title: "Story created successfully!",
      description: "Your magical tale has been added to the collection.",
    });

    // Reset form after 3 seconds
    setTimeout(() => {
      setTitle('');
      setAuthor('');
      setContent('');
      setUploadSuccess(false);
    }, 3000);
  };

  return (
    <div 
      className="min-h-screen pt-20 sm:pt-24 pb-8 sm:pb-12 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${snowyForestBg})` }}
    >
      <div className="absolute inset-0 bg-background/80"></div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-mystical bg-clip-text text-transparent mb-4">
            Create Your Tale
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground px-4">
            Share your magical stories with the world
          </p>
        </div>

        <Card className="p-4 sm:p-6 lg:p-8 bg-gradient-story shadow-enchanted animate-fade-in">
          {uploadSuccess ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Story Created!</h2>
              <p className="text-muted-foreground">Your magical tale has been added to the enchanted collection.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Story Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your story title..."
                    className="bg-card"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">Author Name</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Your name..."
                    className="bg-card"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Story Content</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center space-x-2"
                  >
                    {isUploading ? (
                      <>
                        <AlertCircle className="h-4 w-4 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        <span>Upload File</span>
                      </>
                    )}
                  </Button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your magical story here... or upload a file above."
                  className="min-h-[200px] sm:min-h-[300px] bg-card resize-none text-sm sm:text-base"
                />
                
                <div className="flex items-start space-x-2 text-xs sm:text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Supported formats: .txt (PDF and DOCX support coming soon!)</span>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  type="submit" 
                  size="lg"
                  className="px-6 sm:px-8 w-full sm:w-auto"
                  disabled={!title || !author || !content}
                >
                  Publish Your Tale
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};