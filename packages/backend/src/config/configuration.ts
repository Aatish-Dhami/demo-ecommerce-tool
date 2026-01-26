export interface ServerConfig {
  port: number;
  corsOrigins: string[];
}

export interface DatabaseConfig {
  url: string;
  nodeEnv: string;
}

export interface LlmConfig {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  openaiModel: string;
  anthropicModel: string;
  maxTokens: number;
  temperature: number;
}

export interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
  llm: LlmConfig;
}

export const configuration = (): AppConfig => ({
  server: {
    port: parseInt(process.env.PORT || '4000', 10),
    corsOrigins: (
      process.env.CORS_ORIGINS ||
      'http://localhost:3000,http://localhost:5173'
    )
      .split(',')
      .map((origin) => origin.trim()),
  },
  database: {
    url: process.env.DATABASE_URL || 'sqlite:./data/events.db',
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  llm: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
    maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '1024', 10),
    temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
  },
});
