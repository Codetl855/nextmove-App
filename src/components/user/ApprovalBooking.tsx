import React, { useState } from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { X } from 'lucide-react-native';
import NMText from '../common/NMText';
import { Colors } from '../../theme/colors';
import NMButton from '../common/NMButton';
import { apiRequest } from '../../services/apiClient';
import { showSuccessToast, showErrorToast } from '../../utils/toastService';

interface ApprovalBookingProps {
    visible: boolean;
    onClose: () => void;
    propertyId: number;
    checkIn?: string;
    checkOut?: string;
    guest?: string;
    onSuccess?: () => void;
}

const ApprovalBooking: React.FC<ApprovalBookingProps> = ({
    visible,
    onClose,
    propertyId,
    checkIn,
    checkOut,
    guest,
    onSuccess,
}) => {
    const [loader, setLoader] = useState(false);

    const handleConfirm = async () => {
        try {
            setLoader(true);
            const bodyData: any = {};

            if (checkIn) bodyData.check_in = checkIn;
            if (checkOut) bodyData.check_out = checkOut;
            if (guest) bodyData.guests = guest;

            const { result, error } = await apiRequest({
                endpoint: `v1/send-booking-request/${propertyId}`,
                method: 'POST',
                data: bodyData,
            });

            if (error) {
                showErrorToast(error);
                setLoader(false);
                return;
            }

            if (result) {
                console.log('res', result);

                showSuccessToast('Booking request sent successfully!');
                setLoader(false);
                onClose();
                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (err: any) {
            console.error('Error creating booking request:', err);
            const errorMsg = err?.message || 'Failed to send booking request';
            showErrorToast(errorMsg);
            setLoader(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                            Confirm Booking Request
                        </NMText>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="#000" size={24} strokeWidth={2} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                            Are you sure you want to send a booking request for this property? The property owner will review your request and respond accordingly.
                        </NMText>
                    </View>

                    <View style={styles.buttonContainer}>
                        <NMButton
                            title="Cancel"
                            fontFamily="semiBold"
                            width="48%"
                            borderRadius={8}
                            backgroundColor={Colors.background}
                            textColor={Colors.textPrimary}
                            onPress={onClose}
                            disabled={loader}
                        />
                        <NMButton
                            title="OK"
                            fontFamily="semiBold"
                            width="48%"
                            borderRadius={8}
                            onPress={handleConfirm}
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        width: '90%',
        maxWidth: 400,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    closeButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: 8,
    },
    content: {
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
});

export default ApprovalBooking;

