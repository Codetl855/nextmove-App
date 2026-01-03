import { ScrollView, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import { Colors } from '../../../theme/colors';
import NMText from '../../../components/common/NMText';
import { ChevronLeft, Edit3Icon, SquareCheckIcon, SquareIcon, X } from 'lucide-react-native'
import NMTextInput from '../../../components/common/NMTextInput';
import NMButton from '../../../components/common/NMButton';
import NMRadioButton from '../../../components/common/NMRadioButton';
import { showErrorToast, showSuccessToast, showWarningToast } from '../../../utils/toastService';
import { apiRequest } from '../../../services/apiClient';
import { id } from 'rn-emoji-keyboard';

const BookingPayment: React.FC = ({ navigation, route }: any) => {

    const {
        propertyDetails,
        checkIn,
        checkOut,
        guest,
    } = route.params || {};

    const [splitCheck, setSplitCheck] = useState(false);
    const [radioSelected, setRadioSelected] = useState({
        'equal': true,
        'custom': false
    });
    const [emailInput, setEmailInput] = useState('');
    const [emails, setEmails] = useState<string[]>([]);
    const [yourCustomAmount, setYourCustomAmount] = useState('');
    const [emailCustomAmounts, setEmailCustomAmounts] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false)

    const getPropertyPrice = () => {
        const priceStr = propertyDetails?.price || '0SAR';
        const numericValue = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
        return isNaN(numericValue) ? 0 : numericValue;
    };

    const propertyPrice = getPropertyPrice();

    // Calculate equal split amount
    const calculateEqualSplit = () => {
        if (emails.length === 0) return propertyPrice;
        const totalParticipants = emails.length + 1;
        return propertyPrice / totalParticipants;
    };

    // Calculate total of custom amounts
    const calculateCustomTotal = () => {
        let total = parseFloat(yourCustomAmount) || 0;
        Object.values(emailCustomAmounts).forEach(amount => {
            total += parseFloat(amount) || 0;
        });
        return total;
    };

    // Handle adding email
    const handleAddEmail = () => {
        const trimmedEmail = emailInput.trim();
        if (!trimmedEmail) {
            Alert.alert('Error', 'Please enter an email address');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        if (emails.includes(trimmedEmail)) {
            Alert.alert('Error', 'This email is already added');
            return;
        }

        setEmails([...emails, trimmedEmail]);
        setEmailInput('');

        // Initialize custom amount for new email if in custom mode
        if (radioSelected.custom) {
            const equalAmount = calculateEqualSplit().toFixed(2);
            setEmailCustomAmounts({ ...emailCustomAmounts, [trimmedEmail]: equalAmount });
        }
    };

    // Handle removing email
    const handleRemoveEmail = (emailToRemove: string) => {
        setEmails(emails.filter(email => email !== emailToRemove));
        const newAmounts = { ...emailCustomAmounts };
        delete newAmounts[emailToRemove];
        setEmailCustomAmounts(newAmounts);
    };

    // Handle your custom amount change
    const handleYourAmountChange = (text: string) => {
        const numericValue = text.replace(/[^0-9.]/g, '');
        const amount = parseFloat(numericValue) || 0;

        const otherAmountsTotal = Object.values(emailCustomAmounts).reduce((sum, amt) => sum + (parseFloat(amt) || 0), 0);

        if (amount + otherAmountsTotal > propertyPrice) {
            const maxAllowed = (propertyPrice - otherAmountsTotal).toFixed(2);
            Alert.alert('Error', `Maximum allowed amount is ${maxAllowed} SAR. Total cannot exceed ${propertyPrice} SAR`);
            return;
        }

        setYourCustomAmount(numericValue);
    };

    // Handle email custom amount change
    const handleEmailAmountChange = (email: string, text: string) => {
        const numericValue = text.replace(/[^0-9.]/g, '');
        const amount = parseFloat(numericValue) || 0;

        const yourAmount = parseFloat(yourCustomAmount) || 0;
        const otherEmailsTotal = Object.entries(emailCustomAmounts).reduce((sum, [key, amt]) => {
            if (key !== email) return sum + (parseFloat(amt) || 0);
            return sum;
        }, 0);

        const currentTotal = yourAmount + otherEmailsTotal + amount;

        if (currentTotal > propertyPrice) {
            const maxAllowed = (propertyPrice - yourAmount - otherEmailsTotal).toFixed(2);
            showWarningToast(`Maximum allowed amount is ${maxAllowed} SAR. Total cannot exceed ${propertyPrice} SAR`);
            return;
        }

        setEmailCustomAmounts({ ...emailCustomAmounts, [email]: numericValue });
    };

    useEffect(() => {
        if (radioSelected.equal) {
            setYourCustomAmount('');
            setEmailCustomAmounts({});
        } else {
            const equalAmount = calculateEqualSplit().toFixed(2);
            setYourCustomAmount(equalAmount);

            const newAmounts: { [key: string]: string } = {};
            emails.forEach(email => {
                newAmounts[email] = equalAmount;
            });
            setEmailCustomAmounts(newAmounts);
        }
    }, [radioSelected.equal, emails.length]);

    const getYourAmount = () => {
        if (radioSelected.equal) {
            return calculateEqualSplit();
        } else {
            return parseFloat(yourCustomAmount) || 0;
        }
    };

    const getEmailAmount = (email: string) => {
        if (radioSelected.equal) {
            return calculateEqualSplit();
        } else {
            return parseFloat(emailCustomAmounts[email]) || 0;
        }
    };

    const handleCreateBooking = async () => {
        const payload = {
            type: "property",
            property_details: {
                id: propertyDetails?.id,
                currency: propertyDetails?.currency || "SAR",
                price: propertyDetails?.price
            },
            booking_details: {
                check_in: checkIn,
                check_out: checkOut,
                split_rent: splitCheck,
                guests: guest,
                co_payers: emails.map(email => ({
                    email,
                    amount: getEmailAmount(email).toFixed(2)
                }))
            }
        }

        try {
            setLoading(true)

            const { result, error } = await apiRequest({
                endpoint: "v1/payments/create",
                method: "POST",
                data: payload,
            });

            if (error) {
                showErrorToast(error);
                return;
            }
            console.log('res', result);

            if (result) {
                showSuccessToast(result.message || "Booking created successfully!");
                navigation.navigate('PaymentMethod', { propertyDetails: propertyDetails, checkIn: checkIn, checkOut: checkOut, guest: guest });
            }

        } catch (error) {
            showErrorToast(error || error.message || "Error creating booking");
        } finally {
            setLoading(false)
        }
    }

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={styles.container}>

                    <View style={styles.headerView}>
                        <View style={styles.inRow}>
                            <TouchableOpacity style={styles.backBox}>
                                <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                            </TouchableOpacity>
                            <View style={styles.titleView}>
                                <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                                    Booking Payment
                                </NMText>
                            </View>
                        </View>
                    </View>

                    <View style={styles.contentBox}>
                        <NMText fontSize={20} fontFamily="semiBold" color={Colors.text1A}>
                            Booking Details
                        </NMText>
                        <View style={[styles.checkInBox, { marginTop: 26 }]}>
                            <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                                Checkin
                            </NMText>
                            <View style={[styles.inRow, { gap: 6 }]}>
                                <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                                    {checkIn}
                                </NMText>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.checkInBox}>
                            <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                                Checkout
                            </NMText>
                            <View style={[styles.inRow, { gap: 6 }]}>
                                <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                                    {checkOut}
                                </NMText>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.checkInBox}>
                            <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                                Guest
                            </NMText>
                            <View style={[styles.inRow, { gap: 6 }]}>
                                <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                                    {guest}
                                </NMText>
                            </View>
                        </View>

                        <View style={styles.costBox}>
                            <NMText fontSize={18} fontFamily="semiBold" color={Colors.textPrimary}>
                                Cost Breakdown
                            </NMText>
                            <View style={styles.rentalFeeBox}>
                                <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                                    Rental Fee
                                </NMText>
                                <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                                    00SAR
                                </NMText>
                            </View>
                            <View style={styles.rentalFeeBox}>
                                <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                                    Service Fee
                                </NMText>
                                <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                                    00SAR
                                </NMText>
                            </View>
                            <View style={styles.rentalFeeBox}>
                                <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                                    Total
                                </NMText>
                                <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                                    {propertyDetails?.price}
                                </NMText>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.checkBox} activeOpacity={.9} onPress={() => setSplitCheck(!splitCheck)}>
                            {splitCheck ? <SquareCheckIcon color={Colors.primary} size={18} strokeWidth={2} /> : <SquareIcon color={Colors.textLight} size={18} strokeWidth={2} />}
                            <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                                Split Rent with Others
                            </NMText>
                        </TouchableOpacity>

                        {splitCheck && (<View style={styles.costBox}>
                            <NMText fontSize={16} fontFamily="medium" color={Colors.textPrimary} style={{ marginTop: 10 }}>
                                Invite Co-Payer
                            </NMText>
                            <View style={[styles.inRow, { marginTop: 10, justifyContent: 'space-between' }]}>
                                <NMTextInput
                                    placeholder='Enter email'
                                    mainViewStyle={{ width: '76%' }}
                                    value={emailInput}
                                    onChangeText={setEmailInput}
                                />
                                <NMButton
                                    title='Add'
                                    width={'20%'}
                                    height={46}
                                    borderRadius={8}
                                    onPress={handleAddEmail}
                                />
                            </View>

                            <View style={[styles.inRow, { marginTop: 10, gap: 10 }]}>
                                <NMRadioButton
                                    label='Equally'
                                    fontSize={16}
                                    labelColor={Colors.textPrimary}
                                    selected={radioSelected.equal}
                                    onPress={() => setRadioSelected({ 'equal': true, 'custom': false })}
                                />
                                <NMRadioButton
                                    label='Custom Amounts'
                                    fontSize={16}
                                    labelColor={Colors.textPrimary}
                                    selected={radioSelected.custom}
                                    onPress={() => setRadioSelected({ 'equal': false, 'custom': true })}
                                />
                            </View>

                            <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary} style={{ marginTop: 10 }}>
                                Participants
                            </NMText>

                            <View style={styles.rentalFeeBox}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'column', flex: 1 }}>
                                        <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                                            You
                                        </NMText>
                                        {radioSelected.custom ? (
                                            <View style={{ marginTop: 8, maxWidth: 120 }}>
                                                <NMTextInput
                                                    placeholder='Amount'
                                                    mainViewStyle={{ marginVertical: 0 }}
                                                    value={yourCustomAmount}
                                                    onChangeText={handleYourAmountChange}
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                        ) : (
                                            <NMText fontSize={16} fontFamily="bold" color={Colors.textPrimary} style={{ marginTop: 4 }}>
                                                {calculateEqualSplit().toFixed(2)} SAR
                                            </NMText>
                                        )}
                                    </View>
                                    <View style={styles.paidStatus}>
                                        <NMText fontSize={16} fontFamily="regular" color={Colors.statusText}>
                                            Paid
                                        </NMText>
                                    </View>
                                </View>
                            </View>

                            {emails.map((email, index) => (
                                <View key={index} style={styles.rentalFeeBox}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'column', flex: 1 }}>
                                            <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary} style={{ maxWidth: '92%' }} numberOfLines={1}>
                                                {email}
                                            </NMText>
                                            {radioSelected.custom ? (
                                                <View style={{ marginTop: 8, maxWidth: 120 }}>
                                                    <NMTextInput
                                                        placeholder='Amount'
                                                        mainViewStyle={{ marginVertical: 0 }}
                                                        value={emailCustomAmounts[email] || ''}
                                                        onChangeText={(text) => handleEmailAmountChange(email, text)}
                                                        keyboardType="numeric"
                                                    />
                                                </View>
                                            ) : (
                                                <NMText fontSize={16} fontFamily="bold" color={Colors.textPrimary} style={{ marginTop: 4 }}>
                                                    {calculateEqualSplit().toFixed(2)} SAR
                                                </NMText>
                                            )}
                                        </View>
                                        <View style={[styles.inRow, { gap: 8 }]}>
                                            <View style={[styles.paidStatus, { backgroundColor: Colors.statusPendingBg }]}>
                                                <NMText fontSize={16} fontFamily="regular" color={Colors.statusPendingText}>
                                                    Pending
                                                </NMText>
                                            </View>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => handleRemoveEmail(email)} style={{ padding: 4, position: 'absolute', zIndex: 1, right: -10, top: -10 }}>
                                        <X color={Colors.error || Colors.textPrimary} size={20} strokeWidth={2} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>)}
                    </View>

                    <NMButton
                        title='Pay Now'
                        borderRadius={8}
                        fontFamily='semiBold'
                        width={'90%'}
                        style={{ alignSelf: 'center', marginVertical: 10 }}
                        onPress={() => handleCreateBooking()}
                        loading={loading}
                        disabled={loading}
                    />

                </View>
            </ScrollView>
        </NMSafeAreaWrapper>
    );
};

