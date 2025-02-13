/*
  Warnings:

  - The primary key for the `systemadmin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `systemadmin` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `systemadmin` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `CaseSajen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DeskOfficer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Inspector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `InspectorSajen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PoliceHead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Prosecutor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Sajen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `SystemAdmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kebeleIdPicture` to the `SystemAdmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `SystemAdmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePicture` to the `SystemAdmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SystemAdmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TacticalReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TechnicalReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `casesajen` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `deskofficer` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `inspector` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `inspectorsajen` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `policehead` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `prosecutor` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `sajen` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `systemadmin` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `name`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `kebeleIdPicture` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `profilePicture` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `email` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `tacticalreport` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `technicalreport` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
