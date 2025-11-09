import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import NMText from '../common/NMText'
import { Colors } from '../../theme/colors'
import { CheckCheck } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'

interface ChatListCardProps {
    countHave?: boolean
}

const ChatListCard: React.FC<ChatListCardProps> = ({ countHave }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity style={styles.mainContainer} onPress={() => navigation.navigate('ChatScreen' as never)} activeOpacity={0.8}>
            <View style={styles.avater}>
                <View style={styles.activeAvater} />
            </View>

            <View style={styles.textContainer}>
                <NMText fontSize={16} fontFamily='medium' color={Colors.textPrimary}>
                    Theresa T. Brose
                </NMText>
                <NMText fontSize={14} fontFamily='regular' color={Colors.textLight} numberOfLines={2}>
                    Hello! I just got your assignment, everything's alright, except one thing
                </NMText>
            </View>

            <View style={styles.inColumn}>
                <NMText fontSize={12} fontFamily='regular' color={Colors.textLight}>
                    16 min ago
                </NMText>

                {countHave ? (
                    <View style={styles.countBox}>
                        <NMText fontSize={14} fontFamily='semiBold' color={Colors.white}>
                            1
                        </NMText>
                    </View>
                ) : (
                    <CheckCheck size={20} color={Colors.primary} />
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
