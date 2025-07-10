"use client";
import { useState, useEffect, useRef, useCallback } from "react";
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
  AlertCircle,
  User,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { 
  getOrCreateChat, 
  getChatMessages, 
  sendMessage, 
  markMessagesAsRead,
  getTaggableItems,
  type Message,
  type Chat,
  type TaggableItem
} from "../../../api/StudentApi/Chat";

export default function StudentChatPage() {
  const router = useRouter();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showTagModal, setShowTagModal] = useState(false);
  const [taggableItems, setTaggableItems] = useState<{
    documents: TaggableItem[];
    tasks: TaggableItem[];
    milestones: TaggableItem[];
  }>({ documents: [], tasks: [], milestones: [] });
  const [selectedTag, setSelectedTag] = useState<TaggableItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [noSupervisor, setNoSupervisor] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize chat
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const studentInfoStr = localStorage.getItem("studentInfo");

        console.log("Initializing chat with token:", token, "and studentInfo:", studentInfoStr);    

        if (!token || !studentInfoStr) {
          router.push("/login");
          return;
        }

        const studentInfo = JSON.parse(studentInfoStr);
        const supervisorId = studentInfo.supervisorId || studentInfo.supervisor?.userId;

        // If no supervisor assigned, set chat to null but don't redirect
        if (!supervisorId) {
          setChat(null);
          setMessages([]);
          setTaggableItems({ documents: [], tasks: [], milestones: [] });
          setNoSupervisor(true);
          setError(null);
          setLoading(false);
          return;
        }

        setNoSupervisor(false);

        try {
          // Get or create chat
          const chatData = await getOrCreateChat(token, supervisorId);
          setChat(chatData);

          // Get messages
          const { messages: messageData } = await getChatMessages(token, chatData.id);
          setMessages(messageData);

          // Get taggable items
          const items = await getTaggableItems(token);
          setTaggableItems(items);

          // Mark messages as read
          await markMessagesAsRead(token, chatData.id);
        } catch (chatError) {
          console.error("Failed to initialize chat with supervisor:", chatError);
          // If chat creation fails, still show the chat interface but with error state
          setChat(null);
          setError("Unable to connect to your supervisor. Please try again later.");
        }
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        setError("Failed to load chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !chat || sendingMessage) return;

    try {
      setSendingMessage(true);
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const messageType = selectedTag ? `${selectedTag.type}_tag` : 'text';
      const content = selectedTag 
        ? `${messageText} [Tagged: ${selectedTag.title}]`
        : messageText;

      const newMessage = await sendMessage(
        token,
        chat.id,
        content,
        messageType,
        selectedTag?.id,
        selectedTag?.type
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
        // Navigate to document view page
        router.push(`/student/document/${taggedItemId}`);
        break;
      case 'milestone':
        // Navigate to project page with milestone focused
        router.push(`/student/myProject?milestone=${taggedItemId}`);
        break;
      case 'task':
        // Navigate to project page with task focused  
        router.push(`/student/myProject?task=${taggedItemId}`);
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
    const isCurrentUser = message.senderType === 'student';
    const showDate = index === 0 || 
      formatDate(message.createdAt) !== formatDate(messages[index - 1]?.createdAt);

    return (
      <div key={message.id} className="animate-fadeIn">
        {showDate && (
          <div className="text-center my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600/50"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 px-4 py-2 rounded-full text-xs font-medium shadow-lg">
                  {formatDate(message.createdAt)}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-6 group`}>
          <div className={`max-w-[75%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
            {!isCurrentUser && (
              <div className="flex items-center gap-2 mb-2 px-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                  {message.senderSupervisor?.fullName?.charAt(0) || 'S'}
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  {message.senderSupervisor?.fullName || 'Supervisor'}
                </span>
              </div>
            )}
            
            <div className={`relative rounded-2xl px-4 py-3 shadow-lg transform transition-all duration-200 group-hover:scale-[1.02] ${
              isCurrentUser 
                ? 'bg-gradient-to-br from-teal-500 to-blue-600 text-white rounded-br-md shadow-teal-500/25' 
                : 'bg-gradient-to-br from-gray-700 to-gray-600 text-white rounded-bl-md shadow-gray-700/50'
            }`}>
              {/* Enhanced Tagged item display */}
              {message.taggedItemData && (
                <div 
                  className="mb-3 p-3 bg-black/30 rounded-xl border border-white/20 cursor-pointer hover:bg-black/40 transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => handleTaggedItemClick(message.taggedItemType!, message.taggedItemId!)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 rounded-md bg-white/20">
                      {message.taggedItemType === 'document' && <FileText size={14} className="text-teal-200" />}
                      {message.taggedItemType === 'task' && <CheckSquare size={14} className="text-green-200" />}
                      {message.taggedItemType === 'milestone' && <Target size={14} className="text-purple-200" />}
                    </div>
                    <span className="text-xs font-semibold text-teal-200 capitalize">
                      {message.taggedItemType}
                    </span>
                  </div>
                  <div className="text-sm font-semibold mb-1">{message.taggedItemData.title}</div>
                  {message.taggedItemData.description && (
                    <div className="text-xs text-gray-200 mb-2 line-clamp-2">
                      {message.taggedItemData.description}
                    </div>
                  )}
                  <div className="text-xs text-teal-300 font-medium flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-teal-300"></div>
                    Click to view
                  </div>
                </div>
              )}
              
              <div className="whitespace-pre-wrap break-words leading-relaxed">
                {message.content.replace(/\[Tagged:.*?\]$/, '').trim()}
              </div>
              
              {/* Message tail */}
              <div className={`absolute bottom-0 w-4 h-4 transform rotate-45 ${
                isCurrentUser 
                  ? 'bg-gradient-to-br from-teal-500 to-blue-600 -right-2' 
                  : 'bg-gradient-to-br from-gray-700 to-gray-600 -left-2'
              }`}></div>
            </div>
            
            <div className={`flex items-center gap-2 mt-2 px-4 text-xs text-gray-400 ${
              isCurrentUser ? 'justify-end' : 'justify-start'
            }`}>
              <span className="font-medium">{formatTime(message.createdAt)}</span>
              {isCurrentUser && (
                <div className="flex items-center">
                  {message.isRead ? (
                    <div className="flex items-center gap-1 text-teal-400">
                      <CheckCheck size={12} />
                      <span className="text-xs">Read</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock size={12} />
                      <span className="text-xs">Sent</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br  to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-gray-800/95 to-gray-700/95 backdrop-blur-md border-b border-gray-600/50 shadow-2xl">
        <div className="flex items-center justify-between max-w-4xl mx-auto p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="group p-3 rounded-xl bg-gray-700/80 hover:bg-gray-600/80 transition-all duration-300 hover:scale-105 border border-gray-600/50"
            >
              <ArrowLeft size={20} className="text-white group-hover:text-teal-300 transition-colors" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {noSupervisor ? '?' : (chat?.supervisor?.fullName?.charAt(0) || 'S')}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {noSupervisor ? 'No Supervisor Assigned' : (chat?.supervisor?.fullName || 'Supervisor')}
                </h1>
                <div className="text-sm text-gray-300 flex items-center gap-2">
                  {noSupervisor ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span>Awaiting assignment</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      {chat?.supervisor?.email}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
         
        </div>
      </div>

      {/* Enhanced Messages Container */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 to-transparent pointer-events-none z-10"></div>
        <div 
          ref={chatContainerRef}
          className="h-full overflow-y-auto p-6 space-y-4 scroll-smooth"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#374151 #1f2937'
          }}
        >
          <div className="max-w-4xl mx-auto">
            {error ? (
              <div className="text-center py-20">
                <div className="relative">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center shadow-2xl">
                    <AlertCircle size={32} className="text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Connection Error</h3>
                <p className="text-gray-400 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-300 font-medium"
                >
                  Try Again
                </button>
              </div>
            ) : noSupervisor ? (
              <div className="text-center py-20">
                <div className="relative">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl">
                    <User size={32} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <AlertTriangle size={16} className="text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Supervisor Assigned</h3>
                <p className="text-gray-400 mb-6">
                  You have not been assigned a supervisor yet. Once assigned, you'll be able to chat with them here.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300">📋 Register your project</span>
                  <span className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300">👨‍🏫 Get supervisor assigned</span>
                  <span className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300">💬 Start chatting</span>
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => router.push('/student/registerproject')}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Register Project
                  </button>
                  <button
                    onClick={() => router.push('/student')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-300 font-medium"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-20">
                <div className="relative">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shadow-2xl">
                    <Send size={32} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full animate-bounce"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Start the conversation!</h3>
                <p className="text-gray-400 mb-6">Send your first message to begin chatting with your supervisor.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300">💬 Ask questions</span>
                  <span className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300">📋 Share updates</span>
                  <span className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300">🏷️ Tag items</span>
                </div>
              </div>
            ) : (
              messages.map((message, index) => renderMessage(message, index))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Enhanced Message Input */}
      <div className="bg-gradient-to-r from-gray-800/95 to-gray-700/95 backdrop-blur-md border-t border-gray-600/50 shadow-2xl">
        <div className="max-w-4xl mx-auto p-6">
          {noSupervisor ? (
            <div className="text-center py-4">
              <div className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-xl p-4 border border-gray-500/50">
                <p className="text-gray-300 text-sm">
                  💬 Messaging will be available once you are not assigned a supervisor
                </p>
              </div>
            </div>
          ) : (
            <>
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
                      className="p-2 rounded-lg hover:bg-gray-600/50 transition-all duration-200 hover:scale-110"
                    >
                      <X size={16} className="text-gray-400 hover:text-white" />
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex items-end gap-3">
                <button
                  onClick={openTagModal}
                  disabled={noSupervisor}
                  className="group p-4 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg shadow-teal-500/25 disabled:shadow-none"
                  title="Tag document, task, or milestone"
                >
                  <Hash size={20} className="text-white group-hover:rotate-12 transition-transform duration-300" />
                </button>
                
                <div className="flex-1 relative">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={noSupervisor ? "Messaging disabled - no supervisor assigned" : "Type your message..."}
                    className="w-full bg-gradient-to-br from-gray-700/80 to-gray-600/80 text-white rounded-2xl px-6 py-4 pr-14 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800 min-h-[56px] max-h-32 border border-gray-500/50 shadow-lg placeholder-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={1}
                    disabled={sendingMessage || noSupervisor}
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#374151 transparent'
                    }}
                  />
                  <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                    {noSupervisor ? "Supervisor required" : "Press Enter to send"}
                  </div>
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || sendingMessage || noSupervisor}
                  className="group p-4 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg shadow-teal-500/25 disabled:shadow-none"
                >
                  {sendingMessage ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={20} className="text-white group-hover:translate-x-1 transition-transform duration-300" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Enhanced Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl border border-gray-600/50 animate-slideUp">
            <div className="p-6 border-b border-gray-600/50 bg-gradient-to-r from-gray-700/80 to-gray-600/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/20">
                    <Hash size={20} className="text-teal-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Tag an Item</h3>
                </div>
                <button
                  onClick={() => setShowTagModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-600/50 transition-all duration-200 hover:scale-110"
                >
                  <X size={20} className="text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto max-h-96" style={{ scrollbarWidth: 'thin', scrollbarColor: '#374151 transparent' }}>
              {/* Enhanced Documents */}
              {taggableItems.documents.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
                    <div className="p-1 rounded bg-blue-500/20">
                      <FileText size={16} className="text-blue-400" />
                    </div>
                    Documents ({taggableItems.documents.length})
                  </h4>
                  <div className="space-y-2">
                    {taggableItems.documents.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => selectTag(item)}
                        className="w-full text-left p-4 bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/60 hover:to-gray-500/60 rounded-xl transition-all duration-200 hover:scale-[1.02] border border-gray-600/30 hover:border-blue-400/50 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                            <FileText size={16} className="text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white text-sm mb-1 group-hover:text-blue-300 transition-colors">
                              {item.title}
                            </div>
                            {item.description && (
                              <div className="text-xs text-gray-400 line-clamp-2">
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
              
              {/* Enhanced Tasks */}
              {taggableItems.tasks.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
                    <div className="p-1 rounded bg-green-500/20">
                      <CheckSquare size={16} className="text-green-400" />
                    </div>
                    Tasks ({taggableItems.tasks.length})
                  </h4>
                  <div className="space-y-2">
                    {taggableItems.tasks.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => selectTag(item)}
                        className="w-full text-left p-4 bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/60 hover:to-gray-500/60 rounded-xl transition-all duration-200 hover:scale-[1.02] border border-gray-600/30 hover:border-green-400/50 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                            <CheckSquare size={16} className="text-green-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-medium text-white text-sm group-hover:text-green-300 transition-colors">
                                {item.title}
                              </div>
                              {item.status && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.status === 'completed' 
                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                    : item.status === 'in_progress'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                                }`}>
                                  {item.status.replace('_', ' ')}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <div className="text-xs text-gray-400 line-clamp-2">
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
              
              {/* Enhanced Milestones */}
              {taggableItems.milestones.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
                    <div className="p-1 rounded bg-purple-500/20">
                      <Target size={16} className="text-purple-400" />
                    </div>
                    Milestones ({taggableItems.milestones.length})
                  </h4>
                  <div className="space-y-2">
                    {taggableItems.milestones.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => selectTag(item)}
                        className="w-full text-left p-4 bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/60 hover:to-gray-500/60 rounded-xl transition-all duration-200 hover:scale-[1.02] border border-gray-600/30 hover:border-purple-400/50 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                            <Target size={16} className="text-purple-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-medium text-white text-sm group-hover:text-purple-300 transition-colors">
                                {item.title}
                              </div>
                              {item.status && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.status === 'completed' 
                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                    : item.status === 'in_progress'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                                }`}>
                                  {item.status.replace('_', ' ')}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <div className="text-xs text-gray-400 line-clamp-2">
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
              
              {taggableItems.documents.length === 0 && 
               taggableItems.tasks.length === 0 && 
               taggableItems.milestones.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-600/50 flex items-center justify-center">
                    <Hash size={24} className="text-gray-400" />
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
      `}</style>
    </div>
  );
}