export default BookingPayment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerView: {
        width: '100%',
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        paddingVertical: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBox: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.background
    },
    titleView: {
        marginLeft: 10,
    },
    contentBox: {
        marginTop: 10,
        marginHorizontal: '5%',
        padding: 14,
        borderRadius: 8,
        backgroundColor: Colors.white
    },
    checkInBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    editView: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: Colors.primaryF9
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 10
    },
    costBox: {
        marginTop: 16,
        padding: 14,
        borderRadius: 8,
        backgroundColor: Colors.background,
    },
    rentalFeeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        padding: 14,
        borderRadius: 8,
        backgroundColor: Colors.white,
    },
    checkBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 2
    },
    paidStatus: {
        paddingHorizontal: 14,
        paddingVertical: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: Colors.statusBg
    }
});

// import { ScrollView, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
// import { Colors } from '../../../theme/colors';
// import NMText from '../../../components/common/NMText';
// import { ChevronLeft, Edit3Icon, SquareCheckIcon, SquareIcon, X } from 'lucide-react-native'
// import NMTextInput from '../../../components/common/NMTextInput';
// import NMButton from '../../../components/common/NMButton';
// import NMRadioButton from '../../../components/common/NMRadioButton';
// const BookingPayment: React.FC = ({ navigation, route }: any) => {

