/*
  Warnings:

  - You are about to drop the column `fullNamesOfArrestedSuspects` on the `case` table. All the data in the column will be lost.
  - You are about to drop the column `fullNamesOfSuspects` on the `case` table. All the data in the column will be lost.
  - Added the required column `isActive` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `case` DROP COLUMN `fullNamesOfArrestedSuspects`,
    DROP COLUMN `fullNamesOfSuspects`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isActive` BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE `Suspects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `isArrested` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SuspectsFullNamesOfCases` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SuspectsFullNamesOfCases_AB_unique`(`A`, `B`),
    INDEX `_SuspectsFullNamesOfCases_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SuspectsFullNamesOfArrestedCases` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SuspectsFullNamesOfArrestedCases_AB_unique`(`A`, `B`),
    INDEX `_SuspectsFullNamesOfArrestedCases_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_SuspectsFullNamesOfCases` ADD CONSTRAINT `_SuspectsFullNamesOfCases_A_fkey` FOREIGN KEY (`A`) REFERENCES `Case`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SuspectsFullNamesOfCases` ADD CONSTRAINT `_SuspectsFullNamesOfCases_B_fkey` FOREIGN KEY (`B`) REFERENCES `Suspects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SuspectsFullNamesOfArrestedCases` ADD CONSTRAINT `_SuspectsFullNamesOfArrestedCases_A_fkey` FOREIGN KEY (`A`) REFERENCES `Case`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SuspectsFullNamesOfArrestedCases` ADD CONSTRAINT `_SuspectsFullNamesOfArrestedCases_B_fkey` FOREIGN KEY (`B`) REFERENCES `Suspects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
