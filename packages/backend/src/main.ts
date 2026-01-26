import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ServerConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const serverConfig = configService.get<ServerConfig>('server');
  const corsOrigins = serverConfig?.corsOrigins || [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173',
  ];

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  const port = serverConfig?.port || 4000;
  await app.listen(port);

  console.log(`Flowtel backend is running on http://localhost:${port}`);
  console.log(`CORS enabled for origins: ${corsOrigins.join(', ')}`);
}

bootstrap();
