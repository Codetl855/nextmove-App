import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import { Colors } from '../../../theme/colors';
import NMText from '../../../components/common/NMText';
import NMButton from '../../../components/common/NMButton';
import NMDropdown from '../../../components/common/NMDropdown';
import { useNavigation } from '@react-navigation/native';
import { apiRequest } from '../../../services/apiClient';
import { showErrorToast } from '../../../utils/toastService';
import BidListModal from '../../../components/user/BidListModal';
import LoaderModal from '../../../components/common/NMLoaderModal';
import { ChevronLeft } from 'lucide-react-native';

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

interface BookingRequest {
    booking_id: number;
    property_id: number;
    property_title: string;
    property_address: string;
    property_price: string;
    property_type: string;
    property_created_at: string;
    booking_created_at: string;
    check_in: string;
    check_out: string;
    guests: number;
    duration_days: number;
    status: string;
    user_name: string;
    user_first_name: string;
    user_last_name: string;
    user_email: string;
    user_mobile: string;
    primary_image: string;
}

interface BidRequest {
    property_id: number;
    property_identifier: string;
    property_title: string;
    property_address: string;
    property_price: number;
    property_type: string;
    property_category: string;
    city: string;
    state: string;
    location: string;
    primary_image: string;
    bid_count: number;
    property_created_at: string;
}

