/*
  Warnings:

  - You are about to drop the column `kebeleIdPicture` on the `systemadmin` table. All the data in the column will be lost.
  - Added the required column `kebeleIdPictureBack` to the `SystemAdmin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kebeleIdPictureFront` to the `SystemAdmin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `systemadmin` DROP COLUMN `kebeleIdPicture`,
    ADD COLUMN `kebeleIdPictureBack` VARCHAR(191) NOT NULL,
    ADD COLUMN `kebeleIdPictureFront` VARCHAR(191) NOT NULL;
