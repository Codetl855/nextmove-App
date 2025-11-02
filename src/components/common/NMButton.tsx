import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    ActivityIndicator,
    GestureResponderEvent,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { Fonts } from '../../theme/fonts';

interface NMButtonProps {
    title: string;
    onPress?: (event: GestureResponderEvent) => void;
    backgroundColor?: string;
    textColor?: string;
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    fontSize?: number;
    fontWeight?: TextStyle['fontWeight'];
    fontFamily?: keyof typeof Fonts;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    iconSpacing?: number;
}

const NMButton: React.FC<NMButtonProps> = ({
    title,
    onPress,
    backgroundColor = '#BE9A4E',
    textColor = '#FFFFFF',
    width = '100%',
    height = 50,
    borderRadius = 12,
    fontSize = 16,
    fontWeight = '600',
    fontFamily = 'regular',
    loading = false,
    disabled = false,
    style,
    textStyle,
    leftIcon,
    rightIcon,
    iconSpacing = 8,
}) => {
    const buttonStyle: ViewStyle = {
        backgroundColor: disabled ? '#A9A9A9' : backgroundColor,
        width,
        height,
        borderRadius,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        opacity: disabled ? 0.7 : 1,
    };

    const labelStyle: TextStyle = {
        color: textColor,
        fontSize,
        fontWeight,
        fontFamily: Fonts[fontFamily],
    };

    return (
        <TouchableOpacity
            style={[styles.button, buttonStyle, style]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <View style={styles.content}>
                    {leftIcon && <View style={{ marginRight: iconSpacing }}>{leftIcon}</View>}
                    <Text style={[styles.text, labelStyle, textStyle]}>{title}</Text>
                    {rightIcon && <View style={{ marginLeft: iconSpacing }}>{rightIcon}</View>}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        marginVertical: 5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
    },
});

export default NMButton;

// import React from 'react';
// import {
//     TouchableOpacity,
//     Text,
//     StyleSheet,
//     ViewStyle,
//     TextStyle,
//     ActivityIndicator,
//     GestureResponderEvent,
// } from 'react-native';
// import { Fonts } from '../../theme/fonts';

// interface NMButtonProps {
//     title: string;
//     onPress?: (event: GestureResponderEvent) => void;
//     backgroundColor?: string;
//     textColor?: string;
//     width?: number | string;
//     height?: number | string;
//     borderRadius?: number;
//     fontSize?: number;
//     fontWeight?: TextStyle['fontWeight'];
//     fontFamily?: keyof typeof Fonts;
//     loading?: boolean;
//     disabled?: boolean;
//     style?: ViewStyle;
//     textStyle?: TextStyle;
// }

// const NMButton: React.FC<NMButtonProps> = ({
//     title,
//     onPress,
//     backgroundColor = '#BE9A4E',
//     textColor = '#FFFFFF',
//     width = '100%',
//     height = 50,
//     borderRadius = 12,
//     fontSize = 16,
//     fontWeight = '600',
//     fontFamily = 'regular',
//     loading = false,
//     disabled = false,
//     style,
//     textStyle,
// }) => {
//     const buttonStyle: ViewStyle = {
//         backgroundColor: disabled ? '#A9A9A9' : backgroundColor,
//         width,
//         height,
//         borderRadius,
//         justifyContent: 'center',
//         alignItems: 'center',
//         flexDirection: 'row',
//         opacity: disabled ? 0.7 : 1,
//     };

//     const labelStyle: TextStyle = {
//         color: textColor,
//         fontSize,
//         fontWeight,
//         fontFamily: Fonts[fontFamily],
//     };

//     return (
//         <TouchableOpacity
//             style={[styles.button, buttonStyle, style]}
//             onPress={onPress}
//             activeOpacity={0.8}
//             disabled={disabled || loading}
//         >
//             {loading ? (
//                 <ActivityIndicator color={textColor} />
//             ) : (
//                 <Text style={[styles.text, labelStyle, textStyle]}>{title}</Text>
//             )}
//         </TouchableOpacity>
//     );
// };

// const styles = StyleSheet.create({
//     button: {
//         marginVertical: 5,
//     },
//     text: {
//         textAlign: 'center',
//     },
// });

// export default NMButton;
