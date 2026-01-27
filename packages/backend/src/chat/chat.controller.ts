import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ChatRequestDto, ChatResponseDto } from '@flowtel/shared';
import { ChatService } from './chat.service';
import { LlmServiceError } from '../llm/llm.service';

@Controller('api/chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async chat(@Body() dto: ChatRequestDto): Promise<ChatResponseDto> {
    const shopId = dto.shopId || 'shop_123';

    try {
      return await this.chatService.askQuestion(
        dto.message,
        shopId,
        dto.conversationId,
      );
    } catch (error) {
      if (error instanceof LlmServiceError) {
        this.logger.error('LLM service error during chat', error.message);
        throw new InternalServerErrorException(
          'Failed to process your question. Please try again later.',
        );
      }
      throw error;
    }
  }
}
