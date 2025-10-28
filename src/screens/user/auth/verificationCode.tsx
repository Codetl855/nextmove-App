import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import { Colors } from '../../../theme/colors';
import NMText from '../../../components/common/NMText';
import NMButton from '../../../components/common/NMButton';
import { useNavigation } from '@react-navigation/native';
import { OtpInput } from 'react-native-otp-entry';

const VerificationCodeScreen: React.FC = () => {
    const navigation = useNavigation();
    const [otp, setOtp] = useState('');

    const handleSubmit = () => {
        console.log('Submitted OTP:', otp);
    };

    const handleResend = () => {
        console.log('Resend OTP');
    };

    return (
        <NMSafeAreaWrapper
            statusBarColor={Colors.black}
            statusBarStyle="light-content"
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Image
                            source={require('../../../assets/images/AuthImage.png')}
                            style={styles.ImageStyle}
                        />

                        <Image
                            source={require('../../../assets/images/Logo.png')}
                            style={styles.logoStyle}
                        />

                        <View style={styles.verificationContainer}>
                            <NMText
                                fontSize={24}
                                fontWeight="medium"
                                color={Colors.textPrimary}
                                textAlign="center"
                                style={{ marginBottom: 6 }}
                            >
                                Verification Code
                            </NMText>

                            <NMText
                                fontSize={16}
                                fontFamily="regular"
                                color={Colors.textLight}
                                textAlign="center"
                                style={{ marginBottom: 20 }}
                            >
                                Please enter the verification code you received
                            </NMText>

                            <OtpInput
                                numberOfDigits={5}
                                onTextChange={(code) => setOtp(code)}
                                autoFocus={false}
                                focusColor={Colors.primary}
                                theme={{
                                    pinCodeContainerStyle: styles.otpBox,
                                    focusedPinCodeContainerStyle: styles.activeOtpBox,
                                }}
                            />

                            <NMText
                                fontSize={14}
                                fontFamily="regular"
                                color={Colors.textLight}
                                textAlign="center"
                                style={{ marginTop: 15 }}
                            >
                                Code is valid for 5 minutes or 3 attempts
                            </NMText>

                            <NMButton
                                title="Resend Code"
                                onPress={handleResend}
                                backgroundColor={'#F4F4F4'}
                                textColor={'#BE9A4E'}
                                fontFamily="semiBold"
                                fontSize={14}
                                width={'40%'}
                                borderRadius={180}
                                style={{ marginTop: 20, alignSelf: 'center' }}
                            />

                            <NMButton
                                title="Submit"
                                onPress={handleSubmit}
                                backgroundColor={Colors.primary}
                                textColor={Colors.white}
                                fontFamily="bold"
                                style={{ marginTop: 20 }}
                            />
                        </View>

                        <View style={styles.footerContainer}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => navigation.goBack()}
                            >
                                <NMText
                                    fontSize={14}
                                    fontFamily="regular"
                                    color={Colors.textPrimary}
                                >
                                    Back to Login
                                </NMText>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    <Image
                        source={require('../../../assets/images/GraplicSlider.png')}
                        style={styles.bottomLeftImage}
                    />
                </View>
            </KeyboardAvoidingView>
        </NMSafeAreaWrapper>
    );
};

export default VerificationCodeScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: Colors.background,
        paddingBottom: 100,
    },
    ImageStyle: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
    },
    logoStyle: {
        width: 134,
        height: 90,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: '-64%',
        marginBottom: 10,
    },
    verificationContainer: {
        width: '94%',
        marginTop: '12%',
        backgroundColor: Colors.white,
        alignSelf: 'center',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    otpBox: {
        width: 48,
        height: 48,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    activeOtpBox: {
        borderColor: Colors.primary,
        backgroundColor: '#f7f9ff',
    },
    footerContainer: {
        marginTop: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomLeftImage: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 220,
        height: 120,
        resizeMode: 'cover',
    },
});
