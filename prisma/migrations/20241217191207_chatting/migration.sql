-- AlterTable
ALTER TABLE `inspectorquestiontosajen` ADD COLUMN `receiverName` VARCHAR(191) NULL,
    ADD COLUMN `senderName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `policeheadquestiontoinspector` ADD COLUMN `receiverName` VARCHAR(191) NULL,
    ADD COLUMN `senderName` VARCHAR(191) NULL;
