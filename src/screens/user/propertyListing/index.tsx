import React, { useState } from 'react';
import { View, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import { Colors } from '../../../theme/colors';
import NMText from '../../../components/common/NMText';
import NMButton from '../../../components/common/NMButton';
import NMDropdown from '../../../components/common/NMDropdown';
import { useNavigation } from '@react-navigation/native';

type TabType = 'LISTING' | 'REQUESTS';
type StatusType = 'Active' | 'Sold' | 'Deactive' | 'Pending' | 'Approved';

interface Property {
    id: number;
    image: string;
    title: string;
    type: string;
    date: string;
    price: string;
    status: StatusType;
}

const PropertyListingScreen: React.FC = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState<TabType>('LISTING');
    const [status, setStatus] = useState('Sell');
    const [selectReq, setSelectReq] = useState('Booking');

    const statusOptions = [
        { label: 'Sell', value: 'Sell' },
        { label: 'Rent', value: 'Rent' },
        { label: 'Stay', value: 'Stay' },
    ];

    const reqOption = [
        { label: 'Booking', value: 'Booking' },
        { label: 'Auction', value: 'Auction' },
    ]

    const listingProperties: Property[] = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
            title: 'PIK Villa House',
            type: 'Villa',
            date: '04/05/2025',
            price: '$7250.00',
            status: 'Active',
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
            title: 'Oceanfront Apartment',
            type: 'Apartment',
            date: '03/18/2025',
            price: '$5400.00',
            status: 'Sold',
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
            title: 'Luxury Penthouse',
            type: 'Penthouse',
            date: '02/12/2025',
            price: '$12500.00',
            status: 'Deactive',
        },
    ];

    const requestProperties: Property[] = [
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
            status: 'Pending',
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
            title: 'PIK Villa House',
            type: 'Apartment',
            date: '04/05/2025',
            price: '$7250.00',
            status: 'Approved',
        },
        {
            id: 4,
            image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400',
            title: 'PIK Villa House',
            type: 'Apartment',
            date: '04/05/2025',
            price: '$7250.00',
            status: 'Approved',
        },
    ];

    const SellListing = () => (
        <View>
            {listingProperties.map((property) => (
                <View key={property.id} style={styles.sellContainer}>
                    <View style={styles.inRow}>
                        <Image source={{ uri: property.image }} style={styles.sellImage} />
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
                                    property.status === 'Active'
                                        ? Colors.statusBg
                                        : property.status === 'Sold'
                                            ? Colors.statusSoldBg
                                            : Colors.statusPendingBg,
                            },
                        ]}
                    >
                        <NMText
                            fontSize={12}
                            fontFamily="regular"
                            color={
                                property.status === 'Active'
                                    ? Colors.statusText
                                    : property.status === 'Sold'
                                        ? Colors.statusSoldText
                                        : Colors.statusPendingText
                            }
                        >
                            {property.status}
                        </NMText>
                    </View>

                    <View style={styles.btnView}>
                        {property.status === 'Active' && (
                            <NMButton
                                title="De-Active"
                                textColor={Colors.statusPendingText}
                                backgroundColor={Colors.white}
                                borderRadius={8}
                                width={status != 'Sell' ? '46%' : '32%'}
                                height={40}
                                style={{ borderWidth: 1, borderColor: Colors.statusPendingText }}
                            />
                        )}
                        {(property.status === 'Deactive' || property.status === 'Sold') && (
                            <NMButton
                                title="Active"
                                textColor={Colors.statusText}
                                backgroundColor={Colors.white}
                                borderRadius={8}
                                width={property.status === 'Sold' || status != 'Sell' ? '46%' : '32%'}
                                height={40}
                                style={{ borderWidth: 1, borderColor: Colors.statusText }}
                            />
                        )}
                        {(property.status !== 'Sold' && status === 'Sell') && (
                            <NMButton
                                title="Sold"
                                textColor={Colors.statusSoldText}
                                backgroundColor={Colors.white}
                                borderRadius={8}
                                width={'32%'}
                                height={40}
                                style={{ borderWidth: 1, borderColor: Colors.statusSoldText }}
                            />
                        )}
                        <NMButton
                            title="Edit"
                            textColor={Colors.primary}
                            backgroundColor={Colors.white}
                            borderRadius={8}
                            width={property.status === 'Sold' || status != 'Sell' ? '46%' : '32%'}
                            height={40}
                            style={{ borderWidth: 1, borderColor: Colors.primary }}
                        />
                    </View>
                </View>
            ))}
        </View>
    );

    const RequestListing = () => (
        <View>
            {requestProperties.map((property) => (
                <TouchableOpacity key={property.id} style={styles.sellContainer} onPress={() => navigation.navigate('RequestBookingDetail' as never)}>
                    <View style={styles.inRow}>
                        <Image source={{ uri: property.image }} style={styles.sellImage} />
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

                    {selectReq === 'Booking' ? (
                        <View
                            style={[
                                styles.statusView,
                                {
                                    top: '50%',
                                    backgroundColor:
                                        property.status === 'Approved'
                                            ? Colors.statusBg
                                            : property.status === 'Sold'
                                                ? Colors.statusSoldBg
                                                : Colors.statusPendingBg,
                                },
                            ]}
                        >
                            <NMText
                                fontSize={12}
                                fontFamily="regular"
                                color={
                                    property.status === 'Approved'
                                        ? Colors.statusText
                                        : property.status === 'Sold'
                                            ? Colors.statusSoldText
                                            : Colors.statusPendingText
                                }
                            >
                                {property.status}
                            </NMText>
                        </View>
                    ) : (
                        <View
                            style={[
                                styles.statusView,
                                {
                                    top: '50%',
                                    backgroundColor: Colors.background
                                },
                            ]}
                        >
                            <NMText
                                fontSize={12}
                                fontFamily="regular"
                                color={Colors.primary}
                            >
                                10 Bids
                            </NMText>
                        </View>
                    )}

                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={styles.container}>
                    {/* HEADER */}
                    <View style={styles.headerView}>
                        <View style={styles.inRow}>
                            <Image source={require('../../../assets/icons/drawer.png')} style={styles.headerIcon} />
                            <View style={styles.titleView}>
                                <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                                    Property listing
                                </NMText>
                            </View>
                        </View>
                        <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} />
                    </View>

                    {/* TABS */}
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'LISTING' && styles.activeTab]}
                            onPress={() => setActiveTab('LISTING')}
                        >
                            <NMText
                                fontSize={16}
                                fontFamily={activeTab === 'LISTING' ? 'semiBold' : 'regular'}
                                color={activeTab === 'LISTING' ? Colors.white : Colors.textPrimary}
                            >
                                Listing
                            </NMText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'REQUESTS' && styles.activeTab]}
                            onPress={() => setActiveTab('REQUESTS')}
                        >
                            <NMText
                                fontSize={16}
                                fontFamily={activeTab === 'REQUESTS' ? 'semiBold' : 'regular'}
                                color={activeTab === 'REQUESTS' ? Colors.white : Colors.textPrimary}
                            >
                                Requests
                            </NMText>
                        </TouchableOpacity>
                    </View>

                    {activeTab === 'LISTING' ? (
                        <NMDropdown
                            placeholder="Select Status"
                            data={statusOptions}
                            value={status}
                            onChange={setStatus}
                        />
                    ) : (
                        <NMDropdown
                            placeholder="Select Status"
                            data={reqOption}
                            value={selectReq}
                            onChange={setSelectReq}
                        />
                    )}

                    {/* CONTENT */}
                    {activeTab === 'LISTING' ? <SellListing /> : null}
                    {activeTab === 'REQUESTS' ? <RequestListing /> : null}
                </View>
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
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
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
    sellContainer: {
        marginVertical: 10,
        marginHorizontal: '5%',
        backgroundColor: Colors.white,
        borderRadius: 8,
        padding: 14,
    },
    sellImage: {
        width: 85,
        height: 85,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    btnView: {
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statusView: {
        position: 'absolute',
        top: 14,
        right: 14,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
});

export default PropertyListingScreen;