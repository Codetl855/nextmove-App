import React from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import { X, SquareCheckIcon, InfoIcon } from 'lucide-react-native';
import NMText from '../common/NMText';
import { Colors } from '../../theme/colors';
import NMTextInput from '../common/NMTextInput';
import NMButton from '../common/NMButton';
import { useNavigation } from '@react-navigation/native';

interface PaymentMethodAddModalProps {
    visible: boolean;
    onClose: () => void;
}

const PaymentMethodAddModal: React.FC<PaymentMethodAddModalProps> = ({
    visible,
    onClose,
}) => {
    const navigation = useNavigation();

    const Images = [
        require('../../assets/images/card1.png'),
        require('../../assets/images/card2.png'),
        require('../../assets/images/card3.png'),
        require('../../assets/images/card4.png'),
        require('../../assets/images/card5.png'),
        require('../../assets/images/card6.png'),
    ];

    const topRow = Images.slice(0, 4);
    const bottomRow = Images.slice(4);

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.dragIndicator} />
                    </View>

                    <View style={styles.titleRow}>
                        <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                            Add New
                        </NMText>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="#000" size={24} strokeWidth={2} />
                        </TouchableOpacity>
                    </View>

                    <NMTextInput
                        label="Card Holder name"
                        placeholder="Enter"
                        mainViewStyle={{ marginVertical: 10, marginHorizontal: 20 }}
                        required
                    />

                    <NMTextInput
                        label="Card Number"
                        placeholder="Enter"
                        mainViewStyle={{ marginVertical: 10, marginHorizontal: 20 }}
                        required
                    />

                    <View style={styles.inRowInputs}>
                        <NMTextInput
                            label="Expiry Date"
                            placeholder="Enter"
                            mainViewStyle={{ width: '46%' }}
                            required
                        />
                        <NMTextInput
                            label="CVC"
                            placeholder="Enter"
                            mainViewStyle={{ width: '46%' }}
                            required
                        />
                    </View>

                    <View style={[styles.inRow, { marginHorizontal: '5%' }]}>
                        <SquareCheckIcon color={Colors.white} size={24} fill={Colors.primary} />
                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                            Save Card for Further Payment
                        </NMText>
                        <InfoIcon color={Colors.white} size={24} fill={Colors.primary} />
                    </View>

                    <View style={styles.inRowBtn}>
                        <NMButton
                            title="Cancel"
                            backgroundColor={Colors.white}
                            textColor={Colors.primary}
                            borderRadius={8}
                            height={44}
                            width="46%"
                            style={{ borderColor: Colors.primary, borderWidth: 1 }}
                            onPress={onClose}
                        />
                        <NMButton
                            title="Save"
                            backgroundColor={Colors.primary}
                            textColor={Colors.white}
                            borderRadius={8}
                            height={44}
                            width="46%"
                            onPress={onClose}
                        />
                    </View>

                    <View style={styles.bankMethodBox}>
                        <View style={styles.bankRowTop}>
                            {topRow.map((img, i) => (
                                <Image key={i} source={img} style={styles.bankMethodImage} />
                            ))}
                        </View>
                        <View style={styles.bankRowBottom}>
                            {bottomRow.map((img, i) => (
                                <Image key={i} source={img} style={styles.bankMethodImage} />
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default PaymentMethodAddModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
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
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    inRowBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        marginHorizontal: '5%',
    },
    inRowInputs: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: '5%',
    },
    bankMethodBox: {
        marginTop: 20,
        marginHorizontal: '5%',
        backgroundColor: Colors.background,
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 10,
    },
    bankRowTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    bankRowBottom: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
    },
    bankMethodImage: {
        width: 46,
        height: 46,
        margin: 6,
        resizeMode: 'contain',
    },
});
