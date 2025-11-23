import React, { useState } from 'react';
import {
    TextInput as RNTextInput,
    View,
    StyleSheet,
    TextInputProps,
    TouchableOpacity,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Fonts } from '../../theme/fonts';
import { Colors } from '../../theme/colors';
import NMText from './NMText';

interface NMTextInputProps extends TextInputProps {
    mainViewStyle?: ViewStyle;
    label?: string;
    required?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    inputType?: 'text' | 'email' | 'password';
    placeholder?: string;
    secureTextEntry?: boolean;
    showPasswordToggle?: boolean;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    fontFamily?: keyof typeof Fonts;
    labelStyle?: TextStyle;
    error?: string;
}

const NMTextInput: React.FC<NMTextInputProps> = ({
    mainViewStyle,
    label,
    required = false,
    leftIcon,
    rightIcon,
    inputType = 'text',
    placeholder,
    secureTextEntry = false,
    showPasswordToggle = false,
    containerStyle,
    inputStyle,
    fontFamily = 'regular',
    labelStyle,
    error,
    ...rest
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(secureTextEntry);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const determineKeyboardType = () => {
        switch (inputType) {
            case 'email':
                return 'email-address';
            default:
                return 'default';
        }
    };

    return (
        <View style={[{ marginVertical: 8 }, mainViewStyle]}>

            {label && (
                <View style={styles.labelContainer}>
                    <NMText
                        fontSize={14}
                        fontWeight="medium"
                        fontFamily='medium'
                        color={Colors.textPrimary}
                        style={[styles.labelText, labelStyle]}
                    >
                        {label}
                        {required && <NMText color={Colors.error}> *</NMText>}
                    </NMText>
                </View>
            )}

            <View style={[
                styles.inputContainer,
                containerStyle,
                error ? { borderColor: Colors.error } : { borderColor: Colors.border }
            ]}>

                {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

                <RNTextInput
                    style={[
                        styles.input,
                        { fontFamily: Fonts[fontFamily] },
                        inputStyle,
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textLight}
                    secureTextEntry={inputType === 'password' ? isPasswordVisible : false}
                    keyboardType={determineKeyboardType()}
                    {...rest}
                />

                <View style={styles.iconContainer}>
                    {rightIcon}

                    {inputType === 'password' && showPasswordToggle && (
                        <TouchableOpacity onPress={togglePasswordVisibility}>
                            {isPasswordVisible ? (
                                <EyeOff size={20} color={Colors.gray} />
                            ) : (
                                <Eye size={20} color={Colors.gray} />
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </View>
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

const styles = StyleSheet.create({
    labelContainer: {
        marginBottom: 4,
    },
    labelText: {
        fontSize: 14,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        borderColor: Colors.border,
        paddingHorizontal: 10,
        backgroundColor: Colors.white,
    },
    input: {
        flex: 1,
        height: 44,
        fontSize: 16,
        paddingLeft: 10,
        paddingRight: 10,
        color: Colors.textPrimary,
    },
    iconContainer: {
        marginHorizontal: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default NMTextInput;
