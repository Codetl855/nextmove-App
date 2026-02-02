import { Image, StyleSheet, View } from 'react-native'
import React from 'react'
import { Colors } from '../../theme/colors'
import NMText from '../common/NMText'
import NMButton from '../common/NMButton'
import { useNavigation } from '@react-navigation/native'

const PostAnAd: React.FC = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/HomeAd.png')} style={{ width: 112, height: 71, resizeMode: 'contain' }} />
            <View style={{ width: '50%' }}>
                <NMText fontSize={14} fontFamily='medium' color={Colors.textPrimary}>
                    Looking to sell or rent out your property?
                </NMText>
                <NMButton
                    title="Post an Ad"
                    height={40}
                    borderRadius={8}
                    onPress={() => navigation.navigate('AddProperties' as never)} />

            </View>
        </View>
    )
}

export default PostAnAd

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: '5%',
        marginVertical: 10,
        padding: 24,
        backgroundColor: Colors.white,
        borderRadius: 16,
    },
})