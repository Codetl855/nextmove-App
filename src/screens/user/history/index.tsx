import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import NMText from '../../../components/common/NMText';
import { Colors } from '../../../theme/colors';

type TabType = 'Confirmed' | 'Cancelled';
type StatusType = 'Confirmed' | 'Cancelled';

interface HistoryCardProps {
    title: string;
    tickets: number;
    date: string;
    time: string;
    amount: string;
    status: StatusType;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
    title,
    tickets,
    date,
    time,
    amount,
    status,
}) => {
    const isCancelled = status === 'Cancelled';

    const statusStyles = {
        backgroundColor: isCancelled ? Colors.statusSoldBg : Colors.statusBg,
        color: isCancelled ? Colors.statusSoldText : Colors.statusText,
    };

    return (
        <View style={styles.card}>
            <NMText fontSize={16} fontFamily="medium" color={Colors.textPrimary}>
                {title}
            </NMText>

            <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                No. of Tickets:{' '}
                <NMText fontSize={14} fontFamily="semiBold" color={Colors.primary}>
                    {tickets}
                </NMText>
            </NMText>

            <View style={styles.row}>
                <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                    {date}
                </NMText>
                <View style={styles.divider} />
                <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                    {time}
                </NMText>
            </View>

            <View style={styles.rightSection}>
                <View
                    style={[
                        styles.statusBox,
                        { backgroundColor: statusStyles.backgroundColor },
                    ]}
                >
                    <NMText fontSize={12} fontFamily="regular" color={statusStyles.color}>
                        {status}
                    </NMText>
                </View>
                <NMText
                    fontSize={14}
                    fontFamily="semiBold"
                    color={Colors.primary}
                    style={{ marginRight: 4 }}
                >
                    {amount}
                </NMText>
            </View>
        </View>
    );
};

const HistoryScreen: React.FC = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState<TabType>('Confirmed');

    const historyData: HistoryCardProps[] = [
        {
            title: 'Desert Safari Camp',
            tickets: 2,
            date: '05/05/2025',
            time: '10:30 PM',
            amount: '$50',
            status: 'Confirmed',
        },
        {
            title: 'Water Adventure Park',
            tickets: 4,
            date: '06/06/2025',
            time: '02:00 PM',
            amount: '$80',
            status: 'Cancelled',
        },
    ];

    const filteredData = historyData.filter((item) => item.status === activeTab);

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>

                <View style={styles.header}>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                        </TouchableOpacity>
                        <NMText
                            fontSize={20}
                            fontFamily="semiBold"
                            color={Colors.textSecondary}
                            style={{ marginLeft: 10 }}
                        >
                            History
                        </NMText>
                    </View>
                </View>

                <View style={styles.tabsContainer}>
                    {(['Confirmed', 'Cancelled'] as TabType[]).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <NMText
                                fontSize={16}
                                fontFamily={activeTab === tab ? 'semiBold' : 'regular'}
                                color={activeTab === tab ? Colors.white : Colors.textPrimary}
                            >
                                {tab}
                            </NMText>
                        </TouchableOpacity>
                    ))}
                </View>

                {filteredData.map((item, index) => (
                    <HistoryCard key={index} {...item} />
                ))}
            </ScrollView>
        </NMSafeAreaWrapper>
    );
};

export default HistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        paddingVertical: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.background,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: '5%',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: Colors.white,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        backgroundColor: Colors.primary,
    },
    card: {
        marginHorizontal: '5%',
        backgroundColor: Colors.white,
        marginVertical: 6,
        padding: 14,
        borderRadius: 12,
        gap: 8,
    },
    divider: {
        width: 1,
        height: 10,
        backgroundColor: Colors.textLight,
        marginHorizontal: 6,
    },
    statusBox: {
        width: 80,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    rightSection: {
        alignItems: 'flex-end',
        gap: 10,
        position: 'absolute',
        right: 14,
        top: '30%',
    },
});
