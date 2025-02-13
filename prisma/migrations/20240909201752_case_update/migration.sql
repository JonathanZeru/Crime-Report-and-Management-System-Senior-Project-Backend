/*
  Warnings:

  - Added the required column `accuserFirstName` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accuserLastName` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crimeDetail` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfIncidentOccured` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateReported` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAssigned` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isClassified` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `natureOfCrime` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `case` ADD COLUMN `accuserFirstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `accuserLastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `crimeDetail` VARCHAR(191) NOT NULL,
    ADD COLUMN `crimeID` INTEGER NULL,
    ADD COLUMN `dateOfIncidentOccured` DATETIME(3) NOT NULL,
    ADD COLUMN `dateReported` DATETIME(3) NOT NULL,
    ADD COLUMN `fullNamesOfArrestedSuspects` VARCHAR(191) NULL,
    ADD COLUMN `fullNamesOfSuspects` VARCHAR(191) NULL,
    ADD COLUMN `isAssigned` BOOLEAN NOT NULL,
    ADD COLUMN `isClassified` BOOLEAN NOT NULL,
    ADD COLUMN `locationId` INTEGER NOT NULL,
    ADD COLUMN `natureOfCrime` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Case` ADD CONSTRAINT `Case_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
