/*
  Warnings:

  - You are about to drop the column `name` on the `inspector` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `policehead` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `prosecutor` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `sajen` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - Added the required column `password` to the `DeskOfficer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `DeskOfficer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Inspector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kebeleIdPicture` to the `Inspector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Inspector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePicture` to the `Inspector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `PoliceHead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kebeleIdPicture` to the `PoliceHead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `PoliceHead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePicture` to the `PoliceHead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Prosecutor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kebeleIdPicture` to the `Prosecutor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Prosecutor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Prosecutor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePicture` to the `Prosecutor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Prosecutor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Sajen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kebeleIdPicture` to the `Sajen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Sajen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Sajen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePicture` to the `Sajen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Sajen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kebeleIdPicture` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePicture` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `deskofficer` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `userName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `inspector` DROP COLUMN `name`,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `kebeleIdPicture` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `locationId` INTEGER NULL,
    ADD COLUMN `profilePicture` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `policehead` DROP COLUMN `name`,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `kebeleIdPicture` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `locationId` INTEGER NULL,
    ADD COLUMN `profilePicture` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `prosecutor` DROP COLUMN `name`,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `kebeleIdPicture` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `locationId` INTEGER NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `profilePicture` VARCHAR(191) NOT NULL,
    ADD COLUMN `userName` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `sajen` DROP COLUMN `name`,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `kebeleIdPicture` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `locationId` INTEGER NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `profilePicture` VARCHAR(191) NOT NULL,
    ADD COLUMN `userName` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `name`,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `kebeleIdPicture` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `locationId` INTEGER NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `profilePicture` VARCHAR(191) NOT NULL,
    ADD COLUMN `userName` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uniqueName` VARCHAR(191) NOT NULL,
    `kebele` VARCHAR(191) NOT NULL,
    `wereda` VARCHAR(191) NOT NULL,
    `subCity` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `postalCode` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sajen` ADD CONSTRAINT `Sajen_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inspector` ADD CONSTRAINT `Inspector_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PoliceHead` ADD CONSTRAINT `PoliceHead_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prosecutor` ADD CONSTRAINT `Prosecutor_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
