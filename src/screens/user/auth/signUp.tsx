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

const SignUpScreen: React.FC = () => {
    const navigation = useNavigation();
    const [userType, setUserType] = useState<'personal' | 'agency'>('personal');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agencyName, setAgencyName] = useState('');
    const [agencyEmail, setAgencyEmail] = useState('');
    const [agencyPhone, setAgencyPhone] = useState('');
    const [agencyPassword, setAgencyPassword] = useState('');
    const [agencyConfirmPassword, setAgencyConfirmPassword] = useState('');

    const handleSignUp = () => {
        if (userType === 'personal') {
            console.log('SignUp Personal:', { firstName, lastName, email, phone, password, confirmPassword });
        } else {
            console.log('SignUp Agency:', { agencyName, agencyEmail, agencyPhone, agencyPassword, agencyConfirmPassword });
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
                                        placeholder="John"
                                        value={firstName}
                                        onChangeText={setFirstName}
                                        style={{ flex: 1, marginRight: 10 }}
                                    />
                                    <NMTextInput
                                        label="Last Name"
                                        placeholder="Doe"
                                        value={lastName}
                                        onChangeText={setLastName}
                                        style={{ flex: 1 }}
                                    />
                                    <NMTextInput
                                        label="Email"
                                        placeholder="example@mail.com"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                    <NMTextInput
                                        label="Phone"
                                        placeholder="+92 303 55566545"
                                        value={phone}
                                        onChangeText={setPhone}
                                        keyboardType="phone-pad"
                                    />
                                    <View style={styles.row50}>
                                        <NMTextInput
                                            label="Create Password"
                                            placeholder="*********"
                                            value={password}
                                            onChangeText={setPassword}
                                            inputType="password"
                                            showPasswordToggle
                                            mainViewStyle={{ width: '48%' }}
                                        />
                                        <NMTextInput
                                            label="Confirm Password"
                                            placeholder="*********"
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            inputType="password"
                                            showPasswordToggle
                                            mainViewStyle={{ width: '48%' }}
                                        />
                                    </View>
                                </>
                            ) : (
                                <>
                                    <NMTextInput
                                        label="Agency Name"
                                        placeholder="Your Agency Name"
                                        value={agencyName}
                                        onChangeText={setAgencyName}
                                    />
                                    <NMTextInput
                                        label="Agency Email"
                                        placeholder="agency@mail.com"
                                        value={agencyEmail}
                                        onChangeText={setAgencyEmail}
                                    />
                                    <NMTextInput
                                        label="Agency Contact Number"
                                        placeholder="+92 303 55566545"
                                        value={agencyPhone}
                                        onChangeText={setAgencyPhone}
                                        keyboardType="phone-pad"
                                    />
                                    <View style={styles.row50}>
                                        <NMTextInput
                                            label="Create Password"
                                            placeholder="*********"
                                            value={agencyPassword}
                                            onChangeText={setAgencyPassword}
                                            inputType="password"
                                            showPasswordToggle
                                            mainViewStyle={{ width: '48%' }}
                                        />
                                        <NMTextInput
                                            label="Confirm Password"
                                            placeholder="*********"
                                            value={agencyConfirmPassword}
                                            onChangeText={setAgencyConfirmPassword}
                                            inputType="password"
                                            showPasswordToggle
                                            mainViewStyle={{ width: '48%' }}
                                        />
                                    </View>
                                </>
                            )}

                            <NMButton
                                title="Sign Up"
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
                                <TouchableOpacity>
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
                                </TouchableOpacity>
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
