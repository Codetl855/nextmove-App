import { StyleSheet, TextStyle, View } from 'react-native';
import React from 'react';
import { Dropdown as RNDropDown } from 'react-native-element-dropdown';
import NMText from './NMText';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface DropdownProps {
    label?: string;
    placeholder?: string;
    data: { label: string; value: string }[];
    value?: string;
    isRequired?: boolean;
    onChange?: (value: string) => void;
    mHorizontal?: number | `${number}%`,
    custumTextStyle?: TextStyle;
    error?: string;
}

const NMDropdown: React.FC<DropdownProps> = ({
    label = '',
    placeholder = 'Choose',
    data = [],
    value = '',
    isRequired = false,
    mHorizontal,
    custumTextStyle,
    onChange,
    error,
}) => {
    return (
        <View style={[styles.container, { marginHorizontal: mHorizontal ?? '5%' }]}>
            {label && (
                <View style={styles.infoContainer}>
                    <NMText
                        fontSize={14}
                        fontWeight="medium"
                        fontFamily='medium'
                        color={Colors.textPrimary}
                        style={custumTextStyle}
                    >
                        {label}
                        {isRequired && <NMText color={Colors.error}> *</NMText>}
                    </NMText>
                </View>
            )}

            <RNDropDown
                placeholder={placeholder}
                data={data}
                labelField="label"
                valueField="value"
                value={value}
                onChange={item => onChange?.(item.value)}
                style={[
                    styles.dropdown,
                    error ? { borderColor: Colors.error } : { borderColor: Colors.border }
                ]}
                placeholderStyle={styles.itemText}
                itemTextStyle={styles.itemText}
                selectedTextStyle={styles.itemText}
                itemContainerStyle={styles.itemContainer}
                containerStyle={styles.dropdownContainer}
            />
            {error && (
                <NMText
                    fontSize={12}
                    color={Colors.error}
                    style={{ marginTop: 4 }}
                >
                    {error}
                </NMText>
            )}
        </View>
    );
};

export default NMDropdown;

const styles = StyleSheet.create({
    container: {
        marginVertical: 8
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    dropdown: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        paddingHorizontal: '5%',
        borderWidth: 1,
        borderColor: Colors.border,
        minHeight: 48,
    },
    itemText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: Colors.textPrimary || '#000',
    },
    itemContainer: {
        borderBottomWidth: 1,
        borderColor: Colors.border,
    },
    dropdownContainer: {
        borderRadius: 10,
    },
});
