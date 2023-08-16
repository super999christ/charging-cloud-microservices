const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Updates1688690456174 {
    name = 'Updates1688690456174'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" DROP COLUMN "CreatedDate"`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" ADD "CreatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" DROP COLUMN "UpdatedDate"`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" ADD "UpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Notifications" DROP COLUMN "CreatedDate"`);
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Notifications" ADD "CreatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Notifications" DROP COLUMN "UpdatedDate"`);
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Notifications" ADD "UpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Notifications" DROP COLUMN "UpdatedDate"`);
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Notifications" ADD "UpdatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Notifications" DROP COLUMN "CreatedDate"`);
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Notifications" ADD "CreatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" DROP COLUMN "UpdatedDate"`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" ADD "UpdatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" DROP COLUMN "CreatedDate"`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" ADD "CreatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
    }
}
