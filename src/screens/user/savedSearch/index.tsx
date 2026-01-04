import React from 'react';
import { Image, ScrollView, StyleSheet, View, ImageSourcePropType, TouchableOpacity } from 'react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import NMText from '../../../components/common/NMText';
import { Colors } from '../../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

interface SavedListCardProps {
    title: string;
    status: string;
    province: string;
    date: string;
    icon: ImageSourcePropType;
}

const SavedListCard: React.FC<SavedListCardProps> = ({ title, status, province, date, icon }) => (
    <View style={styles.cardContainer}>
        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
            {title}
        </NMText>

        <View style={[styles.row, { marginTop: 6 }]}>
            <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                Status:{' '}
                <NMText fontSize={14} fontFamily="semiBold" color={Colors.textSecondary}>
                    {status}
                </NMText>
            </NMText>

            <View style={styles.divider} />

            <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                Province/State:{' '}
                <NMText fontSize={14} fontFamily="semiBold" color={Colors.textSecondary}>
                    {province}
                </NMText>
            </NMText>
        </View>

        <NMText fontSize={12} fontFamily="regular" color={Colors.textLight} style={{ marginTop: 6 }}>
            {date}
        </NMText>

        <Image source={icon} style={styles.bookmarkIcon} />
    </View>
);

const SavedSearch: React.FC = () => {
    const navigation = useNavigation();
    const bookmarkIcon = require('../../../assets/icons/bookMark.png');
    const notificationIcon = require('../../../assets/icons/notification.png');

    const savedItems = Array(10).fill({
        title: 'Galaxy Family Home',
        status: 'for-rent',
        province: 'Alaska',
        date: '05/05/2025',
    });

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>

                <View style={styles.header}>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.backBox} onPress={() => navigation.goBack()}>
                            <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                        </TouchableOpacity>
                        <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary} style={styles.headerTitle}>
                            Saved Searches
                        </NMText>
                    </View>

                    <Image source={notificationIcon} style={styles.headerIcon} />
                </View>

                {savedItems.map((item, index) => (
                    <SavedListCard
                        key={index}
                        title={item.title}
                        status={item.status}
                        province={item.province}
                        date={item.date}
                        icon={bookmarkIcon}
                    />
                ))}
            </ScrollView>
        </NMSafeAreaWrapper>
    );
};

export default SavedSearch;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
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
    backBox: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.background
    },
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    headerTitle: {
        marginLeft: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardContainer: {
        marginHorizontal: '5%',
        backgroundColor: Colors.white,
        marginVertical: 6,
        padding: 14,
        borderRadius: 12,
    },
    divider: {
        width: 1,
        height: 10,
        backgroundColor: Colors.textSecondary,
        marginHorizontal: 10,
    },
    bookmarkIcon: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
        position: 'absolute',
        top: 10,
        right: 14,
    },
});
