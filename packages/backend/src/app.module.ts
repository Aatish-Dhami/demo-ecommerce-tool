import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { InsightsModule } from './insights/insights.module';

@Module({
  imports: [DatabaseModule, InsightsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
