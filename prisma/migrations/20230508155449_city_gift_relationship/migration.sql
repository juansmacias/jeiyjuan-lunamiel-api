/*
  Warnings:

  - Added the required column `cityID` to the `GiftGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GiftGroup` ADD COLUMN `cityID` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `GiftGroup` ADD CONSTRAINT `GiftGroup_cityID_fkey` FOREIGN KEY (`cityID`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
