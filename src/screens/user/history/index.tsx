import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import NMText from '../../../components/common/NMText';
import { Colors } from '../../../theme/colors';
import { apiRequest } from '../../../services/apiClient';
import { showErrorToast } from '../../../utils/toastService';
import LoaderModal from '../../../components/common/NMLoaderModal';

interface FunActivityBooking {
    fun_activity_id: number;
    fun_activity_title: string;
    fun_activity_location: string;
    fun_activity_price: string;
    fun_activity_category: string;
    fun_activity_created_at: string;
    booking_created_at: string;
    date: string;
    total_tickets: number;
    adults: number;
    children: number;
    status: string;
    user_email: string;
    user_mobile: string;
    primary_image: string;
}

interface HistoryCardProps {
    booking: FunActivityBooking;
    onPress: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ booking, onPress }) => {
    const statusLower = booking.status.toLowerCase();
    const isCancelled = statusLower === 'cancelled';
    const isPending = statusLower === 'pending' || statusLower === 'pending_payment';

    const getStatusStyles = () => {
        if (isCancelled) {
            return {
                backgroundColor: Colors.statusSoldBg,
                color: Colors.statusSoldText,
            };
        }
        if (isPending) {
            return {
                backgroundColor: Colors.statusPendingBg,
                color: Colors.statusPendingText,
            };
        }
        // Confirmed or other statuses
        return {
            backgroundColor: Colors.statusBg,
            color: Colors.statusText,
        };
    };

    const getStatusDisplayText = () => {
        if (isPending) {
            return 'Pending';
        }
        return booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
    };

    const statusStyles = getStatusStyles();

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    const formatPrice = (price: string) => {
        const numPrice = parseFloat(price);
        if (isNaN(numPrice)) return price;
        return `SAR ${numPrice.toFixed(2)}`;
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Image */}
            {booking.primary_image ? (
                <Image
                    source={{ uri: booking.primary_image }}
                    style={styles.cardImage}
                    resizeMode="cover"
                />
            ) : (
                <View style={[styles.cardImage, styles.placeholderImage]} />
            )}

            {/* Content */}
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <View style={styles.titleContainer}>
                        <NMText
                            fontSize={16}
                            fontFamily="semiBold"
                            color={Colors.textPrimary}
                            numberOfLines={2}
                            style={styles.title}
                        >
                            {booking.fun_activity_title}
                        </NMText>
                    </View>
                    <View
                        style={[
                            styles.statusBox,
                            { backgroundColor: statusStyles.backgroundColor },
                        ]}
                    >
                        <NMText fontSize={12} fontFamily="semiBold" color={statusStyles.color}>
                            {getStatusDisplayText()}
                        </NMText>
                    </View>
                </View>

                {/* Location */}
                <View style={styles.locationRow}>
                    <MapPin color={Colors.primary} size={14} strokeWidth={1.5} />
                    <NMText fontSize={13} fontFamily="regular" color={Colors.textLight} numberOfLines={1}>
                        {booking.fun_activity_location}
                    </NMText>
                </View>

                {/* Booking Details */}
                <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                        <NMText fontSize={13} fontFamily="regular" color={Colors.textLight}>
                            Booking Date:
                        </NMText>
                        <NMText fontSize={13} fontFamily="semiBold" color={Colors.textPrimary}>
                            {formatDate(booking.date)}
                        </NMText>
                    </View>
                </View>

                {/* Tickets Info */}
                <View style={styles.ticketsRow}>
                    <View style={styles.ticketInfo}>
                        <NMText fontSize={13} fontFamily="regular" color={Colors.textLight}>
                            Total Tickets:
                        </NMText>
                        <NMText fontSize={13} fontFamily="semiBold" color={Colors.primary}>
                            {booking.total_tickets}
                        </NMText>
                    </View>
                    {booking.adults > 0 && (
                        <View style={styles.ticketInfo}>
                            <NMText fontSize={13} fontFamily="regular" color={Colors.textLight}>
                                Adults:
                            </NMText>
                            <NMText fontSize={13} fontFamily="semiBold" color={Colors.textPrimary}>
                                {booking.adults}
                            </NMText>
                        </View>
                    )}
                    {booking.children > 0 && (
                        <View style={styles.ticketInfo}>
                            <NMText fontSize={13} fontFamily="regular" color={Colors.textLight}>
                                Children:
                            </NMText>
                            <NMText fontSize={13} fontFamily="semiBold" color={Colors.textPrimary}>
                                {booking.children}
                            </NMText>
                        </View>
                    )}
                </View>

                {/* Price */}
                <View style={styles.priceRow}>
                    <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                        Price:
                    </NMText>
                    <NMText fontSize={16} fontFamily="semiBold" color={Colors.primary}>
                        {formatPrice(booking.fun_activity_price)}
                    </NMText>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const HistoryScreen: React.FC = () => {
    const navigation = useNavigation();
    const [bookings, setBookings] = useState<FunActivityBooking[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const { result, error } = await apiRequest<{
                message: string;
                data: {
                    data: FunActivityBooking[];
                };
            }>({
                endpoint: 'v1/fun-activity-bookings',
                method: 'GET',
            });

            if (error) {
                showErrorToast(error);
                setBookings([]);
                return;
            }

            if (result?.data?.data) {
                setBookings(result.data.data);
            } else {
                setBookings([]);
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
            showErrorToast('Failed to load bookings. Please try again.');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCardPress = (booking: FunActivityBooking) => {
        navigation.navigate('FunActivityDetail' as never, { activityId: booking.fun_activity_id } as never);
    };

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <LoaderModal visible={loading} />
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
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

                {bookings.length === 0 && !loading ? (
                    <View style={styles.emptyContainer}>
                        <NMText fontSize={16} fontFamily="regular" color={Colors.textLight}>
                            No bookings found
                        </NMText>
                    </View>
                ) : (
                    bookings.map((booking, index) => (
                        <HistoryCard
                            key={`${booking.fun_activity_id}-${index}`}
                            booking={booking}
                            onPress={() => handleCardPress(booking)}
                        />
                    ))
                )}
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
    card: {
        marginHorizontal: '5%',
        backgroundColor: Colors.white,
        marginVertical: 8,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        height: 180,
        backgroundColor: Colors.borderLight,
    },
    placeholderImage: {
        backgroundColor: Colors.borderLight,
    },
    cardContent: {
        padding: 14,
        gap: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    titleContainer: {
        flex: 1,
        marginRight: 10,
    },
    title: {
        lineHeight: 22,
    },
    statusBox: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        minWidth: 80,
        alignItems: 'center',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    detailsRow: {
        marginTop: 4,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    ticketsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginTop: 4,
        flexWrap: 'wrap',
    },
    ticketInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
});
