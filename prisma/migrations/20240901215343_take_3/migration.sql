-- CreateTable
CREATE TABLE `InspectorSajen` (
    `inspectorId` INTEGER NOT NULL,
    `sajenId` INTEGER NOT NULL,

    PRIMARY KEY (`inspectorId`, `sajenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InspectorSajen` ADD CONSTRAINT `InspectorSajen_inspectorId_fkey` FOREIGN KEY (`inspectorId`) REFERENCES `Inspector`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspectorSajen` ADD CONSTRAINT `InspectorSajen_sajenId_fkey` FOREIGN KEY (`sajenId`) REFERENCES `Sajen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
