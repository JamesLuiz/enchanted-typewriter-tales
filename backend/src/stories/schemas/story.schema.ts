import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type StoryDocument = Story & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Story {
  @ApiProperty({
    description: 'Unique identifier for the story',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Title of the story',
    example: 'The Whispering Woods',
  })
  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string;

  @ApiProperty({
    description: 'Author of the story',
    example: 'Luna Silvermoon',
  })
  @Prop({ required: true, trim: true, maxlength: 100 })
  author: string;

  @ApiProperty({
    description: 'Full content of the story',
    example: 'Deep in the enchanted forest...',
  })
  @Prop({ required: true })
  content: string;

  @ApiProperty({
    description: 'Preview/excerpt of the story',
    example: 'Deep in the enchanted forest, where moonbeams dance...',
  })
  @Prop({ required: true, maxlength: 500 })
  preview: string;

  @ApiProperty({
    description: 'Estimated reading time',
    example: '5 min',
  })
  @Prop({ required: true })
  readTime: string;

  @ApiProperty({
    description: 'Word count of the story',
    example: 1250,
  })
  @Prop({ required: true, min: 0 })
  wordCount: number;

  @ApiProperty({
    description: 'Character count of the story',
    example: 7500,
  })
  @Prop({ required: true, min: 0 })
  characterCount: number;

  @ApiProperty({
    description: 'Tags associated with the story',
    example: ['fantasy', 'adventure', 'magic'],
  })
  @Prop({ type: [String], default: [] })
  tags: string[];

  @ApiProperty({
    description: 'Story genre/category',
    example: 'Fantasy',
  })
  @Prop({ default: 'General' })
  genre: string;

  @ApiProperty({
    description: 'Publication status',
    example: 'published',
    enum: ['draft', 'published', 'archived'],
  })
  @Prop({ 
    enum: ['draft', 'published', 'archived'], 
    default: 'published' 
  })
  status: string;

  @ApiProperty({
    description: 'Original filename if uploaded from file',
    example: 'my-story.txt',
  })
  @Prop()
  originalFilename?: string;

  @ApiProperty({
    description: 'MIME type of uploaded file',
    example: 'text/plain',
  })
  @Prop()
  mimeType?: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 15420,
  })
  @Prop()
  fileSize?: number;

  @ApiProperty({
    description: 'Story creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Story last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}

export const StorySchema = SchemaFactory.createForClass(Story);

// Create indexes for better query performance
StorySchema.index({ title: 'text', author: 'text', content: 'text' });
StorySchema.index({ createdAt: -1 });
StorySchema.index({ status: 1 });
StorySchema.index({ genre: 1 });
StorySchema.index({ tags: 1 });