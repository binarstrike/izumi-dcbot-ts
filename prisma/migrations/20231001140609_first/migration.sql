-- CreateTable
CREATE TABLE "guilds" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "guildName" TEXT NOT NULL,

    CONSTRAINT "guilds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configData" (
    "id" SERIAL NOT NULL,
    "guildRelId" INTEGER NOT NULL,
    "chatGptChannelId" TEXT,

    CONSTRAINT "configData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guilds_guildId_key" ON "guilds"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "configData_guildRelId_key" ON "configData"("guildRelId");

-- AddForeignKey
ALTER TABLE "configData" ADD CONSTRAINT "configData_guildRelId_fkey" FOREIGN KEY ("guildRelId") REFERENCES "guilds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
