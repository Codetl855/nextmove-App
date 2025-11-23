import React from 'react';
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { X } from 'lucide-react-native';
import NMText from '../common/NMText';
import { Colors } from '../../theme/colors';

interface ConfirmationModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    message: string;
    buttonName?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    onClose,
    title,
    message,
    buttonName
}) => {

    const handleApply = () => {
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>

                    <View style={styles.titleRow}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="#000" size={24} strokeWidth={2} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.costBoxContainer}>
                        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                            {title}
                        </NMText>

                        <NMText
                            fontSize={14}
                            fontFamily="regular"
                            color={Colors.textPrimary}
                            style={{ marginTop: 6 }}
                        >
                            {message}
                        </NMText>

                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={styles.resetButton}
                                onPress={onClose}
                                activeOpacity={0.7}
                            >
                                <NMText fontSize={14} fontFamily='regular' color={Colors.primary}>
                                    Cancel
                                </NMText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.applyButton}
                                onPress={handleApply}
                                activeOpacity={0.7}
                            >
                                <NMText fontSize={14} fontFamily='regular' color={Colors.white}>
                                    {buttonName ?? 'Delete'}
                                </NMText>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 20,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    closeButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: 8,
    },
    costBoxContainer: {
        marginHorizontal: 20,
        padding: 16,
        backgroundColor: Colors.background,
        borderRadius: 8,
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    resetButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    applyButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ConfirmationModal;
