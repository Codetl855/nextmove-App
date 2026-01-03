import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Linking,
} from 'react-native';
import { X, CheckCircle, Calendar, MapPin, Star } from 'lucide-react-native';
import NMText from '../common/NMText';
import { Colors } from '../../theme/colors';
import { apiRequest } from '../../services/apiClient';
import LoaderModal from '../common/NMLoaderModal';
import { showErrorToast, showSuccessToast } from '../../utils/toastService';

interface InvoiceDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    invoiceId: number | null;
}

interface InvoiceData {
    property: {
        id: number;
        title: string;
        address: string;
        property_type: string;
        price: string;
        primary_image: string;
    };
    booking: {
        id: number;
        check_in: string;
        check_out: string;
        guests: number;
        status: string;
        duration_days: number;
    };
    payment: {
        id: number;
        reference: string;
        amount: string;
        currency: string;
        status: string;
        created_at: string;
    };
    co_payers: Array<{
        id: number;
        email: string;
        amount: number;
        paid_amount: number;
        status: string;
    }>;
}

const InvoiceDetailsModal: React.FC<InvoiceDetailsModalProps> = ({
    visible,
    onClose,
    invoiceId,
}) => {
    const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (visible && invoiceId) {
            fetchInvoiceDetails();
        } else {
            setInvoiceData(null);
        }
    }, [visible, invoiceId]);

    const fetchInvoiceDetails = async () => {
        if (!invoiceId) return;

        try {
            setIsLoading(true);
            const { result, error } = await apiRequest({
                endpoint: `v1/invoice/${invoiceId}`,
                method: 'GET',
            });

            if (error) {
                console.log('Error fetching invoice details:', error);
                return;
            }

            if (result?.data) {
                console.log('Invoice details:', result.data);
                setInvoiceData(result.data);
            }
        } catch (err) {
            console.log('Error fetching invoice details:', err);
            showErrorToast('Failed to fetch invoice details');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    const formatAmount = (amount: string | number, currency: string = 'SAR') => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numAmount)) return `${currency} 0.00`;
        return `${currency} ${numAmount.toFixed(2)}`;
    };

    const calculateTotal = () => {
        if (!invoiceData) return 0;
        const paymentAmount = parseFloat(invoiceData.payment.amount);
        return paymentAmount;
    };

    const calculateMyPayment = () => {
        if (!invoiceData) return 0;
        const total = calculateTotal();
        const coPayersTotal = invoiceData.co_payers.reduce(
            (sum, payer) => sum + payer.amount,
            0
        );
        return total - coPayersTotal;
    };

    const calculateRemaining = () => {
        if (!invoiceData) return 0;
        const total = calculateTotal();
        const paid = invoiceData.co_payers.reduce(
            (sum, payer) => sum + payer.paid_amount,
            0
        );
        return total - paid - calculateMyPayment();
    };

    const handleLocationPress = () => {
        if (invoiceData?.property?.address) {
            const url = `https://maps.google.com/?q=${encodeURIComponent(invoiceData.property.address)}`;
            Linking.openURL(url).catch(err => console.log('Error opening maps:', err));
        }
    };

    const handleSendReminder = async () => {
        if (!invoiceId) return;

        try {
            setIsLoading(true);
            const { result, error } = await apiRequest({
                endpoint: `v1/send-reminder/${invoiceId}`,
                method: 'GET',
            });

            if (error) {
                console.log('Error sending reminder:', error);
                showErrorToast('Failed to send reminder');
                return;
            }

            if (result) {
                showSuccessToast('Reminder sent successfully');
            }
        } catch (err) {
            console.log('Error sending reminder:', err);
            showErrorToast('Failed to send reminder');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsPaid = async (coPayerId: number) => {
        try {
            setIsLoading(true);
            const { result, error } = await apiRequest({
                endpoint: `v1/mark-paid-co-payer/${coPayerId}`,
                method: 'GET',
            });

            if (error) {
                console.log('Error marking as paid:', error);
                showErrorToast('Failed to mark as paid');
                return;
            }

            if (result) {
                showSuccessToast('Marked as paid successfully');
                // Refresh invoice details to reflect the change
                await fetchInvoiceDetails();
            }
        } catch (err) {
            console.log('Error marking as paid:', err);
            showErrorToast('Failed to mark as paid');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
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
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <X color="#000" size={24} strokeWidth={2} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {invoiceData ? (
                                <>
                                    {/* Invoice Header */}
                                    <View style={styles.section}>
                                        <NMText fontSize={24} fontFamily="semiBold" color={Colors.textSecondary}>
                                            Invoice
                                        </NMText>
                                        <View style={styles.headerRow}>
                                            <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                                                Issue Date: {formatDate(invoiceData.payment?.created_at || '')}
                                            </NMText>
                                            {/* <View style={[styles.statusBadge, { backgroundColor: Colors.statusBg }]}>
                                                <NMText fontSize={12} fontFamily="medium" color={Colors.statusText}>
                                                    {invoiceData.booking?.status?.toUpperCase() || 'CONFIRMED'}
                                                </NMText>
                                            </View> */}
                                        </View>
                                    </View>

                                    {/* Property Section */}
                                    {invoiceData.property && (
                                        <View style={styles.propertySection}>
                                            <View style={styles.propertyHeader}>
                                                {invoiceData.property.primary_image ? (
                                                    <Image
                                                        source={{ uri: invoiceData.property.primary_image }}
                                                        style={styles.propertyImage}
                                                    />
                                                ) : (
                                                    <View style={styles.propertyImagePlaceholder} />
                                                )}
                                                <View style={styles.propertyInfo}>
                                                    <NMText fontSize={18} fontFamily="semiBold" color={Colors.textSecondary}>
                                                        {invoiceData.property.title}
                                                    </NMText>
                                                    <View style={styles.ratingRow}>
                                                        <Star size={16} color={Colors.star} fill={Colors.star} />
                                                        <Star size={16} color={Colors.star} fill={Colors.star} />
                                                        <Star size={16} color={Colors.star} fill={Colors.star} />
                                                        <Star size={16} color={Colors.star} fill={Colors.star} />
                                                        <Star size={16} color={Colors.star} fill={Colors.star} />
                                                        <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary} style={{ marginLeft: 4 }}>
                                                            5.0
                                                        </NMText>
                                                    </View>
                                                    <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                                                        {invoiceData.property.address}
                                                    </NMText>
                                                </View>
                                            </View>
                                            <TouchableOpacity
                                                style={styles.locationButton}
                                                onPress={handleLocationPress}
                                            >
                                                <MapPin size={16} color={Colors.white} />
                                                <NMText fontSize={14} fontFamily="medium" color={Colors.white} style={{ marginLeft: 6 }}>
                                                    Location on Map
                                                </NMText>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    {/* Booking Dates */}
                                    <View style={[styles.dateCard, { marginHorizontal: 20, marginVertical: 10 }]}>
                                        <CheckCircle size={20} color={Colors.statusText} />
                                        <View style={styles.dateInfo}>
                                            <NMText fontSize={12} fontFamily="regular" color={Colors.textLight}>
                                                Confirmation
                                            </NMText>
                                            <NMText fontSize={12} fontFamily="medium" color={Colors.textPrimary} numberOfLines={1}>
                                                {invoiceData.payment?.reference || 'N/A'}
                                            </NMText>
                                        </View>
                                    </View>
                                    <View style={styles.datesContainer}>
                                        <View style={styles.dateCard}>
                                            <Calendar size={20} color={Colors.primary} />
                                            <View style={styles.dateInfo}>
                                                <NMText fontSize={12} fontFamily="regular" color={Colors.textLight}>
                                                    Checkin Date
                                                </NMText>
                                                <NMText fontSize={12} fontFamily="medium" color={Colors.textPrimary}>
                                                    {formatDate(invoiceData.booking?.check_in || '')}
                                                </NMText>
                                            </View>
                                        </View>
                                        <View style={styles.dateCard}>
                                            <Calendar size={20} color={Colors.primary} />
                                            <View style={styles.dateInfo}>
                                                <NMText fontSize={12} fontFamily="regular" color={Colors.textLight}>
                                                    Checkout Date
                                                </NMText>
                                                <NMText fontSize={12} fontFamily="medium" color={Colors.textPrimary}>
                                                    {formatDate(invoiceData.booking?.check_out || '')}
                                                </NMText>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Guest and Room Details */}
                                    <View style={styles.card}>
                                        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textSecondary} style={styles.cardTitle}>
                                            Guest and Room Details
                                        </NMText>
                                        <View style={styles.table}>
                                            <View style={styles.tableHeader}>
                                                {/* <NMText fontSize={12} fontFamily="medium" color={Colors.textLight} style={styles.tableCell}>
                                                    Guest Names
                                                </NMText> */}
                                                <NMText fontSize={12} fontFamily="medium" color={Colors.textLight} style={styles.tableCell}>
                                                    Room Type
                                                </NMText>
                                                <NMText fontSize={12} fontFamily="medium" color={Colors.textLight} style={styles.tableCell}>
                                                    Meal
                                                </NMText>
                                                <NMText fontSize={12} fontFamily="medium" color={Colors.textLight} style={styles.tableCell}>
                                                    No. of Rooms
                                                </NMText>
                                                <NMText fontSize={12} fontFamily="medium" color={Colors.textLight} style={styles.tableCell}>
                                                    Adults
                                                </NMText>
                                                {/* <NMText fontSize={12} fontFamily="medium" color={Colors.textLight} style={styles.tableCell}>
                                                    Children
                                                </NMText> */}
                                            </View>
                                            <View style={styles.tableRow}>
                                                {/* <NMText fontSize={12} fontFamily="regular" color={Colors.textPrimary} style={styles.tableCell}>
                                                    N/A
                                                </NMText> */}
                                                <NMText fontSize={12} fontFamily="regular" color={Colors.textPrimary} style={styles.tableCell}>
                                                    {invoiceData.property?.property_type || 'N/A'}
                                                </NMText>
                                                <NMText fontSize={12} fontFamily="regular" color={Colors.textPrimary} style={styles.tableCell}>
                                                    Room Only
                                                </NMText>
                                                <NMText fontSize={12} fontFamily="regular" color={Colors.textPrimary} style={styles.tableCell}>
                                                    01
                                                </NMText>
                                                <NMText fontSize={12} fontFamily="regular" color={Colors.textPrimary} style={styles.tableCell}>
                                                    {invoiceData.booking?.guests || 'N/A'}
                                                </NMText>
                                                {/* <NMText fontSize={12} fontFamily="regular" color={Colors.textPrimary} style={styles.tableCell}>
                                                    01
                                                </NMText> */}
                                            </View>
                                        </View>
                                    </View>

                                    {/* Payment Summary */}
                                    <View style={styles.summaryCard}>
                                        <NMText fontSize={18} fontFamily="semiBold" color={Colors.textSecondary} style={styles.summaryTitle}>
                                            Summary
                                        </NMText>
                                        <View style={styles.totalRow}>
                                            <NMText fontSize={16} fontFamily="medium" color={Colors.textPrimary}>
                                                Total
                                            </NMText>
                                            <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                                                {formatAmount(calculateTotal(), invoiceData.payment?.currency)}
                                            </NMText>
                                        </View>
                                        <NMText fontSize={12} fontFamily="regular" color={Colors.textLight} style={styles.vatText}>
                                            Incl. VAT
                                        </NMText>

                                        {/* My Payment */}
                                        <View style={styles.paymentItem}>
                                            <View style={styles.paymentInfo}>
                                                <View style={[styles.paymentIndicator, { backgroundColor: Colors.statusBg }]} />
                                                <View>
                                                    <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary}>
                                                        My Payment
                                                    </NMText>
                                                    <NMText fontSize={12} fontFamily="regular" color={Colors.textLight}>
                                                        Paid • {formatDate(invoiceData.payment?.created_at || '')}
                                                    </NMText>
                                                </View>
                                            </View>
                                            <NMText fontSize={14} fontFamily="semiBold" color={Colors.textPrimary}>
                                                {formatAmount(calculateMyPayment(), invoiceData.payment?.currency)}
                                            </NMText>
                                        </View>

                                        {/* Co-payers */}
                                        {invoiceData.co_payers && invoiceData.co_payers.length > 0 ? (
                                            invoiceData.co_payers.map((payer) => (
                                                <View key={payer.id} style={styles.paymentItem}>
                                                    <View style={styles.paymentInfo}>
                                                        <View style={[styles.paymentIndicator, { backgroundColor: payer.status === 'pending' ? Colors.statusPendingBg : Colors.statusBg }]} />
                                                        <View>
                                                            <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary}>
                                                                {payer.email}
                                                            </NMText>
                                                            <NMText fontSize={12} fontFamily="regular" color={Colors.textLight}>
                                                                {payer.status === 'pending' ? 'Pending' : 'Paid'} • {formatDate(invoiceData.payment?.created_at || '')}
                                                            </NMText>
                                                        </View>
                                                    </View>
                                                    <View style={styles.paymentAmountContainer}>
                                                        <NMText fontSize={14} fontFamily="semiBold" color={Colors.textPrimary}>
                                                            {formatAmount(payer.amount, invoiceData.payment?.currency)}
                                                        </NMText>
                                                        {payer.status === 'pending' && (
                                                            <TouchableOpacity
                                                                style={styles.markPaidButton}
                                                                onPress={() => handleMarkAsPaid(payer.id)}
                                                            >
                                                                <NMText fontSize={12} fontFamily="medium" color={Colors.primary}>
                                                                    Mark as Paid
                                                                </NMText>
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                </View>
                                            ))
                                        ) : null}

                                        {/* Remaining Amount */}
                                        {invoiceData?.payment?.status?.trim().toLowerCase() !== 'succeeded' && 
                                         invoiceData?.co_payers?.some(payer => payer.status === 'pending') && (
                                            <>
                                                <View style={styles.remainingRow}>
                                                    <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary}>
                                                        Remaining Amount
                                                    </NMText>
                                                    <NMText fontSize={16} fontFamily="semiBold" color={Colors.error}>
                                                        {formatAmount(calculateRemaining(), invoiceData.payment?.currency)}
                                                    </NMText>
                                                </View>

                                                <TouchableOpacity
                                                    style={styles.sendReminderButton}
                                                    onPress={handleSendReminder}
                                                >
                                                    <NMText fontSize={14} fontFamily="medium" color={Colors.white}>
                                                        Send Reminder
                                                    </NMText>
                                                </TouchableOpacity>
                                            </>
                                        )}
                                    </View>

                                    {/* Payment Details */}
                                    <View style={styles.card}>
                                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary} style={styles.paymentDetailsText}>
                                            Payable Through HOTELBEDS DMCC, Acting As Agent For The Service Operating Company, Details Of Which Can Be Provided Upon Request. VAT: 100035906500003 Reference: {invoiceData.payment?.reference || 'N/A'}
                                        </NMText>
                                    </View>
                                </>
                            ) : (
                                <View style={styles.loadingContainer}>
                                    <NMText fontSize={16} fontFamily="medium" color={Colors.textLight}>
                                        Loading invoice details...
                                    </NMText>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            <LoaderModal visible={isLoading} />
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        maxHeight: '90%',
    },
    header: {
        paddingTop: 12,
        paddingBottom: 8,
        paddingHorizontal: 20,
    },
    dragIndicator: {
        width: 40,
        height: 4,
        backgroundColor: Colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 12,
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 12,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 8,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    section: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    propertySection: {
        backgroundColor: Colors.white,
        marginHorizontal: 20,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
    },
    propertyHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    propertyImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    propertyImagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: Colors.border,
    },
    propertyInfo: {
        flex: 1,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 4,
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    datesContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 12,
        gap: 8,
    },
    dateCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    dateInfo: {
        flex: 1,
    },
    card: {
        backgroundColor: Colors.white,
        marginHorizontal: 20,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
    },
    cardTitle: {
        marginBottom: 12,
    },
    table: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: Colors.background,
        paddingVertical: 10,
        paddingHorizontal: 8,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
    },
    summaryCard: {
        backgroundColor: Colors.white,
        marginHorizontal: 20,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
    },
    summaryTitle: {
        marginBottom: 16,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    vatText: {
        marginBottom: 16,
    },
    paymentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    paymentInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    paymentIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 10,
        marginTop: 4,
    },
    paymentAmountContainer: {
        alignItems: 'flex-end',
    },
    markPaidButton: {
        marginTop: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    remainingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    sendReminderButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentDetailsText: {
        lineHeight: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
});

export default InvoiceDetailsModal;

