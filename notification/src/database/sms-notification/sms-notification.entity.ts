import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tbl_SMS_Notifications')
export class SMSNotification {
  @PrimaryGeneratedColumn({ name: 'NotificationId', type: 'bigint' })
  id: number;

  @Column({ name: 'AppName', type: 'varchar' })
  appName: string;

  @Column({ name: 'SenderPhone', type: 'varchar' })
  senderPhone: string;

  @Column({ name: 'RecipientPhone', type: 'varchar' })
  recipientPhone: string;

  @Column({ name: 'Message', type: 'text' })
  message: string;

  @Column({ name: 'NotificationStatus', type: 'varchar' })
  notificationStatus: string;

  @Column({ name: 'AuthCode', type: 'varchar', nullable: true })
  authCode?: string;

  @Column({ name: 'Verified', type: 'bool', default: false })
  verified: boolean;

  @Column({ name: 'Error', type: 'varchar', nullable: true })
  error?: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'CreatedDate' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'UpdatedDate' })
  updatedDate: Date;
};