import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import NMText from '../../../components/common/NMText';
import { Colors } from '../../../theme/colors';
import NMButton from '../../../components/common/NMButton';

const PackagesScreen: React.FC = () => {
    const navigation = useNavigation();

    const packages = [
        {
            name: 'Premium',
            credit: 'Unlimited Credits',
            price: '15k SAR',
            duration: 'Per Year',
            status: true,
            image: require('../../../assets/images/premium.png'),
        },
        {
            name: 'Gold',
            credit: '50 Credits',
            price: '10k SAR',
            duration: 'Per Week',
            status: false,
            image: require('../../../assets/images/gold.png'),
        },
        {
            name: 'Silver',
            credit: '10 Credits',
            price: '5k SAR',
            duration: 'Per Week',
            status: false,
            image: require('../../../assets/images/silver.png'),
        },
    ];

    const PackageCard = ({ item }: { item: any }) => (
        <View
            style={[
                styles.card,
                item.status && { borderColor: Colors.primary, borderWidth: 2 },
            ]}
        >
            <Image source={item.image} style={styles.cardImage} />

            <View style={styles.leftBox}>
                <View style={[styles.inRow, { gap: 10 }]}>
                    <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                        {item.name}
                    </NMText>

                    {item.status && (
                        <View style={styles.statusBox}>
                            <View style={styles.whiteDot} />
                            <NMText fontSize={10} fontFamily="medium" color={Colors.white}>
                                Active
                            </NMText>
                        </View>
                    )}
                </View>

                <NMText fontSize={12} fontFamily="regular" color={Colors.textLight}>
                    {item.credit}
                </NMText>
            </View>

            <View style={styles.rightBox}>
                <NMText fontSize={18} fontFamily="semiBold" color={Colors.primary}>
                    {item.price}
                </NMText>
                <NMText fontSize={12} fontFamily="regular" color={Colors.textLight}>
                    {item.duration}
                </NMText>
            </View>
        </View>
    );

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
                            Packages
                        </NMText>
                    </View>
                    {/* <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} /> */}
                </View>

                {/* Current Plan */}
                <View style={styles.contentBox}>
                    <NMText fontSize={18} fontFamily="semiBold" color={Colors.primary} textAlign="center">
                        Current Plan (Gold)
                    </NMText>
                    <NMText fontSize={14} fontFamily="regular" color={Colors.textLight} textAlign="center">
                        Unlimited access to our legal document library and online rental application tool, billed monthly.
                    </NMText>

                    <View style={styles.priceBox}>
                        <NMText fontSize={48} fontFamily="bold" color={Colors.primary} textAlign="center">
                            $48
                        </NMText>
                        <NMText fontSize={18} fontFamily="medium" color={Colors.textPrimary} textAlign="center">
                            Monthly Plan
                        </NMText>
                        <NMText fontSize={14} fontFamily="regular" color={Colors.textLight} textAlign="center">
                            Your subscription renews July 12th, 2023
                        </NMText>
                    </View>

                    <NMButton
                        title="Cancel Current Plan"
                        fontSize={14}
                        fontFamily="semiBold"
                        textColor={Colors.statusSoldText}
                        backgroundColor={Colors.statusSoldBg}
                        borderRadius={8}
                    />
                </View>

                {/* Choose Plan */}
                <View style={styles.contentBox}>
                    <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                        Choose Your Pricing Plan
                    </NMText>

                    {['Unlimited', '5 Months', 'Consults + Reports', 'Priority Support', 'Verified', '5 Year'].map((feature, i) => (
                        <View key={i} style={styles.inRow}>
                            <View style={styles.checkCircle}>
                                <Check size={16} color={Colors.statusText} strokeWidth={2} />
                            </View>
                            <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                                {feature}
                            </NMText>
                        </View>
                    ))}

                    {packages.map((pkg, index) => (
                        <PackageCard key={index} item={pkg} />
                    ))}

                    <NMButton
                        title="Subscribe"
                        fontSize={14}
                        fontFamily="semiBold"
                        textColor={Colors.white}
                        backgroundColor={Colors.primary}
                        borderRadius={8}
                    />
                </View>
            </ScrollView>
        </NMSafeAreaWrapper>
    );
};

export default PackagesScreen;

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
    priceBox: {
        backgroundColor: Colors.background,
        borderRadius: 12,
        padding: 16,
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.statusBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    card: {
        backgroundColor: Colors.white,
        borderColor: Colors.border,
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
        marginTop: 10,
    },
    cardImage: {
        height: 50,
        width: 50,
        resizeMode: 'contain',
    },
    statusBox: {
        height: 26,
        paddingHorizontal: 12,
        backgroundColor: Colors.primary,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    whiteDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.white,
    },
    leftBox: {
        flex: 1,
    },
    rightBox: {
        position: 'absolute',
        right: 10,
        alignItems: 'flex-end',
        gap: 4,
    },
});
