import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../theme/colors';
import NMText from '../../../components/common/NMText';
import NMButton from '../../../components/common/NMButton';
import NMRadioButton from '../../../components/common/NMRadioButton';
import NMTextInput from '../../../components/common/NMTextInput';
import { Mail, Phone } from 'lucide-react-native';

const ForgotPasswordScreen: React.FC = () => {
    const navigation = useNavigation();
    const [selectedOption, setSelectedOption] = useState<'email' | 'mobile'>('email');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.black} statusBarStyle="light-content">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Image
                        source={require('../../../assets/images/AuthImage.png')}
                        style={styles.ImageStyle}
                    />

                    <View style={styles.mainContent}>
                        <Image
                            source={require('../../../assets/images/Logo.png')}
                            style={styles.logoStyle}
                        />

                        <View style={styles.loginContainer}>
                            <NMText
                                fontSize={24}
                                fontWeight="medium"
                                color={Colors.textPrimary}
                                textAlign="center"
                                style={{ marginBottom: 10 }}
                            >
                                Forget Password
                            </NMText>

                            <View style={styles.rowSection}>
                                <NMRadioButton
                                    label="Email"
                                    labelColor={Colors.textLight}
                                    selected={selectedOption === 'email'}
                                    onPress={() => setSelectedOption('email')}
                                />
                                <NMRadioButton
                                    label="Mobile Number"
                                    labelColor={Colors.textLight}
                                    selected={selectedOption === 'mobile'}
                                    marginLeft={20}
                                    onPress={() => setSelectedOption('mobile')}
                                />
                            </View>

                            {selectedOption === 'email' ? (
                                <NMTextInput
                                    label="Email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    inputType="email"
                                    leftIcon={<Mail size={18} color={Colors.textLight} />}
                                />
                            ) : (
                                <NMTextInput
                                    label="Mobile Number"
                                    placeholder="+92 303 55566545"
                                    value={mobile}
                                    onChangeText={setMobile}
                                    keyboardType="phone-pad"
                                    leftIcon={<Phone size={18} color={Colors.textLight} />}
                                />
                            )}

                            <View style={styles.optionRow}>
                                <NMText
                                    fontSize={14}
                                    fontFamily="regular"
                                    color={Colors.textLight}
                                >
                                    We will send you a verification code via your email if it's already existed
                                </NMText>
                            </View>

                            <NMButton
                                title="Send"
                                onPress={() => navigation.navigate('VerificationCodeScreen' as never)}
                                backgroundColor={Colors.primary}
                                textColor={Colors.white}
                                fontFamily="bold"
                                style={{ marginTop: 20 }}
                            />
                        </View>
                    </View>

                    <Image
                        source={require('../../../assets/images/GraplicSlider.png')}
                        style={styles.bottomLeftImage}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </NMSafeAreaWrapper>
    );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        backgroundColor: Colors.background,
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
        marginTop: '-68%',
        marginBottom: 10,
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 16,
    },
    loginContainer: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        marginTop: 10,
    },
    rowSection: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    bottomLeftImage: {
        width: 220,
        height: 120,
        resizeMode: 'cover',
        marginTop: 20,
        alignSelf: 'flex-start',
    },
});
