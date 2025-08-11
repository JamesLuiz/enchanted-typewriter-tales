import { Injectable, BadRequestException } from '@nestjs/common';
import { StoriesService } from '../stories/stories.service';
import { CreateStoryDto } from '../stories/dto/create-story.dto';

@Injectable()
export class UploadService {
  constructor(private readonly storiesService: StoriesService) {}

  async uploadStoryFile(
    file: Express.Multer.File,
    title?: string,
    author?: string,
    tags?: string[],
    genre?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.mimetype !== 'text/plain') {
      throw new BadRequestException('Only text files (.txt) are supported');
    }

    try {
      // Extract content from file buffer
      const content = file.buffer.toString('utf-8');
      
      if (!content.trim()) {
        throw new BadRequestException('File is empty or contains no readable content');
      }

      // Create story DTO
      const createStoryDto: CreateStoryDto = {
        title: title || this.extractTitleFromFilename(file.originalname),
        author: author || 'Anonymous',
        content: content.trim(),
        tags: tags || [],
        genre: genre || 'General',
        status: 'published',
      };

      // Create story with file information
      const story = await this.storiesService.create(createStoryDto, {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });

      return {
        story,
        fileInfo: {
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Failed to process file: ${error.message}`);
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    defaultAuthor?: string,
    defaultGenre?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        const result = await this.uploadStoryFile(
          file,
          undefined, // Let it extract title from filename
          defaultAuthor,
          [],
          defaultGenre,
        );
        results.push(result);
      } catch (error) {
        errors.push({
          filename: file.originalname,
          error: error.message,
        });
      }
    }

    return {
      successful: results,
      failed: errors,
      summary: {
        total: files.length,
        successful: results.length,
        failed: errors.length,
      },
    };
  }

  private extractTitleFromFilename(filename: string): string {
    // Remove file extension
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    
    // Replace underscores and hyphens with spaces
    const cleanName = nameWithoutExt.replace(/[_-]/g, ' ');
    
    // Capitalize first letter of each word
    return cleanName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  validateFileType(file: Express.Multer.File): boolean {
    const allowedMimeTypes = ['text/plain'];
    const allowedExtensions = ['.txt'];
    
    const hasValidMimeType = allowedMimeTypes.includes(file.mimetype);
    const hasValidExtension = allowedExtensions.some(ext => 
      file.originalname.toLowerCase().endsWith(ext)
    );
    
    return hasValidMimeType && hasValidExtension;
  }

  validateFileSize(file: Express.Multer.File, maxSizeInBytes: number = 10 * 1024 * 1024): boolean {
    return file.size <= maxSizeInBytes;
  }
}