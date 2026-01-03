import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { X, Calendar, ChevronDown, SquareCheckIcon } from 'lucide-react-native';
import NMText from '../common/NMText';
import { Colors } from '../../theme/colors';
import NMTextInput from '../common/NMTextInput';
import NMButton from '../common/NMButton';
import { useNavigation } from '@react-navigation/native';
import NMDatePicker from '../common/NMDatePicker';
import { useForm } from '../../hooks/useForm';
import NMDropdown from '../common/NMDropdown';
import { showErrorToast } from '../../utils/toastService';
import { apiRequest } from '../../services/apiClient';
import ApprovalBooking from './ApprovalBooking';
import PropertyAvailabilityModal from './PropertyAvailabilityModal';

interface BookKnowModalProps {
    propertyDetails: any;
    visible: boolean;
    onClose: () => void;
}

const BookKnowModal: React.FC<BookKnowModalProps> = ({
    propertyDetails,
    visible,
    onClose,
}) => {
    const navigation = useNavigation();
    const [loader, setLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
    const [availabilityData, setAvailabilityData] = useState<any>(null);

    const guestData = [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
    ];

    const { values, errors, handleChange, validate, setValues } = useForm({
        checkIn: '',
        checkOut: '',
        guest: '',
    });

    const handleNavigate = async () => {
        // Clear previous error
        setErrorMessage('');

        if (!values.checkIn || !values.checkOut || !values.guest) {
            showErrorToast('Please fill all the fields');
            return;
        }

        const isAvailable = await checkAvailability();
        console.log('isAvailable check', JSON.stringify(isAvailable));

        if (isAvailable?.data?.is_available && propertyDetails?.booking_type === "instant booking") {
            onClose();
            navigation.navigate("BookingPayment", {
                propertyDetails,
                checkIn: values.checkIn,
                checkOut: values.checkOut,
                guest: values.guest,
            });
        } else if (isAvailable?.data?.is_available && propertyDetails?.booking_type === "approval needed") {
            setShowApprovalModal(true);
        } else if (isAvailable?.data && !isAvailable?.data?.is_available) {
            // Show availability modal when property is not available
            setErrorMessage(''); // Clear any error messages
            setAvailabilityData(isAvailable.data);
            setShowAvailabilityModal(true);
        }
        // Error message is already set in checkAvailability, so we don't need to do anything else
    };

    const checkAvailability = async () => {
        const bodyData: any = {
            check_in: values.checkIn,
            check_out: values.checkOut,
            property_id: propertyDetails.id,
        };

        try {
            setLoader(true);
            const { result, error } = await apiRequest({
                endpoint: `v1/check-property-availability`,
                method: 'POST',
                data: bodyData,
            });
            console.log('property data', bodyData);
            console.log('API response - result:', result, 'error:', error);

            if (error) {
                console.log('API error:', error);
                const errorMsg = typeof error === 'string' ? error : error?.message || 'Error checking availability';
                console.log('Setting error message to state:', errorMsg);
                setErrorMessage(errorMsg);
                showErrorToast(errorMsg);
                setLoader(false);
                return false;
            }

            if (result) {
                const errorMsg = result.message || 'Selected dates are not available';
                console.log('Setting error message (not available) to state:', errorMsg);
                setLoader(false);
            }

            // Clear error if successful
            setErrorMessage('');
            setLoader(false);
            return result ?? false;
        } catch (err: any) {
            console.error("Unexpected Error:", err);
            const errorMsg = err?.message || String(err) || 'An unexpected error occurred';
            console.log('Setting error message (catch) to state:', errorMsg);
            setErrorMessage(errorMsg);
            showErrorToast(errorMsg);
            setLoader(false);
            return false;
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
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.scrollContent}
                    >
                        <View style={styles.header}>
                            <View style={styles.dragIndicator} />
                        </View>

                        <View style={styles.titleRow}>
                            <View style={styles.titleContainer}>
                                <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                                    Book Now
                                </NMText>
                                <View style={styles.statusBox}>
                                    <NMText fontSize={14} fontFamily="regular" color={Colors.statusText}>
                                        {propertyDetails?.booking_type
                                            ?.replace(/\bbooking\b/i, "")
                                            ?.trim()
                                            ?.replace(/\b\w/g, (char) => char.toUpperCase())
                                        }
                                    </NMText>
                                </View>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <X color="#000" size={24} strokeWidth={2} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.priceBox}>
                            <NMText fontSize={18} fontFamily="bold" color={Colors.primary}>
                                {propertyDetails?.price}
                            </NMText>
                            <NMText fontSize={18} fontFamily="regular" color={Colors.primary}>
                                /Month
                            </NMText>
                        </View>

                        <View style={styles.checkInBox}>
                            <NMDatePicker
                                label="Check-In"
                                placeholder="dd/mm/yyyy"
                                value={values.checkIn}
                                onChange={(value) => {
                                    handleChange('checkIn', value);
                                    setErrorMessage(''); // Clear error when user changes date
                                }}
                                isRequired
                                mHorizontal={0}
                                error={errors.checkIn}
                                minDate="today"
                            />
                        </View>

                        <View style={styles.checkInBox}>
                            <NMDatePicker
                                label="Check-out"
                                placeholder="dd/mm/yyyy"
                                value={values.checkOut}
                                onChange={(value) => {
                                    handleChange('checkOut', value);
                                    setErrorMessage(''); // Clear error when user changes date
                                }}
                                isRequired
                                mHorizontal={0}
                                error={errors.checkOut}
                                minDate={values.checkIn}
                            />
                        </View>

                        <View style={styles.checkInBox}>
                            <NMDropdown
                                label="Guest"
                                placeholder="Select"
                                data={guestData}
                                value={values.guest}
                                onChange={(value) => handleChange('guest', value)}
                                mHorizontal={0}
                                isRequired
                                error={errors.guest}
                            />
                        </View>

                        <View style={styles.costBoxContainer}>
                            <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                                Cost Breakdown
                            </NMText>
                            <View style={styles.costBox}>
                                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                    Rental Fee
                                </NMText>
                                <NMText fontSize={14} fontFamily="semiBold" color={Colors.textPrimary}>
                                    00SAR
                                </NMText>
                            </View>
                            <View style={styles.costBox}>
                                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                    Service Fee
                                </NMText>
                                <NMText fontSize={14} fontFamily="semiBold" color={Colors.textPrimary}>
                                    00SAR
                                </NMText>
                            </View>
                            <View style={styles.costBox}>
                                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                    Total
                                </NMText>
                                <NMText fontSize={14} fontFamily="semiBold" color={Colors.textPrimary}>
                                    {propertyDetails?.price}
                                </NMText>
                            </View>

                            <View style={styles.agreeBox}>
                                <SquareCheckIcon color={Colors.white} size={22} strokeWidth={1} fill={Colors.primary} />
                                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                    I agree to the rental <NMText fontSize={14} fontFamily="medium" color={Colors.primary}>terms</NMText> & cancellation policy
                                </NMText>
                            </View>
                        </View>

                        <NMButton
                            title="Book Now"
                            fontFamily='semiBold'
                            width={'92%'}
                            borderRadius={8}
                            style={{ alignSelf: 'center', marginTop: 10 }}
                            onPress={() => handleNavigate()}
                            loading={loader}
                        />
                        {errorMessage ? (
                            <View style={styles.errorContainer}>
                                <NMText
                                    fontSize={14}
                                    fontFamily="regular"
                                    color={Colors.error}
                                    style={styles.errorText}
                                >
                                    {errorMessage}
                                </NMText>
                            </View>
                        ) : null}
                    </ScrollView>
                </View>
            </View>

            <ApprovalBooking
                visible={showApprovalModal}
                onClose={() => setShowApprovalModal(false)}
                propertyId={propertyDetails?.id}
                checkIn={values.checkIn}
                checkOut={values.checkOut}
                guest={values.guest}
                onSuccess={() => {
                    setShowApprovalModal(false);
                    onClose();
                }}
            />

            <PropertyAvailabilityModal
                visible={showAvailabilityModal}
                onClose={() => setShowAvailabilityModal(false)}
                checkIn={availabilityData?.check_in}
                checkOut={availabilityData?.check_out}
                availableSlots={availabilityData?.available_slots}
                availabilityRanges={availabilityData?.availability_ranges}
            />
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
        maxHeight: '90%',
    },
    scrollContent: {
        paddingBottom: 20,
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
    statusBox: {
        marginLeft: 8,
        backgroundColor: Colors.statusBg,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    priceBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: Colors.background,
        borderRadius: 8,
        paddingVertical: 10,
        marginHorizontal: 20
    },
    checkInBox: {
        marginTop: 10,
        marginHorizontal: 20
    },
    dateBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        borderColor: Colors.border,
        borderWidth: 1.5,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 10
    },
    costBoxContainer: {
        marginTop: 10,
        marginHorizontal: 20,
        padding: 16,
        backgroundColor: Colors.background,
        borderRadius: 8
    },
    costBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    agreeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 2
    },
    errorContainer: {
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 20,
        width: '100%',
    },
    errorText: {
        textAlign: 'center',
        color: Colors.error,
    },

});

export default BookKnowModal;
