import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import NMText from '../common/NMText'
import { Colors } from '../../theme/colors'
import { CheckCheck } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'

// interface ChatListCardProps {
//     countHave?: boolean
// }

// const ChatListCard: React.FC<ChatListCardProps> = ({ countHave, conversation }) => {

//     const navigation = useNavigation();
//     return (
//         <TouchableOpacity style={styles.mainContainer} onPress={() => navigation.navigate('ChatScreen' as never)} activeOpacity={0.8}>
//             <View style={styles.avater}>
//                 <View style={styles.activeAvater} />
//             </View>

//             <View style={styles.textContainer}>
//                 <NMText fontSize={16} fontFamily='medium' color={Colors.textPrimary}>
//                     Theresa T. Brose
//                 </NMText>
//                 <NMText fontSize={14} fontFamily='regular' color={Colors.textLight} numberOfLines={2}>
//                     Hello! I just got your assignment, everything's alright, except one thing
//                 </NMText>
//             </View>

//             <View style={styles.inColumn}>
//                 <NMText fontSize={12} fontFamily='regular' color={Colors.textLight}>
//                     16 min ago
//                 </NMText>

//                 {countHave ? (
//                     <View style={styles.countBox}>
//                         <NMText fontSize={14} fontFamily='semiBold' color={Colors.white}>
//                             1
//                         </NMText>
//                     </View>
//                 ) : (
//                     <CheckCheck size={20} color={Colors.primary} />
//                 )}
//             </View>
//         </TouchableOpacity>
//     )
// }
interface ChatListCardProps {
    countHave?: boolean
    conversation: any
    onPress?: () => void
}

const ChatListCard: React.FC<ChatListCardProps> = ({ countHave, conversation, onPress }) => {
    const getLastMessagePreview = () => {
        if (!conversation.last_message) return 'No messages yet'

        if (conversation.last_message.type === 'file') {
            return conversation.last_message.body || '📎 File'
        }

        return conversation.last_message.body || 'No messages yet'
    }

    const getTimeAgo = () => {
        if (!conversation.last_message) return ''
        return conversation.last_message.created_at
    }

    return (
        <TouchableOpacity style={styles.mainContainer} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.avater}>
                {conversation.avatar ? (
                    <Image source={{ uri: conversation.avatar }} style={styles.avater} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <NMText fontSize={18} fontFamily='semiBold' color={Colors.primary}>
                            {conversation.name?.charAt(0).toUpperCase()}
                        </NMText>
                    </View>
                )}
                {conversation.is_online && <View style={styles.activeAvater} />}
            </View>

            <View style={styles.textContainer}>
                <NMText fontSize={16} fontFamily='medium' color={Colors.textPrimary}>
                    {conversation.name}
                </NMText>
                <NMText fontSize={14} fontFamily='regular' color={Colors.textLight} numberOfLines={2}>
                    {getLastMessagePreview()}
                </NMText>
            </View>

            <View style={styles.inColumn}>
                <NMText fontSize={12} fontFamily='regular' color={Colors.textLight}>
                    {getTimeAgo()}
                </NMText>

                {countHave ? (
                    <View style={styles.countBox}>
                        <NMText fontSize={14} fontFamily='semiBold' color={Colors.white}>
                            {conversation.unread_count}
                        </NMText>
                    </View>
                ) : (
                    conversation.last_message?.is_own && (
                        <CheckCheck size={20} color={Colors.primary} />
                    )
                )}
            </View>
        </TouchableOpacity>
    )
}
export default ChatListCard

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        marginVertical: 6,
        marginHorizontal: '5%',
        padding: 14,
        borderRadius: 12,
        backgroundColor: Colors.white,
    },
    avater: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.border,
        marginRight: 8,
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeAvater: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.background,
        backgroundColor: Colors.statusText,
        position: 'absolute',
        right: -2,
        top: 4,
    },
    textContainer: {
        flex: 1,
    },
    inColumn: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginTop: 10,
    },
    countBox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
    },
})
