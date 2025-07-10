const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth');

// Student chat routes
router.get('/chat/supervisor/:supervisorId', authenticateToken, ChatController.getOrCreateChat);
router.get('/chat/:chatId/messages', authenticateToken, ChatController.getChatMessages);
router.post('/chat/:chatId/messages', authenticateToken, ChatController.sendMessage);
router.put('/chat/:chatId/messages/read', authenticateToken, ChatController.markMessagesAsRead);
router.get('/chat/:chatId/search', authenticateToken, ChatController.searchMessages);
router.get('/chat/taggable-items', authenticateToken, ChatController.getTaggableItems);

module.exports = router;
