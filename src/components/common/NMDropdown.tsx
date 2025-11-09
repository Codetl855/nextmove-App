import { StyleSheet, View } from 'react-native';
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
}

const NMDropdown: React.FC<DropdownProps> = ({
    label = '',
    placeholder = 'Choose',
    data = [],
    value = '',
    isRequired = false,
    onChange,
}) => {
    return (
        <View style={styles.container}>
            {label && (
                <View style={styles.infoContainer}>
                    <NMText
                        fontSize={16}
                        fontFamily="regular"
                        color={Colors.lightB6}
                    >
                        {`${label}${isRequired ? ' *' : ''}`}
                    </NMText>
                </View>
            )}

            <RNDropDown
                placeholder={placeholder}
                data={data}
                labelField="label"
                valueField="value"
                value={value}
                onChange={item => onChange?.(item.value)} // ✅ fixed onChange
                style={styles.dropdown}
                placeholderStyle={styles.itemText}
                itemTextStyle={styles.itemText}
                selectedTextStyle={styles.itemText}
                itemContainerStyle={styles.itemContainer}
                containerStyle={styles.dropdownContainer}
            />
        </View>
    );
};

export default NMDropdown;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: '5%',
        marginTop: 10
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdown: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        paddingHorizontal: '5%',
        borderWidth: 0.5,
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
