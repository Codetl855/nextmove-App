import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { Fonts } from '../../theme/fonts';
import { Colors } from '../../theme/colors';

interface NMRadioButtonProps {
    selected: boolean;
    onPress: () => void;
    borderWidth?: number;
    activeOuterColor?: string;
    outerColor?: string;
    innerColor?: string;
    label?: string;
    labelStyle?: TextStyle;
    fontFamily?: keyof typeof Fonts;
    fontSize?: number;
    labelColor?: string;
    containerStyle?: ViewStyle;
    marginLeft?: number;
    marginRight?: number;
}

const NMRadioButton: React.FC<NMRadioButtonProps> = ({
    selected,
    onPress,
    borderWidth = 1,
    activeOuterColor = Colors.primary,
    outerColor = Colors.gray,
    innerColor = Colors.primary,
    label,
    labelStyle,
    fontFamily = 'regular',
    fontSize = 14,
    labelColor = '#333',
    containerStyle,
    marginLeft,
    marginRight,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                containerStyle,
                { marginLeft, marginRight },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View
                style={[
                    styles.outerCircle,
                    { borderColor: selected ? activeOuterColor : outerColor, borderWidth },
                ]}
            >
                {selected && (
                    <View
                        style={[
                            styles.innerCircle,
                            { backgroundColor: innerColor },
                        ]}
                    />
                )}
            </View>
            {label && (
                <Text
                    style={[
                        styles.label,
                        { fontFamily: Fonts[fontFamily], fontSize, color: labelColor },
                        labelStyle,
                    ]}
                >
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    outerCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    innerCircle: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    label: {
        marginLeft: 6,
    },
});

export default NMRadioButton;
