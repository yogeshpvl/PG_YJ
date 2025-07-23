/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Floor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "GuestPolicy" (
    "id" SERIAL NOT NULL,
    "guestId" INTEGER NOT NULL,
    "pgId" INTEGER NOT NULL,
    "advance" DOUBLE PRECISION NOT NULL,
    "maintenance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuestPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoticeRequest" (
    "id" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "pgId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NoticeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuestPolicy_guestId_key" ON "GuestPolicy"("guestId");

-- CreateIndex
CREATE UNIQUE INDEX "Floor_name_key" ON "Floor"("name");

-- AddForeignKey
ALTER TABLE "GuestPolicy" ADD CONSTRAINT "GuestPolicy_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestPolicy" ADD CONSTRAINT "GuestPolicy_pgId_fkey" FOREIGN KEY ("pgId") REFERENCES "PG"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoticeRequest" ADD CONSTRAINT "NoticeRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoticeRequest" ADD CONSTRAINT "NoticeRequest_pgId_fkey" FOREIGN KEY ("pgId") REFERENCES "PG"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
