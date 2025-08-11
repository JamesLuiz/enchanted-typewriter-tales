import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { StoriesModule } from './stories/stories.module';
import { UploadModule } from './upload/upload.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('DATABASE_NAME'),
        retryWrites: true,
        w: 'majority',
      }),
      inject: [ConfigService],
    }),

    // Multer for file uploads
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        limits: {
          fileSize: configService.get<number>('MAX_FILE_SIZE') || 10 * 1024 * 1024, // 10MB
        },
        fileFilter: (req, file, callback) => {
          const allowedTypes = configService.get<string>('ALLOWED_FILE_TYPES')?.split(',') || ['text/plain'];
          if (allowedTypes.includes(file.mimetype)) {
            callback(null, true);
          } else {
            callback(new Error('Invalid file type. Only text files are allowed.'), false);
          }
        },
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    StoriesModule,
    UploadModule,
    HealthModule,
  ],
})
export class AppModule {}