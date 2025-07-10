const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Student = require('../models/Student');
const Supervisor = require('../models/Supervisor');
const Document = require('../models/Document');
const Task = require('../models/Task');
const Milestone = require('../models/Milestone');
const Project = require('../models/Project');
const { Op } = require('sequelize');


class ChatController {
  // Get or create chat between student and supervisor
  static async getOrCreateChat(req, res) {
    try {
      const { supervisorId } = req.params;
      const studentId = req.user.userId; // Use userId from auth middleware
      
      // Verify user is a student
      if (req.user.role !== 'Student') {
        return res.status(403).json({
          success: false,
          message: 'Only students can access chat'
        });
      }

      let chat = await Chat.findOne({
        where: {
          studentId,
          supervisorId
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['userId', 'fullName', 'email']
          },
          {
            model: Supervisor,
            as: 'supervisor',
            attributes: ['userId', 'fullName', 'email']
          }
        ]
      });

      
      if (!chat) {
        chat = await Chat.create({
          studentId,
          supervisorId
        });

        // Fetch with associations
        chat = await Chat.findByPk(chat.id, {
          include: [
            {
              model: Student,
              as: 'student',
              attributes: ['userId', 'fullName', 'email']
            },
            {
              model: Supervisor,
              as: 'supervisor',
              attributes: ['userId', 'fullName', 'email']
            }
          ]
        });
      }

      res.json({
        success: true,
        chat
      });
    } catch (error) {
      console.error('Error getting/creating chat:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get chat',
        error: error.message
      });
    }
  }

  // Get chat messages with pagination
  static async getChatMessages(req, res) {
    try {
      const { chatId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const offset = (page - 1) * limit;

      const messages = await Message.findAndCountAll({
        where: { chatId },
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Manually populate sender information
      const messagesWithSender = await Promise.all(
        messages.rows.map(async (message) => {
          const messageObj = message.toJSON();
          
          if (message.senderType === 'student') {
            const student = await Student.findOne({
              where: { userId: message.senderId },
              attributes: ['userId', 'fullName']
            });
            messageObj.sender = student;
          } else if (message.senderType === 'supervisor') {
            const supervisor = await Supervisor.findOne({
              where: { userId: message.senderId },
              attributes: ['userId', 'fullName']
            });
            messageObj.sender = supervisor;
          }
          
          return messageObj;
        })
      );

      res.json({
        success: true,
        messages: messagesWithSender.reverse(), // Reverse to show oldest first
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(messages.count / limit),
          totalMessages: messages.count,
          hasMore: messages.count > offset + messages.rows.length
        }
      });
    } catch (error) {
      console.error('Error getting messages:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get messages',
        error: error.message
      });
    }
  }

  // Send a new message
  static async sendMessage(req, res) {
    try {
      const { chatId } = req.params;
      const { content, messageType = 'text', taggedItemId, taggedItemType } = req.body;
      const senderId = req.user.userId; // Use userId from auth middleware
      const senderType = req.user.role === 'Student' ? 'student' : 'supervisor';

      let taggedItemData = null;

      // If tagging an item, fetch its data
      if (taggedItemId && taggedItemType) {
        switch (taggedItemType) {
          case 'document':
            const document = await Document.findByPk(taggedItemId);
            if (document) {
              taggedItemData = {
                id: document.id,
                title: document.title,
                description: document.description,
                fileType: document.fileType
              };
            }
            break;
          case 'task':
            const task = await Task.findByPk(taggedItemId);
            if (task) {
              taggedItemData = {
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                dueDate: task.dueDate
              };
            }
            break;
          case 'milestone':
            const milestone = await Milestone.findByPk(taggedItemId);
            if (milestone) {
              taggedItemData = {
                id: milestone.id,
                title: milestone.title,
                description: milestone.description,
                status: milestone.status,
                dueDate: milestone.dueDate
              };
            }
            break;
        }
      }

      const message = await Message.create({
        chatId,
        senderId,
        senderType,
        content,
        messageType,
        taggedItemId,
        taggedItemType,
        taggedItemData
      });

      // Update chat's last message time
      await Chat.update(
        { lastMessageAt: new Date() },
        { where: { id: chatId } }
      );

      // Fetch message with sender info
      const messageWithSender = await Message.findByPk(message.id);
      const messageObj = messageWithSender.toJSON();
      
      if (messageWithSender.senderType === 'student') {
        const student = await Student.findOne({
          where: { userId: messageWithSender.senderId },
          attributes: ['userId', 'fullName']
        });
        messageObj.sender = student;
      } else if (messageWithSender.senderType === 'supervisor') {
        const supervisor = await Supervisor.findOne({
          where: { userId: messageWithSender.senderId },
          attributes: ['userId', 'fullName']
        });
        messageObj.sender = supervisor;
      }

      res.json({
        success: true,
        message: messageObj
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send message',
        error: error.message
      });
    }
  }

  // Mark messages as read
  static async markMessagesAsRead(req, res) {
    try {
      const { chatId } = req.params;
      const userId = req.user.userId; // Use userId from auth middleware

      await Message.update(
        { 
          isRead: true, 
          readAt: new Date() 
        },
        {
          where: {
            chatId,
            senderId: { [Op.ne]: userId },
            isRead: false
          }
        }
      );

      res.json({
        success: true,
        message: 'Messages marked as read'
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark messages as read',
        error: error.message
      });
    }
  }

  // Search messages
  static async searchMessages(req, res) {
    try {
      const { chatId } = req.params;
      const { query, type } = req.query;

      const whereClause = {
        chatId,
        [Op.or]: [
          { content: { [Op.iLike]: `%${query}%` } }
        ]
      };

      if (type) {
        whereClause.messageType = type;
      }

      const messages = await Message.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: 20
      });

      // Manually populate sender information
      const messagesWithSender = await Promise.all(
        messages.map(async (message) => {
          const messageObj = message.toJSON();
          
          if (message.senderType === 'student') {
            const student = await Student.findOne({
              where: { userId: message.senderId },
              attributes: ['userId', 'fullName']
            });
            messageObj.sender = student;
          } else if (message.senderType === 'supervisor') {
            const supervisor = await Supervisor.findOne({
              where: { userId: message.senderId },
              attributes: ['userId', 'fullName']
            });
            messageObj.sender = supervisor;
          }
          
          return messageObj;
        })
      );

      res.json({
        success: true,
        messages: messagesWithSender
      });
    } catch (error) {
      console.error('Error searching messages:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search messages',
        error: error.message
      });
    }
  }

  // Get taggable items (documents, tasks, milestones)
  static async getTaggableItems(req, res) {
    try {
      const studentId = req.user.userId; // Use userId from auth middleware
      
      // Verify user is a student
      if (req.user.role !== 'Student') {
        return res.status(403).json({
          success: false,
          message: 'Only students can access taggable items'
        });
      }
      
      // Get student to find supervisorId and fetch documents
      const student = await Student.findOne({
        where: { userId: studentId },
        attributes: ['userId', 'supervisorId']
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Fetch documents using supervisorId (same logic as existing getDocuments endpoint)
      const documents = student.supervisorId ? 
        await Document.findAll({
          attributes: ['id', 'title', 'description', 'fileType'],
          where: { supervisorId: student.supervisorId },
          order: [['createdAt', 'DESC']]
        }) : [];

      // Fetch project with milestones and tasks
      const project = await Project.findOne({
        where: { studentId },
        include: [
          {
            model: Milestone,
            as: 'milestones',
            attributes: ['id', 'title', 'description', 'status'],
            include: [
              {
                model: Task,
                as: 'tasks',
                attributes: ['id', 'title', 'description', 'status']
              }
            ]
          }
        ]
      });

      const milestones = project?.milestones || [];
      const tasks = milestones.flatMap(m => m.tasks || []);

      res.json({
        success: true,
        items: {
          documents: documents.map(doc => ({
            id: doc.id,
            title: doc.title,
            description: doc.description,
            type: 'document'
          })),
          tasks: tasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            type: 'task'
          })),
          milestones: milestones.map(milestone => ({
            id: milestone.id,
            title: milestone.title,
            description: milestone.description,
            status: milestone.status,
            type: 'milestone'
          }))
        }
      });
    } catch (error) {
      console.error('Error getting taggable items:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get taggable items',
        error: error.message
      });
    }
  }
}

module.exports = ChatController;