const PropertyListingScreen: React.FC = () => {
    const navigation = useNavigation();
    const drawerNavigation = navigation.getParent('drawer') || navigation.getParent();
    const [activeTab, setActiveTab] = useState<TabType>('LISTING');
    const [status, setStatus] = useState('Sell');
    const [selectReq, setSelectReq] = useState('Booking');
    const [properties, setProperties] = useState<Property[]>([]);
    const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
    const [bidRequests, setBidRequests] = useState<BidRequest[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [bidModalVisible, setBidModalVisible] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

    const statusOptions = [
        { label: 'Sell', value: 'Sell' },
        { label: 'Rent', value: 'Rent' },
        { label: 'Stay', value: 'Stay' },
    ];

    const reqOption = [
        { label: 'Booking', value: 'Booking' },
        { label: 'Auction', value: 'Auction' },
    ]


    const getProperties = async () => {
        try {
            setLoadingRequests(true);
            const { result, error } = await apiRequest({
                endpoint: 'v1/properties',
                method: 'GET',
            });

            if (result) {
                console.log("Properties List:", JSON.stringify(result.data));
                setProperties(result.data);
            }

            if (error) {
                console.log("Error:", error);
                showErrorToast(`Get Properties Error: ${error}`);
            }

        } catch (err) {
            console.error("Unexpected Error:", err);
            showErrorToast(`Unexpected Error: ${err}`);
        } finally {
            setLoadingRequests(false);
        }
    };

    useEffect(() => {
        getProperties();
    }, []);

    useEffect(() => {
        if (activeTab === 'REQUESTS') {
            if (selectReq === 'Booking') {
                fetchBookingRequests();
            } else {
                fetchBidRequests();
            }
        }
    }, [activeTab, selectReq]);

    const fetchBookingRequests = async () => {
        try {
            setLoadingRequests(true);
            const { result, error } = await apiRequest({
                endpoint: 'v1/booking-requests',
                method: 'GET',
            });

            if (result) {
                setBookingRequests(result.data.data || result || []);
            }

            if (error) {
                showErrorToast(`Error fetching booking requests: ${error}`);
            }
        } catch (err) {
            console.error('Error fetching booking requests:', err);
            showErrorToast('Failed to fetch booking requests');
        } finally {
            setLoadingRequests(false);
        }
    };

    const fetchBidRequests = async () => {
        try {
            setLoadingRequests(true);
            const { result, error } = await apiRequest({
                endpoint: 'v1/bid-requests',
                method: 'GET',
            });

            if (result) {
                setBidRequests(result.data.data || result || []);
            }

            if (error) {
                showErrorToast(`Error fetching bid requests: ${error}`);
            }
        } catch (err) {
            console.error('Error fetching bid requests:', err);
            showErrorToast('Failed to fetch bid requests');
        } finally {
            setLoadingRequests(false);
        }
    };

    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString;
            }
            return date.toLocaleDateString('en-GB');
        } catch (error) {
            return dateString;
        }
    };


    const SellListing = () => (
        <View>
            {properties?.data?.map((property) => (
                <TouchableOpacity key={property.id} style={styles.sellContainer} activeOpacity={.8} onPress={() => navigation.navigate('AddProperties' as never, { property: property } as never)}>
                    <View style={styles.inRow}>
                        <Image source={{ uri: property?.media[0]?.media_url }} style={styles.sellImage} />
                        <View style={{ marginLeft: 12, width: '52%' }}>
                            <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary} numberOfLines={1} ellipsizeMode="tail">
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
                                    {property.property_type}
                                </NMText>
                            </NMText>

                            <NMText fontSize={14} fontFamily="regular" color={Colors.textSecondary}>
                                Date:{' '}
                                <NMText fontSize={14} fontFamily="semiBold" color={Colors.textSecondary}>
                                    {new Date(property.created_at).toLocaleDateString("en-GB")}
                                </NMText>
                            </NMText>

                            <NMText fontSize={16} fontFamily="semiBold" color={Colors.primary} style={{ marginTop: 4 }}>
                                SAR {property.price}
                            </NMText>
                        </View>
                    </View>

                    <View
                        style={[
                            styles.statusView,
                            {
                                backgroundColor:
                                    property.is_active
                                        ? Colors.statusBg
                                        : property.is_active == 2
                                            ? Colors.statusSoldBg
                                            : Colors.statusPendingBg,
                            },
                        ]}
                    >
                        <NMText
                            fontSize={12}
                            fontFamily="regular"
                            color={
                                property.is_active
                                    ? Colors.statusText
                                    : property.is_active == 2
                                        ? Colors.statusSoldText
                                        : Colors.statusPendingText
                            }
                        >
                            {property.is_active ? 'Active' : property.is_active == 2 ? 'Sold' : 'Deactive'}
                        </NMText>
                    </View>

                    <View style={styles.btnView}>
                        {property.is_active && (
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
                        {(property.is_active == 0 || property.is_active == 2) && (
                            <NMButton
                                title="Active"
                                textColor={Colors.statusText}
                                backgroundColor={Colors.white}
                                borderRadius={8}
                                width={property.is_active == 2 || status != 'Sell' ? '46%' : '32%'}
                                height={40}
                                style={{ borderWidth: 1, borderColor: Colors.statusText }}
                            />
                        )}
                        {(property.is_active != 2 && status === 'Sell') && (
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
                            width={property.is_active == 2 || status != 'Sell' ? '46%' : '32%'}
                            height={40}
                            style={{ borderWidth: 1, borderColor: Colors.primary }}
                            onPress={() => navigation.navigate('AddProperties' as never, { property: property } as never)}
                        />
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );

    const RequestListing = () => {
        if (loadingRequests) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            );
        }

        if (selectReq === 'Booking') {
            if (bookingRequests.length === 0) {
                return (
                    <View style={styles.emptyContainer}>
                        <NMText fontSize={16} fontFamily="regular" color={Colors.textSecondary}>
                            No booking requests found
                        </NMText>
                    </View>
                );
            }

            return (
                <View>
                    {bookingRequests.map((booking) => (
                        <TouchableOpacity
                            key={booking.booking_id}
                            style={styles.sellContainer}
                            onPress={() => navigation.navigate('RequestBookingDetail' as never, { booking } as never)}
                        >
                            <View style={styles.inRow}>
                                <Image
                                    source={{ uri: booking.primary_image }}
                                    style={styles.sellImage}
                                />
                                <View style={{ marginLeft: 12, flex: 1 }}>
                                    <NMText
                                        fontSize={16}
                                        fontFamily="semiBold"
                                        color={Colors.textPrimary}
                                        numberOfLines={1}
                                    >
                                        {booking.property_title}
                                    </NMText>

                                    <NMText
                                        fontSize={14}
                                        fontFamily="regular"
                                        color={Colors.textSecondary}
                                        style={{ marginVertical: 4 }}
                                    >
                                        Type:{' '}
                                        <NMText fontSize={14} fontFamily="semiBold" color={Colors.textSecondary}>
                                            {booking.property_type}
                                        </NMText>
                                    </NMText>

                                    <NMText fontSize={14} fontFamily="regular" color={Colors.textSecondary}>
                                        Date:{' '}
                                        <NMText fontSize={14} fontFamily="semiBold" color={Colors.textSecondary}>
                                            {formatDate(booking.booking_created_at)}
                                            {/* {formatDate(booking.check_in)} - {formatDate(booking.check_out)} */}
                                        </NMText>
                                    </NMText>

                                    <NMText fontSize={16} fontFamily="semiBold" color={Colors.primary} style={{ marginTop: 4 }}>
                                        SAR {booking.property_price}
                                    </NMText>
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.statusView,
                                    {
                                        top: '50%',
                                        backgroundColor:
                                            booking.status === 'confirmed'
                                                ? Colors.statusBg
                                                : booking.status === 'cancelled'
                                                    ? Colors.statusSoldBg
                                                    : Colors.statusPendingBg,
                                    },
                                ]}
                            >
                                <NMText
                                    fontSize={12}
                                    fontFamily="regular"
                                    color={
                                        booking.status === 'confirmed'
                                            ? Colors.statusText
                                            : booking.status === 'cancelled'
                                                ? Colors.statusSoldText
                                                : Colors.statusPendingText
                                    }
                                >
                                    {(() => {
                                        const status = booking.status || '';
                                        const displayStatus = status.includes('_')
                                            ? status.split('_')[0]
                                            : status;

                                        return (
                                            displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)
                                        );
                                    })()}
                                </NMText>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        } else {
            if (bidRequests.length === 0) {
                return (
                    <View style={styles.emptyContainer}>
                        <NMText fontSize={16} fontFamily="regular" color={Colors.textSecondary}>
                            No bid requests found
                        </NMText>
                    </View>
                );
            }

            return (
                <View>
                    {bidRequests.map((bid) => (
                        <TouchableOpacity
                            key={bid.property_id}
                            style={styles.sellContainer}
                            onPress={() => {
                                setSelectedPropertyId(bid.property_id);
                                setBidModalVisible(true);
                            }}
                        >
                            <View style={styles.inRow}>
                                <Image
                                    source={{ uri: bid.primary_image }}
                                    style={styles.sellImage}
                                />
                                <View style={{ marginLeft: 12, flex: 1 }}>
                                    <NMText
                                        fontSize={16}
                                        fontFamily="semiBold"
                                        color={Colors.textPrimary}
                                        numberOfLines={1}
                                    >
                                        {bid.property_title}
                                    </NMText>

                                    <NMText
                                        fontSize={14}
                                        fontFamily="regular"
                                        color={Colors.textSecondary}
                                        style={{ marginVertical: 4 }}
                                    >
                                        Type:{' '}
                                        <NMText fontSize={14} fontFamily="semiBold" color={Colors.textSecondary}>
                                            {bid.property_type}
                                        </NMText>
                                    </NMText>

                                    <NMText fontSize={14} fontFamily="regular" color={Colors.textSecondary}>
                                        Location:{' '}
                                        <NMText fontSize={14} fontFamily="semiBold" color={Colors.textSecondary}>
                                            {bid.location}
                                        </NMText>
                                    </NMText>

                                    <NMText fontSize={16} fontFamily="semiBold" color={Colors.primary} style={{ marginTop: 4 }}>
                                        SAR {bid.property_price.toFixed(2)}
                                    </NMText>
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.statusView,
                                    {
                                        top: '50%',
                                        backgroundColor: Colors.background,
                                    },
                                ]}
                            >
                                <NMText fontSize={12} fontFamily="regular" color={Colors.primary}>
                                    {bid.bid_count} {bid.bid_count === 1 ? 'Bid' : 'Bids'}
                                </NMText>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        }
    };

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={styles.container}>
                    {/* HEADER */}
                    <View style={styles.headerView}>
                        <View style={styles.inRow}>
                            <TouchableOpacity style={styles.backBox} onPress={() => navigation.goBack()}>
                                <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                            </TouchableOpacity>
                            <View style={styles.titleView}>
                                <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                                    Property listing
                                </NMText>
                            </View>
                        </View>
                        {/* <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} /> */}
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

            <BidListModal
                visible={bidModalVisible}
                onClose={() => {
                    setBidModalVisible(false);
                    setSelectedPropertyId(null);
                }}
                propertyId={selectedPropertyId}
                onBidUpdate={fetchBidRequests}
            />
            <LoaderModal visible={loadingRequests} />
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
        backgroundColor: Colors.border,
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
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default PropertyListingScreen;