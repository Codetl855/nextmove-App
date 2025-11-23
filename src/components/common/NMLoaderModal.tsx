import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native';

interface LoaderModalProps {
    visible: boolean;
}

const LoaderModal: React.FC<LoaderModalProps> = ({ visible }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.loaderBox}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderBox: {
        width: 90,
        height: 90,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoaderModal;
