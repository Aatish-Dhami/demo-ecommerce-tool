import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { InsightsModule } from './insights/insights.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [DatabaseModule, EventsModule, InsightsModule, StatsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
