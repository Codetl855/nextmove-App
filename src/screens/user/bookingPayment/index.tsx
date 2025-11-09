import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import { Colors } from '../../../theme/colors';
import NMText from '../../../components/common/NMText';
import { ChevronLeft, Edit3Icon, SquareCheckIcon } from 'lucide-react-native'
import NMTextInput from '../../../components/common/NMTextInput';
import NMButton from '../../../components/common/NMButton';
import NMRadioButton from '../../../components/common/NMRadioButton';
const BookingPayment: React.FC = ({ navigation }: any) => {
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
                                    08/08/2025
                                </NMText>
                                <View style={styles.editView}>
                                    <Edit3Icon color={Colors.primary} size={18} strokeWidth={2} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.checkInBox}>
                            <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                                Checkout
                            </NMText>
                            <View style={[styles.inRow, { gap: 6 }]}>
                                <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                                    08/08/2025
                                </NMText>
                                <View style={styles.editView}>
                                    <Edit3Icon color={Colors.primary} size={18} strokeWidth={2} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.checkInBox}>
                            <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                                Guest
                            </NMText>
                            <View style={[styles.inRow, { gap: 6 }]}>
                                <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                                    2
                                </NMText>
                                <View style={styles.editView}>
                                    <Edit3Icon color={Colors.primary} size={18} strokeWidth={2} />
                                </View>
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
                                    500SAR
                                </NMText>
                            </View>

                            <NMText fontSize={16} fontFamily="medium" color={Colors.textPrimary} style={{ marginTop: 10 }}>
                                Special Requests
                            </NMText>
                            <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary} style={{ marginTop: 10 }}>
                                Risk management and compliance, when approached strategically,
                            </NMText>
                        </View>

                        <View style={styles.checkBox}>
                            <SquareCheckIcon color={Colors.primary} size={18} strokeWidth={2} />
                            <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                                Split Rent with Others
                            </NMText>
                        </View>

                        <View style={styles.costBox}>
                            <NMText fontSize={16} fontFamily="medium" color={Colors.textPrimary} style={{ marginTop: 10 }}>
                                Invite Co-Payer
                            </NMText>
                            <View style={[styles.inRow, { marginTop: 10, justifyContent: 'space-between' }]}>
                                <NMTextInput
                                    placeholder='Enter email or phone'
                                    mainViewStyle={{ width: '76%' }}
                                />
                                <NMButton
                                    title='Add'
                                    width={'20%'}
                                    height={46}
                                    borderRadius={8}
                                />
                            </View>

                            <View style={[styles.inRow, { marginTop: 10, gap: 10 }]}>
                                <NMRadioButton
                                    label='Equally'
                                    fontSize={16}
                                    labelColor={Colors.textPrimary}
                                    selected={true}
                                    onPress={() => console.log('radio')}
                                />
                                <NMRadioButton
                                    label='Custom Amounts'
                                    fontSize={16}
                                    labelColor={Colors.textPrimary}
                                    selected={false}
                                    onPress={() => console.log('radio')}
                                />
                            </View>

                            <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary} style={{ marginTop: 10 }}>
                                Participants
                            </NMText>

                            <View style={styles.rentalFeeBox}>
                                <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary} style={{ width: '70%' }}>
                                    You:<NMText fontSize={16} fontFamily="bold" color={Colors.textPrimary}> 500SAR</NMText>
                                </NMText>
                                <View style={styles.paidStatus}>
                                    <NMText fontSize={16} fontFamily="regular" color={Colors.statusText}>
                                        Paid
                                    </NMText>
                                </View>
                            </View>

                            <View style={styles.rentalFeeBox}>
                                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary} style={{ width: '70%' }}>
                                    rashedkabir@gmail.com:<NMText fontSize={16} fontFamily="bold" color={Colors.textPrimary}> 500SAR</NMText>
                                </NMText>
                                <View style={styles.paidStatus}>
                                    <NMText fontSize={16} fontFamily="regular" color={Colors.statusText}>
                                        Paid
                                    </NMText>
                                </View>
                            </View>

                            <View style={styles.rentalFeeBox}>
                                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary} style={{ width: '70%' }}>
                                    rashedkabir@gmail.com:<NMText fontSize={16} fontFamily="bold" color={Colors.textPrimary}> 500SAR</NMText>
                                </NMText>
                                <View style={[styles.paidStatus, { backgroundColor: Colors.statusPendingBg }]}>
                                    <NMText fontSize={16} fontFamily="regular" color={Colors.statusPendingText}>
                                        Pending
                                    </NMText>
                                </View>
                            </View>

                            <NMButton
                                title='Send Reminder'
                                borderRadius={8}
                                backgroundColor='transparent'
                                textColor={Colors.primary}
                                fontSize={14}
                                fontFamily='medium'
                                style={{ borderColor: Colors.primary, borderWidth: 1, marginTop: 10 }}
                            />
                        </View>
                    </View>

                    <NMButton
                        title='Pay Now'
                        borderRadius={8}
                        fontFamily='semiBold'
                        width={'90%'}
                        style={{ alignSelf: 'center', marginVertical: 10 }}
                        onPress={() => navigation.navigate('PaymentMethod')}
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