/*
  Warnings:

  - Added the required column `date` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bedId_fkey";

-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "paidDate" TIMESTAMP(3),
ALTER COLUMN "bedId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Complaint" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "pgId" INTEGER,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bedId_fkey" FOREIGN KEY ("bedId") REFERENCES "Bed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_pgId_fkey" FOREIGN KEY ("pgId") REFERENCES "PG"("id") ON DELETE SET NULL ON UPDATE CASCADE;
