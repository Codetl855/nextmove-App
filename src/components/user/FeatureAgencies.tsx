import { Image, StyleSheet, View } from 'react-native'
import React from 'react'
import { Colors } from '../../theme/colors'
import NMText from '../common/NMText'

const FeatureAgencies: React.FC = () => {
    return (
        <View style={styles.container}>
            <NMText fontSize={16} fontFamily='medium' color={Colors.textPrimary} style={{ marginBottom: 6 }}>
                Trusted our Feature Agencies
            </NMText>

            <View style={styles.agencyContainer}>
                <View style={styles.agencyBox}>
                    <Image
                        source={require('../../assets/images/Agencies1.png')}
                        style={styles.agencyImage}
                    />
                </View>
                <View style={styles.agencyBox}>
                    <Image
                        source={require('../../assets/images/Agencies2.png')}
                        style={styles.agencyImage}
                    />
                </View>
                <View style={styles.agencyBox}>
                    <Image
                        source={require('../../assets/images/Agencies1.png')}
                        style={styles.agencyImage}
                    />
                </View>
            </View>
        </View>
    )
}

export default FeatureAgencies

const styles = StyleSheet.create({
    container: {
        marginHorizontal: '5%',
        marginVertical: 10,
        padding: 14,
        backgroundColor: Colors.white,
        borderRadius: 16,
    },
    agencyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    agencyBox: {
        width: '32%',
        height: 54,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.border,
        borderRadius: 8,
    },
    agencyImage: {
        width: '70%',
        height: 48,
        resizeMode: 'contain',
    },
})
