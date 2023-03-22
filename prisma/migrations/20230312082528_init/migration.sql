-- CreateTable
CREATE TABLE `ServerData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serverId` CHAR(32) NOT NULL,
    `serverName` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `ServerData_serverId_key`(`serverId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChannelConfiguration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `channelId` CHAR(32) NOT NULL DEFAULT '0',
    `idServer` CHAR(32) NOT NULL,
    `channelName` VARCHAR(100) NOT NULL DEFAULT 'general',

    UNIQUE INDEX `ChannelConfiguration_idServer_key`(`idServer`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChannelConfiguration` ADD CONSTRAINT `ChannelConfiguration_idServer_fkey` FOREIGN KEY (`idServer`) REFERENCES `ServerData`(`serverId`) ON DELETE RESTRICT ON UPDATE CASCADE;
