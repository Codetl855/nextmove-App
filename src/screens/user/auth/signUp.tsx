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
import NMTextInput from '../../../components/common/NMTextInput';
import NMRadioButton from '../../../components/common/NMRadioButton';
import { useForm } from '../../../hooks/useForm';
import { validatePassword } from '../../../utils/passwordValidation';
import { apiRequest } from '../../../services/apiClient';
import { showErrorToast, showSuccessToast } from '../../../utils/toastService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen: React.FC = () => {
    const navigation = useNavigation();
    const [userType, setUserType] = useState<'personal' | 'agency'>('personal');
    const [loading, setLoading] = useState(false);
    const { values, errors, handleChange, validate } = useForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agencyName: '',
        agencyEmail: '',
        agencyPhone: '',
        agencyPassword: '',
        agencyConfirmPassword: '',
    });

    const handleSignUp = async () => {

        const isValid = validate({
            firstName: (v) =>
                userType === 'personal' && !v ? 'First name is required' : null,
            lastName: (v) =>
                userType === 'personal' && !v ? 'Last name is required' : null,
            email: (v) =>
                userType === 'personal' && (!v || !v.includes('@'))
                    ? 'Invalid email address'
                    : null,
            phone: (v) =>
                userType === 'personal' && (!v || v.length < 10)
                    ? 'Invalid phone number'
                    : null,
            password: (v) =>
                userType === 'personal'
                    ? !v
                        ? 'Password is required'
                        : validatePassword(v)
                    : null,
            confirmPassword: (v) =>
                userType === 'personal' && v !== values.password
                    ? 'Passwords do not match'
                    : null,
            agencyName: (v) =>
                userType === 'agency' && !v ? 'Agency name is required' : null,
            agencyEmail: (v) =>
                userType === 'agency' && (!v || !v.includes('@'))
                    ? 'Invalid agency email'
                    : null,
            agencyPhone: (v) =>
                userType === 'agency' && (!v || v.length < 10)
                    ? 'Invalid agency phone number'
                    : null,
            agencyPassword: (v) =>
                userType === 'agency'
                    ? !v
                        ? 'Password is required'
                        : validatePassword(v)
                    : null,
            agencyConfirmPassword: (v) =>
                userType === 'agency' && v !== values.agencyPassword
                    ? 'Passwords do not match'
                    : null,
        });

        if (!isValid) return;

        const payload =
            userType === 'personal'
                ? {
                    first_name: values.firstName,
                    last_name: values.lastName,
                    email: values.email,
                    mobile: values.phone,
                    password: values.password,
                    password_confirmation: values.confirmPassword,
                }
                : {
                    agency_name: values.agencyName,
                    email: values.agencyEmail,
                    mobile: values.agencyPhone,
                    password: values.agencyPassword,
                    password_confirmation: values.agencyConfirmPassword,
                };

        const fieldMap: Record<string, keyof typeof values> = {
            first_name: 'firstName',
            last_name: 'lastName',
            mobile: userType === 'personal' ? 'phone' : 'agencyPhone',
            email: userType === 'personal' ? 'email' : 'agencyEmail',
            password: userType === 'personal' ? 'password' : 'agencyPassword',
            password_confirmation: userType === 'personal' ? 'confirmPassword' : 'agencyConfirmPassword',
            agency_name: 'agencyName',
        };

        try {
            setLoading(true);

            const { result, error, fieldErrors } = await apiRequest({
                endpoint: 'v1/mobile/register',
                method: 'POST',
                data: payload,
            });

            if (fieldErrors) {
                Object.keys(fieldErrors).forEach((key) => {
                    const mappedKey = fieldMap[key] || (key as keyof typeof values);
                    handleChange(
                        mappedKey,
                        values[mappedKey],
                        fieldErrors[key][0]
                    );
                });
                return;
            }

            if (error) {
                showErrorToast(error);
                return;
            }
            // console.log('result check', JSON.stringify(result));
            // await AsyncStorage.setItem('loginUser', JSON.stringify(result));
            showSuccessToast(result.message || 'Registration successful!');
            navigation.navigate('loginScreen' as never);
        } catch (err) {
            showErrorToast('Something went wrong!');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.black} statusBarStyle="light-content">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
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

                        <View style={styles.signupContainer}>
                            <NMText
                                fontSize={24}
                                fontWeight="medium"
                                color={Colors.textPrimary}
                                textAlign="center"
                                style={{ marginBottom: 10 }}
                            >
                                Sign Up
                            </NMText>

                            <View style={styles.rowSection}>
                                <NMRadioButton
                                    label="Personal Use"
                                    labelColor={Colors.textLight}
                                    selected={userType === 'personal'}
                                    onPress={() => setUserType('personal')}
                                />
                                <NMRadioButton
                                    label="Register Agency"
                                    labelColor={Colors.textLight}
                                    selected={userType === 'agency'}
                                    marginLeft={20}
                                    onPress={() => setUserType('agency')}
                                />
                            </View>

                            {userType === 'personal' ? (
                                <>
                                    <NMTextInput
                                        label="First Name"
                                        placeholder="First Name"
                                        value={values.firstName}
                                        onChangeText={(text) => handleChange("firstName", text)}
                                        inputType="text"
                                        error={errors.firstName}
                                        required
                                    />
                                    <NMTextInput
                                        label="Last Name"
                                        placeholder="Last Name"
                                        value={values.lastName}
                                        onChangeText={(text) => handleChange("lastName", text)}
                                        inputType="text"
                                        error={errors.lastName}
                                        required
                                    />

                                    <NMTextInput
                                        label="Email"
                                        placeholder="example@mail.com"
                                        value={values.email}
                                        onChangeText={(text) => handleChange("email", text)}
                                        inputType="email"
                                        error={errors.email}
                                        required
                                    />
                                    <NMTextInput
                                        label="Mobile Number"
                                        placeholder="123456789"
                                        value={values.phone}
                                        onChangeText={(text) => handleChange("phone", text)}
                                        keyboardType="phone-pad"
                                        inputType="text"
                                        error={errors.phone}
                                        required
                                    />

                                    <View style={styles.row50}>
                                        <NMTextInput
                                            label="Create Password"
                                            placeholder="*********"
                                            value={values.password}
                                            onChangeText={(text) => handleChange("password", text)}
                                            inputType="password"
                                            showPasswordToggle
                                            error={errors.password}
                                            mainViewStyle={{ width: '48%' }}
                                            required
                                        />
                                        <NMTextInput
                                            label="Confirm Password"
                                            placeholder="*********"
                                            value={values.confirmPassword}
                                            onChangeText={(text) => handleChange("confirmPassword", text)}
                                            inputType="password"
                                            showPasswordToggle
                                            error={errors.confirmPassword}
                                            mainViewStyle={{ width: '48%' }}
                                            required
                                        />
                                    </View>
                                </>
                            ) : (
                                <>
                                    <NMTextInput
                                        label="Agency Name"
                                        placeholder="Your Agency Name"
                                        value={values.agencyName}
                                        onChangeText={(text) => handleChange("agencyName", text)}
                                        inputType="text"
                                        error={errors.agencyName}
                                        required
                                    />
                                    <NMTextInput
                                        label="Agency Email"
                                        placeholder="agency@mail.com"
                                        value={values.agencyEmail}
                                        onChangeText={(text) => handleChange("agencyEmail", text)}
                                        inputType="email"
                                        error={errors.agencyEmail}
                                        required
                                    />
                                    <NMTextInput
                                        label="Agency Contact Number"
                                        placeholder="123456789"
                                        value={values.agencyPhone}
                                        onChangeText={(text) => handleChange("agencyPhone", text)}
                                        keyboardType="phone-pad"
                                        inputType="text"
                                        error={errors.agencyPhone}
                                        required
                                    />
                                    <View style={styles.row50}>
                                        <NMTextInput
                                            label="Create Password"
                                            placeholder="*********"
                                            value={values.agencyPassword}
                                            onChangeText={(text) => handleChange("agencyPassword", text)}
                                            inputType="password"
                                            showPasswordToggle
                                            error={errors.agencyPassword}
                                            mainViewStyle={{ width: '48%' }}
                                            required
                                        />
                                        <NMTextInput
                                            label="Confirm Password"
                                            placeholder="*********"
                                            value={values.agencyConfirmPassword}
                                            onChangeText={(text) => handleChange("agencyConfirmPassword", text)}
                                            inputType="password"
                                            showPasswordToggle
                                            error={errors.agencyConfirmPassword}
                                            mainViewStyle={{ width: '48%' }}
                                            required
                                        />
                                    </View>
                                </>
                            )}

                            <NMButton
                                title="Sign Up"
                                loading={loading}
                                onPress={handleSignUp}
                                backgroundColor={Colors.primary}
                                textColor={Colors.white}
                                fontFamily="bold"
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
                                Already have an account?{' '}
                            </NMText>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => navigation.goBack()}
                            >
                                <NMText
                                    fontSize={14}
                                    fontFamily="medium"
                                    color={Colors.primary}
                                >
                                    Login
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

export default SignUpScreen;

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
    mainContent: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 40,
        marginTop: '-58%'
    },
    signupContainer: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    rowSection: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    row50: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    orRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
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
        marginTop: 10,
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
        alignSelf: 'flex-start',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
