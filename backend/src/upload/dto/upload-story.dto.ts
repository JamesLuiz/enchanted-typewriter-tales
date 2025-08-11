import { IsOptional, IsString, IsArray, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UploadStoryDto {
  @ApiPropertyOptional({
    description: 'Title of the story (if not provided, will be extracted from filename)',
    example: 'The Whispering Woods',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    description: 'Author of the story',
    example: 'Luna Silvermoon',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  author?: string;

  @ApiPropertyOptional({
    description: 'Tags associated with the story',
    example: ['fantasy', 'adventure', 'magic'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Story genre/category',
    example: 'Fantasy',
  })
  @IsOptional()
  @IsString()
  genre?: string;
}

export class UploadMultipleStoriesDto {
  @ApiPropertyOptional({
    description: 'Default author for all uploaded stories',
    example: 'Luna Silvermoon',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  defaultAuthor?: string;

  @ApiPropertyOptional({
    description: 'Default genre for all uploaded stories',
    example: 'Fantasy',
  })
  @IsOptional()
  @IsString()
  defaultGenre?: string;
}