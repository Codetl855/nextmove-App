import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    Modal,
    StyleSheet,
    TextStyle,
    ViewStyle,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import NMText from './NMText';
import { Colors } from '../../theme/colors';

interface NMDatePickerProps {
    label?: string;
    placeholder?: string;
    value?: string;
    isRequired?: boolean;
    onChange?: (date: string) => void;
    mHorizontal?: number | `${number}%`;
    customTextStyle?: TextStyle;
    mainView?: ViewStyle,
    error?: string
}

const NMDatePicker: React.FC<NMDatePickerProps> = ({
    label = '',
    placeholder = 'Select Date',
    value = '',
    isRequired = false,
    onChange,
    mHorizontal,
    customTextStyle,
    mainView,
    error
}) => {

    const [open, setOpen] = useState(false);

    return (
        <View style={[styles.container, mainView, { marginHorizontal: mHorizontal ?? '5%' }
        ]}>
            {/* LABEL */}
            {label && (
                <View style={styles.infoContainer}>
                    <NMText
                        fontSize={14}
                        fontWeight="medium"
                        fontFamily='medium'
                        color={Colors.textPrimary}
                        style={customTextStyle}
                    >
                        {label}
                        {isRequired && <NMText color={Colors.error}> *</NMText>}
                    </NMText>
                </View>
            )}

            {/* TOUCHABLE INPUT */}
            <TouchableOpacity
                style={[styles.inputBox,
                error ? { borderColor: Colors.error } : { borderColor: Colors.border }
                ]}
                activeOpacity={0.8}
                onPress={() => setOpen(true)}
            >
                <NMText
                    fontSize={14}
                    fontFamily="regular"
                    color={value ? Colors.textPrimary : Colors.textSecondary}
                >
                    {value || placeholder}
                </NMText>
            </TouchableOpacity>
            {error && (
                <NMText
                    fontSize={12}
                    color={Colors.error}
                    style={{ marginTop: 4 }}
                >
                    {error}
                </NMText>
            )}

            {/* CALENDAR MODAL */}
            <Modal
                transparent
                animationType="slide"
                visible={open}
                onRequestClose={() => setOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Calendar
                            markedDates={
                                value
                                    ? { [value]: { selected: true, selectedColor: Colors.primary } }
                                    : {}
                            }
                            onDayPress={(day) => {
                                onChange?.(day.dateString);
                                setOpen(false);
                            }}
                        />
                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default NMDatePicker;

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
});
