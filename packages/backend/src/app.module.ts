import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { InsightsModule } from './insights/insights.module';
import { LlmModule } from './llm/llm.module';
import { StatsModule } from './stats/stats.module';
import { ChatModule } from './chat/chat.module';
import { TrackerModule } from './tracker/tracker.module';
import { configuration } from './config/configuration';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [configuration],
      validate,
    }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    EventsModule,
    InsightsModule,
    LlmModule,
    StatsModule,
    ChatModule,
    TrackerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
