import { Image, ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper'
import { Colors } from '../../../theme/colors'
import NMText from '../../../components/common/NMText'
import FilterListCard from '../../../components/user/FilterListCard'
import { showErrorToast, showSuccessToast } from '../../../utils/toastService'
import { apiRequest } from '../../../services/apiClient'
import LoaderModal from '../../../components/common/NMLoaderModal'
import { useNavigation } from '@react-navigation/native'

const FavoriteProperties: React.FC = () => {
    const navigation = useNavigation();
    const drawerNavigation = navigation.getParent('drawer') || navigation.getParent();
    const [favList, setFavList] = useState([]);
    const [loader, setLoader] = useState(false);
    const getFavList = async () => {
        try {
            setLoader(true);
            const { result, error } = await apiRequest({
                endpoint: `v1/favourites`,
                method: 'GET',
            });

            if (result) {
                console.log("Properties List:", JSON.stringify(result.data));
                setFavList(result.data);
            }

            if (error) {
                console.log("Error:", error);
                showErrorToast(`Get Properties Error: ${error}`);
            }

        } catch (err) {
            console.error("Unexpected Error:", err);
            showErrorToast(`Unexpected Error: ${err}`);
        } finally {
            setLoader(false);
        }
    };

    const makeUnFavorite = async (property: any) => {
        try {
            setLoader(true);

            const { result, error } = await apiRequest({
                endpoint: `v1/favourites/${property.property_id}/toggle`,
                method: 'POST',
            });

            if (result) {
                console.log("Properties List:", JSON.stringify(result));
                getFavList();
                showSuccessToast('Favorite status updated successfully');
            }

            if (error) {
                console.log("Error:", error);
                showErrorToast(`Get Properties Error: ${error}`);
            }

        } catch (err) {
            console.error("Unexpected Error:", err);
            showErrorToast(`Unexpected Error: ${err}`);
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        getFavList();
    }, []);

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>

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
                                Favorite Properties
                            </NMText>
                        </View>
                    </View>
                    <View style={styles.inRow}>
                        <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} />
                    </View>
                </View>


                {favList?.map(item => (
                    <FilterListCard
                        key={item.property_id}
                        item={item}
                        isFavorite={true}
                        onFavoritePress={(pressedItem) => makeUnFavorite(pressedItem)}
                    />
                ))}

                <LoaderModal visible={loader} />
            </ScrollView>
        </NMSafeAreaWrapper>
    )
}

export default FavoriteProperties

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
})
