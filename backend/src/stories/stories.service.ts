import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Story, StoryDocument } from './schemas/story.schema';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoryQueryDto } from './dto/story-query.dto';
import { PaginatedResponseDto } from '../common/dto/response.dto';

@Injectable()
export class StoriesService {
  constructor(
    @InjectModel(Story.name) private storyModel: Model<StoryDocument>,
  ) {}

  async create(createStoryDto: CreateStoryDto, fileInfo?: any): Promise<Story> {
    try {
      // Calculate story metrics
      const wordCount = this.calculateWordCount(createStoryDto.content);
      const characterCount = createStoryDto.content.length;
      const readTime = this.calculateReadTime(wordCount);
      const preview = this.generatePreview(createStoryDto.content);

      const storyData = {
        ...createStoryDto,
        wordCount,
        characterCount,
        readTime,
        preview,
        ...(fileInfo && {
          originalFilename: fileInfo.originalname,
          mimeType: fileInfo.mimetype,
          fileSize: fileInfo.size,
        }),
      };

      const createdStory = new this.storyModel(storyData);
      return await createdStory.save();
    } catch (error) {
      throw new BadRequestException(`Failed to create story: ${error.message}`);
    }
  }

  async findAll(query: StoryQueryDto): Promise<PaginatedResponseDto<Story>> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      genre,
      author,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Build filter object
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (genre) {
      filter.genre = new RegExp(genre, 'i');
    }

    if (author) {
      filter.author = new RegExp(author, 'i');
    }

    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { author: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries
    const [stories, total] = await Promise.all([
      this.storyModel
        .find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.storyModel.countDocuments(filter).exec(),
    ]);

    return new PaginatedResponseDto(
      true,
      'Stories retrieved successfully',
      stories,
      page,
      limit,
      total,
    );
  }

  async findOne(id: string): Promise<Story> {
    try {
      const story = await this.storyModel.findById(id).exec();
      if (!story) {
        throw new NotFoundException(`Story with ID ${id} not found`);
      }
      return story;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Invalid story ID: ${id}`);
    }
  }

  async update(id: string, updateStoryDto: UpdateStoryDto): Promise<Story> {
    try {
      const updateData = { ...updateStoryDto };

      // Recalculate metrics if content is updated
      if (updateStoryDto.content) {
        const wordCount = this.calculateWordCount(updateStoryDto.content);
        const characterCount = updateStoryDto.content.length;
        const readTime = this.calculateReadTime(wordCount);
        const preview = this.generatePreview(updateStoryDto.content);

        Object.assign(updateData, {
          wordCount,
          characterCount,
          readTime,
          preview,
        });
      }

      const updatedStory = await this.storyModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();

      if (!updatedStory) {
        throw new NotFoundException(`Story with ID ${id} not found`);
      }

      return updatedStory;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update story: ${error.message}`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.storyModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Story with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete story: ${error.message}`);
    }
  }

  async getStats(): Promise<any> {
    const [
      totalStories,
      publishedStories,
      draftStories,
      totalWordCount,
      genreStats,
      recentStories,
    ] = await Promise.all([
      this.storyModel.countDocuments().exec(),
      this.storyModel.countDocuments({ status: 'published' }).exec(),
      this.storyModel.countDocuments({ status: 'draft' }).exec(),
      this.storyModel.aggregate([
        { $group: { _id: null, total: { $sum: '$wordCount' } } }
      ]).exec(),
      this.storyModel.aggregate([
        { $group: { _id: '$genre', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).exec(),
      this.storyModel
        .find({ status: 'published' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title author createdAt readTime')
        .exec(),
    ]);

    return {
      totalStories,
      publishedStories,
      draftStories,
      archivedStories: totalStories - publishedStories - draftStories,
      totalWordCount: totalWordCount[0]?.total || 0,
      averageWordsPerStory: totalStories > 0 ? Math.round((totalWordCount[0]?.total || 0) / totalStories) : 0,
      genreDistribution: genreStats,
      recentStories,
    };
  }

  private calculateWordCount(content: string): number {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  private calculateReadTime(wordCount: number): string {
    // Average reading speed: 200-250 words per minute
    const wordsPerMinute = 225;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min`;
  }

  private generatePreview(content: string, maxLength: number = 200): string {
    const cleanContent = content.trim();
    if (cleanContent.length <= maxLength) {
      return cleanContent;
    }
    
    // Find the last complete sentence within the limit
    const truncated = cleanContent.substring(0, maxLength);
    const lastSentenceEnd = Math.max(
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?')
    );
    
    if (lastSentenceEnd > maxLength * 0.5) {
      return truncated.substring(0, lastSentenceEnd + 1);
    }
    
    // If no sentence end found, truncate at word boundary
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  }
}