/*
  Warnings:

  - You are about to drop the column `accuserFirstName` on the `case` table. All the data in the column will be lost.
  - You are about to drop the column `accuserLastName` on the `case` table. All the data in the column will be lost.
  - You are about to drop the column `crimeCityName` on the `case` table. All the data in the column will be lost.
  - You are about to drop the column `crimeCountryName` on the `case` table. All the data in the column will be lost.
  - You are about to drop the column `crimeSubCityName` on the `case` table. All the data in the column will be lost.
  - You are about to drop the column `kebeleIdPicture` on the `user` table. All the data in the column will be lost.
  - Added the required column `kebeleIdPictureBack` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kebeleIdPictureFront` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `case` DROP COLUMN `accuserFirstName`,
    DROP COLUMN `accuserLastName`,
    DROP COLUMN `crimeCityName`,
    DROP COLUMN `crimeCountryName`,
    DROP COLUMN `crimeSubCityName`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `kebeleIdPicture`,
    ADD COLUMN `kebeleIdPictureBack` VARCHAR(191) NOT NULL,
    ADD COLUMN `kebeleIdPictureFront` VARCHAR(191) NOT NULL,
    MODIFY `profilePicture` VARCHAR(191) NULL;
