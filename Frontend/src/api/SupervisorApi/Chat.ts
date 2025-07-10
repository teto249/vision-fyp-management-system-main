const BASE_URL = 'http://localhost:3000/api';

export interface Chat {
  id: number;
  studentId: string;
  supervisorId: string;
  lastMessageAt: string;
  student?: {
    userId: string;
    fullName: string;
    email: string;
  };
  supervisor?: {
    userId: string;
    fullName: string;
    email: string;
  };
}

export interface Message {
  id: number;
  chatId: number;
  senderId: string;
  senderType: 'student' | 'supervisor';
  content: string;
  messageType: 'text' | 'file' | 'image' | 'document_tag' | 'task_tag' | 'milestone_tag';
  taggedItemId?: string;
  taggedItemType?: 'document' | 'task' | 'milestone';
  taggedItemData?: any;
  attachmentUrl?: string;
  attachmentName?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  senderStudent?: {
    userId: string;
    fullName: string;
  };
  senderSupervisor?: {
    userId: string;
    fullName: string;
  };
}

export interface TaggableItem {
  id: string;
  title: string;
  description?: string;
  type: 'document' | 'task' | 'milestone';
  status?: string;
  dueDate?: string;
  source?: 'student' | 'supervisor'; // Added source property for documents
}

export interface CreateMessageData {
  content: string;
  messageType?: 'text' | 'file' | 'image' | 'document_tag' | 'task_tag' | 'milestone_tag';
  taggedItemId?: string;
  taggedItemType?: 'document' | 'task' | 'milestone';
  attachmentUrl?: string;
  attachmentName?: string;
}

export const SupervisorChatApi = {
  // Get all chats for a supervisor
  getChats: async (token: string, supervisorId: string): Promise<Chat[]> => {
    try {
      const response = await fetch(`${BASE_URL}/supervisor/chats/${supervisorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  },

  // Get or create a chat between supervisor and student
  getOrCreateChat: async (token: string, supervisorId: string, studentId: string): Promise<Chat> => {
    try {
      const response = await fetch(`${BASE_URL}/supervisor/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ supervisorId, studentId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting or creating chat:', error);
      throw error;
    }
  },

  // Get messages for a specific chat
  getMessages: async (token: string, chatId: number): Promise<{ messages: Message[] }> => {
    try {
      const response = await fetch(`${BASE_URL}/supervisor/chat/${chatId}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Send a message
  sendMessage: async (token: string, chatId: number, supervisorId: string, messageData: CreateMessageData): Promise<Message> => {
    try {
      const response = await fetch(`${BASE_URL}/supervisor/chat/${chatId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          senderId: supervisorId,
          ...messageData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get taggable items (documents, tasks, milestones) for a student
  getTaggableItems: async (token: string, studentId: string): Promise<{
    documents: TaggableItem[];
    tasks: TaggableItem[];
    milestones: TaggableItem[];
  }> => {
    try {
      const response = await fetch(`${BASE_URL}/supervisor/chat/taggable-items/${studentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching taggable items:', error);
      throw error;
    }
  },

  // Mark messages as read
  markAsRead: async (token: string, chatId: number, supervisorId: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/supervisor/chat/${chatId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ supervisorId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },
};

export default SupervisorChatApi;
