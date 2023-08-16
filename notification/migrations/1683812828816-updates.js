const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Updates1683812828816 {
    name = 'Updates1683812828816'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Notifications" ADD "AuthCode" character varying`);
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Notifications" ADD "Verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Notifications" ADD "Error" character varying`);
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Notifications" ADD "CreatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Notifications" ADD "UpdatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Notifications" DROP COLUMN "UpdatedDate"`);
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Notifications" DROP COLUMN "CreatedDate"`);
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Notifications" DROP COLUMN "Error"`);
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Notifications" DROP COLUMN "Verified"`);
        await queryRunner.query(`ALTER TABLE "tbl_SMS_Notifications" DROP COLUMN "AuthCode"`);
    }
}
