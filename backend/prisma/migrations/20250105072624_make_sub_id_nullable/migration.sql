-- DropForeignKey
ALTER TABLE `responsible_committee` DROP FOREIGN KEY `Responsible_Committee_Sub_id_fkey`;

-- AlterTable
ALTER TABLE `responsible_committee` MODIFY `sub_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `responsible_committee` ADD CONSTRAINT `Responsible_Committee_Sub_id_fkey` FOREIGN KEY (`sub_id`) REFERENCES `subject`(`subj_id`) ON DELETE SET NULL ON UPDATE CASCADE;