//     const {
//         propertyDetails,
//         checkIn,
//         checkOut,
//         guest,
//     } = route.params || {};
//     const [splitCheck, setSplitCheck] = useState(false);
//     const [radioSelected, setRadioSelected] = useState({
//         'equal': true,
//         'custom': false
//     });
//     const [emailInput, setEmailInput] = useState('');
//     const [emails, setEmails] = useState<string[]>([]);
//     const [yourCustomAmount, setYourCustomAmount] = useState('');
//     const [emailCustomAmounts, setEmailCustomAmounts] = useState<{ [key: string]: string }>({});

//     // Extract numeric value from price string (e.g., "1000SAR" -> 1000)
//     const getPropertyPrice = () => {
//         const priceStr = propertyDetails?.price || '0SAR';
//         const numericValue = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
//         return isNaN(numericValue) ? 0 : numericValue;
//     };

//     const propertyPrice = getPropertyPrice();

//     // Calculate equal split amount
//     const calculateEqualSplit = () => {
//         if (emails.length === 0) return propertyPrice;
//         const totalParticipants = emails.length + 1; // +1 for "You"
//         return propertyPrice / totalParticipants;
//     };

//     // Calculate total of custom amounts
//     const calculateCustomTotal = () => {
//         let total = parseFloat(yourCustomAmount) || 0;
//         Object.values(emailCustomAmounts).forEach(amount => {
//             total += parseFloat(amount) || 0;
//         });
//         return total;
//     };

