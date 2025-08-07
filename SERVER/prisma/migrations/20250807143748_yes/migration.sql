/*
  Warnings:

  - You are about to drop the column `isAC` on the `Room` table. All the data in the column will be lost.
  - Made the column `date` on table `Expense` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "isAC",
ADD COLUMN     "amenities" JSONB;

-- CreateTable
CREATE TABLE "NoticeBoard" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "userId" INTEGER NOT NULL,
    "pgId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NoticeBoard_pkey" PRIMARY KEY ("id")
);
