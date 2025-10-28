import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../theme/colors';
import NMText from '../../../components/common/NMText';
import NMButton from '../../../components/common/NMButton';

const SplashScreen: React.FC = () => {

    const navigation = useNavigation();

    return (
        <NMSafeAreaWrapper
            statusBarColor={Colors.black}
            statusBarStyle="light-content"
        >
            <Image source={require('../../../assets/images/Spash.png')} style={styles.ImageStyle} />
            <Image source={require('../../../assets/images/Logo.png')} style={styles.logoStyle} />
            <View style={styles.textContainer}>
                <NMText fontSize={28} color={Colors.white} fontFamily='regular'>
                    Find A Home of
                </NMText>
                <NMText fontSize={28} color={Colors.white} fontFamily='bold'>
                    Your Dreams
                </NMText>
                <NMText fontSize={16} color={Colors.white} fontFamily='regular' style={{ marginVertical: 10 }}>
                    Finding a place to live can be a difficult task, therefore we have done our best to simplify it.
                </NMText>
                <NMButton
                    title="Get Started"
                    fontFamily='semiBold'
                    textColor={Colors.btnTextPrimary}
                    backgroundColor={Colors.white}
                    onPress={() => navigation?.replace('loginScreen')}
                />
            </View>
        </NMSafeAreaWrapper>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    ImageStyle: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    logoStyle: {
        width: 134,
        height: 90,
        resizeMode: 'contain',
        position: 'absolute',
        alignSelf: 'center',
        top: '7%',
    },
    textContainer: {
        paddingHorizontal: 28,
        position: 'absolute',
        bottom: '6%',
        alignSelf: 'center',
        alignItems: 'center',
    },
});
