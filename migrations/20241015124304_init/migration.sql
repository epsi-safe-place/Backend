-- CreateTable
CREATE TABLE "Users" (
    "Id_Users" SERIAL NOT NULL,
    "name" TEXT,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "mail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("Id_Users")
);

-- CreateTable
CREATE TABLE "Post" (
    "Id_Post" SERIAL NOT NULL,
    "Id_Users" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,
    "toxic_score" DOUBLE PRECISION NOT NULL,
    "image_path" TEXT,
    "date_creation" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("Id_Post")
);

-- CreateTable
CREATE TABLE "Comments" (
    "Id_Comments" SERIAL NOT NULL,
    "Id_Post" INTEGER NOT NULL,
    "Id_Users" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "date_upload" TIMESTAMP(3) NOT NULL,
    "toxic_score" DOUBLE PRECISION NOT NULL,
    "image_path" TEXT,
    "verified" BOOLEAN,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("Id_Comments")
);

-- CreateTable
CREATE TABLE "Message" (
    "Id_Message" SERIAL NOT NULL,
    "Id_Users" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "date_upload" TIMESTAMP(3) NOT NULL,
    "conversationId_Conversation" INTEGER,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("Id_Message")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "Id_Notifications" SERIAL NOT NULL,
    "Id_Users" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT,
    "date_upload" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("Id_Notifications")
);

-- CreateTable
CREATE TABLE "Settings" (
    "Id_Settings" SERIAL NOT NULL,
    "Id_Users" INTEGER NOT NULL,
    "data_type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "confidentiality" BOOLEAN NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("Id_Settings")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "Id_Conversation" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("Id_Conversation")
);

-- CreateTable
CREATE TABLE "Appartenance" (
    "Id_Appartenance" SERIAL NOT NULL,
    "Id_Utilisateurs" INTEGER NOT NULL,
    "Id_Conversation" INTEGER NOT NULL,

    CONSTRAINT "Appartenance_pkey" PRIMARY KEY ("Id_Appartenance")
);

-- CreateTable
CREATE TABLE "API_result" (
    "Id_api_result" SERIAL NOT NULL,
    "Id_Categories" INTEGER NOT NULL,
    "flagged" BOOLEAN NOT NULL,
    "Id_Post" INTEGER NOT NULL,
    "Id_Users" INTEGER NOT NULL,
    "Id_Comments" INTEGER,

    CONSTRAINT "API_result_pkey" PRIMARY KEY ("Id_api_result")
);

-- CreateTable
CREATE TABLE "Categories" (
    "Id_Categories" SERIAL NOT NULL,
    "name" TEXT,
    "score" TEXT,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("Id_Categories")
);

-- CreateTable
CREATE TABLE "Notify" (
    "Id_Users" INTEGER NOT NULL,
    "Id_Notifications" INTEGER NOT NULL,

    CONSTRAINT "Notify_pkey" PRIMARY KEY ("Id_Users","Id_Notifications")
);

-- CreateTable
CREATE TABLE "Receive" (
    "Id_Message" INTEGER NOT NULL,
    "Id_Users" INTEGER NOT NULL,
    "Id_Conversation" INTEGER NOT NULL,

    CONSTRAINT "Receive_pkey" PRIMARY KEY ("Id_Message","Id_Users","Id_Conversation")
);

-- CreateTable
CREATE TABLE "_MessagesReceived" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserConversations" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_mail_key" ON "Users"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "Post_Id_Post_Id_Users_key" ON "Post"("Id_Post", "Id_Users");

-- CreateIndex
CREATE UNIQUE INDEX "_MessagesReceived_AB_unique" ON "_MessagesReceived"("A", "B");

-- CreateIndex
CREATE INDEX "_MessagesReceived_B_index" ON "_MessagesReceived"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserConversations_AB_unique" ON "_UserConversations"("A", "B");

-- CreateIndex
CREATE INDEX "_UserConversations_B_index" ON "_UserConversations"("B");

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
