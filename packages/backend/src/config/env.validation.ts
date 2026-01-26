import { plainToInstance } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsNumber()
  @Min(1)
  @Max(65535)
  @IsOptional()
  PORT: number = 4000;

  @IsString()
  @IsOptional()
  CORS_ORIGINS: string = 'http://localhost:3000,http://localhost:5173';

  @IsString()
  @IsOptional()
  DATABASE_URL: string = 'sqlite:./data/events.db';

  @IsString()
  @IsOptional()
  NODE_ENV: string = 'development';

  @IsString()
  @IsOptional()
  OPENAI_API_KEY?: string;

  @IsString()
  @IsOptional()
  ANTHROPIC_API_KEY?: string;

  @IsString()
  @IsOptional()
  OPENAI_MODEL: string = 'gpt-4o-mini';

  @IsString()
  @IsOptional()
  ANTHROPIC_MODEL: string = 'claude-3-haiku-20240307';

  @IsNumber()
  @Min(1)
  @Max(100000)
  @IsOptional()
  LLM_MAX_TOKENS: number = 1024;

  @IsNumber()
  @Min(0)
  @Max(2)
  @IsOptional()
  LLM_TEMPERATURE: number = 0.7;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => {
        const constraints = error.constraints
          ? Object.values(error.constraints).join(', ')
          : 'Unknown validation error';
        return `${error.property}: ${constraints}`;
      })
      .join('\n');

    throw new Error(`Environment validation failed:\n${errorMessages}`);
  }

  return validatedConfig;
};
