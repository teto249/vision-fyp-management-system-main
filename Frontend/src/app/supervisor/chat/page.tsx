"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  Search,
  Paperclip,
  FileText,
  CheckSquare,
  Target,
  ArrowLeft,
  MoreVertical,
  Smile,
  Hash,
  X,
  Clock,
  CheckCheck,
  Users,
} from "lucide-react";
import { SupervisorChatApi, Chat, Message, TaggableItem } from "../../../api/SupervisorApi/Chat";

interface Student {
  userId: string;
  fullName: string;
  email: string;
}

export default function SupervisorChatPage() {
  const router = useRouter();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showTagModal, setShowTagModal] = useState(false);
  const [taggableItems, setTaggableItems] = useState<{
    documents: TaggableItem[];
    tasks: TaggableItem[];
    milestones: TaggableItem[];
  }>({
    documents: [],
    tasks: [],
    milestones: [],
  });
  const [selectedTag, setSelectedTag] = useState<TaggableItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize supervisor data
  useEffect(() => {
    const initializeSupervisor = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const supervisorInfoStr = localStorage.getItem("supervisorInfo");

        if (!token || !supervisorInfoStr) {
          router.push("/login");
          return;
        }

        const supervisorInfo = JSON.parse(supervisorInfoStr);
        const supervisorId = supervisorInfo.supervisorId || supervisorInfo.userId;

        // Get all chats for this supervisor
        const chatsData = await SupervisorChatApi.getChats(token, supervisorId);
        
        // Extract unique students from chats
        const studentsFromChats: Student[] = chatsData.map(chat => chat.student).filter((student): student is Student => Boolean(student));
        setStudents(studentsFromChats);

        // Check if there's a specific student ID in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const targetStudentId = urlParams.get('studentId');
        
        if (targetStudentId && studentsFromChats.some(s => s.userId === targetStudentId)) {
          setSelectedStudentId(targetStudentId);
        } else if (studentsFromChats.length > 0) {
          setSelectedStudentId(studentsFromChats[0].userId);
        }
      } catch (error) {
        console.error("Failed to initialize supervisor chat:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeSupervisor();
  }, [router]);

  // Load chat when student is selected
  useEffect(() => {
    if (!selectedStudentId) return;

    const loadChat = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const supervisorInfoStr = localStorage.getItem("supervisorInfo");
        
        if (!token || !supervisorInfoStr) return;

        const supervisorInfo = JSON.parse(supervisorInfoStr);
        const supervisorId = supervisorInfo.supervisorId || supervisorInfo.userId;

        // Get or create chat
        const chatData = await SupervisorChatApi.getOrCreateChat(token, supervisorId, selectedStudentId);
        setChat(chatData);

        // Get messages
        const messagesResponse = await SupervisorChatApi.getMessages(token, chatData.id);
        setMessages(messagesResponse.messages || []);

        // Get taggable items for this student
        const items = await SupervisorChatApi.getTaggableItems(token, selectedStudentId);
        setTaggableItems(items);

        // Mark messages as read
        await SupervisorChatApi.markAsRead(token, chatData.id, supervisorId);
      } catch (error) {
        console.error("Failed to load chat:", error);
      }
    };

    loadChat();
  }, [selectedStudentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !chat || sendingMessage) return;

    try {
      setSendingMessage(true);
      const token = localStorage.getItem("authToken");
      const supervisorInfoStr = localStorage.getItem("supervisorInfo");
      
      if (!token || !supervisorInfoStr) return;

      const supervisorInfo = JSON.parse(supervisorInfoStr);
      const supervisorId = supervisorInfo.supervisorId || supervisorInfo.userId;

      const messageType = selectedTag ? `${selectedTag.type}_tag` as const : 'text' as const;
      const content = selectedTag 
        ? `${messageText} [Tagged: ${selectedTag.title}]`
        : messageText;

      const messageData = {
        content,
        messageType,
        taggedItemId: selectedTag?.id,
        taggedItemType: selectedTag?.type
      };

      const newMessage = await SupervisorChatApi.sendMessage(
        token,
        chat.id,
        supervisorId,
        messageData
      );

      setMessages(prev => [...prev, newMessage]);
      setMessageText("");
      setSelectedTag(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openTagModal = () => {
    setShowTagModal(true);
  };

  const selectTag = (item: TaggableItem) => {
    setSelectedTag(item);
    setShowTagModal(false);
  };

  const handleTaggedItemClick = (taggedItemType: string, taggedItemId: string) => {
    switch (taggedItemType) {
      case 'document':
        // Navigate to supervisor document view
        router.push(`/supervisor/document/${taggedItemId}`);
        break;
      case 'milestone':
        // Navigate to supervisor project page with milestone focused
        router.push(`/supervisor/project/${selectedStudentId}?milestone=${taggedItemId}`);
        break;
      case 'task':
        // Navigate to supervisor project page with task focused  
        router.push(`/supervisor/project/${selectedStudentId}?task=${taggedItemId}`);
        break;
      default:
        console.warn('Unknown tagged item type:', taggedItemType);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderMessage = (message: Message, index: number) => {
    const isCurrentUser = message.senderType === 'supervisor';
    const showDate = index === 0 || 
      formatDate(message.createdAt) !== formatDate(messages[index - 1]?.createdAt);

    return (
      <div key={message.id} className="animate-fadeIn">
        {showDate && (
          <div className="text-center my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-gray-500/50">
                  {formatDate(message.createdAt)}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 group`}>
          <div className="flex items-end gap-3 max-w-[70%]">
            {/* Avatar for received messages */}
            {!isCurrentUser && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shadow-lg mb-1 flex-shrink-0">
                {chat?.student?.fullName?.charAt(0) || 'S'}
              </div>
            )}
            
            <div className={`relative px-4 py-3 rounded-2xl shadow-lg transition-all duration-200 group-hover:shadow-xl ${
              isCurrentUser 
                ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-br-md' 
                : 'bg-gradient-to-br from-gray-700 to-gray-600 text-white rounded-bl-md border border-gray-500/50'
            }`}>
              {/* Tagged item display */}
              {message.taggedItemData && message.taggedItemType && message.taggedItemId && (
                <button
                  onClick={() => handleTaggedItemClick(message.taggedItemType!, message.taggedItemId!)}
                  className={`w-full mb-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                    isCurrentUser
                      ? 'bg-teal-400/20 hover:bg-teal-400/30 border border-teal-300/30'
                      : 'bg-gray-600/30 hover:bg-gray-500/40 border border-gray-400/30'
                  }`}
                >
                  <div className="flex items-start gap-3 text-left">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      message.taggedItemType === 'document' ? 'bg-blue-500/30 text-blue-300' :
                      message.taggedItemType === 'task' ? 'bg-green-500/30 text-green-300' :
                      'bg-purple-500/30 text-purple-300'
                    }`}>
                      {message.taggedItemType === 'document' && <FileText size={16} />}
                      {message.taggedItemType === 'task' && <CheckSquare size={16} />}
                      {message.taggedItemType === 'milestone' && <Target size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-teal-300 capitalize">
                          {message.taggedItemType}
                        </span>
                      </div>
                      <div className="font-semibold text-sm line-clamp-1">
                        {message.taggedItemData.title}
                      </div>
                      {message.taggedItemData.description && (
                        <div className="text-xs opacity-80 mt-1 line-clamp-2">
                          {message.taggedItemData.description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )}
              
              {/* Message content */}
              <div className="text-sm leading-relaxed">
                {message.content.replace(/\[Tagged:.*?\]$/, '').trim()}
              </div>
              
              {/* Message metadata */}
              <div className={`flex items-center gap-2 mt-2 text-xs ${
                isCurrentUser ? 'justify-end text-teal-100' : 'justify-start text-gray-300'
              }`}>
                <span className="opacity-75">{formatTime(message.createdAt)}</span>
                {isCurrentUser && (
                  <div className="flex items-center opacity-75">
                    {message.isRead ? (
                      <CheckCheck size={12} className="text-teal-200" />
                    ) : (
                      <Clock size={12} className="text-teal-200" />
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Avatar for sent messages */}
            {isCurrentUser && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center text-white text-sm font-semibold shadow-lg mb-1 flex-shrink-0">
                S
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br rounded-4xl from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br rounded-4xl  from-gray-900 via-gray-800 to-black flex">
      {/* Enhanced Students Sidebar */}
      <div className="w-80 bg-gradient-to-b from-gray-800/95 rounded-4xl to-gray-900/95 backdrop-blur-md border-r border-gray-600/50 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-600/50 bg-gradient-to-r from-gray-700/50 to-gray-600/50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-3 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Students</h2>
              <p className="text-sm text-gray-300">Select a student to chat with</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
          {students.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-xl">
                <Users size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No students yet</h3>
              <p className="text-gray-400 text-sm">Students will appear here when they join your supervision.</p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {students.map((student) => (
                <button
                  key={student.userId}
                  onClick={() => setSelectedStudentId(student.userId)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg group ${
                    selectedStudentId === student.userId 
                      ? 'bg-gradient-to-r from-teal-500/20 to-teal-600/20 border border-teal-400/50 shadow-teal-500/20' 
                      : 'bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/60 hover:to-gray-500/60 border border-gray-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow-lg transition-all duration-200 ${
                      selectedStudentId === student.userId 
                        ? 'bg-gradient-to-br from-teal-400 to-teal-500 group-hover:scale-110' 
                        : 'bg-gradient-to-br from-blue-400 to-purple-500 group-hover:scale-105'
                    }`}>
                      {student.fullName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-base group-hover:text-teal-200 transition-colors">
                        {student.fullName}
                      </div>
                      <div className="text-sm text-gray-300 truncate group-hover:text-gray-200 transition-colors">
                        {student.email}
                      </div>
                    </div>
                    {selectedStudentId === student.userId && (
                      <div className="w-3 h-3 rounded-full bg-teal-400 animate-pulse shadow-lg shadow-teal-400/50"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedStudentId && chat ? (
          <>
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-gray-800/95 to-gray-700/95 backdrop-blur-md border-b border-gray-600/50 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {chat?.student?.fullName?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white mb-1">
                      {chat?.student?.fullName || 'Student'}
                    </h1>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
                      <p className="text-sm text-gray-300">
                        {chat?.student?.email}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="p-3 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                    <Search size={20} className="text-white" />
                  </button>
                  <button className="p-3 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                    <MoreVertical size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Messages Container */}
            <div className="flex-1 overflow-hidden">
              <div 
                ref={chatContainerRef}
                className="h-full overflow-y-auto p-6 space-y-4 scroll-smooth"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#374151 #1f2937'
                }}
              >
                <div className="max-w-4xl mx-auto">
                  {!messages || messages.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="relative">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shadow-2xl">
                          <Send size={32} className="text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full animate-bounce"></div>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Start the conversation!</h3>
                      <p className="text-gray-400 mb-6">Send your first message to begin chatting with {chat?.student?.fullName || 'this student'}.</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        <span className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300">💬 Provide guidance</span>
                        <span className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300">📋 Share feedback</span>
                        <span className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300">🏷️ Tag items</span>
                      </div>
                    </div>
                  ) : (
                    Array.isArray(messages) && messages.map((message, index) => renderMessage(message, index))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            {/* Enhanced Message Input */}
            <div className="bg-gradient-to-r from-gray-800/95 to-gray-700/95 backdrop-blur-md border-t border-gray-600/50 shadow-2xl">
              <div className="max-w-4xl mx-auto p-6">
                {/* Enhanced Selected tag display */}
                {selectedTag && (
                  <div className="mb-4 animate-slideDown">
                    <div className="flex items-center gap-3 bg-gradient-to-r from-gray-700/80 to-gray-600/80 rounded-xl p-4 border border-gray-500/50 shadow-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-teal-500/20 border border-teal-400/30">
                          {selectedTag.type === 'document' && <FileText size={18} className="text-teal-400" />}
                          {selectedTag.type === 'task' && <CheckSquare size={18} className="text-green-400" />}
                          {selectedTag.type === 'milestone' && <Target size={18} className="text-purple-400" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white mb-1">
                            Tagging: <span className="text-teal-300">{selectedTag.title}</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {selectedTag.type.charAt(0).toUpperCase() + selectedTag.type.slice(1)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedTag(null)}
                        className="p-2 rounded-lg bg-gray-600/50 hover:bg-gray-500/50 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        <X size={18} className="text-gray-300" />
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-end gap-4">
                  <button
                    onClick={openTagModal}
                    className="p-4 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 group"
                    title="Tag document, task, or milestone"
                  >
                    <Hash size={20} className="text-teal-400 group-hover:text-teal-300 transition-colors" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full bg-gradient-to-r from-gray-700/80 to-gray-600/80 text-white rounded-xl px-6 py-4 pr-16 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 min-h-[56px] max-h-32 border border-gray-500/30 shadow-lg backdrop-blur-sm transition-all duration-200"
                      rows={1}
                      disabled={sendingMessage}
                    />
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendingMessage}
                    className="p-4 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:scale-100"
                  >
                    {sendingMessage ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Send size={20} className="text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-gray-700/50">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-2xl">
                  <Users size={48} className="text-gray-300" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <Send size={20} className="text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Select a Student</h3>
              <p className="text-gray-400 text-lg mb-6">Choose a student from the sidebar to start chatting</p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-4 py-2 bg-gray-700/50 rounded-full text-sm text-gray-300">💬 Provide feedback</span>
                <span className="px-4 py-2 bg-gray-700/50 rounded-full text-sm text-gray-300">📋 Track progress</span>
                <span className="px-4 py-2 bg-gray-700/50 rounded-full text-sm text-gray-300">🎯 Set goals</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Tag Modal */}
      {showTagModal && selectedStudentId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl border border-gray-600/50 animate-slideUp">
            <div className="p-6 border-b border-gray-600/50 bg-gradient-to-r from-gray-700/50 to-gray-600/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/20 border border-teal-400/30">
                    <Hash size={20} className="text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Tag an Item</h3>
                    <p className="text-sm text-gray-300">Choose something to reference in your message</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTagModal(false)}
                  className="p-2 rounded-xl bg-gray-600/50 hover:bg-gray-500/50 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <X size={20} className="text-gray-300" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto max-h-96"
                 style={{
                   scrollbarWidth: 'thin',
                   scrollbarColor: '#374151 #1f2937'
                 }}>
              {/* Enhanced Documents Section */}
              {taggableItems.documents.length > 0 && (
                <div className="animate-slideUp">
                  <h4 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
                      <FileText size={16} className="text-blue-400" />
                    </div>
                    Documents ({taggableItems.documents.length})
                  </h4>
                  <div className="space-y-3">
                    {taggableItems.documents.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => selectTag(item)}
                        className="w-full text-left p-4 bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/60 hover:to-gray-500/60 rounded-xl transition-all duration-200 border border-gray-500/30 hover:border-blue-400/50 hover:scale-[1.02] active:scale-95 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30 group-hover:bg-blue-500/30 transition-colors">
                            <FileText size={16} className="text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-semibold text-white text-sm group-hover:text-blue-200 transition-colors">
                                {item.title}
                              </div>
                              {item.source && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.source === 'supervisor' 
                                    ? 'bg-teal-500/20 text-teal-300 border border-teal-400/30' 
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                                }`}>
                                  {item.source === 'supervisor' ? 'My Document' : 'Student Document'}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <div className="text-xs text-gray-400 line-clamp-2 group-hover:text-gray-300 transition-colors">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Enhanced Tasks Section */}
              {taggableItems.tasks.length > 0 && (
                <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
                  <h4 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/20 border border-green-400/30">
                      <CheckSquare size={16} className="text-green-400" />
                    </div>
                    Tasks ({taggableItems.tasks.length})
                  </h4>
                  <div className="space-y-3">
                    {taggableItems.tasks.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => selectTag(item)}
                        className="w-full text-left p-4 bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/60 hover:to-gray-500/60 rounded-xl transition-all duration-200 border border-gray-500/30 hover:border-green-400/50 hover:scale-[1.02] active:scale-95 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-green-500/20 border border-green-400/30 group-hover:bg-green-500/30 transition-colors">
                            <CheckSquare size={16} className="text-green-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-semibold text-white text-sm group-hover:text-green-200 transition-colors">
                                {item.title}
                              </div>
                              {item.status && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm ${
                                  item.status === 'completed' 
                                    ? 'bg-green-600/80 text-green-100 border border-green-500/50' 
                                    : item.status === 'in_progress'
                                    ? 'bg-blue-600/80 text-blue-100 border border-blue-500/50'
                                    : 'bg-gray-600/80 text-gray-100 border border-gray-500/50'
                                }`}>
                                  {item.status.replace('_', ' ')}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <div className="text-xs text-gray-400 line-clamp-2 group-hover:text-gray-300 transition-colors">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Enhanced Milestones Section */}
              {taggableItems.milestones.length > 0 && (
                <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
                  <h4 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-400/30">
                      <Target size={16} className="text-purple-400" />
                    </div>
                    Milestones ({taggableItems.milestones.length})
                  </h4>
                  <div className="space-y-3">
                    {taggableItems.milestones.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => selectTag(item)}
                        className="w-full text-left p-4 bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/60 hover:to-gray-500/60 rounded-xl transition-all duration-200 border border-gray-500/30 hover:border-purple-400/50 hover:scale-[1.02] active:scale-95 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-400/30 group-hover:bg-purple-500/30 transition-colors">
                            <Target size={16} className="text-purple-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-semibold text-white text-sm group-hover:text-purple-200 transition-colors">
                                {item.title}
                              </div>
                              {item.status && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm ${
                                  item.status === 'completed' 
                                    ? 'bg-green-600/80 text-green-100 border border-green-500/50' 
                                    : item.status === 'in_progress'
                                    ? 'bg-blue-600/80 text-blue-100 border border-blue-500/50'
                                    : 'bg-gray-600/80 text-gray-100 border border-gray-500/50'
                                }`}>
                                  {item.status.replace('_', ' ')}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <div className="text-xs text-gray-400 line-clamp-2 group-hover:text-gray-300 transition-colors">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Enhanced Empty State */}
              {taggableItems.documents.length === 0 && 
               taggableItems.tasks.length === 0 && 
               taggableItems.milestones.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-xl">
                    <Hash size={24} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No items available</h3>
                  <p className="text-gray-400 text-sm">No documents, tasks, or milestones to tag right now.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* CSS Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-track-gray-800 {
          scrollbar-color: #374151 #1f2937;
        }
        
        .scrollbar-thumb-gray-600 {
          scrollbar-color: #4b5563 #1f2937;
        }
      `}</style>
    </div>
  );
}
