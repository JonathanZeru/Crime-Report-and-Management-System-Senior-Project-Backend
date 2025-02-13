/*
  Warnings:

  - You are about to drop the column `kebeleIdPicture` on the `inspector` table. All the data in the column will be lost.
  - You are about to drop the column `kebeleIdPicture` on the `policehead` table. All the data in the column will be lost.
  - You are about to drop the column `kebeleIdPicture` on the `prosecutor` table. All the data in the column will be lost.
  - You are about to drop the column `kebeleIdPicture` on the `sajen` table. All the data in the column will be lost.
  - Added the required column `kebeleIdPictureBack` to the `Inspector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kebeleIdPictureFront` to the `Inspector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kebeleIdPictureBack` to the `PoliceHead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kebeleIdPictureFront` to the `PoliceHead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kebeleIdPictureBack` to the `Prosecutor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kebeleIdPictureFront` to the `Prosecutor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kebeleIdPictureBack` to the `Sajen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kebeleIdPictureFront` to the `Sajen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `inspector` DROP COLUMN `kebeleIdPicture`,
    ADD COLUMN `kebeleIdPictureBack` VARCHAR(191) NOT NULL,
    ADD COLUMN `kebeleIdPictureFront` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `policehead` DROP COLUMN `kebeleIdPicture`,
    ADD COLUMN `kebeleIdPictureBack` VARCHAR(191) NOT NULL,
    ADD COLUMN `kebeleIdPictureFront` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `prosecutor` DROP COLUMN `kebeleIdPicture`,
    ADD COLUMN `kebeleIdPictureBack` VARCHAR(191) NOT NULL,
    ADD COLUMN `kebeleIdPictureFront` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `sajen` DROP COLUMN `kebeleIdPicture`,
    ADD COLUMN `kebeleIdPictureBack` VARCHAR(191) NOT NULL,
    ADD COLUMN `kebeleIdPictureFront` VARCHAR(191) NOT NULL;
