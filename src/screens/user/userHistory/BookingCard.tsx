import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NMText from '../../../components/common/NMText';
import { Colors } from '../../../theme/colors';
import { BookingData } from './types';
import { formatDate, getStatusColors, formatStatus } from './utils';

interface BookingCardProps {
    booking: BookingData;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
    const navigation = useNavigation();
    const propertyImage = booking.primary_image || 
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400';
    
    const statusColors = getStatusColors(booking.status);
    const price = parseFloat(booking.property_price || '0');

    return (
        <TouchableOpacity
            style={styles.propertyCard}
            onPress={() => navigation.navigate('BookingRequestStatusDetail' as never)}
        >
            <View style={styles.inRow}>
                <Image source={{ uri: propertyImage }} style={styles.propertyImage} />
                <View style={styles.propertyInfo}>
                    <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                        {booking.property_title}
                    </NMText>

                    <NMText
                        fontSize={14}
                        fontFamily="regular"
                        color={Colors.textSecondary}
                        style={styles.propertyDetail}
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
                        </NMText>
                    </NMText>

                    <NMText fontSize={16} fontFamily="semiBold" color={Colors.primary} style={styles.price}>
                        {price.toLocaleString()} SAR
                    </NMText>
                </View>
            </View>

            <View style={[styles.statusView, { backgroundColor: statusColors.bg }]}>
                <NMText fontSize={12} fontFamily="regular" color={statusColors.text}>
                    {formatStatus(booking.status)}
                </NMText>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    propertyCard: {
        marginVertical: 10,
        marginHorizontal: '5%',
        backgroundColor: Colors.white,
        borderRadius: 8,
        padding: 14,
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    propertyImage: {
        width: 85,
        height: 85,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    propertyInfo: {
        marginLeft: 12,
        flex: 1,
    },
    propertyDetail: {
        marginVertical: 4,
    },
    price: {
        marginTop: 4,
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

export default React.memo(BookingCard);

