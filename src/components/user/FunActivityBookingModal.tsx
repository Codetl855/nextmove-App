import React, { useState } from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
} from 'react-native';
import { X, Calendar } from 'lucide-react-native';
import NMText from '../common/NMText';
import { Colors } from '../../theme/colors';
import NMButton from '../common/NMButton';
import NMDatePicker from '../common/NMDatePicker';
import { useForm } from '../../hooks/useForm';
import { showErrorToast, showSuccessToast } from '../../utils/toastService';
import { apiRequest } from '../../services/apiClient';
import LoaderModal from '../common/NMLoaderModal';
import StripePaymentScreen, { FunActivityDetails, FunActivityBookingDetails } from './StripModal';

interface FunActivityBookingModalProps {
    activityDetails: any;
    visible: boolean;
    onClose: () => void;
}

const FunActivityBookingModal: React.FC<FunActivityBookingModalProps> = ({
    activityDetails,
    visible,
    onClose,
}) => {
    const [showBookingDetails, setShowBookingDetails] = useState(false);
    const [availabilityData, setAvailabilityData] = useState<any>(null);
    const [loader, setLoader] = useState(false);
    const [paymentLoader, setPaymentLoader] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [adults, setAdults] = useState('1');
    const [children, setChildren] = useState('0');
    const [tickets, setTickets] = useState('1');
    const [ticketsError, setTicketsError] = useState('');

    const { values, errors, handleChange, setValues } = useForm({
        date: '',
    });

    const handleCheckout = async () => {
        if (!values.date || !tickets || !adults) {
            showErrorToast('Please fill all required fields');
            return;
        }

        if (parseInt(tickets) <= 0) {
            showErrorToast('Please enter a valid number of tickets');
            return;
        }

        if (tickets > activityDetails.number_of_tickets) {
            showErrorToast(`Insufficient tickets available.`);
            return;
        }

        if (parseInt(adults) + parseInt(children) !== parseInt(tickets)) {
            showErrorToast(`Total tickets must equal the sum of adults and children.`);
            return;
        }

        try {
            setLoader(true);
            const { result, error } = await apiRequest({
                endpoint: 'v1/check-fun-activity-availability',
                method: 'POST',
                data: {
                    date: values.date,
                    fun_activity_id: activityDetails.id,
                    tickets: parseInt(tickets),
                },
            });

            if (error) {
                setTicketsError(error);
                showErrorToast(error);
                return;
            }

            if (result?.data) {
                if (result?.data?.data?.is_available === false) {
                    setTicketsError('No tickets available');
                    showErrorToast('No tickets available');
                    return;
                }
                setAvailabilityData(result.data);
                setShowBookingDetails(true);
            }
        } catch (err) {
            setTicketsError('Failed to check availability');
            showErrorToast('Failed to check availability');
        } finally {
            setLoader(false);
        }
    };

    const handleProceedToPayment = async () => {
        if (!availabilityData) return;

        const totalAmount = availabilityData.total_amount || (parseInt(tickets) * activityDetails.price);
        const serviceFee = availabilityData?.service_fee || 0;
        const vatAmount = availabilityData?.vat_amount || 0;
        const grandTotal = totalAmount + serviceFee + vatAmount;

        try {
            setPaymentLoader(true);
            const { result, error } = await apiRequest({
                endpoint: 'v1/payments/create',
                method: 'POST',
                data: {
                    booking_details: {
                        date: values.date,
                        tickets: parseInt(tickets),
                        adults: parseInt(adults),
                        children: parseInt(children),
                        total_amount: grandTotal,
                    },
                    fun_activity_details: {
                        id: String(activityDetails.id),
                        price: activityDetails.price,
                        currency: 'SAR',
                    },
                    type: 'fun_activity',
                },
            });

            if (error) {
                showErrorToast(error);
                return;
            }

            if (result?.data) {
                setShowPayment(true);
                setShowBookingDetails(false);
            }
        } catch (err) {
            showErrorToast('Failed to create payment');
        } finally {
            setPaymentLoader(false);
        }
    };

    const handleChangeDate = () => {
        setShowBookingDetails(false);
        setAvailabilityData(null);
    };

    const handleChangeTickets = () => {
        setShowBookingDetails(false);
        setAvailabilityData(null);
    };

    const handleChangeAdults = () => {
        setShowBookingDetails(false);
        setAvailabilityData(null);
    };

    const handleChangeChildren = () => {
        setShowBookingDetails(false);
        setAvailabilityData(null);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const totalAmount = availabilityData?.total_amount || (parseInt(tickets) * activityDetails.price);
    const serviceFee = availabilityData?.service_fee || 0;
    const vatAmount = availabilityData?.vat_amount || 0;
    const grandTotal = totalAmount + serviceFee + vatAmount;

    return (
        <>
            <Modal
                visible={visible && !showPayment}
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
                                <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                                    Booking Now
                                </NMText>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <X color="#000" size={24} strokeWidth={2} />
                                </TouchableOpacity>
                            </View>

                            {!showBookingDetails ? (
                                <>
                                    {/* Initial Booking Form */}
                                    <View style={styles.priceBox}>
                                        <NMText fontSize={18} fontFamily="bold" color={Colors.primary}>
                                            SAR {activityDetails.price}
                                        </NMText>
                                        <NMText fontSize={18} fontFamily="regular" color={Colors.primary}>
                                            /Ticket
                                        </NMText>
                                    </View>

                                    <View style={styles.inputBox}>
                                        <NMDatePicker
                                            label="Select Date"
                                            placeholder="dd/mm/yyyy"
                                            value={values.date}
                                            onChange={(value) => handleChange('date', value)}
                                            isRequired
                                            mHorizontal={0}
                                            error={errors.date}
                                            minDate="today"
                                        />
                                    </View>

                                    <View style={styles.inputBox}>
                                        <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary} style={styles.label}>
                                            Tickets <NMText color={Colors.error}>*</NMText>
                                        </NMText>
                                        <TextInput
                                            style={styles.textInput}
                                            value={tickets}
                                            onChangeText={setTickets}
                                            keyboardType="number-pad"
                                            placeholder="Enter number of tickets"
                                            placeholderTextColor={Colors.textLight}
                                        />
                                    </View>

                                    <View style={styles.inputBox}>
                                        <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary} style={styles.label}>
                                            Adults <NMText color={Colors.error}>*</NMText>
                                        </NMText>
                                        <TextInput
                                            style={styles.textInput}
                                            value={adults}
                                            onChangeText={setAdults}
                                            keyboardType="number-pad"
                                            placeholder="Enter number of adults"
                                            placeholderTextColor={Colors.textLight}
                                        />
                                    </View>

                                    <View style={styles.inputBox}>
                                        <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary} style={styles.label}>
                                            Children
                                        </NMText>
                                        <TextInput
                                            style={styles.textInput}
                                            value={children}
                                            onChangeText={setChildren}
                                            keyboardType="number-pad"
                                            placeholder="Enter number of children"
                                            placeholderTextColor={Colors.textLight}
                                        />
                                    </View>

                                    <NMButton
                                        title="Checkout"
                                        fontFamily="semiBold"
                                        width="92%"
                                        borderRadius={8}
                                        style={{ alignSelf: 'center', marginTop: 10 }}
                                        onPress={handleCheckout}
                                        loading={loader}
                                    />
                                    {ticketsError && <NMText color={Colors.error} style={styles.errorText}>{ticketsError}</NMText>}
                                </>
                            ) : (
                                <>
                                    {/* Booking Details */}
                                    <View style={styles.bookingDetailsContainer}>
                                        <NMText fontSize={18} fontFamily="semiBold" color={Colors.textPrimary} style={styles.sectionTitle}>
                                            Booking Request
                                        </NMText>

                                        <View style={styles.detailRow}>
                                            <View style={styles.detailItem}>
                                                <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                                                    Date:
                                                </NMText>
                                                <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary}>
                                                    {formatDate(values.date)}
                                                </NMText>
                                            </View>
                                            <TouchableOpacity onPress={handleChangeDate}>
                                                <NMText fontSize={14} fontFamily="medium" color={Colors.primary}>
                                                    Change
                                                </NMText>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <View style={styles.detailItem}>
                                                <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                                                    Ticket:
                                                </NMText>
                                                <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary}>
                                                    {tickets}
                                                </NMText>
                                            </View>
                                            <TouchableOpacity onPress={handleChangeTickets}>
                                                <NMText fontSize={14} fontFamily="medium" color={Colors.primary}>
                                                    Change
                                                </NMText>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <View style={styles.detailItem}>
                                                <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                                                    Adults:
                                                </NMText>
                                                <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary}>
                                                    {adults}
                                                </NMText>
                                            </View>
                                            <TouchableOpacity onPress={handleChangeAdults}>
                                                <NMText fontSize={14} fontFamily="medium" color={Colors.primary}>
                                                    Change
                                                </NMText>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <View style={styles.detailItem}>
                                                <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                                                    Children:
                                                </NMText>
                                                <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary}>
                                                    {children}
                                                </NMText>
                                            </View>
                                            <TouchableOpacity onPress={handleChangeChildren}>
                                                <NMText fontSize={14} fontFamily="medium" color={Colors.primary}>
                                                    Change
                                                </NMText>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.costBreakdown}>
                                            <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary} style={styles.costTitle}>
                                                Cost Breakdown
                                            </NMText>

                                            <View style={styles.costRow}>
                                                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                                    {tickets} X Ticket
                                                </NMText>
                                                <NMText fontSize={14} fontFamily="semiBold" color={Colors.textPrimary}>
                                                    {totalAmount.toFixed(2)} SAR
                                                </NMText>
                                            </View>

                                            <View style={styles.costRow}>
                                                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                                    Service Fee
                                                </NMText>
                                                <NMText fontSize={14} fontFamily="semiBold" color={Colors.textPrimary}>
                                                    {serviceFee.toFixed(2)} SAR
                                                </NMText>
                                            </View>

                                            <View style={styles.divider} />

                                            <View style={styles.costRow}>
                                                <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                                                    Total VAT included
                                                </NMText>
                                                <NMText fontSize={16} fontFamily="bold" color={Colors.primary}>
                                                    {grandTotal.toFixed(2)} SAR
                                                </NMText>
                                            </View>
                                        </View>

                                        <NMButton
                                            title="Proceed to Payment"
                                            fontFamily="semiBold"
                                            width="100%"
                                            borderRadius={8}
                                            style={{ marginTop: 20 }}
                                            onPress={handleProceedToPayment}
                                            loading={paymentLoader}
                                        />
                                    </View>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Stripe Payment Modal */}
            {showPayment && availabilityData && (
                <StripePaymentScreen
                    visible={showPayment}
                    onClose={() => {
                        setShowPayment(false);
                        onClose();
                    }}
                    paymentType="fun_activity"
                    funActivityDetails={{
                        id: String(activityDetails.id),
                        price: activityDetails.price,
                        currency: 'SAR',
                    }}
                    funActivityBookingDetails={{
                        date: values.date,
                        tickets: parseInt(tickets),
                        adults: parseInt(adults),
                        children: parseInt(children),
                        total_amount: grandTotal,
                    }}
                />
            )}
        </>
    );
};

export default FunActivityBookingModal;

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
    priceBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: Colors.background,
        borderRadius: 8,
        paddingVertical: 10,
        marginHorizontal: 20,
    },
    inputBox: {
        marginTop: 10,
        marginHorizontal: 20,
    },
    label: {
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 14,
        fontFamily: 'Regular',
        color: Colors.textPrimary,
        backgroundColor: Colors.white,
    },
    bookingDetailsContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    sectionTitle: {
        marginBottom: 15,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    detailItem: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    costBreakdown: {
        marginTop: 20,
        padding: 16,
        backgroundColor: Colors.background,
        borderRadius: 8,
    },
    costTitle: {
        marginBottom: 15,
    },
    costRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 12,
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
    }
});

