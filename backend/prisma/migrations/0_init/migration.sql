-- CreateTable
CREATE TABLE `todo` (
    `todo_id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`todo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

