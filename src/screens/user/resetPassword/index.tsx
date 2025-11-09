import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, Lock, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import NMText from '../../../components/common/NMText';
import NMTextInput from '../../../components/common/NMTextInput';
import NMButton from '../../../components/common/NMButton';
import { Colors } from '../../../theme/colors';

const ResetPasswordScreen: React.FC = () => {
    const navigation = useNavigation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleContinue = () => {
        console.log('Password reset submitted');
    };

    const passwordRequirements = [
        'Password must be between 8 to 32 characters.',
        'Containing at least one number.',
        'Optional special characters: !@#$%^&*().',
        'Should be alphanumeric.',
    ];

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                        </TouchableOpacity>
                        <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary} style={styles.headerTitle}>
                            Reset Password
                        </NMText>
                    </View>
                    <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} />
                </View>

                <View style={styles.contentBox}>
                    <Image source={require('../../../assets/images/lockyellow.png')} style={styles.contentImage} />

                    <NMTextInput
                        label="Current Password"
                        placeholder="********"
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        inputType="password"
                        showPasswordToggle
                        leftIcon={<Lock size={18} color={Colors.textLight} />}
                    />

                    <NMTextInput
                        label="New Password"
                        placeholder="********"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        inputType="password"
                        showPasswordToggle
                        leftIcon={<Lock size={18} color={Colors.textLight} />}
                    />

                    <NMTextInput
                        label="Confirm Password"
                        placeholder="********"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        inputType="password"
                        showPasswordToggle
                        leftIcon={<Lock size={18} color={Colors.textLight} />}
                    />

                    <NMText fontSize={14} fontFamily="semiBold" color={Colors.textPrimary} style={{ marginTop: 16 }}>
                        Password Requirements:
                    </NMText>

                    {passwordRequirements.map((req, index) => (
                        <View key={index} style={styles.requirementRow}>
                            <Check size={18} color={Colors.primary} />
                            <NMText fontSize={14} fontFamily="light" color={Colors.textLight} style={styles.requirementText}>
                                {req}
                            </NMText>
                        </View>
                    ))}

                    <NMButton title="Continue" onPress={handleContinue} />
                </View>
            </ScrollView>
        </NMSafeAreaWrapper>
    );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        width: '100%',
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        paddingVertical: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        marginLeft: 10,
    },
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    backButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.background,
    },
    contentBox: {
        marginTop: 20,
        marginHorizontal: '5%',
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        paddingVertical: 24,
        borderRadius: 12,
        gap: 12,
    },
    contentImage: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    requirementRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    requirementText: {
        marginLeft: 8,
    },
});
