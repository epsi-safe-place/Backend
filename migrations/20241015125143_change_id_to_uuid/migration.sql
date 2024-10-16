/*
  Warnings:

  - The primary key for the `API_result` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Appartenance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Conversation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Notify` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Receive` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "API_result" DROP CONSTRAINT "API_result_Id_Comments_fkey";

-- DropForeignKey
ALTER TABLE "API_result" DROP CONSTRAINT "API_result_Id_Post_Id_Users_fkey";

-- DropForeignKey
ALTER TABLE "Appartenance" DROP CONSTRAINT "Appartenance_Id_Conversation_fkey";

-- DropForeignKey
ALTER TABLE "Appartenance" DROP CONSTRAINT "Appartenance_Id_Utilisateurs_fkey";

-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_Id_Categories_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_Id_Post_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_Id_Users_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_Id_Users_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_Conversation_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_Id_Users_fkey";

-- DropForeignKey
ALTER TABLE "Notify" DROP CONSTRAINT "Notify_Id_Notifications_fkey";

-- DropForeignKey
ALTER TABLE "Notify" DROP CONSTRAINT "Notify_Id_Users_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_Id_Users_fkey";

-- DropForeignKey
ALTER TABLE "Receive" DROP CONSTRAINT "Receive_Id_Conversation_fkey";

-- DropForeignKey
ALTER TABLE "Receive" DROP CONSTRAINT "Receive_Id_Message_fkey";

-- DropForeignKey
ALTER TABLE "Receive" DROP CONSTRAINT "Receive_Id_Users_fkey";

-- DropForeignKey
ALTER TABLE "Settings" DROP CONSTRAINT "Settings_Id_Users_fkey";

-- DropForeignKey
ALTER TABLE "_MessagesReceived" DROP CONSTRAINT "_MessagesReceived_A_fkey";

-- DropForeignKey
ALTER TABLE "_MessagesReceived" DROP CONSTRAINT "_MessagesReceived_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserConversations" DROP CONSTRAINT "_UserConversations_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserConversations" DROP CONSTRAINT "_UserConversations_B_fkey";

-- AlterTable
ALTER TABLE "API_result" DROP CONSTRAINT "API_result_pkey",
ALTER COLUMN "Id_api_result" DROP DEFAULT,
ALTER COLUMN "Id_api_result" SET DATA TYPE TEXT,
ALTER COLUMN "Id_Categories" SET DATA TYPE TEXT,
ALTER COLUMN "Id_Post" SET DATA TYPE TEXT,
ALTER COLUMN "Id_Users" SET DATA TYPE TEXT,
ALTER COLUMN "Id_Comments" SET DATA TYPE TEXT,
ADD CONSTRAINT "API_result_pkey" PRIMARY KEY ("Id_api_result");
DROP SEQUENCE "API_result_Id_api_result_seq";

-- AlterTable
ALTER TABLE "Appartenance" DROP CONSTRAINT "Appartenance_pkey",
ALTER COLUMN "Id_Appartenance" DROP DEFAULT,
ALTER COLUMN "Id_Appartenance" SET DATA TYPE TEXT,
ALTER COLUMN "Id_Utilisateurs" SET DATA TYPE TEXT,
ALTER COLUMN "Id_Conversation" SET DATA TYPE TEXT,
ADD CONSTRAINT "Appartenance_pkey" PRIMARY KEY ("Id_Appartenance");
DROP SEQUENCE "Appartenance_Id_Appartenance_seq";

-- AlterTable
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_pkey",
ALTER COLUMN "Id_Categories" DROP DEFAULT,
ALTER COLUMN "Id_Categories" SET DATA TYPE TEXT,
ADD CONSTRAINT "Categories_pkey" PRIMARY KEY ("Id_Categories");
DROP SEQUENCE "Categories_Id_Categories_seq";

-- AlterTable
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_pkey",
ALTER COLUMN "Id_Comments" DROP DEFAULT,
ALTER COLUMN "Id_Comments" SET DATA TYPE TEXT,
ALTER COLUMN "Id_Post" SET DATA TYPE TEXT,
ALTER COLUMN "Id_Users" SET DATA TYPE TEXT,
ADD CONSTRAINT "Comments_pkey" PRIMARY KEY ("Id_Comments");
DROP SEQUENCE "Comments_Id_Comments_seq";

-- AlterTable
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_pkey",
ALTER COLUMN "Id_Conversation" DROP DEFAULT,
ALTER COLUMN "Id_Conversation" SET DATA TYPE TEXT,
ADD CONSTRAINT "Conversation_pkey" PRIMARY KEY ("Id_Conversation");
DROP SEQUENCE "Conversation_Id_Conversation_seq";

-- AlterTable
ALTER TABLE "Message" DROP CONSTRAINT "Message_pkey",
ALTER COLUMN "Id_Message" DROP DEFAULT,
ALTER COLUMN "Id_Message" SET DATA TYPE TEXT,
ALTER COLUMN "Id_Users" SET DATA TYPE TEXT,
ALTER COLUMN "conversationId_Conversation" SET DATA TYPE TEXT,
ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("Id_Message");
DROP SEQUENCE "Message_Id_Message_seq";

-- AlterTable
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_pkey",
ALTER COLUMN "Id_Notifications" DROP DEFAULT,
ALTER COLUMN "Id_Notifications" SET DATA TYPE TEXT,
ALTER COLUMN "Id_Users" SET DATA TYPE TEXT,
ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY ("Id_Notifications");
DROP SEQUENCE "Notifications_Id_Notifications_seq";

-- AlterTable
ALTER TABLE "Notify" DROP CONSTRAINT "Notify_pkey",
ALTER COLUMN "Id_Users" SET DATA TYPE TEXT,
ALTER COLUMN "Id_Notifications" SET DATA TYPE TEXT,
ADD CONSTRAINT "Notify_pkey" PRIMARY KEY ("Id_Users", "Id_Notifications");

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
ALTER COLUMN "Id_Post" DROP DEFAULT,
ALTER COLUMN "Id_Post" SET DATA TYPE TEXT,
ALTER COLUMN "Id_Users" SET DATA TYPE TEXT,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("Id_Post");
DROP SEQUENCE "Post_Id_Post_seq";

-- AlterTable
ALTER TABLE "Receive" DROP CONSTRAINT "Receive_pkey",
ALTER COLUMN "Id_Message" SET DATA TYPE TEXT,
ALTER COLUMN "Id_Users" SET DATA TYPE TEXT,
ALTER COLUMN "Id_Conversation" SET DATA TYPE TEXT,
ADD CONSTRAINT "Receive_pkey" PRIMARY KEY ("Id_Message", "Id_Users", "Id_Conversation");

-- AlterTable
ALTER TABLE "Settings" DROP CONSTRAINT "Settings_pkey",
ALTER COLUMN "Id_Settings" DROP DEFAULT,
ALTER COLUMN "Id_Settings" SET DATA TYPE TEXT,
ALTER COLUMN "Id_Users" SET DATA TYPE TEXT,
ADD CONSTRAINT "Settings_pkey" PRIMARY KEY ("Id_Settings");
DROP SEQUENCE "Settings_Id_Settings_seq";

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
ALTER COLUMN "Id_Users" DROP DEFAULT,
ALTER COLUMN "Id_Users" SET DATA TYPE TEXT,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("Id_Users");
DROP SEQUENCE "Users_Id_Users_seq";

-- AlterTable
ALTER TABLE "_MessagesReceived" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_UserConversations" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_Id_Users_fkey" FOREIGN KEY ("Id_Users") REFERENCES "Users"("Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_Id_Post_fkey" FOREIGN KEY ("Id_Post") REFERENCES "Post"("Id_Post") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_Id_Users_fkey" FOREIGN KEY ("Id_Users") REFERENCES "Users"("Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_Id_Users_fkey" FOREIGN KEY ("Id_Users") REFERENCES "Users"("Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_Conversation_fkey" FOREIGN KEY ("conversationId_Conversation") REFERENCES "Conversation"("Id_Conversation") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_Id_Users_fkey" FOREIGN KEY ("Id_Users") REFERENCES "Users"("Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_Id_Users_fkey" FOREIGN KEY ("Id_Users") REFERENCES "Users"("Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appartenance" ADD CONSTRAINT "Appartenance_Id_Conversation_fkey" FOREIGN KEY ("Id_Conversation") REFERENCES "Conversation"("Id_Conversation") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appartenance" ADD CONSTRAINT "Appartenance_Id_Utilisateurs_fkey" FOREIGN KEY ("Id_Utilisateurs") REFERENCES "Users"("Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "API_result" ADD CONSTRAINT "API_result_Id_Post_Id_Users_fkey" FOREIGN KEY ("Id_Post", "Id_Users") REFERENCES "Post"("Id_Post", "Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "API_result" ADD CONSTRAINT "API_result_Id_Comments_fkey" FOREIGN KEY ("Id_Comments") REFERENCES "Comments"("Id_Comments") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_Id_Categories_fkey" FOREIGN KEY ("Id_Categories") REFERENCES "API_result"("Id_api_result") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notify" ADD CONSTRAINT "Notify_Id_Users_fkey" FOREIGN KEY ("Id_Users") REFERENCES "Users"("Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notify" ADD CONSTRAINT "Notify_Id_Notifications_fkey" FOREIGN KEY ("Id_Notifications") REFERENCES "Notifications"("Id_Notifications") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receive" ADD CONSTRAINT "Receive_Id_Message_fkey" FOREIGN KEY ("Id_Message") REFERENCES "Message"("Id_Message") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receive" ADD CONSTRAINT "Receive_Id_Conversation_fkey" FOREIGN KEY ("Id_Conversation") REFERENCES "Conversation"("Id_Conversation") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receive" ADD CONSTRAINT "Receive_Id_Users_fkey" FOREIGN KEY ("Id_Users") REFERENCES "Users"("Id_Users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessagesReceived" ADD CONSTRAINT "_MessagesReceived_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("Id_Message") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessagesReceived" ADD CONSTRAINT "_MessagesReceived_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("Id_Users") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserConversations" ADD CONSTRAINT "_UserConversations_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation"("Id_Conversation") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserConversations" ADD CONSTRAINT "_UserConversations_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("Id_Users") ON DELETE CASCADE ON UPDATE CASCADE;
