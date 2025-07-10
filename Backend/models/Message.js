const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  chatId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'chats',
      key: 'id'
    }
  },
  senderId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  senderType: {
    type: DataTypes.ENUM('student', 'supervisor'),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  messageType: {
    type: DataTypes.ENUM('text', 'file', 'image', 'document_tag', 'task_tag', 'milestone_tag'),
    defaultValue: 'text'
  },
  // For tagged items
  taggedItemId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  taggedItemType: {
    type: DataTypes.ENUM('document', 'task', 'milestone'),
    allowNull: true
  },
  taggedItemData: {
    type: DataTypes.JSON,
    allowNull: true
  },
  // File attachments
  attachmentUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  attachmentName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  attachmentSize: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  // Message status
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  editedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'messages',
  timestamps: true
});

module.exports = Message;
