

import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NMText from '../common/NMText';
import { Colors } from '../../theme/colors';
import { X } from 'lucide-react-native';
import { showErrorToast, showSuccessToast } from '../../utils/toastService';
import { useNavigation } from '@react-navigation/native';

// Interfaces
export interface PropertyDetails {
    id: string;
    price: string;
    currency: string;
}

export interface BookingDetails {
    check_in: string;
    check_out: string;
    guests: string;
    split_rent?: boolean;
}

interface PaymentData {
    property_details: PropertyDetails;
    booking_details: BookingDetails;
}

export interface FunActivityDetails {
    id: string;
    price: number;
    currency: string;
}

export interface FunActivityBookingDetails {
    date: string;
    tickets: number;
    adults: number;
    children: number;
    total_amount: number;
}

export interface StripePaymentScreenProps {
    propertyDetails?: PropertyDetails;
    bookingDetails?: BookingDetails;
    funActivityDetails?: FunActivityDetails;
    funActivityBookingDetails?: FunActivityBookingDetails;
    paymentType?: 'property' | 'fun_activity';
    visible: boolean;
    onClose: () => void;
}

const StripePaymentScreen: React.FC<StripePaymentScreenProps> = (props) => {
    const { 
        propertyDetails, 
        bookingDetails, 
        funActivityDetails,
        funActivityBookingDetails,
        paymentType = 'property',
        visible, 
        onClose 
    } = props;
    const navigation = useNavigation();
    const [loading, setLoading] = useState<boolean>(false);
    const [cardDetails, setCardDetails] = useState<any>(null);
    const { confirmPayment } = useStripe();

    // Construct payment payload based on type
    const getPaymentPayload = () => {
        if (paymentType === 'fun_activity' && funActivityDetails && funActivityBookingDetails) {
            return {
                booking_details: {
                    date: funActivityBookingDetails.date,
                    tickets: funActivityBookingDetails.tickets,
                    adults: funActivityBookingDetails.adults,
                    children: funActivityBookingDetails.children,
                    total_amount: funActivityBookingDetails.total_amount,
                },
                adults: funActivityBookingDetails.adults,
                children: funActivityBookingDetails.children,
                date: funActivityBookingDetails.date,
                tickets: funActivityBookingDetails.tickets,
                total_amount: funActivityBookingDetails.total_amount,
                fun_activity_details: {
                    id: funActivityDetails.id,
                    price: funActivityDetails.price,
                    currency: funActivityDetails.currency,
                },
                currency: funActivityDetails.currency,
                type: 'fun_activity',
            };
        } else {
            // Default property booking payload
            return {
                property_details: {
                    id: propertyDetails?.id || '1',
                    price: propertyDetails?.price || '1000',
                    currency: propertyDetails?.currency || 'SAR',
                },
                booking_details: {
                    check_in: bookingDetails?.check_in || '2025-12-01',
                    check_out: bookingDetails?.check_out || '2025-12-02',
                    guests: bookingDetails?.guests || '2',
                    split_rent: false,
                },
            };
        }
    };

    const paymentData = getPaymentPayload();

    const handlePayment = async (): Promise<void> => {
        // Additional validation
        if (!cardDetails?.complete) {
            showErrorToast('Please enter complete card details');
            return;
        }

        if (cardDetails.validNumber !== 'Valid' ||
            cardDetails.validExpiryDate !== 'Valid' ||
            cardDetails.validCVC !== 'Valid') {
            showErrorToast('Please check your card details');
            return;
        }

        setLoading(true);

        try {
            const userData = await AsyncStorage.getItem('loginUser');
            const parsed = JSON.parse(userData || '{}');
            const token = parsed?.token;

            if (!token) {
                throw new Error('Authentication token not found');
            }

            // Step 1: Create payment intent
            const apiUrl = paymentType === 'fun_activity' 
                ? 'https://uat.nextmove.estate/backend/api/v1/payments/create'
                : 'https://uat.nextmove.estate/backend/api/v1/payments/create';
            
            const createResponse = await fetch(
                apiUrl,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(paymentData),
                }
            );

            const responseText = await createResponse.text();
            console.log('Create Response:', responseText);

            if (!createResponse.ok) {
                throw new Error('Failed to create payment intent');
            }

            const createData = JSON.parse(responseText);
            const { client_secret, trx_reference, status } = createData.data;

            if (!client_secret) {
                throw new Error('No client secret received');
            }

            console.log('Transaction Reference:', trx_reference);
            console.log('Status:', status);
            console.log('Card Details before payment:', cardDetails);

            // Step 2: Confirm payment with Stripe
            const { error, paymentIntent } = await confirmPayment(client_secret, {
                paymentMethodType: 'Card',
                paymentMethodData: {
                    billingDetails: {
                        email: parsed?.email || undefined,
                    },
                },
            });

            if (error) {
                console.error('Payment confirmation error:', error);
                showErrorToast(`Payment failed: ${error.message}`);
            } else if (paymentIntent) {
                console.log('Payment Intent:', paymentIntent);
                showSuccessToast('Payment completed successfully!');
                setCardDetails(null);

                // Navigate and close modal
                setTimeout(() => {
                    navigation.replace('UserBottomTab');
                    if (typeof onClose === 'function') {
                        onClose();
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Payment error:', error);
            showErrorToast((error as Error).message || 'Payment processing failed');
        } finally {
            setLoading(false);
        }
    };

    //     const handlePayment = async () => {
    //         if (!cardDetails?.complete) {
    //             Alert.alert('Error', 'Please enter complete card details');
    //             return;
    //         }

    //         setLoading(true);

    //         try {
    //             const userData = await AsyncStorage.getItem('loginUser');
    //             const parsed = JSON.parse(userData);
    //             const token = parsed?.token;

    //             // Step 1: Create payment intent
    //             const createResponse = await fetch(
    //                 'https://uat.nextmove.estate/backend/api/v1/payments/create',
    //                 {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                         Authorization: `Bearer ${token}`,
    //                     },
    //                     body: JSON.stringify(paymentData),
    //                 }
    //             );

    //             const responseText = await createResponse.text();
    //             console.log('Create Response:', responseText);

    //             if (!createResponse.ok) {
    //                 throw new Error('Failed to create payment intent');
    //             }

    //             const createData = JSON.parse(responseText);
    //             const { client_secret, trx_reference, status } = createData.data;

    //             if (!client_secret) {
    //                 throw new Error('No client secret received');
    //             }

    //             console.log('Transaction Reference:', trx_reference);
    //             console.log('Status:', status);

    //             // Step 2: Confirm payment with Stripe
    //             const { error, paymentIntent } = await confirmPayment(client_secret, {
    //                 paymentMethodType: 'Card',
    //             });

    //             if (error) {
    //                 Alert.alert('Payment Failed', error.message);
    //                 console.error('Payment confirmation error:', error);
    //             } else if (paymentIntent) {
    //                 Alert.alert(
    //                     'Payment Successful',
    //                     `Payment completed!\nTransaction ID: ${trx_reference}\nStatus: ${paymentIntent.status}`
    //                 );
    //                 setModalVisible(false);
    //                 setCardDetails(null);
    //             }
    //         } catch (error) {
    //             Alert.alert('Error', error.message || 'Payment processing failed');
    //             console.error('Payment error:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    const handleClose = () => {
        if (!loading && typeof onClose === 'function') {
            onClose();
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <NMText fontSize={16} fontFamily="bold" color={Colors.textPrimary}>
                                Payment Details
                            </NMText>
                            <TouchableOpacity
                                onPress={handleClose}
                                style={styles.closeButton}
                                disabled={loading}
                            >
                                <X size={24} color={Colors.textPrimary} strokeWidth={2} />
                            </TouchableOpacity>
                        </View>

                        {/* Payment Summary */}
                        <View style={styles.summaryContainer}>
                            <NMText
                                fontSize={16}
                                fontFamily="semiBold"
                                color={Colors.textPrimary}
                                style={{ marginBottom: 8 }}
                            >
                                Booking Summary
                            </NMText>
                            {/* <View style={styles.summaryRow}>
                                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                    Property ID:
                                </NMText>
                                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                    #{paymentData.property_details.id}
                                </NMText>
                            </View> */}
                            {paymentType === 'fun_activity' && funActivityBookingDetails ? (
                                <>
                                    <View style={styles.summaryRow}>
                                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                            Date:
                                        </NMText>
                                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                            {funActivityBookingDetails.date}
                                        </NMText>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                            Tickets:
                                        </NMText>
                                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                            {funActivityBookingDetails.tickets}
                                        </NMText>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                            Adults:
                                        </NMText>
                                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                            {funActivityBookingDetails.adults}
                                        </NMText>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                            Children:
                                        </NMText>
                                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                            {funActivityBookingDetails.children}
                                        </NMText>
                                    </View>
                                </>
                            ) : (
                                <>
                                    <View style={styles.summaryRow}>
                                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                            Check-in:
                                        </NMText>
                                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                            {paymentData.booking_details?.check_in}
                                        </NMText>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                            Check-out:
                                        </NMText>
                                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                            {paymentData.booking_details?.check_out}
                                        </NMText>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                            Guests:
                                        </NMText>
                                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                            {paymentData.booking_details?.guests}
                                        </NMText>
                                    </View>
                                </>
                            )}
                            <View style={styles.divider} />
                            <View style={styles.summaryRow}>
                                <NMText fontSize={14} fontFamily="bold" color={Colors.textPrimary}>
                                    Total Amount:
                                </NMText>
                                <NMText fontSize={14} fontFamily="bold" color={Colors.primary}>
                                    {paymentType === 'fun_activity' && funActivityDetails
                                        ? `${funActivityDetails.currency} ${funActivityBookingDetails?.total_amount || 0}`
                                        : `${paymentData.property_details?.currency || 'SAR'} ${paymentData.property_details?.price || 0}`}
                                </NMText>
                            </View>
                        </View>

                        {/* Card Input */}
                        <View style={styles.cardContainer}>
                            <NMText fontSize={14} fontFamily="semiBold" color={Colors.textPrimary}>
                                Card Information
                            </NMText>
                            <Text style={styles.cardSubLabel}>
                                Enter your card details below
                            </Text>
                            <CardField
                                postalCodeEnabled={false}
                                placeholders={{
                                    number: '4242 4242 4242 4242',
                                }}
                                cardStyle={{
                                    backgroundColor: '#FFFFFF',
                                    textColor: '#000000',
                                    borderColor: '#DDDDDD',
                                    borderWidth: 1,
                                    borderRadius: 8,
                                    placeholderColor: '#999999',
                                }}
                                style={styles.cardField}
                                onCardChange={(details) => {
                                    console.log('Card changed:', details);
                                    setCardDetails(details);
                                }}
                            />
                            {/* Validation feedback */}
                            {cardDetails && (
                                <View style={styles.validationContainer}>
                                    {cardDetails.validNumber === 'Valid' && (
                                        <Text style={styles.validText}>✓ Card number valid</Text>
                                    )}
                                    {cardDetails.validExpiryDate === 'Valid' && (
                                        <Text style={styles.validText}>✓ Expiry date valid</Text>
                                    )}
                                    {cardDetails.validCVC === 'Valid' && (
                                        <Text style={styles.validText}>✓ CVC valid</Text>
                                    )}
                                </View>
                            )}
                        </View>

                        {/* Pay Button */}
                        <TouchableOpacity
                            style={[
                                styles.payButton,
                                (!cardDetails?.complete || loading) && styles.payButtonDisabled,
                            ]}
                            onPress={handlePayment}
                            disabled={!cardDetails?.complete || loading}
                        >
                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator color="#FFFFFF" />
                                    <Text style={styles.loadingText}>Processing...</Text>
                                </View>
                            ) : (
                                <Text style={styles.payButtonText}>
                                    Pay {paymentType === 'fun_activity' && funActivityDetails
                                        ? `${funActivityDetails.currency} ${funActivityBookingDetails?.total_amount || 0}`
                                        : `${paymentData.property_details?.currency || 'SAR'} ${paymentData.property_details?.price || 0}`}
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Cancel Button */}
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleClose}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    closeButton: {
        padding: 5,
    },
    summaryContainer: {
        backgroundColor: Colors.background,
        padding: 16,
        borderRadius: 8,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 12,
    },
    cardContainer: {
        marginBottom: 24,
    },
    cardSubLabel: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 12,
        marginTop: 4,
    },
    cardField: {
        width: '100%',
        height: 50,
        marginVertical: 8,
    },
    validationContainer: {
        marginTop: 8,
    },
    validText: {
        fontSize: 12,
        color: '#4CAF50',
        marginBottom: 4,
    },
    payButton: {
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    payButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    payButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loadingText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    cancelButton: {
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    cancelButtonText: {
        color: '#666666',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default StripePaymentScreen;
// // StripePaymentScreen.js
// import React, { useState } from 'react';
// import {
//     View,
//     Text,
//     Modal,
//     TouchableOpacity,
//     StyleSheet,
//     ActivityIndicator,
//     Alert,
//     ScrollView,
//     SafeAreaView,
//     StatusBar,
// } from 'react-native';
// import { CardField, useStripe } from '@stripe/stripe-react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const StripePaymentScreen = () => {
//     const [modalVisible, setModalVisible] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [cardDetails, setCardDetails] = useState(null);
//     const { confirmPayment } = useStripe();

//     // Static values for initial testing
//     const paymentData = {
//         property_details: {
//             id: '9',
//             price: '2999.00',
//             currency: 'SAR',
//         },
//         booking_details: {
//             check_in: '2025-11-30',
//             check_out: '2025-11-31',
//             guests: '3',
//             split_rent: false,
//         },
//     };

//     const handlePayment = async () => {
//         if (!cardDetails?.complete) {
//             Alert.alert('Error', 'Please enter complete card details');
//             return;
//         }

//         setLoading(true);

//         try {
//             const userData = await AsyncStorage.getItem('loginUser');
//             const parsed = JSON.parse(userData);
//             const token = parsed?.token;

//             // Step 1: Create payment intent
//             const createResponse = await fetch(
//                 'https://uat.nextmove.estate/backend/api/v1/payments/create',
//                 {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${token}`,
//                     },
//                     body: JSON.stringify(paymentData),
//                 }
//             );

//             const responseText = await createResponse.text();
//             console.log('Create Response:', responseText);

//             if (!createResponse.ok) {
//                 throw new Error('Failed to create payment intent');
//             }

//             const createData = JSON.parse(responseText);
//             const { client_secret, trx_reference, status } = createData.data;

//             if (!client_secret) {
//                 throw new Error('No client secret received');
//             }

//             console.log('Transaction Reference:', trx_reference);
//             console.log('Status:', status);

//             // Step 2: Confirm payment with Stripe
//             const { error, paymentIntent } = await confirmPayment(client_secret, {
//                 paymentMethodType: 'Card',
//             });

//             if (error) {
//                 Alert.alert('Payment Failed', error.message);
//                 console.error('Payment confirmation error:', error);
//             } else if (paymentIntent) {
//                 Alert.alert(
//                     'Payment Successful',
//                     `Payment completed!\nTransaction ID: ${trx_reference}\nStatus: ${paymentIntent.status}`
//                 );
//                 setModalVisible(false);
//                 setCardDetails(null);
//             }
//         } catch (error) {
//             Alert.alert('Error', error.message || 'Payment processing failed');
//             console.error('Payment error:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
//             <View style={styles.container}>
//                 {/* Header */}
//                 <View style={styles.screenHeader}>
//                     <Text style={styles.screenTitle}>Booking Payment</Text>
//                 </View>

//                 {/* Content */}
//                 <View style={styles.content}>
//                     <Text style={styles.infoText}>
//                         Complete your booking by making the payment
//                     </Text>

//                     {/* Button to open modal */}
//                     <TouchableOpacity
//                         style={styles.openButton}
//                         onPress={() => setModalVisible(true)}
//                     >
//                         <Text style={styles.openButtonText}>Proceed to Payment</Text>
//                     </TouchableOpacity>
//                 </View>

//                 {/* Payment Modal */}
//                 <Modal
//                     animationType="slide"
//                     transparent={true}
//                     visible={modalVisible}
//                     onRequestClose={() => {
//                         if (!loading) {
//                             setModalVisible(false);
//                         }
//                     }}
//                 >
//                     <View style={styles.modalOverlay}>
//                         <View style={styles.modalContent}>
//                             <ScrollView
//                                 showsVerticalScrollIndicator={false}
//                                 keyboardShouldPersistTaps="handled"
//                             >
//                                 {/* Header */}
//                                 <View style={styles.header}>
//                                     <Text style={styles.headerTitle}>Payment Details</Text>
//                                     <TouchableOpacity
//                                         onPress={() => {
//                                             if (!loading) {
//                                                 setModalVisible(false);
//                                             }
//                                         }}
//                                         style={styles.closeButton}
//                                         disabled={loading}
//                                     >
//                                         <Text style={styles.closeButtonText}>✕</Text>
//                                     </TouchableOpacity>
//                                 </View>

//                                 {/* Payment Summary */}
//                                 <View style={styles.summaryContainer}>
//                                     <Text style={styles.summaryTitle}>Booking Summary</Text>
//                                     <View style={styles.summaryRow}>
//                                         <Text style={styles.summaryLabel}>Property ID:</Text>
//                                         <Text style={styles.summaryValue}>
//                                             #{paymentData.property_details.id}
//                                         </Text>
//                                     </View>
//                                     <View style={styles.summaryRow}>
//                                         <Text style={styles.summaryLabel}>Check-in:</Text>
//                                         <Text style={styles.summaryValue}>
//                                             {paymentData.booking_details.check_in}
//                                         </Text>
//                                     </View>
//                                     <View style={styles.summaryRow}>
//                                         <Text style={styles.summaryLabel}>Check-out:</Text>
//                                         <Text style={styles.summaryValue}>
//                                             {paymentData.booking_details.check_out}
//                                         </Text>
//                                     </View>
//                                     <View style={styles.summaryRow}>
//                                         <Text style={styles.summaryLabel}>Guests:</Text>
//                                         <Text style={styles.summaryValue}>
//                                             {paymentData.booking_details.guests}
//                                         </Text>
//                                     </View>
//                                     <View style={styles.divider} />
//                                     <View style={styles.summaryRow}>
//                                         <Text style={styles.totalLabel}>Total Amount:</Text>
//                                         <Text style={styles.totalValue}>
//                                             {paymentData.property_details.currency}{' '}
//                                             {paymentData.property_details.price}
//                                         </Text>
//                                     </View>
//                                 </View>

//                                 {/* Card Input */}
//                                 <View style={styles.cardContainer}>
//                                     <Text style={styles.cardLabel}>Card Information</Text>
//                                     <Text style={styles.cardSubLabel}>
//                                         Enter your card details below
//                                     </Text>
//                                     <CardField
//                                         postalCodeEnabled={false}
//                                         placeholders={{
//                                             number: '4242 4242 4242 4242',
//                                             expiry: 'MM/YY',
//                                             cvc: 'CVC',
//                                         }}
//                                         cardStyle={{
//                                             backgroundColor: '#FFFFFF',
//                                             textColor: '#000000',
//                                             borderColor: '#DDDDDD',
//                                             borderWidth: 1,
//                                             borderRadius: 8,
//                                         }}
//                                         style={styles.cardField}
//                                         onCardChange={(details) => {
//                                             setCardDetails(details);
//                                             console.log('Card details:', details);
//                                         }}
//                                     />
//                                     <Text style={styles.testCardInfo}>
//                                         Test card: 4242 4242 4242 4242
//                                     </Text>
//                                 </View>

//                                 {/* Pay Button */}
//                                 <TouchableOpacity
//                                     style={[
//                                         styles.payButton,
//                                         (!cardDetails?.complete || loading) &&
//                                         styles.payButtonDisabled,
//                                     ]}
//                                     onPress={handlePayment}
//                                     disabled={!cardDetails?.complete || loading}
//                                 >
//                                     {loading ? (
//                                         <View style={styles.loadingContainer}>
//                                             <ActivityIndicator color="#FFFFFF" />
//                                             <Text style={styles.loadingText}>Processing...</Text>
//                                         </View>
//                                     ) : (
//                                         <Text style={styles.payButtonText}>
//                                             Pay {paymentData.property_details.currency}{' '}
//                                             {paymentData.property_details.price}
//                                         </Text>
//                                     )}
//                                 </TouchableOpacity>

//                                 {/* Cancel Button */}
//                                 <TouchableOpacity
//                                     style={styles.cancelButton}
//                                     onPress={() => setModalVisible(false)}
//                                     disabled={loading}
//                                 >
//                                     <Text style={styles.cancelButtonText}>Cancel</Text>
//                                 </TouchableOpacity>

//                                 {/* Secure Payment Info */}
//                                 <View style={styles.secureInfo}>
//                                     <Text style={styles.secureText}>
//                                         🔒 Secure payment powered by Stripe
//                                     </Text>
//                                 </View>
//                             </ScrollView>
//                         </View>
//                     </View>
//                 </Modal>
//             </View>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: '#FFFFFF',
//     },
//     container: {
//         flex: 1,
//         backgroundColor: '#F5F5F5',
//     },
//     screenHeader: {
//         backgroundColor: '#FFFFFF',
//         paddingVertical: 20,
//         paddingHorizontal: 20,
//         borderBottomWidth: 1,
//         borderBottomColor: '#E0E0E0',
//     },
//     screenTitle: {
//         fontSize: 24,
//         fontWeight: '700',
//         color: '#000000',
//     },
//     content: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//     },
//     infoText: {
//         fontSize: 16,
//         color: '#666666',
//         textAlign: 'center',
//         marginBottom: 30,
//     },
//     openButton: {
//         backgroundColor: '#007AFF',
//         paddingHorizontal: 50,
//         paddingVertical: 16,
//         borderRadius: 8,
//         shadowColor: '#000000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//     },
//     openButtonText: {
//         color: '#FFFFFF',
//         fontSize: 18,
//         fontWeight: '600',
//     },
//     modalOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         justifyContent: 'flex-end',
//     },
//     modalContent: {
//         backgroundColor: '#FFFFFF',
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         paddingHorizontal: 20,
//         paddingTop: 20,
//         paddingBottom: 40,
//         maxHeight: '90%',
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     headerTitle: {
//         fontSize: 24,
//         fontWeight: '700',
//         color: '#000000',
//     },
//     closeButton: {
//         padding: 5,
//     },
//     closeButtonText: {
//         fontSize: 28,
//         color: '#666666',
//         fontWeight: '300',
//     },
//     summaryContainer: {
//         backgroundColor: '#F9F9F9',
//         padding: 16,
//         borderRadius: 12,
//         marginBottom: 24,
//         borderWidth: 1,
//         borderColor: '#E0E0E0',
//     },
//     summaryTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#000000',
//         marginBottom: 12,
//     },
//     summaryRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingVertical: 6,
//     },
//     summaryLabel: {
//         fontSize: 15,
//         color: '#666666',
//     },
//     summaryValue: {
//         fontSize: 15,
//         color: '#000000',
//         fontWeight: '500',
//     },
//     divider: {
//         height: 1,
//         backgroundColor: '#E0E0E0',
//         marginVertical: 12,
//     },
//     totalLabel: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#000000',
//     },
//     totalValue: {
//         fontSize: 20,
//         fontWeight: '700',
//         color: '#007AFF',
//     },
//     cardContainer: {
//         marginBottom: 24,
//     },
//     cardLabel: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#000000',
//         marginBottom: 4,
//     },
//     cardSubLabel: {
//         fontSize: 14,
//         color: '#666666',
//         marginBottom: 12,
//     },
//     cardField: {
//         width: '100%',
//         height: 50,
//         marginVertical: 8,
//     },
//     testCardInfo: {
//         fontSize: 12,
//         color: '#999999',
//         marginTop: 8,
//         fontStyle: 'italic',
//     },
//     payButton: {
//         backgroundColor: '#007AFF',
//         padding: 16,
//         borderRadius: 8,
//         alignItems: 'center',
//         marginBottom: 12,
//         shadowColor: '#000000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 2,
//     },
//     payButtonDisabled: {
//         backgroundColor: '#CCCCCC',
//     },
//     payButtonText: {
//         color: '#FFFFFF',
//         fontSize: 18,
//         fontWeight: '600',
//     },
//     loadingContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     loadingText: {
//         color: '#FFFFFF',
//         fontSize: 16,
//         fontWeight: '600',
//         marginLeft: 10,
//     },
//     cancelButton: {
//         padding: 16,
//         borderRadius: 8,
//         alignItems: 'center',
//         backgroundColor: '#F0F0F0',
//         borderWidth: 1,
//         borderColor: '#E0E0E0',
//     },
//     cancelButtonText: {
//         color: '#666666',
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     secureInfo: {
//         marginTop: 20,
//         alignItems: 'center',
//     },
//     secureText: {
//         fontSize: 13,
//         color: '#999999',
//     },
// });

// export default StripePaymentScreen;