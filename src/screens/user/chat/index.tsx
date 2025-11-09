import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native'
import React, { useState } from 'react'
import { ChevronLeft, Circle, PhoneCall, Paperclip, Camera, Send, Smile, Check } from 'lucide-react-native'
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper'
import NMText from '../../../components/common/NMText'
import { Colors } from '../../../theme/colors'

const ChatScreen = () => {
    const [message, setMessage] = useState('')

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

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.headerView}>
                    <View style={styles.inRow}>
                        <TouchableOpacity style={styles.backBox}>
                            <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                        </TouchableOpacity>
                        <View style={styles.titleView}>
                            <NMText fontSize={20} fontFamily='semiBold' color={Colors.textSecondary}>
                                Theresa T. Brose
                            </NMText>
                            <View style={styles.inRow}>
                                <Circle color={Colors.statusText} size={8} fill={Colors.statusText} style={{ marginRight: 5 }} />
                                <NMText fontSize={14} fontFamily='regular' color={Colors.statusText}>
                                    Online
                                </NMText>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.backBox}>
                        <PhoneCall color={Colors.black} size={18} strokeWidth={2} />
                    </TouchableOpacity>
                </View>

                {/* Messages */}
                <ScrollView style={styles.messagesContainer} contentContainerStyle={{ paddingBottom: 20 }}>
                    {messages.map((msg) => (
                        <View
                            key={msg.id}
                            style={[styles.messageWrapper, msg.type === 'sent' ? styles.sentWrapper : styles.receivedWrapper]}
                        >
                            {msg.type === 'received' && (
                                <Image
                                    source={{ uri: 'https://i.pravatar.cc/150?img=5' }}
                                    style={styles.avatar}
                                />
                            )}

                            <View style={styles.messageContent}>
                                <View
                                    style={[styles.messageBubble, msg.type === 'sent' ? styles.sentBubble : styles.receivedBubble]}
                                >
                                    <Text
                                        style={[styles.messageText, msg.type === 'sent' ? styles.sentText : styles.receivedText]}
                                    >
                                        {msg.content}
                                    </Text>
                                    <View style={[styles.timeContainer, msg.type === 'sent' && styles.sentTimeContainer]}>
                                        <Text
                                            style={[styles.timeText, msg.type === 'sent' && styles.sentTimeText]}
                                        >
                                            {msg.time}
                                        </Text>
                                        {msg.type === 'received' && msg.isRead && (
                                            <Check color={Colors.textLight} size={14} style={{ marginLeft: 4 }} />
                                        )}
                                    </View>
                                </View>
                            </View>

                            {msg.type === 'sent' && (
                                <Image
                                    source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                                    style={styles.avatar}
                                />
                            )}
                        </View>
                    ))}
                </ScrollView>

                {/* Input Area */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TouchableOpacity style={styles.inputIcon}>
                            <Smile color={Colors.textLight} size={22} />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your message"
                            placeholderTextColor="#aaa"
                            value={message}
                            onChangeText={setMessage}
                            multiline
                        />
                        <TouchableOpacity style={styles.inputIcon}>
                            <Paperclip color={Colors.textLight} size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.inputIcon}>
                            <Camera color={Colors.textLight} size={20} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.sendButton}>
                        <Send color={Colors.white} size={20} fill={Colors.white} />
                    </TouchableOpacity>
                </View>
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
        marginHorizontal: 8
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
        color: Colors.primary
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
    }
})
