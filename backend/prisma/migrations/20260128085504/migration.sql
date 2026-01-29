/*
  Warnings:

  - You are about to drop the column `text` on the `todo` table. All the data in the column will be lost.
  - Added the required column `title` to the `todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `todo` DROP COLUMN `text`,
    ADD COLUMN `complated_at` DATETIME(3) NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `title` VARCHAR(50) NOT NULL;
