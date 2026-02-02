import { Image, FlatList, StyleSheet, Text, TouchableOpacity, View, TextInput, ActivityIndicator, Linking } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { ChevronLeft, Circle, Paperclip, Camera, Send, Smile, Check, Download, FileText } from 'lucide-react-native'
import { useFocusEffect } from '@react-navigation/native'
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper'
import NMText from '../../../components/common/NMText'
import { Colors } from '../../../theme/colors'
import { chatService } from '../../../services/chatService'
import LoaderModal from '../../../components/common/NMLoaderModal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import EmojiPicker from "rn-emoji-keyboard";
import { pick, types } from '@react-native-documents/picker';
import { pickImagesFromGallery } from '../../../utils/mediaPicker'
import { getEcho } from '../../../utils/echo'
import { showErrorToast } from '../../../utils/toastService'
const ChatScreen: React.FC = ({ navigation, route }: any) => {
    const { property } = route.params || {};

    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [btnLoading, setbtnLoading] = useState(false);
    const [attachment, setAttachment] = useState(null);
    const [chatUser, setChatUser] = useState<any>(null);
    const flatListRef = useRef<FlatList>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const initialScrollDoneRef = useRef<boolean>(false);
    const echoRef = useRef<any>(null);
    const flatListLayoutRef = useRef<boolean>(false);

    const scrollToBottom = useCallback((animated = false) => {
        if (!flatListRef.current || messages.length === 0) {
            return;
        }

        const attemptScroll = () => {
            if (!flatListRef.current) return;

            try {
                // Use scrollToEnd - most reliable for chat messages
                flatListRef.current.scrollToEnd({ animated });
            } catch (error) {
                console.log("Scroll error:", error);
            }
        };

        // Use requestAnimationFrame for better timing
        requestAnimationFrame(() => {
            // Add a small delay to ensure layout is complete
            setTimeout(() => {
                attemptScroll();
            }, 100);
        });
    }, [messages.length]);

    const fetchMessages = async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            }
            const userInfo = await AsyncStorage.getItem('loginUser');
            const conversationId = property?.owner_id || property?.conversation_id;

            if (!conversationId) {
                throw new Error('Conversation ID is missing');
            }

            const response = await chatService.getMessages(conversationId);
            const parsedUser = JSON.parse(userInfo || '{}');
            const userId = parsedUser?.user?.id;
            setCurrentUserId(userId);

            const messagesData = response?.data || response || [];
            const reversedMessages = messagesData.reverse();
            setMessages(reversedMessages);

            // Set chat user info from messages or property
            if (reversedMessages.length > 0) {
                const otherUser = reversedMessages.find((msg: any) => msg.user?.id !== userId)?.user;
                if (otherUser) {
                    setChatUser(otherUser);
                }
            } else if (property?.otherItem) {
                setChatUser(property.otherItem);
            }

            // Note: Scroll will be handled by useEffect when both messages and layout are ready
        } catch (error: any) {
            console.log("Failed to load messages:", error.message);
            if (showLoading) {
                showErrorToast(error.message || 'Failed to load conversation');
                // Navigate back to ChatList on error
                const errorTimeout = setTimeout(() => {
                    navigation.goBack();
                }, 1500);
                return () => clearTimeout(errorTimeout);
            }
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    };

    const markAsRead = async () => {
        try {
            const conversationId = property?.owner_id || property?.conversation_id;
            const response = await chatService.markAsRead(conversationId);
            console.log("read messages:", response);

        } catch (error: any) {
            console.log("Failed to mark as read:", error.message);
        }
    };

    // Use focus effect to handle interval polling safely
    useFocusEffect(
        useCallback(() => {
            // Reset flags when screen comes into focus
            initialScrollDoneRef.current = false;
            flatListLayoutRef.current = false;
            
            markAsRead();
            fetchMessages(true); // Show loading on initial load

            // Set up interval polling for messages (every 5 seconds) only when screen is focused
            const conversationId = property?.owner_id || property?.conversation_id;
            if (conversationId) {
                intervalRef.current = setInterval(() => {
                    fetchMessages(false); // Don't show loading during interval updates
                }, 5000);
            }

            return () => {
                // Cleanup interval when screen loses focus
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                // Cleanup scroll timeout
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                    scrollTimeoutRef.current = null;
                }
            };
        }, [property?.owner_id, property?.conversation_id])
    );

    const handlePickImage = async () => {
        const images = await pickImagesFromGallery({ multiple: false });

        if (images && images.length > 0) {
            const image = images[0];

            setAttachment({
                uri: image.uri!,
                name: image.fileName || `image_${Date.now()}.jpg`,
                type: image.type || "image/jpeg",
                size: image.fileSize,
            });
        }
    };

    const handlePickDocument = async () => {
        try {
            const [file] = await pick({
                type: [types.pdf, types.doc, types.docx, types.plainText],
                allowMultiSelection: false,
            });

            if (!file) return;

            setAttachment({
                uri: file.uri,
                name: file.name,
                type: file.type || file.nativeType || 'application/octet-stream',
                size: file.size,
            });
        } catch (err) {
            console.log("Document picker error:", err);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() && !attachment) return;

        try {
            setbtnLoading(true);
            const conversationId = property?.owner_id || property?.conversation_id;

            const formData = new FormData();
            formData.append("body", message);

            if (attachment) {
                formData.append("attachments[]", {
                    uri: attachment.uri,
                    name: attachment.name,
                    type: attachment.type,
                } as any);
            }

            const response = await chatService.sendMessage(conversationId, formData);
            console.log("Send message:", response);

            setMessage('');
            setAttachment(null);

            // Fetch messages and scroll to bottom
            await fetchMessages(false);

            // Scroll to bottom after sending
            setTimeout(() => {
                scrollToBottom(true);
            }, 100);
        } catch (e: any) {
            console.log("Send message error:", e);
            showErrorToast(e.message || 'Failed to send message');
        } finally {
            setbtnLoading(false);
        }
    };

    const handleTyping = async () => {
        try {
            const conversationId = property?.owner_id || property?.conversation_id;
            const response = await chatService.sendTyping(conversationId);
            console.log("Send typing:", response);
        } catch (error: any) {
            console.log("Failed to send typing:", error.message);
        }
    }

    const onTyping = (text: any) => {
        setMessage(text);

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout
        typingTimeoutRef.current = setTimeout(() => {
            handleTyping();
        }, 500);
    };

    const renderMessageContent = (msg: any) => {
        switch (msg.type) {
            case 'text':
                return (
                    <Text style={[
                        styles.messageText,
                        msg.user.id === currentUserId ? styles.sentText : styles.receivedText
                    ]}>
                        {msg.body}
                    </Text>
                );

            case 'image':
                return (
                    <View>
                        {msg.attachments.map((attachment: any) => (
                            <Image
                                key={attachment.id}
                                source={{ uri: attachment.url }}
                                style={styles.messageImage}
                                resizeMode="cover"
                            />
                        ))}
                    </View>
                );

            case 'file':
                return (
                    <View style={styles.fileContainer}>
                        {msg.attachments.map((attachment: any) => (
                            <View key={attachment.id} >
                                <View style={styles.fileInfo}>
                                    <Paperclip color={msg.user.id === currentUserId ? Colors.white : Colors.primary} size={16} />
                                    <Text style={[
                                        styles.fileName,
                                        msg.user.id === currentUserId ? styles.sentText : styles.receivedText
                                    ]}>
                                        {attachment.file_name}
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.downloadButton}
                                        onPress={() => {
                                            if (attachment.url) {
                                                Linking.openURL(attachment.url);
                                            } else {
                                                console.log("No attachment URL found");
                                            }
                                        }}>
                                        <Download color={Colors.primary} size={16} strokeWidth={2} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={[
                                    styles.fileSize,
                                    msg.user.id === currentUserId ? styles.sentText : styles.receivedText
                                ]}>
                                    {attachment.file_size}
                                </Text>
                            </View>
                        ))}
                    </View>
                );

            default:
                return null;
        }
    };

    // useEffect(() => {

    //     let echo: any = null;

    //     const setupEcho = async () => {
    //         // 1️⃣ Get global Echo instance
    //         echo = await getEcho();

    //         // 2️⃣ Subscribe to private channel
    //         echo.private(`chat.${property?.owner_id || property?.conversation_id}`)
    //             .listen(".conversation.updated", (event: any) => {
    //                 console.log("📩 New message pusher:", event);
    //             });

    //         console.log("👂 Listening to channel:", `chat.${property?.owner_id || property?.conversation_id}`);
    //     };

    //     setupEcho();

    //     // 3️⃣ Cleanup when screen unmounts
    //     return () => {
    //         if (echo) {
    //             echo.leave(`chat.${property?.owner_id || property?.conversation_id}`);
    //             console.log("🧹 Left channel:", `chat.${property?.owner_id || property?.conversation_id}`);
    //         }
    //     };

    // }, [property?.owner_id, property?.conversation_id]);

    useEffect(() => {
        let echo: any = null;
        let scrollTimeout: NodeJS.Timeout | null = null;
        const conversationId = property?.owner_id || property?.conversation_id;
        if (!conversationId) return;

        const channelName = `conversation.${conversationId}`;

        const setup = async () => {
            try {
                echo = await getEcho();
                echoRef.current = echo;
                echo.private(channelName)
                    .subscribed(() => console.log("📡 Subscribed to conversation", channelName))
                    .listen(".message.sent", (newMessage: any) => {
                        console.log("📩 New message received:", newMessage);
                        setMessages(prev => {
                            // Check if message already exists
                            const exists = prev.find(m => m.id === newMessage.id);
                            if (exists) return prev;
                            return [...prev, newMessage];
                        });

                        // Scroll to bottom when new message arrives
                        if (scrollTimeout) {
                            clearTimeout(scrollTimeout);
                        }
                        scrollTimeout = setTimeout(() => {
                            scrollToBottom(true);
                        }, 100);
                    });
            } catch (error) {
                console.log("Failed to setup echo listener:", error);
            }
        };

        setup();

        return () => {
            // Cleanup scroll timeout
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            // Cleanup Echo listener
            if (echo) {
                try {
                    echo.leave(channelName);
                    console.log("🧹 Left channel:", channelName);
                } catch (error) {
                    console.log("Error leaving channel:", error);
                }
            }
            echoRef.current = null;
        };
    }, [property?.owner_id, property?.conversation_id]);

    // Scroll to bottom when both messages are loaded AND FlatList is laid out
    useEffect(() => {
        if (messages.length > 0 && flatListLayoutRef.current && !initialScrollDoneRef.current) {
            initialScrollDoneRef.current = true;
            // Try scrolling multiple times with increasing delays to ensure it works
            // This handles cases where the list needs time to measure its content
            const timeout1 = setTimeout(() => scrollToBottom(false), 150);
            const timeout2 = setTimeout(() => scrollToBottom(false), 400);
            const timeout3 = setTimeout(() => scrollToBottom(false), 700);
            
            return () => {
                clearTimeout(timeout1);
                clearTimeout(timeout2);
                clearTimeout(timeout3);
            };
        }
    }, [messages.length, scrollToBottom]);

    // Cleanup all timeouts on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = null;
            }
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
                scrollTimeoutRef.current = null;
            }
        };
    }, []);


    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.headerView}>
                    <View style={styles.inRow}>
                        <TouchableOpacity style={styles.backBox} onPress={() => navigation.goBack()}>
                            <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                        </TouchableOpacity>
                        <View style={styles.titleView}>
                            <NMText fontSize={20} fontFamily='semiBold' color={Colors.textSecondary}>
                                {loading ? 'Loading...' :
                                    (chatUser?.first_name && chatUser?.last_name
                                        ? `${chatUser.first_name} ${chatUser.last_name}`
                                        : chatUser?.name || property?.otherItem?.name || 'Chat')}
                            </NMText>
                            <View style={styles.inRow}>
                                <Circle
                                    color={chatUser?.is_online ? Colors.statusText : Colors.textLight}
                                    size={8}
                                    fill={chatUser?.is_online ? Colors.statusText : Colors.textLight}
                                    style={{ marginRight: 5 }}
                                />
                                <NMText fontSize={14} fontFamily='regular' color={chatUser?.is_online ? Colors.statusText : Colors.textLight}>
                                    {chatUser?.is_online ? 'Online' : 'Offline'}
                                </NMText>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Messages */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    style={styles.messagesContainer}
                    contentContainerStyle={{ paddingBottom: 20, paddingTop: 20 }}
                    showsVerticalScrollIndicator={false}
                    onLayout={() => {
                        // Mark FlatList as laid out
                        flatListLayoutRef.current = true;
                    }}
                    renderItem={({ item: msg }) => {
                        const isSent = msg.user?.id === currentUserId;

                        return (
                            <View
                                style={[
                                    styles.messageWrapper,
                                    isSent ? styles.sentWrapper : styles.receivedWrapper
                                ]}
                            >
                                {!isSent && (
                                    <Image
                                        source={{
                                            uri: msg.user?.profile_image || ''
                                        }}
                                        style={styles.avatar}
                                    />
                                )}

                                <View style={styles.messageContent}>
                                    <View
                                        style={[
                                            styles.messageBubble,
                                            isSent ? styles.sentBubble : styles.receivedBubble
                                        ]}
                                    >
                                        {renderMessageContent(msg)}

                                        <View style={[
                                            styles.timeContainer,
                                            isSent && styles.sentTimeContainer
                                        ]}>
                                            <Text style={[
                                                styles.timeText,
                                                isSent && styles.sentTimeText
                                            ]}>
                                                {msg.formatted_time}
                                            </Text>
                                            {isSent && (
                                                <Check
                                                    color={Colors.white}
                                                    size={14}
                                                    style={{ marginLeft: 4 }}
                                                />
                                            )}
                                        </View>
                                    </View>
                                </View>

                                {isSent && (
                                    <View style={{ width: 10, height: 10 }} />
                                )}
                            </View>
                        );
                    }}
                />

                {attachment && (
                    <View style={styles.attachmentContainer}>
                        <TouchableOpacity
                            style={styles.removeAttachmentButton}
                            onPress={() => setAttachment(null)}
                        >
                            <Text style={{ color: 'white', fontSize: 16, lineHeight: 16 }}>×</Text>
                        </TouchableOpacity>

                        {attachment.type.startsWith('image/') ? (
                            <Image
                                source={{ uri: attachment.uri }}
                                style={{ width: 120, height: 120, borderRadius: 8 }}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.documentPreview}>
                                <FileText width={48} height={48} color="#555" />
                                <Text numberOfLines={1} style={styles.documentName}>
                                    {attachment.name}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Input Area */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TouchableOpacity style={styles.inputIcon} onPress={() => setEmojiOpen(true)}>
                            <Smile color={Colors.textLight} size={22} />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your message"
                            placeholderTextColor="#aaa"
                            value={message}
                            onChangeText={(t) => onTyping(t)}
                            multiline
                        />

                        <TouchableOpacity style={styles.inputIcon} onPress={handlePickDocument}>
                            <Paperclip color={Colors.textLight} size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.inputIcon} onPress={handlePickImage}>
                            <Camera color={Colors.textLight} size={20} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                        {btnLoading ? <ActivityIndicator size="small" color={Colors.white} /> :
                            <Send color={Colors.white} size={20} fill={Colors.white} />}
                    </TouchableOpacity>
                </View>
                {emojiOpen && (
                    <View style={{ position: "absolute", bottom: 60, left: 0, right: 0 }}>
                        <EmojiPicker
                            onEmojiSelected={(emoji) => setMessage(prev => prev + emoji.emoji)}
                            open={emojiOpen}
                            onClose={() => setEmojiOpen(false)}
                            enableSearch={false}
                            categoryPosition="bottom"
                            expandable={false}
                            theme={{
                                backdrop: "transparent"
                            }}
                        />
                    </View>
                )}

                <LoaderModal visible={loading} />
            </View>
        </NMSafeAreaWrapper>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background
    },
    headerView: {
        width: '100%',
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        paddingVertical: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleView: {
        marginLeft: 10
    },
    backBox: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.background,
    },
    messagesContainer: {
        flex: 1,
        paddingHorizontal: '2%',
        paddingTop: 20
    },
    messageWrapper: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'flex-end'
    },
    sentWrapper: {
        justifyContent: 'flex-end'
    },
    receivedWrapper: {
        justifyContent: 'flex-start'
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 8,
        backgroundColor: Colors.border
    },
    messageContent: {
        maxWidth: '70%'
    },
    messageBubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16
    },
    sentBubble: {
        backgroundColor: Colors.primary,
        borderBottomRightRadius: 4
    },
    receivedBubble: {
        backgroundColor: Colors.white,
        borderBottomLeftRadius: 4
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20
    },
    sentText: {
        color: Colors.white
    },
    receivedText: {
        color: Colors.textSecondary
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        alignSelf: 'flex-end'
    },
    sentTimeContainer: {
        alignSelf: 'flex-end'
    },
    timeText: {
        fontSize: 12,
        color: Colors.textLight
    },
    sentTimeText: {
        color: 'rgba(255, 255, 255, 0.7)'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '5%',
        paddingVertical: 12,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        gap: 8
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    inputIcon: {
        padding: 4
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: Colors.textSecondary,
        paddingVertical: 8,
        paddingHorizontal: 8,
        maxHeight: 100
    },
    sendButton: {
        width: 48,
        height: 48,
        backgroundColor: Colors.primary,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    messageImage: {
        width: 200,
        height: 200,
        borderRadius: 12,
        marginBottom: 8
    },
    fileContainer: {
        padding: 8
    },
    fileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    fileName: {
        fontSize: 14,
        fontWeight: '500',
        width: '74%',
    },
    fileSize: {
        fontSize: 12,
        opacity: 0.7,
        marginLeft: 20
    },
    downloadButton: {
        width: 26,
        height: 26,
        backgroundColor: Colors.background,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    attachmentContainer: {
        position: 'relative',
        alignSelf: 'flex-start',
        marginHorizontal: '5%',
        marginBottom: -10,
        zIndex: 1,
    },
    removeAttachmentButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'red',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    documentPreview: {
        width: 120,
        height: 120,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    documentName: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
        marginTop: 4,
    },
})

const messages = [
    {
        id: 1,
        type: 'received',
        content: "Hey Gaston, how's all going?",
        time: '08:30',
        sender: 'Theresa'
    },
    {
        id: 4,
        type: 'sent',
        content: "Thanks, Gaston. I appreciate your support. Overall, I'm optimistic about our team's performance.",
        time: '08:30'
    },
    {
        id: 5,
        type: 'received',
        content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
        time: '08:30',
        sender: 'Theresa',
        isRead: true
    }
]