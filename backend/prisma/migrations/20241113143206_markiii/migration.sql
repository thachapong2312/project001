-- CreateTable
CREATE TABLE `pi` (
    `PI_id` INTEGER NOT NULL AUTO_INCREMENT,
    `PI_no` VARCHAR(191) NOT NULL,
    `PI_description` VARCHAR(191) NULL,

    PRIMARY KEY (`PI_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pi_summary` (
    `summary_id` INTEGER NOT NULL AUTO_INCREMENT,
    `subj_id` INTEGER NOT NULL,
    `PI_id` INTEGER NOT NULL,
    `PI_score1` INTEGER NOT NULL,
    `PI_score2` INTEGER NOT NULL,
    `PI_score3` INTEGER NOT NULL,
    `PI_score4` INTEGER NOT NULL,
    `PI_score5` INTEGER NOT NULL,

    INDEX `PI_Summary_PI_id_fkey`(`PI_id`),
    INDEX `PI_Summary_subj_id_fkey`(`subj_id`),
    PRIMARY KEY (`summary_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subject` (
    `subj_id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_name` VARCHAR(191) NOT NULL,
    `subj_name` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `prof_id` INTEGER NOT NULL,
    `update_data` DATETIME(3) NULL,

    INDEX `Subject_prof_Id_fkey`(`prof_id`),
    UNIQUE INDEX `unique_course_year_prof_id`(`course_name`, `year`, `prof_id`),
    PRIMARY KEY (`subj_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `prof_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `surname` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `user_type` VARCHAR(191) NULL,

    UNIQUE INDEX `USER_email_key`(`email`),
    PRIMARY KEY (`prof_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pi_summary` ADD CONSTRAINT `PI_Summary_PI_id_fkey` FOREIGN KEY (`PI_id`) REFERENCES `pi`(`PI_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pi_summary` ADD CONSTRAINT `PI_Summary_subj_id_fkey` FOREIGN KEY (`subj_id`) REFERENCES `subject`(`subj_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subject` ADD CONSTRAINT `Subject_prof_Id_fkey` FOREIGN KEY (`prof_id`) REFERENCES `user`(`prof_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
