import React, { useState } from 'react';
import { View, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import { Colors } from '../../../theme/colors';
import NMText from '../../../components/common/NMText';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

type TabType = 'Upcoming' | 'Previous';
type StatusType = 'Pending' | 'Approved' | 'Completed' | 'Cancelled';

interface Property {
    id: number;
    image: string;
    title: string;
    type: string;
    date: string;
    price: string;
    status: StatusType;
}

const BookingRequestsScreen: React.FC = () => {
    const navigation = useNavigation();
    const drawerNavigation = navigation.getParent('drawer') || navigation.getParent();
    const [activeTab, setActiveTab] = useState<TabType>('Upcoming');

    const allProperties: Property[] = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
            title: 'PIK Villa House',
            type: 'Apartment',
            date: '04/05/2025',
            price: '$7250.00',
            status: 'Pending',
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
            title: 'PIK Villa House',
            type: 'Apartment',
            date: '04/05/2025',
            price: '$7250.00',
            status: 'Approved',
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
            title: 'PIK Villa House',
            type: 'Apartment',
            date: '04/05/2024',
            price: '$7250.00',
            status: 'Completed',
        },
        {
            id: 4,
            image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400',
            title: 'PIK Villa House',
            type: 'Apartment',
            date: '04/05/2024',
            price: '$7250.00',
            status: 'Cancelled',
        },
    ];


    const filteredProperties =
        activeTab === 'Upcoming'
            ? allProperties.filter(p => p.status === 'Pending' || p.status === 'Approved')
            : allProperties.filter(p => p.status === 'Completed' || p.status === 'Cancelled');

    const PropertyList = ({ data }: { data: Property[] }) => (
        <View>
            {data.map(property => (
                <TouchableOpacity
                    key={property.id}
                    style={styles.propertyCard}
                    onPress={() => navigation.navigate('BookingRequestStatusDetail' as never)}
                >
                    <View style={styles.inRow}>
                        <Image source={{ uri: property.image }} style={styles.propertyImage} />
                        <View style={{ marginLeft: 12 }}>
                            <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                                {property.title}
                            </NMText>

                            <NMText
                                fontSize={14}
                                fontFamily="regular"
                                color={Colors.textSecondary}
                                style={{ marginVertical: 4 }}
                            >
                                Type:{' '}
                                <NMText fontSize={14} fontFamily="semiBold" color={Colors.textSecondary}>
                                    {property.type}
                                </NMText>
                            </NMText>

                            <NMText fontSize={14} fontFamily="regular" color={Colors.textSecondary}>
                                Date:{' '}
                                <NMText fontSize={14} fontFamily="semiBold" color={Colors.textSecondary}>
                                    {property.date}
                                </NMText>
                            </NMText>

                            <NMText fontSize={16} fontFamily="semiBold" color={Colors.primary} style={{ marginTop: 4 }}>
                                {property.price}
                            </NMText>
                        </View>
                    </View>

                    <View
                        style={[
                            styles.statusView,
                            {
                                backgroundColor:
                                    property.status === 'Approved' || property.status === 'Completed'
                                        ? Colors.statusBg
                                        : property.status === 'Cancelled'
                                            ? Colors.statusSoldBg
                                            : Colors.statusPendingBg,
                            },
                        ]}
                    >
                        <NMText
                            fontSize={12}
                            fontFamily="regular"
                            color={
                                property.status === 'Approved' || property.status === 'Completed'
                                    ? Colors.statusText
                                    : property.status === 'Cancelled'
                                        ? Colors.statusSoldText
                                        : Colors.statusPendingText
                            }
                        >
                            {property.status}
                        </NMText>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Header */}
                <View style={styles.headerView}>
                    <View style={styles.inRow}>
                        <TouchableOpacity style={styles.backBox} onPress={() => navigation.goBack()}>
                            <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                        </TouchableOpacity>
                        <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary} style={{ marginLeft: 10 }}>
                            Booking Requests
                        </NMText>
                    </View>
                    <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} />
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    {(['Upcoming', 'Previous'] as TabType[]).map(tab => (
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

                {/* Property Listing */}
                <PropertyList data={filteredProperties} />
            </ScrollView>
        </NMSafeAreaWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerView: {
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
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
    propertyCard: {
        marginVertical: 10,
        marginHorizontal: '5%',
        backgroundColor: Colors.white,
        borderRadius: 8,
        padding: 14,
    },
    propertyImage: {
        width: 85,
        height: 85,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    statusView: {
        position: 'absolute',
        top: '50%',
        right: 14,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
});

export default BookingRequestsScreen;
