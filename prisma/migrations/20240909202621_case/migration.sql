/*
  Warnings:

  - You are about to drop the column `crimeID` on the `case` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `case` table. All the data in the column will be lost.
  - Added the required column `crimeCityName` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crimeCityUniqueName` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crimeCountryName` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crimeSubCityName` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `case` DROP FOREIGN KEY `Case_locationId_fkey`;

-- AlterTable
ALTER TABLE `case` DROP COLUMN `crimeID`,
    DROP COLUMN `locationId`,
    ADD COLUMN `crimeCityName` VARCHAR(191) NOT NULL,
    ADD COLUMN `crimeCityUniqueName` VARCHAR(191) NOT NULL,
    ADD COLUMN `crimeCountryName` VARCHAR(191) NOT NULL,
    ADD COLUMN `crimeSubCityName` VARCHAR(191) NOT NULL;
