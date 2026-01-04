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
import { useForm } from '../../../hooks/useForm';
import { apiRequest } from '../../../services/apiClient';
import { showErrorToast, showSuccessToast } from '../../../utils/toastService';

const ForgotPasswordScreen: React.FC = () => {
    const navigation = useNavigation();
    const [selectedOption, setSelectedOption] = useState<'email' | 'mobile'>('email');
    const [loading, setLoading] = useState(false);
    const { values, errors, handleChange, validate } = useForm({
        email: "",
        phone: "",
    });

    const handleSubmit = async () => {

        const isValid = validate({
            email: (v) =>
                selectedOption === 'email' && !v ? 'Email is required' : null,
            phone: (v) =>
                selectedOption === 'mobile' && !v ? 'Phone number is required' : null,
        });

        if (!isValid) return;

        const payload = selectedOption === 'email'
            ? { email: values.email }
            : { phone: values.phone };

        try {
            setLoading(true);

            const { result, error } = await apiRequest({
                endpoint: "v1/mobile/forgot-password",
                method: "POST",
                data: payload,
            });

            if (error) {
                showErrorToast(error);
                return;
            }

            showSuccessToast(result.message || "Verification code sent successfully!");
            navigation.navigate("loginScreen" as never);
            // navigation.navigate('VerificationCodeScreen' as never)

        } catch (err) {
            showErrorToast("Something went wrong!");
        } finally {
            setLoading(false);
        }
    }

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
                                    placeholder="example@mail.com"
                                    value={values.email}
                                    onChangeText={(text) => handleChange("email", text)}
                                    inputType="email"
                                    error={errors.email}
                                    leftIcon={<Mail size={18} color={Colors.textLight} />}
                                />
                            ) : (
                                <NMTextInput
                                    label="Phone"
                                    placeholder="123456789"
                                    value={values.phone}
                                    onChangeText={(text) => handleChange("phone", text)}
                                    keyboardType="phone-pad"
                                    inputType="text"
                                    error={errors.phone}
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
                                loading={loading}
                                onPress={handleSubmit}
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
