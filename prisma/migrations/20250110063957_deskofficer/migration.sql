/*
  Warnings:

  - Added the required column `kebeleIdPictureBack` to the `DeskOfficer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kebeleIdPictureFront` to the `DeskOfficer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePicture` to the `DeskOfficer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `deskofficer` ADD COLUMN `kebeleIdPictureBack` VARCHAR(191) NOT NULL,
    ADD COLUMN `kebeleIdPictureFront` VARCHAR(191) NOT NULL,
    ADD COLUMN `profilePicture` VARCHAR(191) NOT NULL;
