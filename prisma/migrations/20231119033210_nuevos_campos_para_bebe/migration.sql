-- DropForeignKey
ALTER TABLE `GiftGroup` DROP FOREIGN KEY `GiftGroup_cityID_fkey`;

-- AlterTable
ALTER TABLE `Gift` ADD COLUMN `itemName` VARCHAR(191) NULL,
    ADD COLUMN `urlGift` VARCHAR(191) NULL,
    MODIFY `amount` DECIMAL(65, 30) NULL,
    MODIFY `currency` ENUM('USD', 'COP') NULL;

-- AlterTable
ALTER TABLE `GiftGroup` ADD COLUMN `etapaID` INTEGER NULL,
    MODIFY `type` ENUM('TRANSPORTATION', 'FOOD', 'ACOMODATION', 'ACTIVITIY', 'DAIPERS', 'CLOTHES', 'TOYS', 'MOTHER', 'FATHER', 'ACCESSORIES') NOT NULL,
    MODIFY `cityID` INTEGER NULL;

-- CreateTable
CREATE TABLE `Etapa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `photoUrl` VARCHAR(191) NULL,
    `index` INTEGER NOT NULL,

    UNIQUE INDEX `Etapa_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GiftGroup` ADD CONSTRAINT `GiftGroup_cityID_fkey` FOREIGN KEY (`cityID`) REFERENCES `City`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GiftGroup` ADD CONSTRAINT `GiftGroup_etapaID_fkey` FOREIGN KEY (`etapaID`) REFERENCES `Etapa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
