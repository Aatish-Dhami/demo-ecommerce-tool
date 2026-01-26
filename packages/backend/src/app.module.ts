import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { InsightsModule } from './insights/insights.module';
import { LlmModule } from './llm/llm.module';
import { StatsModule } from './stats/stats.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    EventsModule,
    InsightsModule,
    LlmModule,
    StatsModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
