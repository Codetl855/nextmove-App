import React from 'react';
import {
    View,
    StatusBar,
    Platform,
    StyleSheet,
    ViewStyle,
    StatusBarStyle,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

interface NMSafeAreaWrapperProps {
    children: React.ReactNode;
    statusBarColor?: string;
    statusBarStyle?: StatusBarStyle;
    backgroundColor?: string;
    edges?: ('top' | 'right' | 'bottom' | 'left')[];
    style?: ViewStyle;
}

const NMSafeAreaWrapper: React.FC<NMSafeAreaWrapperProps> = ({
    children,
    statusBarColor,
    statusBarStyle = 'dark-content',
    backgroundColor = Platform.OS === 'android' ? '#ffffff' : '#000',
    edges = ['top', 'bottom'],
    style,
}) => {
    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={[styles.container, { backgroundColor }, style]}
                edges={edges}
            >
                <StatusBar
                    barStyle={statusBarStyle}
                    backgroundColor={Platform.OS === 'android' && statusBarColor ? statusBarColor : undefined}
                    translucent={Platform.OS === 'android'}
                />

                <View style={styles.content}>
                    {children}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});

export default NMSafeAreaWrapper;
