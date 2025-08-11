import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: ConfigService,
  ) {}

  async getHealthStatus() {
    const databaseHealth = await this.getDatabaseHealth();
    
    return {
      status: databaseHealth.connected ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.get('NODE_ENV'),
      version: '1.0.0',
      database: databaseHealth,
    };
  }

  async getDatabaseHealth() {
    try {
      const state = this.connection.readyState;
      const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
      };

      return {
        status: states[state] || 'unknown',
        connected: state === 1,
        name: this.connection.name,
        host: this.connection.host,
        port: this.connection.port,
      };
    } catch (error) {
      return {
        status: 'error',
        connected: false,
        error: error.message,
      };
    }
  }
}