/*
  Warnings:

  - You are about to drop the column `focusTime` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `longBreak` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `shortBreak` on the `settings` table. All the data in the column will be lost.
  - The primary key for the `task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `status` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `task` table. All the data in the column will be lost.
  - Added the required column `longBreakTime` to the `Settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortBreakTime` to the `Settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workTime` to the `Settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `settings` DROP COLUMN `focusTime`,
    DROP COLUMN `longBreak`,
    DROP COLUMN `shortBreak`,
    ADD COLUMN `longBreakTime` INTEGER NOT NULL,
    ADD COLUMN `shortBreakTime` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `workTime` INTEGER NOT NULL,
    MODIFY `id` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `task` DROP PRIMARY KEY,
    DROP COLUMN `status`,
    DROP COLUMN `title`,
    ADD COLUMN `completedDate` BIGINT NULL,
    ADD COLUMN `duration` INTEGER NOT NULL,
    ADD COLUMN `interruptDate` BIGINT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `startDate` BIGINT NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE INDEX `Task_startDate_idx` ON `Task`(`startDate`);
