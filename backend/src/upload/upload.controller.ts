import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  BadRequestException,
  UseFilters,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { UploadStoryDto, UploadMultipleStoriesDto } from './dto/upload-story.dto';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@ApiTags('upload')
@Controller('upload')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('story')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a single story file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Story file upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Text file containing the story (.txt)',
        },
        title: {
          type: 'string',
          description: 'Story title (optional, will be extracted from filename if not provided)',
          example: 'The Whispering Woods',
        },
        author: {
          type: 'string',
          description: 'Story author',
          example: 'Luna Silvermoon',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Story tags',
          example: ['fantasy', 'adventure'],
        },
        genre: {
          type: 'string',
          description: 'Story genre',
          example: 'Fantasy',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Story uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Story uploaded successfully' },
        data: {
          type: 'object',
          properties: {
            story: { $ref: '#/components/schemas/Story' },
            fileInfo: {
              type: 'object',
              properties: {
                originalName: { type: 'string', example: 'my-story.txt' },
                size: { type: 'number', example: 15420 },
                mimeType: { type: 'string', example: 'text/plain' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid file or validation failed',
  })
  async uploadStory(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadStoryDto: UploadStoryDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file
    if (!this.uploadService.validateFileType(file)) {
      throw new BadRequestException('Invalid file type. Only .txt files are allowed.');
    }

    if (!this.uploadService.validateFileSize(file)) {
      throw new BadRequestException('File size exceeds the maximum limit of 10MB.');
    }

    const result = await this.uploadService.uploadStoryFile(
      file,
      uploadStoryDto.title,
      uploadStoryDto.author,
      uploadStoryDto.tags,
      uploadStoryDto.genre,
    );

    return {
      message: 'Story uploaded successfully',
      ...result,
    };
  }

  @Post('stories/bulk')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  @ApiOperation({ summary: 'Upload multiple story files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Multiple story files upload',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Text files containing stories (.txt)',
        },
        defaultAuthor: {
          type: 'string',
          description: 'Default author for all stories',
          example: 'Luna Silvermoon',
        },
        defaultGenre: {
          type: 'string',
          description: 'Default genre for all stories',
          example: 'Fantasy',
        },
      },
      required: ['files'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Files processed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Files processed successfully' },
        data: {
          type: 'object',
          properties: {
            successful: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  story: { $ref: '#/components/schemas/Story' },
                  fileInfo: {
                    type: 'object',
                    properties: {
                      originalName: { type: 'string' },
                      size: { type: 'number' },
                      mimeType: { type: 'string' },
                    },
                  },
                },
              },
            },
            failed: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  filename: { type: 'string' },
                  error: { type: 'string' },
                },
              },
            },
            summary: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                successful: { type: 'number' },
                failed: { type: 'number' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - no files provided or validation failed',
  })
  async uploadMultipleStories(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() uploadMultipleDto: UploadMultipleStoriesDto,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    if (files.length > 10) {
      throw new BadRequestException('Maximum 10 files allowed per upload');
    }

    // Validate all files before processing
    for (const file of files) {
      if (!this.uploadService.validateFileType(file)) {
        throw new BadRequestException(`Invalid file type for ${file.originalname}. Only .txt files are allowed.`);
      }

      if (!this.uploadService.validateFileSize(file)) {
        throw new BadRequestException(`File ${file.originalname} exceeds the maximum size limit of 10MB.`);
      }
    }

    const result = await this.uploadService.uploadMultipleFiles(
      files,
      uploadMultipleDto.defaultAuthor,
      uploadMultipleDto.defaultGenre,
    );

    return {
      message: `Processed ${result.summary.total} files. ${result.summary.successful} successful, ${result.summary.failed} failed.`,
      ...result,
    };
  }
}