import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { InsightsModule } from './insights/insights.module';
import { StatsModule } from './stats/stats.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [DatabaseModule, EventsModule, InsightsModule, StatsModule, ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
