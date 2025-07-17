-- AlterTable
ALTER TABLE "Bed" ALTER COLUMN "facilities" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PG" ADD COLUMN     "pincode" TEXT;
