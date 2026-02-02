import React, { useState } from 'react';
import {
    Modal,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import NMText from '../common/NMText';
import NMButton from '../common/NMButton';
import { Colors } from '../../theme/colors';
import { apiRequest } from '../../services/apiClient';
import { showErrorToast, showSuccessToast } from '../../utils/toastService';

interface EmailVerificationModalProps {
    visible: boolean;
    onClose: () => void;
    email?: string;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
    visible,
    onClose,
    email,
}) => {
    const [loading, setLoading] = useState(false);

    const handleResendVerification = async () => {
        if (!email) {
            showErrorToast('Email address is required');
            return;
        }

        try {
            setLoading(true);
            const { result, error } = await apiRequest({
                endpoint: 'v1/mobile/email/verification-notification',
                method: 'POST',
                data: { email },
            });

            if (error) {
                showErrorToast(error);
                console.log('err', error);
                return;
            }
            console.log('result', result);
            showSuccessToast(result?.message || 'Verification email sent successfully!');
            onClose();
        } catch (err) {
            showErrorToast('Something went wrong. Please try again.');
            console.log('err', err);

        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.modalContainer}>
                    {/* Logo */}
                    <Image
                        source={require('../../assets/images/Logo.png')}
                        style={styles.logo}
                    />

                    {/* Heading */}
                    <NMText
                        fontSize={24}
                        fontFamily="bold"
                        color={Colors.textPrimary}
                        textAlign="center"
                        style={styles.heading}
                    >
                        Verify your email
                    </NMText>

                    {/* Instructional Text */}
                    <NMText
                        fontSize={14}
                        fontFamily="regular"
                        color={Colors.textPrimary}
                        textAlign="center"
                        style={styles.message}
                    >
                        We sent a verification link to your email. Please check your inbox and click the link to verify.
                    </NMText>

                    {/* Resend Button */}
                    <NMButton
                        title="Resend verification email"
                        onPress={handleResendVerification}
                        loading={loading}
                        backgroundColor={Colors.primary}
                        textColor={Colors.white}
                        fontFamily="bold"
                        style={styles.button}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logo: {
        width: 134,
        height: 90,
        resizeMode: 'contain',
        marginBottom: 20,
        tintColor: Colors.primary,
    },
    heading: {
        marginBottom: 12,
    },
    message: {
        marginBottom: 24,
        lineHeight: 20,
    },
    button: {
        width: '100%',
        borderRadius: 12,
    },
});

export default EmailVerificationModal;
