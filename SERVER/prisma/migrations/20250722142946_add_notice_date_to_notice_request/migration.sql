/*
  Warnings:

  - Added the required column `noticeDate` to the `NoticeRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NoticeRequest" ADD COLUMN     "noticeDate" TIMESTAMP(3) NOT NULL;
