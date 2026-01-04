import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, HistoryIcon, MapPinIcon } from 'lucide-react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import NMText from '../../../components/common/NMText';
import NMTabs from '../../../components/common/NMTab';
import { Colors } from '../../../theme/colors';
import { useNavigation } from '@react-navigation/native';

interface ActivityCardProps {
    imageUrl: string;
    title: string;
    location: string;
    price: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ imageUrl, title, location, price }) => (
    <View style={styles.card}>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        <View style={styles.textContainer}>
            {/* Title */}
            <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                {title}
            </NMText>

            {/* Location */}
            <View style={styles.locationRow}>
                <MapPinIcon color={Colors.primary} size={20} strokeWidth={1.5} />
                <NMText
                    fontSize={12}
                    fontFamily="regular"
                    color={Colors.textLight}
                    style={{ width: '92%' }}
                >
                    {location}
                </NMText>
            </View>

            {/* Price */}
            <View style={styles.priceTag}>
                <NMText fontSize={14} fontFamily="semiBold" color={Colors.primary}>
                    {price}
                </NMText>
            </View>
        </View>
    </View>
);

const BookFunActivities: React.FC = () => {
    const navigation = useNavigation();
    const drawerNavigation = navigation.getParent('drawer') || navigation.getParent();
    const activities = Array(10).fill({
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
        title: 'Desert Safari Camp',
        location: 'Riyadh Desert Safari Camp, Khurais Road, Riyadh 13872, Saudi Arabia',
        price: 'SAR 150',
    });

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity style={styles.backBox} onPress={() => navigation.goBack()}>
                            <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                        </TouchableOpacity>
                        <NMText
                            fontSize={20}
                            fontFamily="semiBold"
                            color={Colors.textSecondary}
                            style={styles.headerTitle}
                        >
                            Book Fun Activities
                        </NMText>
                    </View>

                    <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('HistoryScreen' as never)}>
                        <HistoryIcon color={Colors.textPrimary} size={20} strokeWidth={1.5} />
                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                            History
                        </NMText>
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <NMTabs
                    tabs={[
                        { id: '1', label: 'Desert Safari' },
                        { id: '2', label: 'Theme Park' },
                        { id: '3', label: 'Water Activities' },
                    ]}
                    onTabSelect={(tabId) => console.log('Selected:', tabId)}
                    defaultSelected="1"
                />

                {/* Activity Cards */}
                {activities.map((activity, index) => (
                    <ActivityCard
                        key={index}
                        imageUrl={activity.imageUrl}
                        title={activity.title}
                        location={activity.location}
                        price={activity.price}
                    />
                ))}
            </ScrollView>
        </NMSafeAreaWrapper>
    );
};

export default BookFunActivities;

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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRight: {
        backgroundColor: Colors.background,
        padding: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    headerTitle: {
        marginLeft: 10,
    },
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    card: {
        marginHorizontal: '5%',
        backgroundColor: Colors.white,
        marginVertical: 6,
        padding: 14,
        borderRadius: 12,
        flexDirection: 'row',
        gap: 8,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    textContainer: {
        flex: 1,
        marginLeft: 8,
    },
    locationRow: {
        flexDirection: 'row',
        gap: 4,
        paddingVertical: 8,
    },
    priceTag: {
        width: 80,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.background,
    },
});
