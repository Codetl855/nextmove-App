import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Edit3Icon, Trash2Icon } from 'lucide-react-native';
import NMText from '../../../components/common/NMText';
import { Colors } from '../../../theme/colors';
import { AuctionBid } from './types';
import { formatDate } from './utils';

interface AuctionCardProps {
    bid: AuctionBid;
    editingBidId: number | null;
    bidAmount: string;
    onEdit: (bidId: number, currentAmount: number) => void;
    onDelete: (bidId: number) => void;
    onCancelEdit: () => void;
    onAcceptBid: (bidId: number) => void;
    onBidAmountChange: (amount: string) => void;
}

const AuctionCard: React.FC<AuctionCardProps> = ({
    bid,
    editingBidId,
    bidAmount,
    onEdit,
    onDelete,
    onCancelEdit,
    onAcceptBid,
    onBidAmountChange,
}) => {
    const propertyImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400';
    const isEditing = editingBidId === bid.id;

    return (
        <View style={styles.auctionCard}>
            <View style={styles.auctionCardTop}>
                <View style={styles.inRow}>
                    <Image source={{ uri: propertyImage }} style={styles.auctionPropertyImage} />
                    <View style={styles.auctionPropertyInfo}>
                        <NMText fontSize={18} fontFamily="semiBold" color={Colors.textPrimary}>
                            {bid.property.title}
                        </NMText>

                        <NMText
                            fontSize={14}
                            fontFamily="regular"
                            color={Colors.textSecondary}
                            style={styles.propertyDetail}
                        >
                            Type:{' '}
                            <NMText fontSize={14} fontFamily="semiBold" color={Colors.textSecondary}>
                                {bid.property.property_type}
                            </NMText>
                        </NMText>

                        <NMText
                            fontSize={14}
                            fontFamily="regular"
                            color={Colors.textSecondary}
                            style={styles.propertyDetail}
                        >
                            Location:{' '}
                            <NMText fontSize={14} fontFamily="semiBold" color={Colors.textSecondary}>
                                {bid.property.address}
                            </NMText>
                        </NMText>

                        <NMText fontSize={16} fontFamily="semiBold" color={Colors.primary} style={styles.price}>
                            {bid.property.price.toLocaleString()} SAR
                        </NMText>
                    </View>
                </View>

                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => onEdit(bid.id, bid.amount)}
                        disabled={editingBidId !== null}
                    >
                        <Edit3Icon color={Colors.primary} size={18} strokeWidth={2} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.editButton, styles.deleteButton]}
                        onPress={() => onDelete(bid.id)}
                    >
                        <Trash2Icon color={Colors.error} size={18} strokeWidth={2} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.auctionCardSection}>
                <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                    Bid Date
                </NMText>
                <NMText fontSize={14} fontFamily="semiBold" color={Colors.textPrimary}>
                    {formatDate(bid.created_at)}
                </NMText>
            </View>

            <View style={styles.divider} />

            <View style={styles.auctionCardSection}>
                <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                    Bid Amount
                </NMText>
                {isEditing ? (
                    <View style={styles.bidInputContainer}>
                        <TextInput
                            style={styles.bidInput}
                            placeholder="Enter amount"
                            placeholderTextColor={Colors.textLight}
                            value={bidAmount}
                            onChangeText={onBidAmountChange}
                            keyboardType="decimal-pad"
                            autoFocus
                        />
                        <TouchableOpacity
                            style={[styles.bidActionButton, styles.cancelButton]}
                            onPress={onCancelEdit}
                        >
                            <NMText fontSize={16} fontFamily="semiBold" color={Colors.white}>
                                ✕
                            </NMText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.bidActionButton, styles.acceptButton]}
                            onPress={() => onAcceptBid(bid.id)}
                        >
                            <NMText fontSize={16} fontFamily="semiBold" color={Colors.white}>
                                ✓
                            </NMText>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <NMText fontSize={14} fontFamily="semiBold" color={Colors.textPrimary}>
                        {bid.amount.toLocaleString()} SAR
                    </NMText>
                )}
            </View>

            <View style={styles.statusBadge}>
                <NMText fontSize={12} fontFamily="semiBold" color={Colors.primary}>
                    {bid.status.toUpperCase()}
                </NMText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    auctionCard: {
        marginVertical: 10,
        marginHorizontal: '5%',
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
    },
    auctionCardTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    auctionPropertyImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    auctionPropertyInfo: {
        flex: 1,
        marginLeft: 12,
    },
    propertyDetail: {
        marginTop: 4,
    },
    price: {
        marginTop: 4,
    },
    actionButtonsContainer: {
        flexDirection: 'column',
        gap: 8,
        position: 'absolute',
        left: -16,
        top: -14,
    },
    editButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: Colors.whitEC,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButton: {
        backgroundColor: '#FEE',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 12,
    },
    auctionCardSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bidInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    bidInput: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        fontFamily: 'Outfit-Regular',
        color: Colors.textPrimary,
        minWidth: 100,
        backgroundColor: Colors.white,
    },
    bidActionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.error,
    },
    acceptButton: {
        backgroundColor: Colors.statusText,
    },
    statusBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: Colors.whitEC,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
});

export default React.memo(AuctionCard);



