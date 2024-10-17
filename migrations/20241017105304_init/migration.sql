-- CreateTable
CREATE TABLE "Users" (
    "Id_User" TEXT NOT NULL,
    "name" VARCHAR(50),
    "last_name" VARCHAR(20) NOT NULL,
    "first_name" VARCHAR(20) NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "mail" VARCHAR(25) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "isAdmin" BOOLEAN,
    "seed_totp" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("Id_User")
);

-- CreateTable
CREATE TABLE "Post" (
    "Id_Post" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "visibility" VARCHAR(50) NOT NULL,
    "toxic_score" DECIMAL(2,1) NOT NULL,
    "image_exists" BOOLEAN,
    "date_creation" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN,
    "Id_User" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("Id_Post")
);

-- CreateTable
CREATE TABLE "Comments" (
    "Id_Comment" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date_upload" TIMESTAMP(3) NOT NULL,
    "toxic_score" DECIMAL(2,1) NOT NULL,
    "image_exists" BOOLEAN,
    "verified" BOOLEAN,
    "Id_Reply_to_comment" TEXT,
    "Id_Post" TEXT NOT NULL,
    "Id_User" TEXT NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("Id_Comment")
);

-- CreateTable
CREATE TABLE "Message" (
    "Id_Message" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date_upload" TIMESTAMP(3) NOT NULL,
    "Id_User" TEXT NOT NULL,
    "Id_Conversation" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("Id_Message")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "Id_Notifications" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "content" TEXT,
    "date_upload" TEXT,
    "Id_User" TEXT NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("Id_Notifications")
);

-- CreateTable
CREATE TABLE "Settings" (
    "Id_Settings" TEXT NOT NULL,
    "data_type" VARCHAR(50) NOT NULL,
    "content" TEXT NOT NULL,
    "confidentiality" BOOLEAN NOT NULL,
    "Id_User" TEXT NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("Id_Settings")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "Id_Conversation" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("Id_Conversation")
);

-- CreateTable
CREATE TABLE "API_result" (
    "Id_api_result" TEXT NOT NULL,
    "Id_Categories" INTEGER NOT NULL,
    "flagged" BOOLEAN,
    "Id_Message" TEXT NOT NULL,
    "Id_Post" TEXT NOT NULL,
    "Id_Comment" TEXT NOT NULL,

    CONSTRAINT "API_result_pkey" PRIMARY KEY ("Id_api_result")
);

-- CreateTable
CREATE TABLE "Categories" (
    "Id_Category" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "score" TEXT,
    "Id_api_result" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("Id_Category")
);

-- CreateTable
CREATE TABLE "Friend" (
    "Id_User" TEXT NOT NULL,
    "Id_Friend" TEXT NOT NULL,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("Id_User","Id_Friend")
);

-- CreateTable
CREATE TABLE "Report" (
    "Id_Report" TEXT NOT NULL,
    "Id_Reporter" TEXT NOT NULL,
    "Id_Reported" TEXT NOT NULL,
    "type" TEXT,
    "reason" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("Id_Report")
);

-- CreateTable
CREATE TABLE "Reports" (
    "Id_User" TEXT NOT NULL,
    "Id_Report" TEXT NOT NULL,

    CONSTRAINT "Reports_pkey" PRIMARY KEY ("Id_User","Id_Report")
);

-- CreateTable
CREATE TABLE "Discuss" (
    "Id_User" TEXT NOT NULL,
    "Id_Conversation" TEXT NOT NULL,

    CONSTRAINT "Discuss_pkey" PRIMARY KEY ("Id_User","Id_Conversation")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_mail_key" ON "Users"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "API_result_Id_Post_key" ON "API_result"("Id_Post");

-- CreateIndex
CREATE UNIQUE INDEX "API_result_Id_Comment_key" ON "API_result"("Id_Comment");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_Id_User_fkey" FOREIGN KEY ("Id_User") REFERENCES "Users"("Id_User") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_Id_Reply_to_comment_fkey" FOREIGN KEY ("Id_Reply_to_comment") REFERENCES "Comments"("Id_Comment") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_Id_Post_fkey" FOREIGN KEY ("Id_Post") REFERENCES "Post"("Id_Post") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_Id_User_fkey" FOREIGN KEY ("Id_User") REFERENCES "Users"("Id_User") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_Id_User_fkey" FOREIGN KEY ("Id_User") REFERENCES "Users"("Id_User") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_Id_Conversation_fkey" FOREIGN KEY ("Id_Conversation") REFERENCES "Conversation"("Id_Conversation") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_Id_User_fkey" FOREIGN KEY ("Id_User") REFERENCES "Users"("Id_User") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_Id_User_fkey" FOREIGN KEY ("Id_User") REFERENCES "Users"("Id_User") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "API_result" ADD CONSTRAINT "API_result_Id_Message_fkey" FOREIGN KEY ("Id_Message") REFERENCES "Message"("Id_Message") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "API_result" ADD CONSTRAINT "API_result_Id_Post_fkey" FOREIGN KEY ("Id_Post") REFERENCES "Post"("Id_Post") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "API_result" ADD CONSTRAINT "API_result_Id_Comment_fkey" FOREIGN KEY ("Id_Comment") REFERENCES "Comments"("Id_Comment") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_Id_api_result_fkey" FOREIGN KEY ("Id_api_result") REFERENCES "API_result"("Id_api_result") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_Id_User_fkey" FOREIGN KEY ("Id_User") REFERENCES "Users"("Id_User") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_Id_Friend_fkey" FOREIGN KEY ("Id_Friend") REFERENCES "Users"("Id_User") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_Id_User_fkey" FOREIGN KEY ("Id_User") REFERENCES "Users"("Id_User") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_Id_Report_fkey" FOREIGN KEY ("Id_Report") REFERENCES "Report"("Id_Report") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discuss" ADD CONSTRAINT "Discuss_Id_User_fkey" FOREIGN KEY ("Id_User") REFERENCES "Users"("Id_User") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discuss" ADD CONSTRAINT "Discuss_Id_Conversation_fkey" FOREIGN KEY ("Id_Conversation") REFERENCES "Conversation"("Id_Conversation") ON DELETE CASCADE ON UPDATE CASCADE;
