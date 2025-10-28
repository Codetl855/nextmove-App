import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { Fonts } from '../../theme/fonts';

interface NMTextProps extends TextProps {
    fontSize?: number;
    fontWeight?: TextStyle['fontWeight'];
    color?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    lineHeight?: number;
    style?: TextStyle;
    fontFamily?: keyof typeof Fonts;
}

const NMText: React.FC<NMTextProps> = ({
    fontSize = 16,
    fontWeight = '400',
    color = '#000',
    textAlign = 'left',
    lineHeight,
    style,
    fontFamily = 'regular',
    children,
    ...rest
}) => {
    const customFontFamily = Fonts[fontFamily] || Fonts.regular;

    return (
        <Text
            {...rest}
            style={[
                styles.text,
                { fontSize, fontWeight, color, textAlign, lineHeight, fontFamily: customFontFamily },
                style,
            ]}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontFamily: 'System',
    },
});

export default NMText;
