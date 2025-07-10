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
}

// Get or create chat with supervisor
export const getOrCreateChat = async (token: string, supervisorId: string): Promise<Chat> => {
  const response = await fetch(`${BASE_URL}/student/chat/supervisor/${supervisorId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to get chat: ${response.status}`);
  }

  const data = await response.json();
  return data.chat;
};

// Get chat messages
export const getChatMessages = async (
  token: string, 
  chatId: number, 
  page: number = 1, 
  limit: number = 50
): Promise<{ messages: Message[]; pagination: any }> => {
  const response = await fetch(`${BASE_URL}/student/chat/${chatId}/messages?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to get messages: ${response.status}`);
  }

  const data = await response.json();
  return {
    messages: data.messages,
    pagination: data.pagination
  };
};

// Send a message
export const sendMessage = async (
  token: string,
  chatId: number,
  content: string,
  messageType: string = 'text',
  taggedItemId?: string,
  taggedItemType?: string
): Promise<Message> => {
  const response = await fetch(`${BASE_URL}/student/chat/${chatId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      messageType,
      taggedItemId,
      taggedItemType
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to send message: ${response.status}`);
  }

  const data = await response.json();
  return data.message;
};

// Mark messages as read
export const markMessagesAsRead = async (token: string, chatId: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/student/chat/${chatId}/messages/read`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to mark messages as read: ${response.status}`);
  }
};

// Search messages
export const searchMessages = async (
  token: string,
  chatId: number,
  query: string,
  type?: string
): Promise<Message[]> => {
  const params = new URLSearchParams({ query });
  if (type) params.append('type', type);

  const response = await fetch(`${BASE_URL}/student/chat/${chatId}/search?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to search messages: ${response.status}`);
  }

  const data = await response.json();
  return data.messages;
};

// Get taggable items
export const getTaggableItems = async (token: string): Promise<{
  documents: TaggableItem[];
  tasks: TaggableItem[];
  milestones: TaggableItem[];
}> => {
  const response = await fetch(`${BASE_URL}/student/chat/taggable-items`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to get taggable items: ${response.status}`);
  }

  const data = await response.json();
  return data.items;
};
