import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { InsightsModule } from './insights/insights.module';

@Module({
  imports: [DatabaseModule, EventsModule, InsightsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
