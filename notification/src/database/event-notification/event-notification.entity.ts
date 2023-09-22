import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tbl_Event_Notifications')
export class EventNotification {
  @PrimaryGeneratedColumn({ name: 'NotificationId', type: 'bigint' })
  id: number;

  @Column({ name: 'EventId', type: 'bigint' })
  eventId: number;

  @Column({ name: 'Type', type: 'varchar' })
  type: string;

  @Column({ name: 'IsComplete', type: 'bool' })
  isComplete: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'CreatedDate' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'UpdatedDate' })
  updatedDate: Date;
};