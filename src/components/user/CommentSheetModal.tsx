import React from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { X, Calendar, ChevronDown, SquareCheckIcon, StarIcon } from 'lucide-react-native';
import NMText from '../common/NMText';
import { Colors } from '../../theme/colors';
import NMTextInput from '../common/NMTextInput';
import NMButton from '../common/NMButton';
import { useNavigation } from '@react-navigation/native';

interface CommentSheetModalProps {
    visible: boolean;
    onClose: () => void;
}

const CommentSheetModal: React.FC<CommentSheetModalProps> = ({
    visible,
    onClose,
}) => {

    const navigation = useNavigation();

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
                                Leave A comment
                            </NMText>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="#000" size={24} strokeWidth={2} />
                        </TouchableOpacity>
                    </View>

                    <NMText fontSize={16} fontFamily="light" color={Colors.textLight} style={{ marginHorizontal: 20 }}>
                        Your email address will not be published. Required fields are marked *
                    </NMText>

                    <NMTextInput
                        label='Name'
                        placeholder='Enter your name'
                        mainViewStyle={{ marginVertical: 10, marginHorizontal: 20 }}
                    />

                    <NMTextInput
                        label='Email'
                        placeholder='Enter your email'
                        mainViewStyle={{ marginVertical: 10, marginHorizontal: 20 }}
                    />

                    <NMTextInput
                        label='Review'
                        placeholder='Enter your review'
                        multiline
                        numberOfLines={5}
                        mainViewStyle={{ marginVertical: 10, marginHorizontal: 20 }}
                        inputStyle={{ textAlignVertical: 'top', height: 100 }}
                    />

                    <View style={styles.starReview}>
                        <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary} style={{ marginHorizontal: 20 }}>
                            Rate Us
                        </NMText>
                        <View style={styles.inRow}>
                            {[1, 2, 3, 4, 5].map((item, index) => (
                                <StarIcon key={index} color={Colors.star} size={16} fill={Colors.star} />
                            ))}
                        </View>
                    </View>

                    <NMButton
                        title="Post Comment"
                        fontFamily='semiBold'
                        width={'92%'}
                        borderRadius={8}
                        style={{ alignSelf: 'center', marginTop: 10 }}
                        onPress={() => {
                            onClose();
                        }}
                    />

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
    statusBox: {
        marginLeft: 8,
        backgroundColor: Colors.statusBg,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    priceBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: Colors.background,
        borderRadius: 8,
        paddingVertical: 10,
        marginHorizontal: 20
    },
    checkInBox: {
        marginTop: 10,
        marginHorizontal: 20
    },
    dateBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        borderColor: Colors.border,
        borderWidth: 1.5,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 10
    },
    costBoxContainer: {
        marginTop: 10,
        marginHorizontal: 20,
        padding: 16,
        backgroundColor: Colors.background,
        borderRadius: 8
    },
    costBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    agreeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 2
    },
    starReview: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
        marginHorizontal: 20,
        backgroundColor: Colors.background,
        borderRadius: 8,
        paddingVertical: 16
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },

});

export default CommentSheetModal;
