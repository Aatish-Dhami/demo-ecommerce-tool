import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Insight, InsightType } from '@flowtel/shared';

@Entity('insights')
@Index(['type'])
@Index(['generatedAt'])
export class InsightEntity implements Insight {
  @PrimaryColumn('varchar')
  id!: string;

  @Column('datetime')
  generatedAt!: string;

  @Column('varchar')
  type!: InsightType;

  @Column('varchar')
  title!: string;

  @Column('text')
  content!: string;

  @Column('simple-json')
  metadata!: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;
}