//     // Handle adding email
//     const handleAddEmail = () => {
//         const trimmedEmail = emailInput.trim();
//         if (!trimmedEmail) {
//             Alert.alert('Error', 'Please enter an email address');
//             return;
//         }

//         // Basic email validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(trimmedEmail)) {
//             Alert.alert('Error', 'Please enter a valid email address');
//             return;
//         }

//         if (emails.includes(trimmedEmail)) {
//             Alert.alert('Error', 'This email is already added');
//             return;
//         }

//         setEmails([...emails, trimmedEmail]);
//         setEmailInput('');

//         // Initialize custom amount for new email if in custom mode
//         if (radioSelected.custom) {
//             setEmailCustomAmounts({ ...emailCustomAmounts, [trimmedEmail]: '' });
//         }
//     };

//     // Handle removing email
//     const handleRemoveEmail = (emailToRemove: string) => {
//         setEmails(emails.filter(email => email !== emailToRemove));
//         const newAmounts = { ...emailCustomAmounts };
//         delete newAmounts[emailToRemove];
//         setEmailCustomAmounts(newAmounts);
//     };

//     // Handle your custom amount change
//     const handleYourAmountChange = (text: string) => {
//         const numericValue = text.replace(/[^0-9.]/g, '');
//         const amount = parseFloat(numericValue) || 0;

//         // Check if amount exceeds property price
//         if (amount > propertyPrice) {
//             Alert.alert('Error', `Amount cannot exceed ${propertyPrice}SAR`);
//             return;
//         }

