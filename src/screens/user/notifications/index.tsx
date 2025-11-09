import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, CalendarPlus, CreditCard, BellRing, MapPin } from 'lucide-react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import { Colors } from '../../../theme/colors';
import NMText from '../../../components/common/NMText';

const getDateLabel = (dateString: string) => {
    const notifDate = new Date(dateString);
    const today = new Date();

    const isToday =
        notifDate.getDate() === today.getDate() &&
        notifDate.getMonth() === today.getMonth() &&
        notifDate.getFullYear() === today.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isYesterday =
        notifDate.getDate() === yesterday.getDate() &&
        notifDate.getMonth() === yesterday.getMonth() &&
        notifDate.getFullYear() === yesterday.getFullYear();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return notifDate.toLocaleDateString();
};

const NotificationsScreen: React.FC = () => {

    const notifications = [
        {
            id: 1,
            title: 'Tour Booked Successfully',
            description: 'Your booking for the Dubai Desert Safari has been confirmed. Enjoy your trip!',
            time: '1 hr ago',
            icon: <CalendarPlus size={18} color={Colors.primary} strokeWidth={1.5} />,
            date: new Date().toISOString(),
        },
        {
            id: 2,
            title: 'Payment Completed',
            description: 'You successfully paid 4587 SAR using your Visa card ending with 1245.',
            time: '3 hr ago',
            icon: <CreditCard size={18} color={Colors.primary} strokeWidth={1.5} />,
            date: new Date().toISOString(),
        },
        {
            id: 3,
            title: 'New Tour Available',
            description: 'A new Maldives Beach Getaway package is now available. Don’t miss the offer!',
            time: 'Yesterday',
            icon: <BellRing size={18} color={Colors.primary} strokeWidth={1.5} />,
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 4,
            title: 'Location Updated',
            description: 'Your saved address has been updated to Riyadh, Saudi Arabia.',
            time: 'Yesterday',
            icon: <MapPin size={18} color={Colors.primary} strokeWidth={1.5} />,
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
    ];

    const groupedNotifications = notifications.reduce((groups: any, item) => {
        const label = getDateLabel(item.date);
        if (!groups[label]) groups[label] = [];
        groups[label].push(item);
        return groups;
    }, {});

    const renderNotificationItem = (item: any) => (
        <View key={item.id} style={styles.notificationBox}>
            <View style={styles.iconBox}>{item.icon}</View>
            <View style={styles.textNotiBox}>
                <View style={styles.titleBox}>
                    <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                        {item.title}
                    </NMText>
                    <NMText fontSize={13} fontFamily="medium" color={Colors.primary}>
                        {item.time}
                    </NMText>
                </View>
                <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                    {item.description}
                </NMText>
            </View>
        </View>
    );

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>

                <View style={styles.headerView}>
                    <View style={styles.inRow}>
                        <TouchableOpacity style={styles.backBox}>
                            <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                        </TouchableOpacity>
                        <View style={styles.titleView}>
                            <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                                Notifications
                            </NMText>
                        </View>
                    </View>
                </View>

                {Object.keys(groupedNotifications).map((label) => (
                    <View key={label} style={styles.sectionContainer}>
                        <NMText
                            fontSize={18}
                            fontFamily="semiBold"
                            color={Colors.text1A}
                            style={styles.sectionTitle}>
                            {label}
                        </NMText>
                        {groupedNotifications[label].map(renderNotificationItem)}
                    </View>
                ))}
            </ScrollView>
        </NMSafeAreaWrapper>
    );
};

export default NotificationsScreen;

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
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleView: {
        marginLeft: 10,
    },
    backBox: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.background,
    },
    sectionContainer: {
        marginHorizontal: '5%',
        marginTop: 20,
    },
    sectionTitle: {
        marginBottom: 8,
    },
    notificationBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 8,
        padding: 14,
        backgroundColor: Colors.white,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    iconBox: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40 / 2,
        backgroundColor: Colors.background,
    },
    textNotiBox: {
        flex: 1,
        marginLeft: 10,
    },
    titleBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
});
