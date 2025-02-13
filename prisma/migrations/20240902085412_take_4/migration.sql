/*
  Warnings:

  - You are about to drop the column `accuserId` on the `case` table. All the data in the column will be lost.
  - You are about to drop the `_casesajens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_prosecutorcases` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deskOfficerId` to the `TechnicalReport` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_casesajens` DROP FOREIGN KEY `_CaseSajens_A_fkey`;

-- DropForeignKey
ALTER TABLE `_casesajens` DROP FOREIGN KEY `_CaseSajens_B_fkey`;

-- DropForeignKey
ALTER TABLE `_prosecutorcases` DROP FOREIGN KEY `_ProsecutorCases_A_fkey`;

-- DropForeignKey
ALTER TABLE `_prosecutorcases` DROP FOREIGN KEY `_ProsecutorCases_B_fkey`;

-- DropForeignKey
ALTER TABLE `case` DROP FOREIGN KEY `Case_accuserId_fkey`;

-- AlterTable
ALTER TABLE `case` DROP COLUMN `accuserId`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `technicalreport` ADD COLUMN `deskOfficerId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_casesajens`;

-- DropTable
DROP TABLE `_prosecutorcases`;

-- CreateTable
CREATE TABLE `SystemAdmin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProsecutorCase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `caseId` INTEGER NOT NULL,
    `prosecutorId` INTEGER NOT NULL,

    UNIQUE INDEX `ProsecutorCase_caseId_prosecutorId_key`(`caseId`, `prosecutorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProsecutorQuestionToPoliceHead` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `caseId` INTEGER NOT NULL,
    `prosecutorId` INTEGER NOT NULL,
    `policeHeadId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PoliceHeadQuestionToInspector` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `caseId` INTEGER NOT NULL,
    `inspectorId` INTEGER NOT NULL,
    `policeHeadId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InspectorQuestionToSajen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `caseId` INTEGER NOT NULL,
    `inspectorId` INTEGER NOT NULL,
    `sajenId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Case` ADD CONSTRAINT `Case_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProsecutorCase` ADD CONSTRAINT `ProsecutorCase_caseId_fkey` FOREIGN KEY (`caseId`) REFERENCES `Case`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProsecutorCase` ADD CONSTRAINT `ProsecutorCase_prosecutorId_fkey` FOREIGN KEY (`prosecutorId`) REFERENCES `Prosecutor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TechnicalReport` ADD CONSTRAINT `TechnicalReport_deskOfficerId_fkey` FOREIGN KEY (`deskOfficerId`) REFERENCES `DeskOfficer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProsecutorQuestionToPoliceHead` ADD CONSTRAINT `ProsecutorQuestionToPoliceHead_caseId_fkey` FOREIGN KEY (`caseId`) REFERENCES `Case`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProsecutorQuestionToPoliceHead` ADD CONSTRAINT `ProsecutorQuestionToPoliceHead_prosecutorId_fkey` FOREIGN KEY (`prosecutorId`) REFERENCES `Prosecutor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProsecutorQuestionToPoliceHead` ADD CONSTRAINT `ProsecutorQuestionToPoliceHead_policeHeadId_fkey` FOREIGN KEY (`policeHeadId`) REFERENCES `PoliceHead`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PoliceHeadQuestionToInspector` ADD CONSTRAINT `PoliceHeadQuestionToInspector_caseId_fkey` FOREIGN KEY (`caseId`) REFERENCES `Case`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PoliceHeadQuestionToInspector` ADD CONSTRAINT `PoliceHeadQuestionToInspector_inspectorId_fkey` FOREIGN KEY (`inspectorId`) REFERENCES `Inspector`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PoliceHeadQuestionToInspector` ADD CONSTRAINT `PoliceHeadQuestionToInspector_policeHeadId_fkey` FOREIGN KEY (`policeHeadId`) REFERENCES `PoliceHead`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspectorQuestionToSajen` ADD CONSTRAINT `InspectorQuestionToSajen_caseId_fkey` FOREIGN KEY (`caseId`) REFERENCES `Case`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspectorQuestionToSajen` ADD CONSTRAINT `InspectorQuestionToSajen_inspectorId_fkey` FOREIGN KEY (`inspectorId`) REFERENCES `Inspector`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspectorQuestionToSajen` ADD CONSTRAINT `InspectorQuestionToSajen_sajenId_fkey` FOREIGN KEY (`sajenId`) REFERENCES `Sajen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
