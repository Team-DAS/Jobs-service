import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { HealthModule } from './health/health.module';
import databaseConfig  from './config/database.config';

@Module({
  imports: [
    // --- Configuración del Módulo de Configuración ---
    // Sigue siendo el primero para que las variables de entorno estén disponibles
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigModule esté disponible en toda la app
      load: [databaseConfig], // Carga la configuración de la base de datos
    }),

    // --- Configuración ASÍNCRONA de TypeOrmModule ---
    // Esto asegura que ConfigModule se cargue ANTES de intentar la conexión
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Importa ConfigModule para poder usar ConfigService
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'), // Obtiene la configuración de la DB desde ConfigService
      }),
      inject: [ConfigService], // Inyecta ConfigService en el factory
    }),

    // --- Otros Módulos ---
    AuthModule,
    JobsModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}