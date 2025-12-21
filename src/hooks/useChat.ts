// import { getEcho } from '@/lib/echo';
// import { useAuth, User } from '@/providers/AuthProvider';
// import chatService, { Conversation, Message } from '@/services/chat/chatService';
// import { useState, useEffect, useCallback, useRef } from 'react';

// export const useChat = () => {
//     const [conversations, setConversations] = useState<Conversation[]>([]);
//     const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [activeUsers, setActiveUsers] = useState<User[]>([]);
//     const [typingUsers, setTypingUsers] = useState<string[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [messagesLoading, setMessagesLoading] = useState(false);
//     const { user } = useAuth();

//     const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//     const loadConversations = useCallback(async () => {
//         try {
//             setLoading(true);
//             const data = await chatService.getConversations();
//             setConversations(data);
//         } catch (error) {
//             console.error('Error loading conversations:', error);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const loadActiveUsers = useCallback(async () => {
//         try {
//             const data = await chatService.getActiveUsers();
//             setActiveUsers(data);
//         } catch (error) {
//             console.error('Error loading active users:', error);
//         }
//     }, []);

//     const loadMessages = useCallback(async (conversationId: number) => {
//         try {
//             setMessagesLoading(true);
//             const response = await chatService.getMessages(conversationId);
//             setMessages(response.data.reverse());
//             await chatService.markAsRead(conversationId);

//             setConversations(prev =>
//                 prev.map(conv =>
//                     conv.id === conversationId
//                         ? { ...conv, unread_count: 0 }
//                         : conv
//                 )
//             );
//         } catch (error) {
//             console.error('Error loading messages:', error);
//         } finally {
//             setMessagesLoading(false);
//         }
//     }, []);

//     const selectConversation = useCallback(async (conversation: Conversation) => {
//         setSelectedConversation(conversation);
//         await loadMessages(conversation.id);
//     }, [loadMessages]);

//     const sendMessage = useCallback(async (body: string, attachments?: File[]) => {
//         if (!selectedConversation) return;

//         try {
//             const message = await chatService.sendMessage(
//                 selectedConversation.id,
//                 body,
//                 attachments
//             );

//             setMessages(prev => [...prev, message]);

//             setConversations(prev =>
//                 prev.map(conv =>
//                     conv.id === selectedConversation.id
//                         ? {
//                             ...conv,
//                             last_message: {
//                                 body: message.body,
//                                 type: message.type,
//                                 created_at: message.created_at,
//                             },
//                             last_message_at: message.created_at,
//                         }
//                         : conv
//                 )
//             );
//         } catch (error) {
//             console.error('Error sending message:', error);
//             throw error;
//         }
//     }, [selectedConversation]);

//     const sendTypingIndicator = useCallback(() => {
//         if (!selectedConversation) return;

//         if (typingTimeoutRef.current) {
//             clearTimeout(typingTimeoutRef.current);
//         }

//         chatService.sendTyping(selectedConversation.id);

//         typingTimeoutRef.current = setTimeout(() => {
//             typingTimeoutRef.current = null;
//         }, 3000);
//     }, [selectedConversation]);

//     const createConversation = useCallback(async (userId: number) => {
//         try {
//             const conversation = await chatService.createConversation(userId);

//             const exists = conversations.find(c => c.id === conversation.id);
//             if (!exists) {
//                 setConversations(prev => [conversation, ...prev]);
//             }

//             await selectConversation(conversation);

//             return conversation;
//         } catch (error) {
//             console.error('Error creating conversation:', error);
//             throw error;
//         }
//     }, [conversations, selectConversation]);

//     useEffect(() => {
//         if (!selectedConversation) return;

//         let cleanup: (() => void) | null = null;

//         const setup = async () => {
//             const echo = await getEcho();

//             echo.private(`conversation.${selectedConversation.id}`)
//                 .listen('.message.sent', (e: Message) => {
//                     if (user?.id === e.user.id) {
//                         return;
//                     }

//                     setMessages(prev => [...prev, e]);

//                     setConversations(prev =>
//                         prev.map(conv =>
//                             conv.id === selectedConversation.id
//                                 ? {
//                                     ...conv,
//                                     last_message: {
//                                         body: e.body,
//                                         type: e.type,
//                                         created_at: e.created_at,
//                                     },
//                                     last_message_at: e.created_at,
//                                     unread_count: 0
//                                 }
//                                 : conv
//                         )
//                     );

//                     chatService.markAsRead(selectedConversation.id);
//                 })
//                 .listen('.user.typing', (e: { user_id: number; user_name: string }) => {
//                     if (user?.id === e.user_id) {
//                         return;
//                     }

//                     setTypingUsers(prev => {
//                         if (!prev.includes(e.user_name)) {
//                             return [...prev, e.user_name];
//                         }
//                         return prev;
//                     });

//                     setTimeout(() => {
//                         setTypingUsers(prev => prev.filter(name => name !== e.user_name));
//                     }, 3000);
//                 })
//                 .listen('.message.read', (e: { user_id: number; read_at: string }) => {
//                     if (user?.id === e.user_id) {
//                         return;
//                     }
//                     console.log('Messages read by user:', e.user_id);
//                 });

//             cleanup = () => {
//                 echo.leave(`conversation.${selectedConversation.id}`);
//             };
//         };

//         setup();

//         return () => {
//             if (cleanup) cleanup();
//         };
//     }, [selectedConversation]);

//     useEffect(() => {
//         if (!user) return;

//         let cleanup: (() => void) | null = null;
//         const setup = async () => {
//             const echo = await getEcho();

//             echo.private(`conversation-list.user.${user.id}`)
//                 .listen('.conversation.updated', (updatedConversation: Conversation) => {
//                     setConversations(prev => {
//                         const exists = prev.find(c => c.id === updatedConversation.id);

//                         if (!exists) {
//                             return [updatedConversation, ...prev];
//                         }

//                         return prev.map(c => c.id === updatedConversation.id ? updatedConversation : c);
//                     });
//                 });

//             cleanup = () => echo.leave(`conversation-list.user.${user.id}`);
//         };

//         setup();

//         return () => {
//             if (cleanup) cleanup();
//         };
//     }, [user]);

//     useEffect(() => {
//         loadConversations();
//         loadActiveUsers();
//     }, [loadConversations, loadActiveUsers]);

//     return {
//         conversations,
//         selectedConversation,
//         messages,
//         activeUsers,
//         typingUsers,
//         loading,
//         messagesLoading,
//         selectConversation,
//         sendMessage,
//         sendTypingIndicator,
//         createConversation,
//         loadConversations,
//         loadActiveUsers,
//     };
// };