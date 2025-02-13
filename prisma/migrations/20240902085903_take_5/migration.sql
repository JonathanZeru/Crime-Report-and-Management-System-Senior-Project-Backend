-- CreateTable
CREATE TABLE `_CaseSajens` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CaseSajens_AB_unique`(`A`, `B`),
    INDEX `_CaseSajens_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CaseSajens` ADD CONSTRAINT `_CaseSajens_A_fkey` FOREIGN KEY (`A`) REFERENCES `Case`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CaseSajens` ADD CONSTRAINT `_CaseSajens_B_fkey` FOREIGN KEY (`B`) REFERENCES `Sajen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
