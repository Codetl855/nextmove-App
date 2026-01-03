import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import { Colors } from '../../../theme/colors';
import { apiRequest } from '../../../services/apiClient';
import { showErrorToast, showSuccessToast } from '../../../utils/toastService';
import ConfirmationModal from '../../../components/user/ConfirmationModal';
import { TabType, BookingData, AuctionBid } from './types';
import Header from './Header';
import Tabs from './Tabs';
import PropertyList from './PropertyList';

const UserHistoryScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('Booking');
    const [editingBidId, setEditingBidId] = useState<number | null>(null);
    const [bidAmount, setBidAmount] = useState<string>('');
    const [auctionData, setAuctionData] = useState<AuctionBid[]>([]);
    const [bookingData, setBookingData] = useState<BookingData[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedBidId, setSelectedBidId] = useState<number | null>(null);

    useEffect(() => {
        if (activeTab === 'Auction') {
            getAuction();
        } else if (activeTab === 'Booking') {
            getBookings();
        }
    }, [activeTab]);

    const getBookings = async () => {
        try {
            setLoading(true);
            const { result, error } = await apiRequest({
                endpoint: 'v1/bookings/properties',
                method: 'GET',
            });

            if (result) {
                console.log('res==>', result);

                setBookingData(result.data.data);
            } else {
                setBookingData([]);
            }

            if (error) {
                showErrorToast(`Get Bookings Error: ${error}`);
            }
        } catch (err) {
            showErrorToast(`Unexpected Error: ${err}`);
            setBookingData([]);
        } finally {
            setLoading(false);
        }
    };

    const getAuction = async () => {
        try {
            setLoading(true);
            const { result, error } = await apiRequest({
                endpoint: 'v1/bids',
                method: 'GET',
            });

            if (result) {
                // Handle different API response structures
                const data = Array.isArray(result) ? result : (result.data || result.bids || []);
                setAuctionData(Array.isArray(data) ? data : []);
            } else {
                setAuctionData([]);
            }

            if (error) {
                showErrorToast(`Get Auction Error: ${error}`);
            }
        } catch (err) {
            showErrorToast(`Unexpected Error: ${err}`);
            setAuctionData([]);
        } finally {
            setLoading(false);
        }
    };

    const updateBid = useCallback(async (bidId: number, newAmount: string) => {
        const payload = {
            amount: Number(newAmount),
        };

        try {
            const { result, error } = await apiRequest({
                endpoint: `v1/bids/${bidId}`,
                method: 'PUT',
                data: payload,
            });

            if (result) {
                showSuccessToast('Bid updated successfully');
                getAuction();
                setEditingBidId(null);
                setBidAmount('');
            }

            if (error) {
                showErrorToast(`Update Error: ${error}`);
            }
        } catch (err) {
            showErrorToast(`Update Error: ${err}`);
        }
    }, []);

    const openDeleteModal = useCallback((bidId: number) => {
        setSelectedBidId(bidId);
        setDeleteModalVisible(true);
    }, []);

    const closeDeleteModal = useCallback(() => {
        setDeleteModalVisible(false);
        setSelectedBidId(null);
    }, []);

    const confirmDeleteBid = useCallback(async () => {
        if (!selectedBidId) return;

        try {
            const { result, error } = await apiRequest({
                endpoint: `v1/bids/${selectedBidId}`,
                method: 'DELETE',
            });

            if (result) {
                showSuccessToast('Bid deleted successfully');
                getAuction();
            }

            if (error) {
                showErrorToast(`Delete Error: ${error}`);
            }
        } catch (err) {
            showErrorToast(`Delete Error: ${err}`);
        } finally {
            closeDeleteModal();
        }
    }, [selectedBidId, closeDeleteModal]);

    const handleEditBid = useCallback((bidId: number, currentAmount: number) => {
        setEditingBidId(bidId);
        setBidAmount(currentAmount.toString());
    }, []);

    const handleCancelEdit = useCallback(() => {
        setEditingBidId(null);
        setBidAmount('');
    }, []);

    const handleAcceptBid = useCallback((bidId: number) => {
        if (!bidAmount || parseFloat(bidAmount) <= 0) {
            showErrorToast('Please enter a valid bid amount');
            return;
        }

        updateBid(bidId, bidAmount);
    }, [bidAmount, updateBid]);

    const handleBidAmountChange = useCallback((amount: string) => {
        setBidAmount(amount);
    }, []);

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                <Header />
                <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
                <PropertyList
                    activeTab={activeTab}
                    loading={loading}
                    bookingData={bookingData}
                    auctionData={auctionData}
                    editingBidId={editingBidId}
                    bidAmount={bidAmount}
                    onEditBid={handleEditBid}
                    onDeleteBid={openDeleteModal}
                    onCancelEdit={handleCancelEdit}
                    onAcceptBid={handleAcceptBid}
                    onBidAmountChange={handleBidAmountChange}
                />
            </ScrollView>

            <ConfirmationModal
                visible={deleteModalVisible}
                onClose={closeDeleteModal}
                onConfirm={confirmDeleteBid}
                title="Delete Bid"
                message="Are you sure you want to delete this bid? This action cannot be undone."
                buttonName="Delete"
            />
        </NMSafeAreaWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
});

export default UserHistoryScreen;
