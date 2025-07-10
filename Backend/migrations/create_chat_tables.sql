-- Migration script for Chat System
-- Run this in your MySQL database

-- Create chats table
CREATE TABLE IF NOT EXISTS `chats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentId` varchar(255) NOT NULL,
  `supervisorId` varchar(255) NOT NULL,
  `lastMessageAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `studentId` (`studentId`),
  KEY `supervisorId` (`supervisorId`),
  UNIQUE KEY `unique_chat` (`studentId`, `supervisorId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create messages table
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chatId` int NOT NULL,
  `senderId` varchar(255) NOT NULL,
  `senderType` enum('student','supervisor') NOT NULL,
  `content` text NOT NULL,
  `messageType` enum('text','file','image','document_tag','task_tag','milestone_tag') NOT NULL DEFAULT 'text',
  `taggedItemId` varchar(255) DEFAULT NULL,
  `taggedItemType` enum('document','task','milestone') DEFAULT NULL,
  `taggedItemData` json DEFAULT NULL,
  `attachmentUrl` varchar(500) DEFAULT NULL,
  `attachmentName` varchar(255) DEFAULT NULL,
  `attachmentSize` int DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `readAt` datetime DEFAULT NULL,
  `isEdited` tinyint(1) NOT NULL DEFAULT '0',
  `editedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `chatId` (`chatId`),
  KEY `senderId` (`senderId`),
  KEY `createdAt` (`createdAt`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`chatId`) REFERENCES `chats` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add indexes for performance
CREATE INDEX idx_messages_chat_created ON messages(chatId, createdAt);
CREATE INDEX idx_messages_unread ON messages(chatId, isRead);
CREATE INDEX idx_messages_tagged ON messages(taggedItemType, taggedItemId);

-- Add foreign key constraints (optional, adjust table names as needed)
-- ALTER TABLE chats ADD CONSTRAINT fk_chat_student FOREIGN KEY (studentId) REFERENCES students(studentId);
-- ALTER TABLE chats ADD CONSTRAINT fk_chat_supervisor FOREIGN KEY (supervisorId) REFERENCES supervisors(supervisorId);