//         // Check if total exceeds property price
//         const otherAmountsTotal = Object.values(emailCustomAmounts).reduce((sum, amt) => sum + (parseFloat(amt) || 0), 0);
//         if (amount + otherAmountsTotal > propertyPrice) {
//             Alert.alert('Error', `Total amount cannot exceed ${propertyPrice}SAR`);
//             return;
//         }

//         setYourCustomAmount(numericValue);
//     };

//     // Handle email custom amount change
//     const handleEmailAmountChange = (email: string, text: string) => {
//         const numericValue = text.replace(/[^0-9.]/g, '');
//         const amount = parseFloat(numericValue) || 0;

//         // Check if amount exceeds property price
//         if (amount > propertyPrice) {
//             Alert.alert('Error', `Amount cannot exceed ${propertyPrice}SAR`);
//             return;
//         }

//         // Check if total exceeds property price
//         const yourAmount = parseFloat(yourCustomAmount) || 0;
//         const otherAmountsTotal = Object.values(emailCustomAmounts).reduce((sum, amt, key) => {
//             if (key !== email) return sum + (parseFloat(amt) || 0);
//             return sum;
//         }, 0);

//         if (yourAmount + otherAmountsTotal + amount > propertyPrice) {
//             Alert.alert('Error', `Total amount cannot exceed ${propertyPrice}SAR`);
//             return;
//         }

//         setEmailCustomAmounts({ ...emailCustomAmounts, [email]: numericValue });
//     };

//     // Reset custom amounts when switching to equal
//     useEffect(() => {
//         if (radioSelected.equal) {
//             setYourCustomAmount('');
//             setEmailCustomAmounts({});
//         } else {
//             // Initialize custom amounts for existing emails
//             const newAmounts: { [key: string]: string } = {};
//             emails.forEach(email => {
//                 if (!emailCustomAmounts[email]) {
//                     newAmounts[email] = '';
//                 }
//             });
//             if (Object.keys(newAmounts).length > 0) {
//                 setEmailCustomAmounts({ ...emailCustomAmounts, ...newAmounts });
//             }
//         }
//     }, [radioSelected.equal]);

//     // Get display amount for "You"
//     const getYourAmount = () => {
//         if (radioSelected.equal) {
//             return calculateEqualSplit();
//         } else {
//             return parseFloat(yourCustomAmount) || 0;
//         }
//     };

//     // Get display amount for email
//     const getEmailAmount = (email: string) => {
//         if (radioSelected.equal) {
//             return calculateEqualSplit();
//         } else {
//             return parseFloat(emailCustomAmounts[email]) || 0;
//         }
//     };
//     return (
//         <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
//             <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
//                 <View style={styles.container}>

//                     <View style={styles.headerView}>
//                         <View style={styles.inRow}>
//                             <TouchableOpacity style={styles.backBox}>
//                                 <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
//                             </TouchableOpacity>
//                             <View style={styles.titleView}>
//                                 <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
//                                     Booking Payment
//                                 </NMText>
//                             </View>
//                         </View>
//                     </View>

//                     <View style={styles.contentBox}>
//                         <NMText fontSize={20} fontFamily="semiBold" color={Colors.text1A}>
//                             Booking Details
//                         </NMText>
//                         <View style={[styles.checkInBox, { marginTop: 26 }]}>
//                             <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
//                                 Checkin
//                             </NMText>
//                             <View style={[styles.inRow, { gap: 6 }]}>
//                                 <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
//                                     {checkIn}
//                                 </NMText>
//                                 {/* <View style={styles.editView}>
//                                     <Edit3Icon color={Colors.primary} size={18} strokeWidth={2} />
//                                 </View> */}
//                             </View>
//                         </View>
//                         <View style={styles.divider} />
//                         <View style={styles.checkInBox}>
//                             <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
//                                 Checkout
//                             </NMText>
//                             <View style={[styles.inRow, { gap: 6 }]}>
//                                 <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
//                                     {checkOut}
//                                 </NMText>
//                                 {/* <View style={styles.editView}>
//                                     <Edit3Icon color={Colors.primary} size={18} strokeWidth={2} />
//                                 </View> */}
//                             </View>
//                         </View>
//                         <View style={styles.divider} />
//                         <View style={styles.checkInBox}>
//                             <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
//                                 Guest
//                             </NMText>
//                             <View style={[styles.inRow, { gap: 6 }]}>
//                                 <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
//                                     {guest}
//                                 </NMText>
//                                 {/* <View style={styles.editView}>
//                                     <Edit3Icon color={Colors.primary} size={18} strokeWidth={2} />
//                                 </View> */}
//                             </View>
//                         </View>

