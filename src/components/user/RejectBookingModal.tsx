import React from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { X } from 'lucide-react-native';
import NMText from '../common/NMText';
import { Colors } from '../../theme/colors';
import NMTextInput from '../common/NMTextInput';
import NMButton from '../common/NMButton';

interface RejectBookingModalProps {
    visible: boolean;
    onClose: () => void;
}

const RejectBookingModal: React.FC<RejectBookingModalProps> = ({
    visible,
    onClose,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>

                    <View style={styles.header}>
                        <View style={styles.dragIndicator} />
                    </View>

                    <View style={styles.titleRow}>
                        <View style={styles.titleContainer}>
                            <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                                Reject Booking
                            </NMText>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="#000" size={24} strokeWidth={2} />
                        </TouchableOpacity>
                    </View>

                    <NMTextInput
                        label='Rejected reason'
                        placeholder='Enter your reason'
                        multiline
                        numberOfLines={5}
                        mainViewStyle={{ marginVertical: 10, marginHorizontal: 20 }}
                        inputStyle={{ textAlignVertical: 'top', height: 120 }}
                    />

                    <View style={[styles.inRow, { marginTop: 10, justifyContent: 'space-between', gap: 0, marginHorizontal: 20 }]}>
                        <NMButton
                            title='Cancel'
                            backgroundColor={Colors.white}
                            textColor={Colors.primary}
                            fontSize={14}
                            fontFamily='semiBold'
                            borderRadius={8}
                            height={44}
                            width={'46%'}
                            style={{ borderColor: Colors.primary, borderWidth: 1 }}
                            onPress={onClose}
                        />
                        <NMButton
                            title='Save'
                            textColor={Colors.white}
                            fontSize={14}
                            fontFamily='semiBold'
                            borderRadius={8}
                            height={44}
                            width={'46%'}
                            onPress={onClose}
                        />
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
    header: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 6,
    },
    dragIndicator: {
        width: 40,
        height: 4,
        backgroundColor: Colors.background,
        borderRadius: 2,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    closeButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
});

export default RejectBookingModal;
