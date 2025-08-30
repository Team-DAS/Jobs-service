import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JobsModule } from './jobs/jobs.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    JobsModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {} 