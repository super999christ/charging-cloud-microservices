import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tbl_Email_Notifications')
export class EmailNotification {
  @PrimaryGeneratedColumn({ name: 'NotificationId', type: 'bigint' })
  id: number;

  @Column({ name: 'SenderName', type: 'varchar' })
  senderName: string;

  @Column({ name: 'RecipientName', type: 'varchar', nullable: true })
  recipientName: string;

  @Column({ name: 'NotificationStatus', type: 'varchar' })
  notificationStatus: string;

  @Column({ name: 'RecipientEmail', type: 'varchar' })
  recipientEmail: string;

  @Column({ name: 'EmailSubject', type: 'varchar' })
  emailSubject: string;

  @Column({ name: 'EmailBody', type: 'text' })
  emailBody: string;

  @Column({ name: 'AuthCode', type: 'varchar', nullable: true })
  authCode?: string;

  @Column({ name: 'VerifyLink', type: 'varchar', nullable: true })
  verifyLink?: string;

  @Column({ name: 'Verified', type: 'bool', nullable: true })
  verified?: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'CreatedDate' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'UpdatedDate' })
  updatedDate: Date;
};