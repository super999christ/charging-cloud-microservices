const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Updates1694666241233 {
    name = 'Updates1694666241233'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "tbl_Event_Notifications" ("NotificationId" BIGSERIAL NOT NULL, "EventId" bigint NOT NULL, "Type" character varying NOT NULL, "IsComplete" boolean NOT NULL, "CreatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "UpdatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_44049f7d76935ba2b137275a7e1" PRIMARY KEY ("NotificationId"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "tbl_Event_Notifications"`);
    }
}
