import React from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import NMText from '../common/NMText';
import { Colors } from '../../theme/colors';
import NMButton from '../common/NMButton';

interface AvailabilitySlot {
    start_date: string;
    end_date: string;
}

interface AvailabilityRange {
    start_date: string;
    end_date: string;
}

interface PropertyAvailabilityModalProps {
    visible: boolean;
    onClose: () => void;
    checkIn?: string;
    checkOut?: string;
    availableSlots?: AvailabilitySlot[];
    availabilityRanges?: AvailabilityRange[];
}

const PropertyAvailabilityModal: React.FC<PropertyAvailabilityModalProps> = ({
    visible,
    onClose,
    checkIn,
    checkOut,
    availableSlots = [],
    availabilityRanges = [],
}) => {
    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString;
            }
            const day = date.getDate();
            const month = date.toLocaleDateString('en-US', { month: 'long' });
            const year = date.getFullYear();
            return `${day} ${month} ${year}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    const formatDateRange = (startDate: string, endDate: string): string => {
        const formattedStart = formatDate(startDate);
        const formattedEnd = formatDate(endDate);
        // If start and end dates are the same, show only one date
        if (startDate === endDate) {
            return formattedStart;
        }
        return `${formattedStart} - ${formattedEnd}`;
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                            Property Availability
                        </NMText>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="#000" size={24} strokeWidth={2} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <View style={styles.content}>
                            <NMText fontSize={16} fontFamily="regular" color={Colors.error} style={styles.errorText}>
                                Sorry! Property is not available within these dates.
                            </NMText>

                            {checkIn && checkOut && (
                                <View style={styles.selectedDatesContainer}>
                                    <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary} style={styles.sectionTitle}>
                                        Selected dates:
                                    </NMText>
                                    <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                        {formatDateRange(checkIn, checkOut)}
                                    </NMText>
                                </View>
                            )}

                            {availableSlots && availableSlots.length > 0 && (
                                <View style={styles.section}>
                                    <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary} style={styles.sectionTitle}>
                                        Available Slots:
                                    </NMText>
                                    {availableSlots.map((slot, index) => (
                                        <View key={index} style={styles.slotItem}>
                                            <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                                Available: {formatDateRange(slot.start_date, slot.end_date)}
                                            </NMText>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {availabilityRanges && availabilityRanges.length > 0 && (
                                <View style={styles.section}>
                                    <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary} style={styles.sectionTitle}>
                                        Property Availability Ranges:
                                    </NMText>
                                    {availabilityRanges.map((range, index) => (
                                        <View key={index} style={styles.slotItem}>
                                            <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                                Available: {formatDateRange(range.start_date, range.end_date)}
                                            </NMText>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>

                        <NMButton
                            title="Close"
                            fontFamily="semiBold"
                            width="100%"
                            borderRadius={8}
                            style={{ marginTop: 20 }}
                            onPress={onClose}
                        />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        width: '90%',
        maxWidth: 400,
        maxHeight: '80%',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    closeButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: 8,
    },
    scrollContent: {
        paddingBottom: 10,
    },
    content: {
        marginBottom: 10,
    },
    errorText: {
        marginBottom: 20,
        textAlign: 'left',
    },
    selectedDatesContainer: {
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        marginBottom: 12,
    },
    slotItem: {
        marginBottom: 8,
        paddingLeft: 8,
    },
});

export default PropertyAvailabilityModal;

