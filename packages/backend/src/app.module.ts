import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [DatabaseModule, EventsModule, StatsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
