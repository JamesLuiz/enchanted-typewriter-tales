import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoryQueryDto } from './dto/story-query.dto';
import { Story } from './schemas/story.schema';
import { ApiResponseDto, PaginatedResponseDto } from '../common/dto/response.dto';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@ApiTags('stories')
@Controller('stories')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new story' })
  @ApiResponse({
    status: 201,
    description: 'Story created successfully',
    type: Story,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  async create(@Body() createStoryDto: CreateStoryDto): Promise<Story> {
    return await this.storiesService.create(createStoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stories with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'Stories retrieved successfully',
    type: PaginatedResponseDto<Story>,
  })
  async findAll(@Query() query: StoryQueryDto): Promise<PaginatedResponseDto<Story>> {
    return await this.storiesService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get story statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStats() {
    return await this.storiesService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a story by ID' })
  @ApiParam({
    name: 'id',
    description: 'Story ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Story retrieved successfully',
    type: Story,
  })
  @ApiResponse({
    status: 404,
    description: 'Story not found',
  })
  async findOne(@Param('id') id: string): Promise<Story> {
    return await this.storiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a story' })
  @ApiParam({
    name: 'id',
    description: 'Story ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Story updated successfully',
    type: Story,
  })
  @ApiResponse({
    status: 404,
    description: 'Story not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateStoryDto: UpdateStoryDto,
  ): Promise<Story> {
    return await this.storiesService.update(id, updateStoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a story' })
  @ApiParam({
    name: 'id',
    description: 'Story ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Story deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Story not found',
  })
  async remove(@Param('id') id: string): Promise<ApiResponseDto<null>> {
    await this.storiesService.remove(id);
    return new ApiResponseDto(true, 'Story deleted successfully', null);
  }
}