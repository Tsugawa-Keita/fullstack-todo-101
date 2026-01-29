/*
  Warnings:

  - You are about to drop the column `complated_at` on the `todo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `todo` DROP COLUMN `complated_at`,
    ADD COLUMN `completed_at` DATETIME(3) NULL;
