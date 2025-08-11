import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        uptime: { type: 'number', example: 12345.67 },
        environment: { type: 'string', example: 'development' },
        version: { type: 'string', example: '1.0.0' },
        database: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'connected' },
            name: { type: 'string', example: 'enchanted-tales' },
          },
        },
      },
    },
  })
  async getHealth() {
    return await this.healthService.getHealthStatus();
  }

  @Get('database')
  @ApiOperation({ summary: 'Database health check' })
  @ApiResponse({
    status: 200,
    description: 'Database connection status',
  })
  async getDatabaseHealth() {
    return await this.healthService.getDatabaseHealth();
  }
}