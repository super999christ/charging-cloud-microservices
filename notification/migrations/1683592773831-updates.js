const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Updates1683592773831 {
    name = 'Updates1683592773831'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "tbl_Email_Notifications" ("NotificationId" BIGSERIAL NOT NULL, "SenderName" character varying NOT NULL, "RecipientName" character varying NOT NULL, "NotificationStatus" character varying NOT NULL, "RecipientEmail" character varying NOT NULL, "EmailSubject" character varying NOT NULL, "EmailBody" text NOT NULL, CONSTRAINT "PK_e6b24638886be797dd0156a7e44" PRIMARY KEY ("NotificationId"))`);
        await queryRunner.query(`CREATE TABLE "tbl_Email_Codes" ("notificationId" integer NOT NULL, "AuthCode" character varying NOT NULL, "VerifyLink" character varying NOT NULL, "NotificationId" bigint, CONSTRAINT "REL_d6bbcc8738f52b53857bebf0e9" UNIQUE ("NotificationId"), CONSTRAINT "PK_65223614fa0670145ca5a551d45" PRIMARY KEY ("notificationId"))`);
        await queryRunner.query(`CREATE TABLE "tbl_SMS_Notifications" ("NotificationId" BIGSERIAL NOT NULL, "AppName" character varying NOT NULL, "SenderPhone" character varying NOT NULL, "RecipientPhone" character varying NOT NULL, "Message" text NOT NULL, "NotificationStatus" character varying NOT NULL, CONSTRAINT "PK_0b685d5fd98149dbb992f6e1546" PRIMARY KEY ("NotificationId"))`);
        await queryRunner.query(`CREATE TABLE "tbl_SMS_Codes" ("notificationId" integer NOT NULL, "AuthCode" character varying NOT NULL, "Verified" boolean NOT NULL, "NotificationId" bigint, CONSTRAINT "REL_70d49361b88cc9969e0e43fc1d" UNIQUE ("NotificationId"), CONSTRAINT "PK_9ee928b9846cee0b111b5e3f72a" PRIMARY KEY ("notificationId"))`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Codes" ADD CONSTRAINT "FK_d6bbcc8738f52b53857bebf0e9e" FOREIGN KEY ("NotificationId") REFERENCES "tbl_Email_Notifications"("NotificationId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Codes" ADD CONSTRAINT "FK_70d49361b88cc9969e0e43fc1dc" FOREIGN KEY ("NotificationId") REFERENCES "tbl_SMS_Notifications"("NotificationId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Codes" DROP CONSTRAINT "FK_70d49361b88cc9969e0e43fc1dc"`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Codes" DROP CONSTRAINT "FK_d6bbcc8738f52b53857bebf0e9e"`);
        await queryRunner.query(`DROP TABLE "tbl_SMS_Codes"`);
        await queryRunner.query(`DROP TABLE "tbl_SMS_Notifications"`);
        await queryRunner.query(`DROP TABLE "tbl_Email_Codes"`);
        await queryRunner.query(`DROP TABLE "tbl_Email_Notifications"`);
    }
}
