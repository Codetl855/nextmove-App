import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import NMText from '../../../components/common/NMText';
import { Colors } from '../../../theme/colors';

interface SettingItemProps {
    icon: any;
    title: string;
    onPress?: () => void;
}

interface SettingToggleItemProps extends SettingItemProps {
    value: boolean;
    onToggle: (value: boolean) => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.settingCard} onPress={onPress}>
        <Image source={icon} style={styles.cardImage} />
        <NMText fontSize={16} fontFamily="regular" color={Colors.textSecondary}>
            {title}
        </NMText>
    </TouchableOpacity>
);

const SettingToggleItem: React.FC<SettingToggleItemProps> = ({ icon, title, value, onToggle }) => (
    <View style={[styles.settingCard, styles.toggleCard]}>
        <View style={styles.row}>
            <Image source={icon} style={styles.cardImage} />
            <NMText fontSize={16} fontFamily="regular" color={Colors.textSecondary}>
                {title}
            </NMText>
        </View>
        <Switch
            value={value}
            onValueChange={onToggle}
            thumbColor={Colors.white}
            trackColor={{ false: Colors.background, true: Colors.primary }}
        />
    </View>
);

const SettingScreen: React.FC = ({ navigation }: any) => {
    const [isMultiFactor, setIsMultiFactor] = useState(false);
    const [isBiometric, setIsBiometric] = useState(false);

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>

                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Image source={require('../../../assets/icons/drawer.png')} style={styles.headerIcon} />
                        <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary} style={styles.headerTitle}>
                            Settings
                        </NMText>
                    </View>
                    <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} />
                </View>
                <View style={{ height: 20 }} />
                <SettingItem icon={require('../../../assets/icons/privacypolicy.png')} title="Privacy Policy" onPress={() => navigation.navigate("PrivacyPolicyScreen")} />
                <SettingItem icon={require('../../../assets/icons/termsCondition.png')} title="Terms & Condition" />
                <SettingItem icon={require('../../../assets/icons/lock.png')} title="Reset Password" onPress={() => navigation.navigate("ResetPasswordScreen")} />

                <SettingToggleItem
                    icon={require('../../../assets/icons/multiFactor.png')}
                    title="Multi-Factor Authentication"
                    value={isMultiFactor}
                    onToggle={setIsMultiFactor}
                />

                <SettingToggleItem
                    icon={require('../../../assets/icons/biometric.png')}
                    title="Enable Biometric"
                    value={isBiometric}
                    onToggle={setIsBiometric}
                />

                <SettingItem icon={require('../../../assets/icons/support.png')} title="Support" />
            </ScrollView>
        </NMSafeAreaWrapper>
    );
};

export default SettingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        width: '100%',
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        paddingVertical: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        marginLeft: 10,
    },
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    settingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: '5%',
        backgroundColor: Colors.white,
        marginVertical: 6,
        paddingHorizontal: 16,
        paddingVertical: 22,
        borderRadius: 12,
    },
    toggleCard: {
        justifyContent: 'space-between',
    },
    cardImage: {
        width: 20,
        height: 20,
        marginRight: 12,
        resizeMode: 'contain',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
