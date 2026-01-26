import {
  Entity,
  Column,
  PrimaryColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';

@Entity('events')
@Index(['shopId'])
@Index(['eventType'])
@Index(['timestamp'])
export class Event {
  @PrimaryColumn()
  id!: string;

  @Column()
  shopId!: string;

  @Column()
  sessionId!: string;

  @Column()
  eventType!: string;

  @Column()
  eventName!: string;

  @Column({ type: 'simple-json' })
  properties!: Record<string, unknown>;

  @Column()
  timestamp!: string;

  @Column()
  url!: string;

  @Column()
  userAgent!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
