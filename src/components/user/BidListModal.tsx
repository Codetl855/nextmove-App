import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    ActivityIndicator,
} from 'react-native';
import { X } from 'lucide-react-native';
import NMText from '../common/NMText';
import { Colors } from '../../theme/colors';
import NMButton from '../common/NMButton';
import { apiRequest } from '../../services/apiClient';
import { showErrorToast, showSuccessToast } from '../../utils/toastService';

interface BidItem {
    bid_id: number;
    property_id: number;
    property_title: string;
    property_address: string;
    property_price: number;
    property_type: string;
    property_created_at: string;
    bid_created_at: string;
    bid_amount: number;
    status: string;
    user_name: string;
    user_first_name: string;
    user_last_name: string;
    user_email: string;
    user_mobile: string;
    primary_image: string;
}

interface BidListModalProps {
    visible: boolean;
    onClose: () => void;
    propertyId: number | null;
    onBidUpdate?: () => void;
}

const BidListModal: React.FC<BidListModalProps> = ({
    visible,
    onClose,
    propertyId,
    onBidUpdate,
}) => {
    const [bids, setBids] = useState<BidItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [processingBidId, setProcessingBidId] = useState<number | null>(null);

    useEffect(() => {
        if (visible && propertyId) {
            fetchBids();
        } else {
            setBids([]);
        }
    }, [visible, propertyId]);

    const fetchBids = async () => {
        if (!propertyId) return;

        try {
            setLoading(true);
            const { result, error } = await apiRequest({
                endpoint: `v1/properties/${propertyId}/bids`,
                method: 'GET',
            });

            if (result) {
                setBids(result.data.data || result || []);
            }

            if (error) {
                showErrorToast(`Error fetching bids: ${error}`);
            }
        } catch (err) {
            console.error('Error fetching bids:', err);
            showErrorToast('Failed to fetch bids');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (bidId: number) => {
        try {
            setProcessingBidId(bidId);
            const { result, error } = await apiRequest({
                endpoint: `v1/bids/${bidId}/approve`,
                method: 'POST',
            });

            if (result) {
                showSuccessToast('Bid approved successfully');
                fetchBids();
                onBidUpdate?.();
            }

            if (error) {
                showErrorToast(`Error approving bid: ${error}`);
            }
        } catch (err) {
            console.error('Error approving bid:', err);
            showErrorToast('Failed to approve bid');
        } finally {
            setProcessingBidId(null);
        }
    };

    const handleCancel = async (bidId: number) => {
        try {
            setProcessingBidId(bidId);
            // TODO: Replace with actual cancel endpoint when available
            const { result, error } = await apiRequest({
                endpoint: `v1/bids/${bidId}/cancel`,
                method: 'POST',
            });

            if (result) {
                showSuccessToast('Bid cancelled successfully');
                fetchBids();
                onBidUpdate?.();
            }

            if (error) {
                showErrorToast(`Error cancelling bid: ${error}`);
            }
        } catch (err) {
            console.error('Error cancelling bid:', err);
            showErrorToast('Failed to cancel bid');
        } finally {
            setProcessingBidId(null);
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

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <View style={styles.dragIndicator} />
                    </View>

                    <View style={styles.titleRow}>
                        <View style={styles.titleContainer}>
                            <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                                Bidders List
                            </NMText>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="#000" size={24} strokeWidth={2} />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                        </View>
                    ) : (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {bids.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <NMText fontSize={16} fontFamily="regular" color={Colors.textSecondary}>
                                        No bids found
                                    </NMText>
                                </View>
                            ) : (
                                bids.map((bid) => (
                                    <View key={bid.bid_id} style={styles.bidCard}>
                                        <View style={styles.bidHeader}>
                                            <Image
                                                source={{ uri: bid.primary_image }}
                                                style={styles.bidImage}
                                            />
                                            <View style={styles.bidInfo}>
                                                <NMText
                                                    fontSize={16}
                                                    fontFamily="semiBold"
                                                    color={Colors.textPrimary}
                                                    numberOfLines={1}
                                                >
                                                    {bid.user_name}
                                                </NMText>
                                                <NMText
                                                    fontSize={14}
                                                    fontFamily="regular"
                                                    color={Colors.textSecondary}
                                                    style={{ marginTop: 4 }}
                                                >
                                                    {bid.user_email}
                                                </NMText>
                                                <NMText
                                                    fontSize={14}
                                                    fontFamily="regular"
                                                    color={Colors.textSecondary}
                                                    style={{ marginTop: 2 }}
                                                >
                                                    {bid.user_mobile}
                                                </NMText>
                                            </View>
                                        </View>

                                        <View style={styles.bidDetails}>
                                            <View style={styles.detailRow}>
                                                <NMText fontSize={14} fontFamily="regular" color={Colors.textSecondary}>
                                                    Bid Amount:
                                                </NMText>
                                                <NMText fontSize={16} fontFamily="semiBold" color={Colors.primary}>
                                                    SAR {bid.bid_amount.toFixed(2)}
                                                </NMText>
                                            </View>
                                            <View style={styles.detailRow}>
                                                <NMText fontSize={14} fontFamily="regular" color={Colors.textSecondary}>
                                                    Bid Date:
                                                </NMText>
                                                <NMText fontSize={14} fontFamily="semiBold" color={Colors.textPrimary}>
                                                    {formatDate(bid.bid_created_at)}
                                                </NMText>
                                            </View>
                                            <View style={styles.detailRow}>
                                                <NMText fontSize={14} fontFamily="regular" color={Colors.textSecondary}>
                                                    Status:
                                                </NMText>
                                                <View
                                                    style={[
                                                        styles.statusBadge,
                                                        {
                                                            backgroundColor:
                                                                bid.status === 'active'
                                                                    ? Colors.statusBg
                                                                    : Colors.statusPendingBg,
                                                        },
                                                    ]}
                                                >
                                                    <NMText
                                                        fontSize={12}
                                                        fontFamily="regular"
                                                        color={
                                                            bid.status === 'active'
                                                                ? Colors.statusText
                                                                : Colors.statusPendingText
                                                        }
                                                    >
                                                        {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                                                    </NMText>
                                                </View>
                                            </View>
                                        </View>

                                        {bid.status !== 'approved' && (<View style={styles.actionButtons}>
                                            <NMButton
                                                title="Cancel"
                                                backgroundColor={Colors.white}
                                                textColor={Colors.error}
                                                fontSize={14}
                                                fontFamily="semiBold"
                                                borderRadius={8}
                                                height={40}
                                                width="48%"
                                                style={{ borderColor: Colors.error, borderWidth: 1 }}
                                                onPress={() => handleCancel(bid.bid_id)}
                                                loading={processingBidId === bid.bid_id}
                                                disabled={processingBidId !== null}
                                            />
                                            <NMButton
                                                title="Approve"
                                                textColor={Colors.white}
                                                fontSize={14}
                                                fontFamily="semiBold"
                                                borderRadius={8}
                                                height={40}
                                                width="48%"
                                                onPress={() => handleApprove(bid.bid_id)}
                                                loading={processingBidId === bid.bid_id}
                                                disabled={processingBidId !== null}
                                            />
                                        </View>)}
                                    </View>
                                ))
                            )}
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 20,
        maxHeight: '90%',
    },
    header: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 6,
    },
    dragIndicator: {
        width: 40,
        height: 4,
        backgroundColor: Colors.background,
        borderRadius: 2,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    closeButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: 20,
        paddingTop: 10,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bidCard: {
        backgroundColor: Colors.background,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
    },
    bidHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    bidImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    bidInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    bidDetails: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        gap: 10,
    },
});

export default BidListModal;