//                         <View style={styles.costBox}>
//                             <NMText fontSize={18} fontFamily="semiBold" color={Colors.textPrimary}>
//                                 Cost Breakdown
//                             </NMText>
//                             <View style={styles.rentalFeeBox}>
//                                 <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
//                                     Rental Fee
//                                 </NMText>
//                                 <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
//                                     00SAR
//                                 </NMText>
//                             </View>
//                             <View style={styles.rentalFeeBox}>
//                                 <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
//                                     Service Fee
//                                 </NMText>
//                                 <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
//                                     00SAR
//                                 </NMText>
//                             </View>
//                             <View style={styles.rentalFeeBox}>
//                                 <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
//                                     Total
//                                 </NMText>
//                                 <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
//                                     {propertyDetails?.price}
//                                 </NMText>
//                             </View>

//                             {/* <NMText fontSize={16} fontFamily="medium" color={Colors.textPrimary} style={{ marginTop: 10 }}>
//                                 Special Requests
//                             </NMText>
//                             <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary} style={{ marginTop: 10 }}>
//                                 Risk management and compliance, when approached strategically,
//                             </NMText> */}
//                         </View>

//                         <TouchableOpacity style={styles.checkBox} activeOpacity={.9} onPress={() => setSplitCheck(!splitCheck)}>
//                             {splitCheck ? <SquareCheckIcon color={Colors.primary} size={18} strokeWidth={2} /> : <SquareIcon color={Colors.textLight} size={18} strokeWidth={2} />}
//                             <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
//                                 Split Rent with Others
//                             </NMText>
//                         </TouchableOpacity>

//                         {splitCheck && (<View style={styles.costBox}>
//                             <NMText fontSize={16} fontFamily="medium" color={Colors.textPrimary} style={{ marginTop: 10 }}>
//                                 Invite Co-Payer
//                             </NMText>
//                             <View style={[styles.inRow, { marginTop: 10, justifyContent: 'space-between' }]}>
//                                 <NMTextInput
//                                     placeholder='Enter email'
//                                     mainViewStyle={{ width: '76%' }}
//                                     value={emailInput}
//                                     onChangeText={setEmailInput}
//                                 />
//                                 <NMButton
//                                     title='Add'
//                                     width={'20%'}
//                                     height={46}
//                                     borderRadius={8}
//                                     onPress={handleAddEmail}
//                                 />
//                             </View>

//                             <View style={[styles.inRow, { marginTop: 10, gap: 10 }]}>
//                                 <NMRadioButton
//                                     label='Equally'
//                                     fontSize={16}
//                                     labelColor={Colors.textPrimary}
//                                     selected={radioSelected.equal}
//                                     onPress={() => setRadioSelected({ 'equal': true, 'custom': false })}
//                                 />
//                                 <NMRadioButton
//                                     label='Custom Amounts'
//                                     fontSize={16}
//                                     labelColor={Colors.textPrimary}
//                                     selected={radioSelected.custom}
//                                     onPress={() => setRadioSelected({ 'equal': false, 'custom': true })}
//                                 />
//                             </View>

//                             <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary} style={{ marginTop: 10 }}>
//                                 Participants
//                             </NMText>

//                             <View style={styles.rentalFeeBox}>
//                                 <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
//                                     <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
//                                         <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
//                                             You:
//                                         </NMText>
//                                         {radioSelected.custom ? (
//                                             <View style={{ flex: 1, marginLeft: 8, maxWidth: 120 }}>
//                                                 <NMTextInput
//                                                     placeholder='Amount'
//                                                     mainViewStyle={{ marginVertical: 0 }}
//                                                     value={yourCustomAmount}
//                                                     onChangeText={handleYourAmountChange}
//                                                     keyboardType="numeric"
//                                                 />
//                                             </View>
//                                         ) : (
//                                             <NMText fontSize={16} fontFamily="bold" color={Colors.textPrimary} style={{ marginLeft: 8 }}>
//                                                 {calculateEqualSplit().toFixed(2)}SAR
//                                             </NMText>
//                                         )}
//                                     </View>
//                                     <View style={styles.paidStatus}>
//                                         <NMText fontSize={16} fontFamily="regular" color={Colors.statusText}>
//                                             Paid
//                                         </NMText>
//                                     </View>
//                                 </View>
//                             </View>

