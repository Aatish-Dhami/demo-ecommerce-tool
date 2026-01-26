import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { StatsModule } from '../stats/stats.module';
import { EventsModule } from '../events/events.module';
import { InsightsModule } from '../insights/insights.module';

@Module({
  imports: [StatsModule, EventsModule, InsightsModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
