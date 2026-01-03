import { ScrollView, StyleSheet, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper'
import { Colors } from '../../../theme/colors'
import NMText from '../../../components/common/NMText'
import { ChevronLeft } from 'lucide-react-native'
import NMButton from '../../../components/common/NMButton'
import { useNavigation, useRoute } from '@react-navigation/native'
import { apiRequest } from '../../../services/apiClient'
import { showErrorToast, showSuccessToast } from '../../../utils/toastService'
import ConfirmationModal from '../../../components/user/ConfirmationModal'

interface BookingRequest {
    booking_id: number
    property_id: number
    property_title: string
    property_address: string
    property_price: string
    property_type: string
    property_created_at: string
    booking_created_at: string
    check_in: string
    check_out: string
    guests: number
    duration_days: number
    status: string
    user_name: string
    user_first_name: string
    user_last_name: string
    user_email: string
    user_mobile: string
    primary_image: string
}

const RequestBookingDetail: React.FC = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const routeParams = route.params as any
    const booking: BookingRequest = routeParams?.booking

    const [loading, setLoading] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)
    if (!booking) {
        return (
            <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                    <NMText fontSize={16} color={Colors.textPrimary}>
                        Booking not found
                    </NMText>
                </View>
            </NMSafeAreaWrapper>
        )
    }

    const formatDate = (dateString: string): string => {
        if (!dateString) return ''
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) {
                return dateString
            }
            return date.toLocaleDateString('en-GB')
        } catch (error) {
            return dateString
        }
    }

    const handleCancel = async () => {
        try {
            setLoading(true)
            const { result, error } = await apiRequest({
                endpoint: `v1/booking-requests/${booking.booking_id}/reject`,
                method: 'POST',
            })

            if (result) {
                showSuccessToast('Booking cancelled successfully')
                navigation.goBack()
            }

            if (error) {
                showErrorToast(`Error cancelling booking: ${error}`)
            }
        } catch (err) {
            console.error('Error cancelling booking:', err)
            showErrorToast('Failed to cancel booking')
        } finally {
            setLoading(false)
            setShowCancelModal(false)
        }
    }

    const totalPrice = parseFloat(booking.property_price) * booking.duration_days
    const serviceFee = totalPrice * 0.1
    const finalTotal = totalPrice + serviceFee

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                {/* HEADER */}
                <View style={styles.headerView}>
                    <View style={styles.inRow}>
                        <TouchableOpacity style={styles.backBox} onPress={() => navigation.goBack()}>
                            <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                        </TouchableOpacity>
                        <View style={styles.titleView}>
                            <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                                Booking Details
                            </NMText>
                        </View>
                    </View>
                </View>

                {/* Property Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: booking.primary_image }} style={styles.propertyImage} />
                </View>

                <View style={styles.contentBox}>
                    <NMText fontSize={20} fontFamily="semiBold" color={Colors.text1A}>
                        Booking Details
                    </NMText>

                    {/* Property Title */}
                    <View style={[styles.checkInBox, { marginTop: 26 }]}>
                        <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary} style={{ width: '34%' }}>
                            Property
                        </NMText>
                        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary} style={{ flex: 1 }}>
                            {booking.property_title}
                        </NMText>
                    </View>

                    <View style={styles.divider} />

                    {/* Property Address */}
                    <View style={styles.checkInBox}>
                        <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary} style={{ width: '34%' }}>
                            Address
                        </NMText>
                        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary} style={{ flex: 1 }}>
                            {booking.property_address}
                        </NMText>
                    </View>

                    <View style={styles.divider} />

                    {/* Checkin */}
                    <View style={styles.checkInBox}>
                        <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary} style={{ width: '34%' }}>
                            Check-in
                        </NMText>
                        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                            {formatDate(booking.check_in)}
                        </NMText>
                    </View>

                    <View style={styles.divider} />

                    {/* Checkout */}
                    <View style={styles.checkInBox}>
                        <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary} style={{ width: '34%' }}>
                            Check-out
                        </NMText>
                        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                            {formatDate(booking.check_out)}
                        </NMText>
                    </View>

                    <View style={styles.divider} />

                    {/* Guest */}
                    <View style={styles.checkInBox}>
                        <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary} style={{ width: '34%' }}>
                            Guests
                        </NMText>
                        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                            {booking.guests}
                        </NMText>
                    </View>

                    <View style={styles.divider} />

                    {/* Duration */}
                    <View style={styles.checkInBox}>
                        <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary} style={{ width: '34%' }}>
                            Duration
                        </NMText>
                        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                            {booking.duration_days} {booking.duration_days === 1 ? 'day' : 'days'}
                        </NMText>
                    </View>

                    <View style={styles.divider} />

                    {/* User Info */}
                    <View style={styles.checkInBox}>
                        <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary} style={{ width: '34%' }}>
                            Guest Name
                        </NMText>
                        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary} style={{ flex: 1 }}>
                            {booking.user_name}
                        </NMText>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.checkInBox}>
                        <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary} style={{ width: '34%' }}>
                            Email
                        </NMText>
                        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary} style={{ flex: 1 }}>
                            {booking.user_email}
                        </NMText>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.checkInBox}>
                        <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary} style={{ width: '34%' }}>
                            Mobile
                        </NMText>
                        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                            {booking.user_mobile}
                        </NMText>
                    </View>

                    {/* Cost Breakdown */}
                    <View style={styles.costBox}>
                        <NMText fontSize={18} fontFamily="semiBold" color={Colors.textPrimary}>
                            Cost Breakdown
                        </NMText>

                        <View style={styles.rentalFeeBox}>
                            <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                                Rental Fee ({booking.duration_days} {booking.duration_days === 1 ? 'day' : 'days'})
                            </NMText>
                            <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                                SAR {totalPrice.toFixed(2)}
                            </NMText>
                        </View>

                        <View style={styles.rentalFeeBox}>
                            <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                                Service Fee
                            </NMText>
                            <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                                SAR {serviceFee.toFixed(2)}
                            </NMText>
                        </View>

                        <View style={styles.rentalFeeBox}>
                            <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                                Total
                            </NMText>
                            <NMText fontSize={16} fontFamily="semiBold" color={Colors.primary}>
                                SAR {finalTotal.toFixed(2)}
                            </NMText>
                        </View>
                    </View>

                    {/* Cancel Button */}
                    {booking.status !== "cancelled" && (<View style={{ marginTop: 20 }}>
                        <NMButton
                            title="Cancel Booking"
                            backgroundColor={Colors.error}
                            textColor={Colors.white}
                            fontSize={14}
                            fontFamily="semiBold"
                            borderRadius={8}
                            height={44}
                            width="100%"
                            onPress={() => setShowCancelModal(true)}
                            loading={loading}
                            disabled={loading}
                        />
                    </View>)}
                </View>
            </ScrollView>
            <ConfirmationModal
                visible={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={() => handleCancel()}
                title="Cancel Booking Request?"
                message="Are you sure you want to cancel this booking request? This action cannot be undone."
                buttonName="Delete"
            />
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
    imageContainer: {
        marginTop: 10,
        marginHorizontal: '5%',
        borderRadius: 8,
        overflow: 'hidden',
    },
    propertyImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
})
