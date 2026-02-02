import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import { Colors } from '../../../theme/colors';
import NMText from '../../../components/common/NMText';
import ChatListCard from '../../../components/user/ChatListCard';
import { chatService, type Conversation } from '../../../services/chatService';
import LoaderModal from '../../../components/common/NMLoaderModal';
import { getEcho } from '../../../utils/echo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatList: React.FC = ({ navigation }: any) => {
    // Get drawer navigation from parent
    const drawerNavigation = navigation?.getParent?.('drawer') || navigation?.getParent?.();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const echoRef = useRef<any>(null);
    const channelNameRef = useRef<string | null>(null);

    const loadConversations = async () => {
        try {
            setLoading(true);
            const data = await chatService.getConversations();
            // Sort conversations by last message time (most recent first)
            const sortedData = [...data].sort((a, b) => {
                const timeA = a.last_message?.created_at || a.updated_at || '';
                const timeB = b.last_message?.created_at || b.updated_at || '';
                return new Date(timeB).getTime() - new Date(timeA).getTime();
            });
            setConversations(sortedData);
        } catch (error: any) {
            console.log("Failed to load conversations:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // Refresh conversations when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadConversations();
        }, [])
    );

    useEffect(() => {
        // Set up real-time listener for conversation updates
        let echo: any = null;
        let channelName: string | null = null;

        const setupEcho = async () => {
            try {
                const userInfo = await AsyncStorage.getItem('loginUser');
                if (!userInfo) return;

                const parsedUser = JSON.parse(userInfo);
                const userId = parsedUser?.user?.id;
                if (!userId) return;

                echo = await getEcho();
                channelName = `conversation-list.user.${userId}`;
                echoRef.current = echo;
                channelNameRef.current = channelName;

                echo.private(channelName)
                    .subscribed(() => console.log("📡 Subscribed to conversation list updates"))
                    .listen(".conversation.updated", (updatedConversation: Conversation) => {
                        console.log("📩 Conversation updated:", updatedConversation);
                        setConversations(prev => {
                            const exists = prev.find(c => c.id === updatedConversation.id);
                            let updated;
                            if (!exists) {
                                updated = [updatedConversation, ...prev];
                            } else {
                                updated = prev.map(c => 
                                    c.id === updatedConversation.id ? updatedConversation : c
                                );
                            }
                            // Re-sort by last message time
                            return updated.sort((a, b) => {
                                const timeA = a.last_message?.created_at || a.updated_at || '';
                                const timeB = b.last_message?.created_at || b.updated_at || '';
                                return new Date(timeB).getTime() - new Date(timeA).getTime();
                            });
                        });
                    });
            } catch (error) {
                console.log("Failed to setup echo listener:", error);
            }
        };

        setupEcho();

        return () => {
            // Cleanup Echo listener
            if (echo && channelName) {
                try {
                    echo.leave(channelName);
                    console.log("🧹 Left channel:", channelName);
                } catch (error) {
                    console.log("Error leaving channel:", error);
                }
            }
            echoRef.current = null;
            channelNameRef.current = null;
        };
    }, []);

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">

            {/* Loader */}
            <LoaderModal visible={loading} />

            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={styles.container}>

                    {/* Header */}
                    <View style={styles.headerView}>
                        <View style={styles.inRow}>
                            <TouchableOpacity onPress={() => {
                                if (drawerNavigation && 'openDrawer' in drawerNavigation) {
                                    drawerNavigation.openDrawer();
                                } else if (navigation && 'openDrawer' in navigation) {
                                    (navigation as any).openDrawer();
                                }
                            }}>
                                <Image source={require('../../../assets/icons/drawer.png')} style={styles.headerIcon} />
                            </TouchableOpacity>
                            <View style={styles.titleView}>
                                <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                                    Messages
                                </NMText>
                            </View>
                        </View>
                        {/* <Image source={require('../../../assets/icons/chatAdd.png')} style={styles.headerIcon} /> */}
                    </View>

                    {/* No conversations */}
                    {conversations.length === 0 && (
                        <View style={{ alignItems: 'center', marginTop: '46%' }}>
                            <NMText fontSize={16} fontFamily="regular" color={Colors.textSecondary}>
                                No conversations yet
                            </NMText>
                        </View>
                    )}

                    {/* Conversations List */}
                    {conversations?.map((item) => (
                        <ChatListCard
                            key={item.id}
                            conversation={item}
                            countHave={!!item.unread_count}
                            onPress={() =>
                                navigation.navigate("ChatScreen", {
                                    property: {
                                        conversation_id: item.id,
                                        users: item.user_id,
                                        otherItem: item
                                    }
                                })
                            }
                        />
                    ))}
                </View>
            </ScrollView>
        </NMSafeAreaWrapper>
    );
};

export default ChatList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
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
        marginBottom: 10
    },
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleView: {
        marginLeft: 10,
    },
});

// import { Image, ScrollView, StyleSheet, View } from 'react-native';
// import React from 'react';
// import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
// import { Colors } from '../../../theme/colors';
// import NMText from '../../../components/common/NMText';
// import ChatListCard from '../../../components/user/ChatListCard';

// const ChatList: React.FC = () => {
//     return (
//         <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
//             <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
//                 <View style={styles.container}>

//                     <View style={styles.headerView}>
//                         <View style={styles.inRow}>
//                             <Image source={require('../../../assets/icons/drawer.png')} style={styles.headerIcon} />
//                             <View style={styles.titleView}>
//                                 <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
//                                     Messages
//                                 </NMText>
//                             </View>
//                         </View>
//                         <Image source={require('../../../assets/icons/chatAdd.png')} style={styles.headerIcon} />
//                     </View>

//                     {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
//                         <ChatListCard
//                             key={index}
//                             countHave={index % 3 === 0}
//                         />
//                     ))}

//                 </View>
//             </ScrollView>
//         </NMSafeAreaWrapper>
//     );
// };

// export default ChatList;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: Colors.background,
//     },
//     headerView: {
//         width: '100%',
//         backgroundColor: Colors.white,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: '5%',
//         paddingVertical: 20,
//         borderBottomLeftRadius: 20,
//         borderBottomRightRadius: 20,
//         marginBottom: 10
//     },
//     headerIcon: {
//         width: 30,
//         height: 30,
//         resizeMode: 'contain',
//     },
//     inRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     titleView: {
//         marginLeft: 10,
//     },
// });