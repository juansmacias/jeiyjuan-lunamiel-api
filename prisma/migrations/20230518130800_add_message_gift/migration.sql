-- AlterTable
ALTER TABLE `Gift` ADD COLUMN `message` VARCHAR(191) NULL,
    MODIFY `isPrivate` BOOLEAN NOT NULL DEFAULT false;
