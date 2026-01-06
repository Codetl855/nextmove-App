import { Image, ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import NMTextInput from '../../../components/common/NMTextInput';
import { Colors } from '../../../theme/colors';
import NMText from '../../../components/common/NMText';
import TransactionCard from '../../../components/user/TransactionCard';
import { apiRequest } from '../../../services/apiClient';
import LoaderModal from '../../../components/common/NMLoaderModal';
import { useNavigation } from '@react-navigation/native';
import InvoiceDetailsModal from '../../../components/user/InvoiceDetailsModal';
import { showWarningToast } from '../../../utils/toastService';

interface TransactionData {
    property_id?: number;
    property_title?: string;
    property_address?: string;
    property_price?: string;
    property_type?: string;
    property_created_at?: string;
    booking_created_at?: string;
    booking_id?: number;
    reference?: string;
    status?: string;
    amount?: string;
    currency?: string;
    gateway?: string;
    created_at?: string;
    user_email?: string;
    user_mobile?: string;
    primary_image?: string;
}

const Transactions: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);

    const getTransactions = async () => {
        try {
            setIsLoading(true);
            const { result, error } = await apiRequest({
                endpoint: 'v1/transactions/properties',
                method: 'GET',
            });
            if (error) {
                console.log('Error fetching transactions:', error);
                setTransactionData([]);
                return;
            }
            // Safely access nested data with optional chaining
            const transactions = result?.data?.data;
            if (Array.isArray(transactions)) {
                setTransactionData(transactions);
            } else {
                console.log('Invalid transaction data format:', transactions);
                setTransactionData([]);
            }
        } catch (err) {
            console.log('Error fetching transactions:', err);
            setTransactionData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getTransactions();
    }, []);

    const navigation = useNavigation();
    const drawerNavigation = navigation.getParent('drawer') || navigation.getParent();

    // Safe filter with null checks and optional chaining
    const filteredTransactions = transactionData.filter(transaction => {
        if (!transaction) return false;

        const query = searchQuery.toLowerCase();
        const title = transaction.property_title?.toLowerCase() || '';
        const reference = transaction.reference?.toLowerCase() || '';
        const amount = transaction.amount?.toString() || '';

        return title.includes(query) ||
            reference.includes(query) ||
            amount.includes(searchQuery);
    });

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={styles.container}>

                    <View style={styles.headerView}>
                        <View style={styles.inRow}>
                            <TouchableOpacity onPress={() => {
                                if (drawerNavigation && 'openDrawer' in drawerNavigation) {
                                    drawerNavigation.openDrawer();
                                } else if (navigation && 'openDrawer' in navigation) {
                                    (navigation as any).openDrawer();
                                }
                            }}>
                                <Image source={require('../../../assets/icons/drawer.png')} style={styles.headerIcon} />
                            </TouchableOpacity>
                            <View style={styles.titleView}>
                                <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                                    Transactions
                                </NMText>
                            </View>
                        </View>
                        {/* <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} /> */}
                    </View>

                    <View style={styles.filterView}>
                        <NMTextInput
                            placeholder="Search here"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
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

                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction, index) => {
                            // Only render if transaction data exists
                            if (!transaction) return null;
                            return (
                                <TransactionCard
                                    key={transaction.booking_id || `transaction-${index}`}
                                    data={transaction}
                                    onPress={() => {
                                        if (transaction.booking_id && transaction?.status == "succeeded") {
                                            setSelectedInvoiceId(transaction.booking_id);
                                            setIsInvoiceModalVisible(true);
                                        } else if (transaction.booking_id && transaction?.status == "pending_approval") {
                                            showWarningToast("Your transaction is pending approval. Please wait for the approval to complete.");
                                        }
                                    }}
                                />
                            );
                        })
                    ) : (
                        <View style={styles.emptyState}>
                            <NMText fontSize={16} fontFamily="medium" color={Colors.textLight}>
                                {searchQuery ? 'No transactions found' : 'No transactions available'}
                            </NMText>
                        </View>
                    )}
                </View>
            </ScrollView>
            <LoaderModal visible={isLoading} />
            <InvoiceDetailsModal
                visible={isInvoiceModalVisible}
                onClose={() => {
                    setIsInvoiceModalVisible(false);
                    setSelectedInvoiceId(null);
                }}
                invoiceId={selectedInvoiceId}
            />
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
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
});
// import { Image, ScrollView, StyleSheet, View } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
// import NMTextInput from '../../../components/common/NMTextInput';
// import { Colors } from '../../../theme/colors';
// import NMText from '../../../components/common/NMText';
// import TransactionCard from '../../../components/user/TransactionCard';
// import { apiRequest } from '../../../services/apiClient';
// import LoaderModal from '../../../components/common/NMLoaderModal';

// const Transactions: React.FC = () => {
//     const [isLoading, setIsLoading] = useState(false);
// const [transactionData, setTransactionData] = useState<Array<any>>([]);

//     const getTransactions = async () => {
//         try {
//             setIsLoading(true);
//             const {result,error}=await apiRequest({
//                 endpoint:'v1/transactions/properties',
//                 method:'GET',
//             })
//             if(error){
//                 console.log('Error fetching transactions:', error);
//                 return;
//             }
//             setTransactionData(result.data.data);
//         } catch (err) {
//             console.log('Error fetching transactions:', err);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         getTransactions();
//     }, []);

//     return (
//         <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
//             <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
//                 <View style={styles.container}>

//                     <View style={styles.headerView}>
//                         <View style={styles.inRow}>
//                             <Image source={require('../../../assets/icons/drawer.png')} style={styles.headerIcon} />
//                             <View style={styles.titleView}>
//                                 <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
//                                     Transactions
//                                 </NMText>
//                             </View>
//                         </View>
//                         <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} />
//                     </View>

//                     <View style={styles.filterView}>
//                         <NMTextInput
//                             placeholder="Search here"
//                             rightIcon={
//                                 <Image
//                                     source={require('../../../assets/icons/search.png')}
//                                     style={styles.searchIcon}
//                                 />
//                             }
//                             containerStyle={styles.inputContainer}
//                             mainViewStyle={{ width: '92%' }}
//                         />
//                     </View>

//                     {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
//                         <TransactionCard key={index} />
//                     ))}
//                 </View>
//             </ScrollView>
//             <LoaderModal visible={isLoading} />
//         </NMSafeAreaWrapper>
//     );
// };

// export default Transactions;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: Colors.background,
//     },
//     headerView: {
//         width: '100%',
//         backgroundColor: Colors.white,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: '5%',
//         paddingVertical: 20,
//         borderBottomLeftRadius: 20,
//         borderBottomRightRadius: 20,
//     },
//     headerIcon: {
//         width: 30,
//         height: 30,
//         resizeMode: 'contain',
//     },
//     inRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     titleView: {
//         marginLeft: 10,
//     },
//     filterView: {
//         marginTop: 10,
//         width: '100%',
//         marginHorizontal: '5%',
//     },
//     inputContainer: {
//         height: 50,
//         width: '100%',
//         borderColor: Colors.white,
//     },
//     searchIcon: {
//         width: 22,
//         height: 22,
//     },
// });