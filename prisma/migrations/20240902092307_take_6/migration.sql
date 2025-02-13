/*
  Warnings:

  - You are about to drop the column `submittedBy` on the `technicalreport` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `technicalreport` DROP FOREIGN KEY `TechnicalReport_deskOfficerId_fkey`;

-- DropForeignKey
ALTER TABLE `technicalreport` DROP FOREIGN KEY `TechnicalReport_inspectorId_fkey`;

-- DropForeignKey
ALTER TABLE `technicalreport` DROP FOREIGN KEY `TechnicalReport_sajenId_fkey`;

-- AlterTable
ALTER TABLE `technicalreport` DROP COLUMN `submittedBy`,
    MODIFY `sajenId` INTEGER NULL,
    MODIFY `inspectorId` INTEGER NULL,
    MODIFY `deskOfficerId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `TechnicalReport` ADD CONSTRAINT `TechnicalReport_deskOfficerId_fkey` FOREIGN KEY (`deskOfficerId`) REFERENCES `DeskOfficer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TechnicalReport` ADD CONSTRAINT `TechnicalReport_sajenId_fkey` FOREIGN KEY (`sajenId`) REFERENCES `Sajen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TechnicalReport` ADD CONSTRAINT `TechnicalReport_inspectorId_fkey` FOREIGN KEY (`inspectorId`) REFERENCES `Inspector`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
