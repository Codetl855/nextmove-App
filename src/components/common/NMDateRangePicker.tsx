import React, { useState, useMemo } from 'react';
import {
    View,
    TouchableOpacity,
    Modal,
    StyleSheet,
    TextStyle,
    ViewStyle,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import NMText from './NMText';
import { Colors } from '../../theme/colors';

interface NMDateRangePickerProps {
    label?: string;
    placeholder?: string;
    startDate?: string;
    endDate?: string;
    isRequired?: boolean;
    onChangeRange?: (startDate: string, endDate: string) => void;
    mHorizontal?: number | `${number}%`;
    customTextStyle?: TextStyle;
    mainView?: ViewStyle;
    error?: string;
    minDate?: string;
}

const NMDateRangePicker: React.FC<NMDateRangePickerProps> = ({
    label = '',
    placeholder = 'Select Date Range',
    startDate = '',
    endDate = '',
    isRequired = false,
    onChangeRange,
    mHorizontal,
    customTextStyle,
    mainView,
    error,
    minDate,
}) => {
    const [open, setOpen] = useState(false);
    const [tempStartDate, setTempStartDate] = useState<string>(startDate);
    const [tempEndDate, setTempEndDate] = useState<string>(endDate);

    // Get today's date in YYYY-MM-DD format
    const today = useMemo(() => {
        const date = new Date();
        return date.toISOString().split('T')[0];
    }, []);

    // Calculate marked dates with range colors
    const markedDates = useMemo(() => {
        const marked: any = {};

        if (tempStartDate && !tempEndDate) {
            // Only start date selected
            marked[tempStartDate] = {
                selected: true,
                selectedColor: Colors.primary,
                startingDay: true,
                endingDay: true,
            };
        } else if (tempStartDate && tempEndDate) {
            // Both dates selected - create range
            const start = new Date(tempStartDate);
            const end = new Date(tempEndDate);
            const current = new Date(start);

            while (current <= end) {
                const dateString = current.toISOString().split('T')[0];
                const isStart = dateString === tempStartDate;
                const isEnd = dateString === tempEndDate;

                marked[dateString] = {
                    selected: true,
                    color: isStart || isEnd ? Colors.primary : Colors.primary + '40',
                    textColor: Colors.white,
                    startingDay: isStart,
                    endingDay: isEnd,
                };

                current.setDate(current.getDate() + 1);
            }
        }

        return marked;
    }, [tempStartDate, tempEndDate]);

    const handleDayPress = (day: DateData) => {
        const selectedDate = day.dateString;

        if (!tempStartDate || (tempStartDate && tempEndDate)) {
            // First selection or reset after complete range
            setTempStartDate(selectedDate);
            setTempEndDate('');
        } else {
            // Second selection
            if (selectedDate < tempStartDate) {
                // If selected date is before start, swap them
                setTempEndDate(tempStartDate);
                setTempStartDate(selectedDate);
            } else {
                setTempEndDate(selectedDate);
            }
        }
    };

    const handleConfirm = () => {
        if (tempStartDate && tempEndDate) {
            onChangeRange?.(tempStartDate, tempEndDate);
            setOpen(false);
        }
    };

    const handleCancel = () => {
        setTempStartDate(startDate);
        setTempEndDate(endDate);
        setOpen(false);
    };

    const displayValue = useMemo(() => {
        if (startDate && endDate) {
            return `${startDate} - ${endDate}`;
        }
        return '';
    }, [startDate, endDate]);

    return (
        <View style={[styles.container, mainView, { marginHorizontal: mHorizontal ?? '5%' }]}>

            {label && (
                <View style={styles.infoContainer}>
                    <NMText
                        fontSize={14}
                        fontWeight="medium"
                        fontFamily="medium"
                        color={Colors.textPrimary}
                        style={customTextStyle}
                    >
                        {label}
                        {isRequired && <NMText color={Colors.error}> *</NMText>}
                    </NMText>
                </View>
            )}

            <TouchableOpacity
                style={[
                    styles.inputBox,
                    error ? { borderColor: Colors.error } : { borderColor: Colors.border },
                ]}
                activeOpacity={0.8}
                onPress={() => setOpen(true)}
            >
                <NMText
                    fontSize={14}
                    fontFamily="regular"
                    color={displayValue ? Colors.textPrimary : Colors.textSecondary}
                >
                    {displayValue || placeholder}
                </NMText>
            </TouchableOpacity>

            {error && (
                <NMText fontSize={12} color={Colors.error} style={{ marginTop: 4 }}>
                    {error}
                </NMText>
            )}

            <Modal
                transparent
                animationType="slide"
                visible={open}
                onRequestClose={handleCancel}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <NMText fontSize={16} fontWeight="medium" fontFamily="medium">
                                Select Date Range
                            </NMText>
                            {tempStartDate && !tempEndDate && (
                                <NMText fontSize={12} color={Colors.textSecondary}>
                                    Select end date
                                </NMText>
                            )}
                        </View>

                        <Calendar
                            markingType="period"
                            markedDates={markedDates}
                            onDayPress={handleDayPress}
                            minDate={minDate || today}
                            theme={{
                                todayTextColor: Colors.primary,
                                arrowColor: Colors.primary,
                            }}
                        />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={handleCancel}
                            >
                                <NMText fontSize={14} color={Colors.textPrimary}>
                                    Cancel
                                </NMText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    styles.confirmButton,
                                    (!tempStartDate || !tempEndDate) && styles.disabledButton,
                                ]}
                                onPress={handleConfirm}
                                disabled={!tempStartDate || !tempEndDate}
                            >
                                <NMText
                                    fontSize={14}
                                    color={
                                        tempStartDate && tempEndDate
                                            ? Colors.white
                                            : Colors.textSecondary
                                    }
                                >
                                    Confirm
                                </NMText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default NMDateRangePicker;

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    inputBox: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        paddingHorizontal: '5%',
        borderWidth: 1,
        borderColor: Colors.border,
        minHeight: 48,
        justifyContent: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        overflow: 'hidden',
    },
    modalHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    buttonContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    confirmButton: {
        backgroundColor: Colors.primary,
    },
    disabledButton: {
        backgroundColor: Colors.border,
    },
});