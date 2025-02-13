-- AlterTable
ALTER TABLE `case` ADD COLUMN `caseLevelOfCrime` VARCHAR(191) NULL DEFAULT '',
    MODIFY `title` TEXT NOT NULL,
    MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `tacticalreport` ADD COLUMN `pdf` VARCHAR(191) NULL;
