import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

export interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LlmCompletionOptions {
  messages: LlmMessage[];
  maxTokens?: number;
  temperature?: number;
}

@Injectable()
export class LlmService {
  private readonly client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    this.client = new OpenAI({ apiKey });
  }

  async complete(options: LlmCompletionOptions): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: options.messages,
      max_tokens: options.maxTokens ?? 1000,
      temperature: options.temperature ?? 0.3,
    });

    return response.choices[0]?.message?.content ?? '';
  }
}
