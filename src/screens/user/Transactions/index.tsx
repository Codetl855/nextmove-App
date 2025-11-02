import { Image, ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import NMTextInput from '../../../components/common/NMTextInput';
import { Colors } from '../../../theme/colors';
import NMText from '../../../components/common/NMText';
import TransactionCard from '../../../components/user/TransactionCard';

const Transactions: React.FC = () => {
    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={styles.container}>

                    <View style={styles.headerView}>
                        <View style={styles.inRow}>
                            <Image source={require('../../../assets/icons/drawer.png')} style={styles.headerIcon} />
                            <View style={styles.titleView}>
                                <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                                    Transactions
                                </NMText>
                            </View>
                        </View>
                        <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} />
                    </View>

                    <View style={styles.filterView}>
                        <NMTextInput
                            placeholder="Search here"
                            rightIcon={
                                <Image
                                    source={require('../../../assets/icons/search.png')}
                                    style={styles.searchIcon}
                                />
                            }
                            containerStyle={styles.inputContainer}
                            mainViewStyle={{ width: '92%' }}
                        />
                    </View>

                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
                        <TransactionCard key={index} />
                    ))}
                </View>
            </ScrollView>
        </NMSafeAreaWrapper>
    );
};

export default Transactions;

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
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleView: {
        marginLeft: 10,
    },
    filterView: {
        marginTop: 10,
        width: '100%',
        marginHorizontal: '5%',
    },
    inputContainer: {
        height: 50,
        width: '100%',
        borderColor: Colors.white,
    },
    searchIcon: {
        width: 22,
        height: 22,
    },
});