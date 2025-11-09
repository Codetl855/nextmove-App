import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper'
import { Colors } from '../../../theme/colors'
import NMText from '../../../components/common/NMText'
import { ChevronLeft, MapPin } from 'lucide-react-native'
import NMButton from '../../../components/common/NMButton'

const BookingRequestStatusDetail: React.FC = () => {

    const propertyStatus = 'Pending' as string

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
                                Booking Detail
                            </NMText>
                        </View>
                    </View>
                </View>

                <View style={styles.contentBox}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400' }}
                        style={styles.imageStyle}
                    />

                    <View
                        style={[
                            styles.statusView,
                            {
                                backgroundColor:
                                    propertyStatus === 'Completed'
                                        ? Colors.statusBg
                                        : propertyStatus === 'Cancelled'
                                            ? Colors.statusSoldBg
                                            : Colors.statusPendingBg,
                            },
                        ]}
                    >
                        <NMText
                            fontSize={12}
                            fontFamily="regular"
                            color={
                                propertyStatus === 'Completed'
                                    ? Colors.statusText
                                    : propertyStatus === 'Cancelled'
                                        ? Colors.statusSoldText
                                        : Colors.statusPendingText
                            }
                        >
                            {propertyStatus}
                        </NMText>
                    </View>

                    <NMText fontSize={16} fontFamily="semiBold" color={Colors.text1A}>
                        PIK Villa House
                    </NMText>

                    <View style={styles.inRow}>
                        <MapPin color={Colors.primary} size={16} strokeWidth={1.5} />
                        <NMText fontSize={14} fontFamily="regular" color={Colors.primary}>
                            102 Ingraham St, Brooklyn, NY 11237
                        </NMText>
                    </View>

                    <View style={[styles.checkInBox, { marginTop: 26 }]}>
                        <NMText fontSize={14} fontFamily="regular" color={Colors.textLight} style={{ width: '34%' }}>
                            Type
                        </NMText>
                        <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary}>
                            Apartment
                        </NMText>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.checkInBox}>
                        <NMText fontSize={14} fontFamily="regular" color={Colors.textLight} style={{ width: '34%' }}>
                            Contact
                        </NMText>
                        <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary}>
                            +231 06-75820711
                        </NMText>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.checkInBox}>
                        <NMText fontSize={14} fontFamily="regular" color={Colors.textLight} style={{ width: '34%' }}>
                            Booking Date
                        </NMText>
                        <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary}>
                            08/05/2025
                        </NMText>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.checkInBox}>
                        <NMText fontSize={14} fontFamily="regular" color={Colors.textLight} style={{ width: '34%' }}>
                            Duration
                        </NMText>
                        <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary}>
                            Weekly
                        </NMText>
                    </View>

                    <NMText fontSize={16} fontFamily="medium" color={Colors.textPrimary} style={{ marginTop: 10 }}>
                        Reason:
                    </NMText>
                    <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary} style={{ marginVertical: 10 }}>
                        The property was exactly as described and the buying process was smooth and hassle-free.
                    </NMText>

                    <NMButton
                        title="Re-Book"
                        textColor={Colors.white}
                        fontSize={14}
                        fontFamily="semiBold"
                        borderRadius={8}
                        height={44}
                    />
                </View>
            </ScrollView>
        </NMSafeAreaWrapper>
    )
}

export default BookingRequestStatusDetail

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
    imageStyle: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginBottom: 12,
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
    statusView: {
        position: 'absolute',
        top: 14,
        right: 14,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
})
