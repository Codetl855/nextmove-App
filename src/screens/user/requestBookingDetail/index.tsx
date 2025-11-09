import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper'
import { Colors } from '../../../theme/colors'
import NMText from '../../../components/common/NMText'
import { ChevronLeft } from 'lucide-react-native'
import NMButton from '../../../components/common/NMButton'
import RejectBookingModal from '../../../components/user/RejectBookingModal'

const RequestBookingDetail: React.FC = () => {
    const [rejectModalVisible, setRejectModalVisible] = useState(false)

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                {/* HEADER */}
                <View style={styles.headerView}>
                    <View style={styles.inRow}>
                        <TouchableOpacity style={styles.backBox}>
                            <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                        </TouchableOpacity>
                        <View style={styles.titleView}>
                            <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                                Approval
                            </NMText>
                        </View>
                    </View>
                </View>

                <View style={styles.contentBox}>
                    <NMText fontSize={20} fontFamily="semiBold" color={Colors.text1A}>
                        Booking Details
                    </NMText>

                    {/* Checkin */}
                    <View style={[styles.checkInBox, { marginTop: 26 }]}>
                        <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary} style={{ width: '34%' }}>
                            Checkin
                        </NMText>
                        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                            08/08/2025
                        </NMText>
                    </View>

                    <View style={styles.divider} />

                    {/* Checkout */}
                    <View style={styles.checkInBox}>
                        <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary} style={{ width: '34%' }}>
                            Checkout
                        </NMText>
                        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                            08/08/2025
                        </NMText>
                    </View>

                    <View style={styles.divider} />

                    {/* Guest */}
                    <View style={styles.checkInBox}>
                        <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary} style={{ width: '34%' }}>
                            Guest
                        </NMText>
                        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                            2
                        </NMText>
                    </View>

                    {/* Cost Breakdown */}
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

                        <View style={styles.rentalFeeBox}>
                            <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                                This cozy and well-maintained apartment is located in the heart of Gulberg, one of the most
                                central and secure areas.
                            </NMText>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={[styles.inRow, { marginTop: 10, justifyContent: 'space-between' }]}>
                        <NMButton
                            title="Reject"
                            backgroundColor={Colors.white}
                            textColor={Colors.primary}
                            fontSize={14}
                            fontFamily="semiBold"
                            borderRadius={8}
                            height={44}
                            width="46%"
                            style={{ borderColor: Colors.primary, borderWidth: 1 }}
                            onPress={() => setRejectModalVisible(true)}
                        />
                        <NMButton
                            title="Approve"
                            textColor={Colors.white}
                            fontSize={14}
                            fontFamily="semiBold"
                            borderRadius={8}
                            height={44}
                            width="46%"
                        />
                    </View>
                </View>

                <RejectBookingModal visible={rejectModalVisible} onClose={() => setRejectModalVisible(false)} />
            </ScrollView>
        </NMSafeAreaWrapper>
    )
}

export default RequestBookingDetail

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
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleView: {
        marginLeft: 10,
    },
    backBox: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.background,
    },
    contentBox: {
        marginTop: 10,
        marginHorizontal: '5%',
        padding: 14,
        borderRadius: 8,
        backgroundColor: Colors.white,
    },
    checkInBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 10,
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
})
