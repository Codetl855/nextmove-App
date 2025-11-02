import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import NMText from '../common/NMText'
import { Colors } from '../../theme/colors'

const TransactionCard: React.FC = () => {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.avater} />
            <View style={styles.textContainer}>
                <NMText fontSize={16} fontFamily='medium' color={Colors.textPrimary}>
                    Sarah M. Brooks
                </NMText>
                <NMText fontSize={14} fontFamily='regular' color={Colors.textPrimary} >
                    Mastercard **** 3467
                </NMText>
                <View style={styles.inRow}>
                    <NMText fontSize={12} fontFamily='regular' color={Colors.textLight}>
                        05/05/2025
                    </NMText>
                    <NMText fontSize={14} fontFamily='semiBold' color={Colors.primary}>
                        $45,842
                    </NMText>
                </View>
            </View>
            <View style={styles.statusBox}>
                <NMText fontSize={12} fontFamily='regular' color={Colors.statusText}>
                    Completed
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
    avater: {
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