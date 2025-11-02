import React from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { X, SquareCheckIcon } from 'lucide-react-native';
import NMText from '../common/NMText';
import { Colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';

interface BlogFilterModalProps {
    visible: boolean;
    onClose: () => void;
}

const BlogFilterModal: React.FC<BlogFilterModalProps> = ({
    visible,
    onClose,
}) => {

    const navigation = useNavigation();
    const tags = ['Property', 'Office', 'Finance', 'Legal', 'Market', 'Renovation']

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

                    <View style={styles.header}>
                        <View style={styles.dragIndicator} />
                    </View>

                    <View style={styles.titleRow}>
                        <View style={styles.titleContainer}>
                            <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                                Search Filters
                            </NMText>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="#000" size={24} strokeWidth={2} />
                        </TouchableOpacity>
                    </View>



                    <View style={styles.costBoxContainer}>
                        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                            Category
                        </NMText>
                        <View style={styles.costBox}>
                            <SquareCheckIcon color={Colors.primary} size={20} strokeWidth={2} />
                            <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                Market Updates  <NMText fontSize={14} fontFamily="semiBold" color={Colors.textPrimary}>
                                    (50)
                                </NMText>
                            </NMText>

                        </View>
                        <View style={styles.costBox}>
                            <SquareCheckIcon color={Colors.border} size={20} strokeWidth={2} />
                            <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                Buying Tips  <NMText fontSize={14} fontFamily="semiBold" color={Colors.textPrimary}>
                                    (10)
                                </NMText>
                            </NMText>
                        </View>
                        <View style={styles.costBox}>
                            <SquareCheckIcon color={Colors.primary} size={20} strokeWidth={2} />
                            <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                Investment Insights  <NMText fontSize={14} fontFamily="semiBold" color={Colors.textPrimary}>
                                    (30)
                                </NMText>
                            </NMText>
                        </View>
                        <View style={styles.costBox}>
                            <SquareCheckIcon color={Colors.border} size={20} strokeWidth={2} />
                            <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                Community Spotlight  <NMText fontSize={14} fontFamily="semiBold" color={Colors.textPrimary}>
                                    (14)
                                </NMText>
                            </NMText>
                        </View>
                    </View>

                    <View style={styles.costBoxContainer}>
                        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                            Popular Tag
                        </NMText>

                        <View style={styles.rowTags}>
                            {tags.map((tag, index) => (
                                <View style={styles.tagBox} key={index}>
                                    <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                        {tag}
                                    </NMText>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.resetButton}
                            activeOpacity={0.7}
                        >
                            <NMText fontSize={14} fontFamily='regular' color={Colors.primary}>
                                Reset
                            </NMText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={handleApply}
                            activeOpacity={0.7}
                        >
                            <NMText fontSize={14} fontFamily='regular' color={Colors.white}>
                                Apply Filter
                            </NMText>
                        </TouchableOpacity>
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
        marginTop: 10,
        gap: 6
    },
    agreeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 2
    },
    rowTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 10
    },
    tagBox: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 14
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: '6%',
        paddingTop: 2,
        marginTop: 10
    },
    resetButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    applyButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 8,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

});

export default BlogFilterModal;