//                             {emails.map((email, index) => (
//                                 <View key={index} style={styles.rentalFeeBox}>
//                                     <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
//                                         <View style={{ flexDirection: 'column', flex: 1, }}>
//                                             <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary} style={{ maxWidth: '92%' }} numberOfLines={1}>
//                                                 {email}:
//                                             </NMText>
//                                             {radioSelected.custom ? (
//                                                 <View style={{ flex: 1, marginLeft: 8, maxWidth: 120 }}>
//                                                     <NMTextInput
//                                                         placeholder='Amount'
//                                                         mainViewStyle={{ marginVertical: 0 }}
//                                                         value={emailCustomAmounts[email] || ''}
//                                                         onChangeText={(text) => handleEmailAmountChange(email, text)}
//                                                         keyboardType="numeric"
//                                                     />
//                                                 </View>
//                                             ) : (
//                                                 <NMText fontSize={16} fontFamily="bold" color={Colors.textPrimary} style={{ marginLeft: 8 }}>
//                                                     {calculateEqualSplit().toFixed(2)}SAR
//                                                 </NMText>
//                                             )}
//                                         </View>
//                                         <View style={[styles.paidStatus, { backgroundColor: Colors.statusPendingBg }]}>
//                                             <NMText fontSize={16} fontFamily="regular" color={Colors.statusPendingText}>
//                                                 Pending
//                                             </NMText>
//                                         </View>
//                                     </View>
//                                     <TouchableOpacity onPress={() => handleRemoveEmail(email)} style={{ padding: 4, position: 'absolute', zIndex: 1, right: -10, top: -10 }}>
//                                         <X color={Colors.error || Colors.textPrimary} size={20} strokeWidth={2} />
//                                     </TouchableOpacity>
//                                 </View>
//                             ))}

//                             {/* <NMButton
//                                 title='Send Reminder'
//                                 borderRadius={8}
//                                 backgroundColor='transparent'
//                                 textColor={Colors.primary}
//                                 fontSize={14}
//                                 fontFamily='medium'
//                                 style={{ borderColor: Colors.primary, borderWidth: 1, marginTop: 10 }}
//                             /> */}
//                         </View>)}
//                     </View>

//                     <NMButton
//                         title='Pay Now'
//                         borderRadius={8}
//                         fontFamily='semiBold'
//                         width={'90%'}
//                         style={{ alignSelf: 'center', marginVertical: 10 }}
//                         onPress={() => navigation.navigate('PaymentMethod', { propertyDetails: propertyDetails, checkIn: checkIn, checkOut: checkOut, guest: guest })}
//                     />

//                 </View>
//             </ScrollView>
//         </NMSafeAreaWrapper>
//     );
// };

// export default BookingPayment;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: Colors.background,
//     },
//     headerView: {
//         width: '100%',
//         backgroundColor: Colors.white,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: '5%',
//         paddingVertical: 20,
//         borderBottomLeftRadius: 20,
//         borderBottomRightRadius: 20,
//     },
//     headerIcon: {
//         width: 30,
//         height: 30,
//         resizeMode: 'contain',
//     },
//     inRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     backBox: {
//         width: 30,
//         height: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 8,
//         backgroundColor: Colors.background
//     },
//     titleView: {
//         marginLeft: 10,
//     },
//     contentBox: {
//         marginTop: 10,
//         marginHorizontal: '5%',
//         padding: 14,
//         borderRadius: 8,
//         backgroundColor: Colors.white
//     },
//     checkInBox: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginTop: 10
//     },
//     editView: {
//         width: 30,
//         height: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 4,
//         backgroundColor: Colors.primaryF9
//     },
//     divider: {
//         width: '100%',
//         height: 1,
//         backgroundColor: Colors.border,
//         marginVertical: 10
//     },
//     costBox: {
//         marginTop: 16,
//         padding: 14,
//         borderRadius: 8,
//         backgroundColor: Colors.background,
//     },
//     rentalFeeBox: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginTop: 10,
//         padding: 14,
//         borderRadius: 8,
//         backgroundColor: Colors.white,
//     },
//     checkBox: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginTop: 10,
//         gap: 2
//     },
//     paidStatus: {
//         paddingHorizontal: 14,
//         paddingVertical: 4,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 4,
//         backgroundColor: Colors.statusBg
//     }
// });