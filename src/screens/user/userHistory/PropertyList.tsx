import React from 'react';
import { View, StyleSheet } from 'react-native';
import NMText from '../../../components/common/NMText';
import { Colors } from '../../../theme/colors';
import LoaderModal from '../../../components/common/NMLoaderModal';
import { TabType, BookingData, AuctionBid } from './types';
import BookingCard from './BookingCard';
import AuctionCard from './AuctionCard';

interface PropertyListProps {
    activeTab: TabType;
    loading: boolean;
    bookingData: BookingData[];
    auctionData: AuctionBid[];
    editingBidId: number | null;
    bidAmount: string;
    onEditBid: (bidId: number, currentAmount: number) => void;
    onDeleteBid: (bidId: number) => void;
    onCancelEdit: () => void;
    onAcceptBid: (bidId: number) => void;
    onBidAmountChange: (amount: string) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({
    activeTab,
    loading,
    bookingData,
    auctionData,
    editingBidId,
    bidAmount,
    onEditBid,
    onDeleteBid,
    onCancelEdit,
    onAcceptBid,
    onBidAmountChange,
}) => {
    if (loading) {
        return <LoaderModal visible={loading} />;
    }

    if (activeTab === 'Auction') {
        if (!auctionData || !Array.isArray(auctionData) || auctionData.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <NMText fontSize={16} fontFamily="regular" color={Colors.textSecondary}>
                        No auction bids found
                    </NMText>
                </View>
            );
        }

        return (
            <View>
                {auctionData.map(bid => (
                    <AuctionCard
                        key={bid.id}
                        bid={bid}
                        editingBidId={editingBidId}
                        bidAmount={bidAmount}
                        onEdit={onEditBid}
                        onDelete={onDeleteBid}
                        onCancelEdit={onCancelEdit}
                        onAcceptBid={onAcceptBid}
                        onBidAmountChange={onBidAmountChange}
                    />
                ))}
            </View>
        );
    }

    // Booking Tab
    if (!bookingData || !Array.isArray(bookingData) || bookingData.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <NMText fontSize={16} fontFamily="regular" color={Colors.textSecondary}>
                    No bookings found
                </NMText>
            </View>
        );
    }

    return (
        <View>
            {bookingData.map((booking, index) => (
                <BookingCard
                    key={`${booking.property_id}-${booking.booking_created_at}-${index}`}
                    booking={booking}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
});

export default React.memo(PropertyList);

