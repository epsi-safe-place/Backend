/*
  Warnings:

  - You are about to drop the column `image_path` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `conversationId_Conversation` on the `Message` table. All the data in the column will be lost.
  - The primary key for the `Notify` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `image_path` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `_MessagesReceived` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[Id_Categories]` on the table `API_result` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Id_Post,Id_Users]` on the table `API_result` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Id_Comments,Id_Post,Id_Users]` on the table `API_result` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Id_Appartenance,Id_Utilisateurs]` on the table `Appartenance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Id_Comments,Id_Post,Id_Users,Id_Comments_replied]` on the table `Comments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Id_Message,Id_Users]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Id_Notifications,Id_Users]` on the table `Notifications` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Id_Message` to the `API_result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Id_Comments_replied` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Id_Users_1` to the `Notify` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_Id_Categories_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_Conversation_fkey";

-- DropForeignKey
ALTER TABLE "Notify" DROP CONSTRAINT "Notify_Id_Notifications_fkey";

-- DropForeignKey
ALTER TABLE "_MessagesReceived" DROP CONSTRAINT "_MessagesReceived_A_fkey";

-- DropForeignKey
ALTER TABLE "_MessagesReceived" DROP CONSTRAINT "_MessagesReceived_B_fkey";

-- AlterTable
ALTER TABLE "API_result" ADD COLUMN     "Id_Message" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "image_path",
ADD COLUMN     "Id_Comments_replied" TEXT NOT NULL,
ADD COLUMN     "image_exists" BOOLEAN;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "conversationId_Conversation";

-- AlterTable
ALTER TABLE "Notifications" ALTER COLUMN "date_upload" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Notify" DROP CONSTRAINT "Notify_pkey",
ADD COLUMN     "Id_Users_1" TEXT NOT NULL,
ADD CONSTRAINT "Notify_pkey" PRIMARY KEY ("Id_Users", "Id_Notifications", "Id_Users_1");

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "image_path",
ADD COLUMN     "image_exists" BOOLEAN;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "seed_totp" TEXT;

-- DropTable
DROP TABLE "_MessagesReceived";

-- CreateTable
CREATE TABLE "Friends" (
    "Id_Friends" TEXT NOT NULL,
    "Id_Users" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("Id_Friends")
);

-- CreateTable
CREATE TABLE "Report" (
    "Id_Report" TEXT NOT NULL,
    "Id_Reporter" TEXT NOT NULL,
    "Id_Reported" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "reason" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("Id_Report","Id_Reporter","Id_Reported")
);

-- CreateTable
CREATE TABLE "Send" (
    "Id_Users" TEXT NOT NULL,
    "Id_Message" TEXT NOT NULL,
    "Id_Users_1" TEXT NOT NULL,

    CONSTRAINT "Send_pkey" PRIMARY KEY ("Id_Users","Id_Message","Id_Users_1")
);

-- CreateTable
CREATE TABLE "Speak" (
    "Id_Conversation" TEXT NOT NULL,
    "Id_Users" TEXT NOT NULL,
    "Id_Appartenance" TEXT NOT NULL,
    "Id_Utilisateurs" TEXT NOT NULL,

    CONSTRAINT "Speak_pkey" PRIMARY KEY ("Id_Conversation","Id_Users","Id_Appartenance","Id_Utilisateurs")
);

-- CreateTable
CREATE TABLE "FriendRelations" (
    "Id_Users" TEXT NOT NULL,
    "Id_Friends" TEXT NOT NULL,
    "Id_Users_1" TEXT NOT NULL,

    CONSTRAINT "FriendRelations_pkey" PRIMARY KEY ("Id_Users","Id_Friends","Id_Users_1")
);

-- CreateTable
CREATE TABLE "Reports" (
    "Id_Users" TEXT NOT NULL,
    "Id_Report" TEXT NOT NULL,
    "Id_Reporter" TEXT NOT NULL,
    "Id_Reported" TEXT NOT NULL,

    CONSTRAINT "Reports_pkey" PRIMARY KEY ("Id_Users","Id_Report","Id_Reporter","Id_Reported")
);

-- CreateIndex
CREATE UNIQUE INDEX "Friends_Id_Friends_Id_Users_key" ON "Friends"("Id_Friends", "Id_Users");

-- CreateIndex
CREATE UNIQUE INDEX "API_result_Id_Categories_key" ON "API_result"("Id_Categories");

-- CreateIndex
CREATE UNIQUE INDEX "API_result_Id_Post_Id_Users_key" ON "API_result"("Id_Post", "Id_Users");

-- CreateIndex
CREATE UNIQUE INDEX "API_result_Id_Comments_Id_Post_Id_Users_key" ON "API_result"("Id_Comments", "Id_Post", "Id_Users");

-- CreateIndex
CREATE UNIQUE INDEX "Appartenance_Id_Appartenance_Id_Utilisateurs_key" ON "Appartenance"("Id_Appartenance", "Id_Utilisateurs");

-- CreateIndex
CREATE UNIQUE INDEX "Comments_Id_Comments_Id_Post_Id_Users_Id_Comments_replied_key" ON "Comments"("Id_Comments", "Id_Post", "Id_Users", "Id_Comments_replied");

-- CreateIndex
CREATE UNIQUE INDEX "Message_Id_Message_Id_Users_key" ON "Message"("Id_Message", "Id_Users");

-- CreateIndex
CREATE UNIQUE INDEX "Notifications_Id_Notifications_Id_Users_key" ON "Notifications"("Id_Notifications", "Id_Users");

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_Id_Comments_replied_fkey" FOREIGN KEY ("Id_Comments_replied") REFERENCES "Comments"("Id_Comments") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "API_result" ADD CONSTRAINT "API_result_Id_Categories_fkey" FOREIGN KEY ("Id_Categories") REFERENCES "Categories"("Id_Categories") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_Id_Users_fkey" FOREIGN KEY ("Id_Users") REFERENCES "Users"("Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_Id_Reporter_fkey" FOREIGN KEY ("Id_Reporter") REFERENCES "Users"("Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_Id_Reported_fkey" FOREIGN KEY ("Id_Reported") REFERENCES "Users"("Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Send" ADD CONSTRAINT "Send_Id_Users_fkey" FOREIGN KEY ("Id_Users") REFERENCES "Users"("Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Send" ADD CONSTRAINT "Send_Id_Message_Id_Users_1_fkey" FOREIGN KEY ("Id_Message", "Id_Users_1") REFERENCES "Message"("Id_Message", "Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notify" ADD CONSTRAINT "Notify_Id_Notifications_Id_Users_1_fkey" FOREIGN KEY ("Id_Notifications", "Id_Users_1") REFERENCES "Notifications"("Id_Notifications", "Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Speak" ADD CONSTRAINT "Speak_Id_Conversation_fkey" FOREIGN KEY ("Id_Conversation") REFERENCES "Conversation"("Id_Conversation") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Speak" ADD CONSTRAINT "Speak_Id_Appartenance_Id_Utilisateurs_fkey" FOREIGN KEY ("Id_Appartenance", "Id_Utilisateurs") REFERENCES "Appartenance"("Id_Appartenance", "Id_Utilisateurs") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Speak" ADD CONSTRAINT "Speak_Id_Users_fkey" FOREIGN KEY ("Id_Users") REFERENCES "Users"("Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRelations" ADD CONSTRAINT "FriendRelations_Id_Users_fkey" FOREIGN KEY ("Id_Users") REFERENCES "Users"("Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRelations" ADD CONSTRAINT "FriendRelations_Id_Friends_Id_Users_1_fkey" FOREIGN KEY ("Id_Friends", "Id_Users_1") REFERENCES "Friends"("Id_Friends", "Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_Id_Users_fkey" FOREIGN KEY ("Id_Users") REFERENCES "Users"("Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_Id_Report_Id_Reporter_Id_Reported_fkey" FOREIGN KEY ("Id_Report", "Id_Reporter", "Id_Reported") REFERENCES "Report"("Id_Report", "Id_Reporter", "Id_Reported") ON DELETE RESTRICT ON UPDATE CASCADE;
