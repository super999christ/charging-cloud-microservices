const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Updates1684279973523 {
    name = 'Updates1684279973523'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" ADD "AuthCode" character varying`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" ADD "VerifyLink" character varying`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" ADD "Verified" boolean`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" ADD "CreatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" ADD "UpdatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" ALTER COLUMN "RecipientName" DROP NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" ALTER COLUMN "RecipientName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" DROP COLUMN "UpdatedDate"`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" DROP COLUMN "CreatedDate"`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" DROP COLUMN "Verified"`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" DROP COLUMN "VerifyLink"`);
        await queryRunner.query(`ALTER TABLE "tbl_Email_Notifications" DROP COLUMN "AuthCode"`);
    }
}
