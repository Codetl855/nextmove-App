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
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../theme/colors';
import NMText from '../../../components/common/NMText';
import NMButton from '../../../components/common/NMButton';
import NMRadioButton from '../../../components/common/NMRadioButton';
import NMTextInput from '../../../components/common/NMTextInput';
import { Mail, Phone, Lock, CheckCircle, Circle } from 'lucide-react-native';
import { useForm } from '../../../hooks/useForm';
import { validatePassword } from '../../../utils/passwordValidation';
import { apiRequest } from '../../../services/apiClient';
import { showErrorToast, showSuccessToast } from '../../../utils/toastService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen: React.FC = () => {
    const navigation = useNavigation();
    const [selectedOption, setSelectedOption] = useState<'email' | 'mobile'>('email');
    const [loading, setLoading] = useState(false);
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const { values, errors, handleChange, validate } = useForm({
        email: "",
        mobile: "",
        password: "",
    });

    const handleLogin = async () => {
        // const isValid = validate({
        //     email: (v) =>
        //         selectedOption === "email" && !v.includes("@")
        //             ? "Invalid email address"
        //             : null,
        //     mobile: (v) =>
        //         selectedOption === "mobile" && v.length < 10
        //             ? "Invalid mobile number"
        //             : null,
        //     password: validatePassword,
        // });

        // if (!isValid) return;

        const payload =
            selectedOption === "email"
                ? { email: values.email, password: values.password }
                : { mobile: values.mobile, password: values.password };

        try {
            setLoading(true);

            const { result, error } = await apiRequest({
                endpoint: "v1/mobile/login",
                method: "POST",
                data: payload,
            });

            if (error) {
                showErrorToast(error);
                return;
            }

            await AsyncStorage.setItem("loginUser", JSON.stringify(result));
            showSuccessToast("Login successful!");
            navigation.replace("UserBottomTab" as never);

        } catch (err) {
            showErrorToast("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

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
                                Login
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
                                <>
                                    <NMTextInput
                                        label="Email"
                                        placeholder="Enter your email"
                                        value={values.email}
                                        onChangeText={(text) => handleChange("email", text)}
                                        inputType="email"
                                        leftIcon={<Mail size={18} color={Colors.textLight} />}
                                        error={errors.email}
                                    />

                                    <NMTextInput
                                        label="Password"
                                        placeholder="*********"
                                        value={values.password}
                                        onChangeText={(text) => handleChange("password", text)}
                                        inputType="password"
                                        showPasswordToggle
                                        leftIcon={<Lock size={18} color={Colors.textLight} />}
                                        error={errors.password}
                                    />
                                </>
                            ) : (
                                <>
                                    <NMTextInput
                                        label="Mobile Number"
                                        placeholder="123456789"
                                        value={values.mobile}
                                        onChangeText={(text) => handleChange("mobile", text)}
                                        keyboardType="phone-pad"
                                        leftIcon={<Phone size={18} color={Colors.textLight} />}
                                        error={errors.mobile}
                                    />

                                    <NMTextInput
                                        label="Password"
                                        placeholder="*********"
                                        value={values.password}
                                        onChangeText={(text) => handleChange("password", text)}
                                        inputType="password"
                                        showPasswordToggle
                                        leftIcon={<Lock size={18} color={Colors.textLight} />}
                                        error={errors.password}
                                    />
                                </>
                            )}

                            <View style={styles.optionRow}>
                                <TouchableOpacity
                                    style={styles.keepLoggedIn}
                                    activeOpacity={0.8}
                                    onPress={() => setKeepLoggedIn(!keepLoggedIn)}
                                >
                                    {keepLoggedIn ? (
                                        <CheckCircle size={20} color={Colors.white} fill={Colors.primary} strokeWidth={2} />
                                    ) : (
                                        <Circle size={16} color={Colors.textLight} />
                                    )}
                                    <NMText
                                        fontSize={14}
                                        fontFamily="regular"
                                        color={Colors.textPrimary}
                                        style={{ marginLeft: 6 }}
                                    >
                                        Keep me logged in
                                    </NMText>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('ForgotPasswordScreen' as never)}
                                >
                                    <NMText
                                        fontSize={14}
                                        fontFamily="regular"
                                        color={Colors.primary}
                                    >
                                        Forgot Password?
                                    </NMText>
                                </TouchableOpacity>
                            </View>

                            <NMButton
                                title="Login"
                                loading={loading}
                                onPress={handleLogin}
                                backgroundColor={Colors.primary}
                                textColor={Colors.white}
                                fontFamily="bold"
                                style={{ marginTop: 20 }}
                            />

                            <View style={styles.orRow}>
                                <View style={styles.line} />
                                <NMText
                                    fontSize={14}
                                    fontFamily="medium"
                                    color={Colors.textLight}
                                    style={{ marginHorizontal: 10 }}
                                >
                                    OR
                                </NMText>
                                <View style={styles.line} />
                            </View>

                            <View style={styles.socialRow}>
                                <TouchableOpacity>
                                    <Image
                                        source={require('../../../assets/images/FaceBook.png')}
                                        style={styles.socialIcon}
                                    />
                                </TouchableOpacity>
                                {/* <TouchableOpacity>
                                    <Image
                                        source={require('../../../assets/images/Instagram.png')}
                                        style={styles.socialIcon}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Image
                                        source={require('../../../assets/images/LinkedIn.png')}
                                        style={styles.socialIcon}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Image
                                        source={require('../../../assets/images/Apple.png')}
                                        style={styles.socialIcon}
                                    />
                                </TouchableOpacity> */}
                                <TouchableOpacity>
                                    <Image
                                        source={require('../../../assets/images/Google.png')}
                                        style={styles.socialIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Footer */}
                        <View style={styles.footerContainer}>
                            <NMText
                                fontSize={14}
                                fontFamily="regular"
                                color={Colors.textSecondary}
                            >
                                Don’t have an account?{' '}
                            </NMText>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate('SignUpScreen' as never)}
                            >
                                <NMText
                                    fontSize={14}
                                    fontFamily="medium"
                                    color={Colors.primary}
                                >
                                    Register Now
                                </NMText>
                            </TouchableOpacity>
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

export default LoginScreen;

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
    keepLoggedIn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 15,
    },
    socialIcon: {
        width: 38,
        height: 38,
        resizeMode: 'contain',
    },
    bottomLeftImage: {
        width: 220,
        height: 120,
        resizeMode: 'cover',
        marginTop: 20,
        alignSelf: 'flex-start',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
});
