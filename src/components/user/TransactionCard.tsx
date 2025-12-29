import { Image, StyleSheet, View } from 'react-native'
import React from 'react'
import NMText from '../common/NMText'
import { Colors } from '../../theme/colors'

interface TransactionCardProps {
    data: {
        property_id: number;
        property_title: string;
        property_address: string;
        property_price: string;
        property_type: string;
        property_created_at: string;
        booking_created_at: string;
        booking_id: number;
        reference: string;
        status: string;
        amount: string;
        currency: string;
        gateway: string;
        created_at: string;
        user_email: string;
        user_mobile: string;
        primary_image: string;
    }
}

const TransactionCard: React.FC<TransactionCardProps> = ({ data }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
    };

    const formatAmount = (amount: string, currency: string) => {
        return `${currency} ${parseFloat(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'succeeded':
            case 'completed':
                return Colors.statusBg;
            case 'pending':
                return '#FFF4E6';
            case 'failed':
                return '#FFE6E6';
            default:
                return Colors.statusBg;
        }
    };

    const getStatusTextColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'succeeded':
            case 'completed':
                return Colors.statusText;
            case 'pending':
                return '#FF8C00';
            case 'failed':
                return '#DC2626';
            default:
                return Colors.statusText;
        }
    };

    return (
        <View style={styles.mainContainer}>
            {data.primary_image ? (
                <Image
                    source={{ uri: data.primary_image }}
                    style={styles.avatar}
                />
            ) : (
                <View style={styles.avatar} />
            )}
            <View style={styles.textContainer}>
                <NMText fontSize={16} fontFamily='medium' color={Colors.textPrimary}>
                    {data.property_title}
                </NMText>
                <NMText fontSize={14} fontFamily='regular' color={Colors.textPrimary}>
                    {data.gateway.charAt(0).toUpperCase() + data.gateway.slice(1)} • Ref: {data.reference.slice(0, 8)}
                </NMText>
                <View style={styles.inRow}>
                    <NMText fontSize={12} fontFamily='regular' color={Colors.textLight}>
                        {formatDate(data.created_at)}
                    </NMText>
                    <NMText fontSize={14} fontFamily='semiBold' color={Colors.primary}>
                        {formatAmount(data.amount, data.currency)}
                    </NMText>
                </View>
            </View>
            <View style={[styles.statusBox, { backgroundColor: getStatusColor(data.status) }]}>
                <NMText
                    fontSize={12}
                    fontFamily='regular'
                    color={getStatusTextColor(data.status)}
                >
                    {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </NMText>
            </View>
        </View>
    )
}

export default TransactionCard

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        marginVertical: 6,
        marginHorizontal: '5%',
        padding: 14,
        borderRadius: 12,
        backgroundColor: Colors.white
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.border,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    statusBox: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: Colors.statusBg,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 10,
        right: 10
    }
})
// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import NMText from '../common/NMText'
// import { Colors } from '../../theme/colors'

// const TransactionCard: React.FC = () => {
//     return (
//         <View style={styles.mainContainer}>
//             <View style={styles.avater} />
//             <View style={styles.textContainer}>
//                 <NMText fontSize={16} fontFamily='medium' color={Colors.textPrimary}>
//                     Sarah M. Brooks
//                 </NMText>
//                 <NMText fontSize={14} fontFamily='regular' color={Colors.textPrimary} >
//                     Mastercard **** 3467
//                 </NMText>
//                 <View style={styles.inRow}>
//                     <NMText fontSize={12} fontFamily='regular' color={Colors.textLight}>
//                         05/05/2025
//                     </NMText>
//                     <NMText fontSize={14} fontFamily='semiBold' color={Colors.primary}>
//                         $45,842
//                     </NMText>
//                 </View>
//             </View>
//             <View style={styles.statusBox}>
//                 <NMText fontSize={12} fontFamily='regular' color={Colors.statusText}>
//                     Completed
//                 </NMText>
//             </View>
//         </View>
//     )
// }

// export default TransactionCard

// const styles = StyleSheet.create({
//     mainContainer: {
//         flexDirection: 'row',
//         marginVertical: 6,
//         marginHorizontal: '5%',
//         padding: 14,
//         borderRadius: 12,
//         backgroundColor: Colors.white
//     },
//     avater: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: Colors.border,
//         marginRight: 12,
//     },
//     textContainer: {
//         flex: 1,
//     },
//     inRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginTop: 10
//     },
//     statusBox: {
//         padding: 8,
//         borderRadius: 8,
//         backgroundColor: Colors.statusBg,
//         justifyContent: 'center',
//         alignItems: 'center',
//         position: 'absolute',
//         top: 10,
//         right: 10
//     }
// })