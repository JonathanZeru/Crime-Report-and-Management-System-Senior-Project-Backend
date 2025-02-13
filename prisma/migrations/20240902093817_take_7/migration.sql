/*
  Warnings:

  - You are about to alter the column `picture` on the `tacticalreport` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `video` on the `tacticalreport` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - You are about to alter the column `audio` on the `tacticalreport` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.

*/
-- DropForeignKey
ALTER TABLE `tacticalreport` DROP FOREIGN KEY `TacticalReport_inspectorId_fkey`;

-- DropForeignKey
ALTER TABLE `tacticalreport` DROP FOREIGN KEY `TacticalReport_sajenId_fkey`;

-- AlterTable
ALTER TABLE `tacticalreport` ADD COLUMN `deskOfficerId` INTEGER NULL,
    MODIFY `picture` VARCHAR(191) NULL,
    MODIFY `video` VARCHAR(191) NULL,
    MODIFY `audio` VARCHAR(191) NULL,
    MODIFY `sajenId` INTEGER NULL,
    MODIFY `inspectorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `TacticalReport` ADD CONSTRAINT `TacticalReport_deskOfficerId_fkey` FOREIGN KEY (`deskOfficerId`) REFERENCES `DeskOfficer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TacticalReport` ADD CONSTRAINT `TacticalReport_sajenId_fkey` FOREIGN KEY (`sajenId`) REFERENCES `Sajen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TacticalReport` ADD CONSTRAINT `TacticalReport_inspectorId_fkey` FOREIGN KEY (`inspectorId`) REFERENCES `Inspector`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
