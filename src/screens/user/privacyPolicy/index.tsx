import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import NMText from '../../../components/common/NMText';
import { Colors } from '../../../theme/colors';

const PrivacyPolicyScreen: React.FC = () => {
    const navigation = useNavigation();

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                        </TouchableOpacity>
                        <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary} style={styles.headerTitle}>
                            Privacy Policy
                        </NMText>
                    </View>
                    <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} />
                </View>

                {/* Content */}
                <View style={styles.contentBox}>
                    <NMText fontSize={14} fontFamily="bold" color={Colors.textSecondary}>
                        Who We Share Your Personal Information With
                    </NMText>

                    <NMText fontSize={14} fontFamily="regular" color={Colors.textSecondary}>
                        Your personal information (which includes your name, address, and any other details you provide) may be processed by us.{'\n\n'}
                        We may also share your information with:
                        {'\n'}(i) third parties that help deliver our services (e.g., payment providers);
                        {'\n'}(ii) business partners who assist in marketing or website operations;
                        {'\n'}(iii) third parties approved by you, such as linked social media or payment services.{'\n\n'}
                        All third parties are required to respect the confidentiality and security of your personal data and comply with applicable laws.{'\n\n'}
                        We may disclose your data if legally obligated or necessary to protect our rights, enforce agreements, or safeguard affiliates. In certain business restructuring cases, we may share anonymized data where possible.
                    </NMText>

                    <NMText fontSize={14} fontFamily="bold" color={Colors.textSecondary} style={styles.sectionTitle}>
                        Purpose of Processing
                    </NMText>

                    <NMText fontSize={14} fontFamily="regular" color={Colors.textSecondary}>
                        Your information allows us to provide access to relevant platform features and services you request.{'\n\n'}
                        We may use your information to:
                        {'\n'}• Notify you of offers, updates, or new features
                        {'\n'}• Conduct customer research and service improvements
                        {'\n'}• Request feedback and opinions on our platform and services{'\n\n'}
                        You may opt out of receiving marketing communications at any time.
                    </NMText>
                </View>
            </ScrollView>
        </NMSafeAreaWrapper>
    );
};

export default PrivacyPolicyScreen;

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
    backButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.background,
    },
    contentBox: {
        marginTop: 20,
        marginHorizontal: '5%',
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        paddingVertical: 24,
        borderRadius: 12,
        gap: 12,
    },
    sectionTitle: {
        marginTop: 12,
    },
});
