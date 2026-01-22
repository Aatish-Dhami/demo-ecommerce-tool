import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './database.config';

@Module({
  imports: [TypeOrmModule.forRoot(getDatabaseConfig())],
  exports: [TypeOrmModule],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit(): Promise<void> {
    if (this.dataSource.isInitialized) {
      this.logger.log('Database connection established successfully');
      this.logger.log(`Database: ${this.dataSource.options.database}`);
    } else {
      this.logger.error('Failed to initialize database connection');
      throw new Error('Database connection failed');
    }
  }
}
