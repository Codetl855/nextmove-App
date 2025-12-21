import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import { Colors } from '../../../theme/colors';
import NMText from '../../../components/common/NMText';
import NMButton from '../../../components/common/NMButton';
import PaymentMethodAddModal from '../../../components/user/PaymentMethodAddModal';
import StripePaymentScreen from '../../../components/user/StripModal';

const PaymentMethod: React.FC = ({ navigation, route }: any) => {

    const {
        propertyDetails,
        checkIn,
        checkOut,
        guest,
    } = route.params || {};
    const [paymentMethodAddModalVisible, setPaymentMethodAddModalVisible] = useState(false);
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [showPayment, setShowPayment] = useState<boolean>(false);

    const paymentMethods = [
        {
            id: 1,
            name: 'Visa',
            number: 'XXXX XXXX XXXX 1245',
            image: require('../../../assets/images/card1.png'),
        },
        {
            id: 2,
            name: 'MasterCard',
            number: 'XXXX XXXX XXXX 4321',
            image: require('../../../assets/images/card2.png'),
        },
    ];


    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>

                <View style={styles.headerView}>
                    <View style={styles.inRow}>
                        <TouchableOpacity style={styles.backBox}>
                            <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                        </TouchableOpacity>
                        <View style={styles.titleView}>
                            <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                                Payment
                            </NMText>
                        </View>
                    </View>
                </View>

                <View style={styles.contentBox}>

                    <View style={styles.priceBox}>
                        <NMText fontSize={16} fontFamily="bold" color={Colors.textPrimary}>
                            Amount
                        </NMText>
                        <NMText fontSize={20} fontFamily="bold" color={Colors.primary}>
                            $ {propertyDetails.price}
                        </NMText>
                    </View>

                    <NMText fontSize={18} fontFamily="semiBold" color={Colors.textPrimary}>
                        Select Payment Method
                    </NMText>

                    {paymentMethods.map((method, index) => {
                        const isSelected = selectedCardIndex === index;
                        return (
                            <TouchableOpacity
                                key={method.id}
                                style={[
                                    styles.paymentMethodBox,
                                    {
                                        borderColor: isSelected ? Colors.primary : Colors.border,
                                        backgroundColor: Colors.white,
                                    },
                                ]}
                                onPress={() => setSelectedCardIndex(index)}
                                activeOpacity={0.7}
                            >
                                <Image source={method.image} style={styles.imageCardStyle} />
                                <View style={styles.rightBox}>
                                    <NMText fontSize={16} fontFamily="medium" color={Colors.textPrimary}>
                                        {method.name}
                                    </NMText>
                                    <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                                        {method.number}
                                    </NMText>
                                </View>

                                <CheckCircle2
                                    size={30}
                                    strokeWidth={1.5}
                                    color={Colors.white}
                                    fill={isSelected ? Colors.primary : Colors.background}
                                />
                            </TouchableOpacity>
                        );
                    })}

                    <NMButton
                        title="Add Debit/ Credit Card"
                        textColor={Colors.textPrimary}
                        fontSize={16}
                        fontFamily="medium"
                        borderRadius={8}
                        height={46}
                        rightIcon={<ChevronRight color={Colors.textPrimary} size={20} strokeWidth={1} />}
                        backgroundColor={Colors.white}
                        style={{
                            borderColor: Colors.border,
                            borderWidth: 1,
                            marginVertical: 20,
                        }}
                        contentStyleExtra={{ justifyContent: 'space-between' }}
                        textStyle={{ textAlign: 'left', width: '80%' }}
                        onPress={() => setPaymentMethodAddModalVisible(true)}
                    />

                    <NMButton
                        title="Make payment"
                        textColor={Colors.white}
                        fontSize={14}
                        fontFamily="semiBold"
                        borderRadius={8}
                        height={44}
                        backgroundColor={Colors.primary}
                        // backgroundColor={selectedCardIndex !== null ? Colors.primary : Colors.textLight}
                        // disabled={selectedCardIndex === null}
                        // navigation.navigate('StripePaymentModal')
                        onPress={() => setShowPayment(true)}
                    // onPress={() => navigation.navigate('StripePaymentModal')}
                    />
                </View>

                <PaymentMethodAddModal
                    visible={paymentMethodAddModalVisible}
                    onClose={() => setPaymentMethodAddModalVisible(false)}
                />

                <StripePaymentScreen
                    visible={showPayment}
                    propertyDetails={propertyDetails}
                    bookingDetails={{ check_in: checkIn, check_out: checkOut, guests: guest }}
                    onClose={() => setShowPayment(false)}
                />
            </ScrollView>
        </NMSafeAreaWrapper>
    );
};

export default PaymentMethod;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerView: {
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
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleView: {
        marginLeft: 10,
    },
    backBox: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.background,
    },
    contentBox: {
        marginTop: 10,
        marginHorizontal: '5%',
        padding: 14,
        borderRadius: 8,
        backgroundColor: Colors.white,
    },
    priceBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
        padding: 14,
        borderRadius: 8,
        backgroundColor: Colors.background,
    },
    paymentMethodBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
    },
    imageCardStyle: {
        width: 40,
        height: 40,
        marginRight: 10,
        resizeMode: 'contain',
    },
    rightBox: {
        flex: 1,
    },
});
