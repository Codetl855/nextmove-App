import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { X } from 'lucide-react-native';
import NMText from '../common/NMText';
import { Colors } from '../../theme/colors';
import NMTextInput from '../common/NMTextInput';
import NMButton from '../common/NMButton';
import { apiRequest } from '../../services/apiClient';
import { showErrorToast, showSuccessToast } from '../../utils/toastService';

interface PropertyAuctionModalProps {
    visible: boolean;
    onClose: () => void;
    propertyId: number;
}

const PropertyAuctionModal: React.FC<PropertyAuctionModalProps> = ({
    visible,
    onClose,
    propertyId,
}) => {
    const [bidAmount, setBidAmount] = useState('');
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (visible) {
            setBidAmount('');
            setError('');
        }
    }, [visible]);

    const handleSubmit = async () => {
        if (!bidAmount || bidAmount.trim() === '') {
            setError('Please enter a bid amount');
            showErrorToast('Please enter a bid amount');
            return;
        }

        const amount = parseFloat(bidAmount);
        if (isNaN(amount) || amount <= 0) {
            setError('Please enter a valid bid amount');
            showErrorToast('Please enter a valid bid amount');
            return;
        }

        try {
            setLoader(true);
            setError('');

            const { result, error: apiError } = await apiRequest({
                endpoint: 'v1/bids',
                method: 'POST',
                data: {
                    amount: amount,
                    property_id: propertyId,
                },
            });

            if (result) {
                console.log('Bid submitted successfully:', JSON.stringify(result));
                showSuccessToast('Bid placed successfully');
                setBidAmount('');
                onClose();
            }

            if (apiError) {
                console.log('Error:', apiError);
                const errorMsg = typeof apiError === 'string' ? apiError : apiError?.message || 'Failed to place bid';
                setError(errorMsg);
                showErrorToast(errorMsg);
            }
        } catch (err) {
            console.error('Unexpected Error:', err);
            const errorMsg = err?.message || String(err) || 'An unexpected error occurred';
            setError(errorMsg);
            showErrorToast(errorMsg);
        } finally {
            setLoader(false);
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
                        <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                            Auction
                        </NMText>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="#000" size={24} strokeWidth={2} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.contentContainer}>
                        <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary} style={styles.label}>
                            Bid Amount
                        </NMText>

                        <NMTextInput
                            placeholder="Enter bid amount"
                            value={bidAmount}
                            onChangeText={(text) => {
                                setBidAmount(text);
                                setError('');
                            }}
                            keyboardType="numeric"
                            mainViewStyle={styles.inputStyle}
                            error={error}
                        />

                        {error ? (
                            <NMText
                                fontSize={12}
                                fontFamily="regular"
                                color={Colors.error}
                                style={styles.errorText}
                            >
                                {error}
                            </NMText>
                        ) : null}

                        <NMButton
                            title="Submit"
                            fontFamily="semiBold"
                            width="100%"
                            borderRadius={8}
                            height={44}
                            backgroundColor={Colors.primary}
                            textColor={Colors.white}
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            loading={loader}
                        />
                    </View>
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
    },
    header: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 8,
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
    },
    closeButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: 8,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    label: {
        marginBottom: 8,
    },
    inputStyle: {
        marginVertical: 0,
    },
    submitButton: {
        marginTop: 20,
    },
    errorText: {
        marginTop: 4,
        marginBottom: 4,
    },
});

export default PropertyAuctionModal;
