/*
  Warnings:

  - Added the required column `currency` to the `Gift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPrivate` to the `Gift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Gift` ADD COLUMN `currency` ENUM('USD', 'COP') NOT NULL,
    ADD COLUMN `isPrivate` BOOLEAN NOT NULL;
