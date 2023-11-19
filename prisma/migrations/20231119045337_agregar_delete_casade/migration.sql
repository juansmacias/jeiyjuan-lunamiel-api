-- DropForeignKey
ALTER TABLE `Gift` DROP FOREIGN KEY `Gift_giftGroupID_fkey`;

-- AddForeignKey
ALTER TABLE `Gift` ADD CONSTRAINT `Gift_giftGroupID_fkey` FOREIGN KEY (`giftGroupID`) REFERENCES `GiftGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
