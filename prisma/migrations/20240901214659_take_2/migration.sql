-- CreateTable
CREATE TABLE `CaseSajen` (
    `caseId` INTEGER NOT NULL,
    `sajenId` INTEGER NOT NULL,

    PRIMARY KEY (`caseId`, `sajenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CaseSajen` ADD CONSTRAINT `CaseSajen_caseId_fkey` FOREIGN KEY (`caseId`) REFERENCES `Case`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaseSajen` ADD CONSTRAINT `CaseSajen_sajenId_fkey` FOREIGN KEY (`sajenId`) REFERENCES `Sajen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
