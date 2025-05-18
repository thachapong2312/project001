-- CreateTable
CREATE TABLE `pi_survey` (
    `survey_id` INTEGER NOT NULL AUTO_INCREMENT,
    `survey_year` INTEGER NOT NULL,
    `PI_id` INTEGER NOT NULL,
    `PIS_score1` INTEGER NOT NULL,
    `PIS_score2` INTEGER NOT NULL,
    `PIS_score3` INTEGER NOT NULL,
    `PIS_score4` INTEGER NOT NULL,
    `PIS_score5` INTEGER NOT NULL,

    INDEX `PI_Survey_PI_id_fkey`(`PI_id`),
    PRIMARY KEY (`survey_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `responsible_committee` (
    `committee_id` INTEGER NOT NULL AUTO_INCREMENT,
    `resp_year` INTEGER NOT NULL,
    `prof_id` INTEGER NOT NULL,
    `PI_id` INTEGER NOT NULL,
    `sub_id` INTEGER NOT NULL,
    `weight` INTEGER NULL,

    INDEX `Responsible_Committee_PI_id_fkey`(`PI_id`),
    INDEX `Responsible_Committee_Sub_id_fkey`(`sub_id`),
    INDEX `Responsible_Committee_Prof_Id_fkey`(`prof_id`),
    PRIMARY KEY (`committee_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pi_survey` ADD CONSTRAINT `PI_Survey_PI_id_fkey` FOREIGN KEY (`PI_id`) REFERENCES `pi`(`PI_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `responsible_committee` ADD CONSTRAINT `Responsible_Committee_PI_id_fkey` FOREIGN KEY (`PI_id`) REFERENCES `pi`(`PI_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `responsible_committee` ADD CONSTRAINT `Responsible_Committee_Sub_id_fkey` FOREIGN KEY (`sub_id`) REFERENCES `subject`(`subj_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `responsible_committee` ADD CONSTRAINT `Responsible_Committee_Prof_Id_fkey` FOREIGN KEY (`prof_id`) REFERENCES `user`(`prof_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
