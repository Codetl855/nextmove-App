import { Image, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper'
import NMTextInput from '../../../components/common/NMTextInput'
import { Colors } from '../../../theme/colors'
import NMText from '../../../components/common/NMText'
import FilterListCard from '../../../components/user/FilterListCard'
import FilterSheet from '../../../components/user/FilterSheet'
import { ChevronLeft } from 'lucide-react-native'
import { apiRequest } from '../../../services/apiClient'
import { showErrorToast, showSuccessToast } from '../../../utils/toastService'
import LoaderModal from '../../../components/common/NMLoaderModal'

const FilterList: React.FC = ({ route, navigation }: any) => {
    const drawerNavigation = navigation?.getParent?.('drawer') || navigation?.getParent?.();

    const { params } = route;
    const { selectedCategory, fiterList } = params || {};

    const [filterVisible, setFilterVisible] = useState(false);
    const [filterData, setFilterData] = useState(fiterList || []);
    const [currentCategory, setCurrentCategory] = useState(selectedCategory || 'BUY');
    const [appliedFilters, setAppliedFilters] = useState<any>({});
    const [favoriteStates, setFavoriteStates] = useState<{ [key: string]: boolean }>({});
    const [loader, setLoader] = useState(false);

    const handleApplyFilter = (filters: any, fieldOption: any) => {
        // console.log('Applied Filters result:', filters);
        setFilterData(filters);
        // Update category from filter payload
        if (fieldOption?.property_category) {
            setCurrentCategory(fieldOption.property_category);
        }
        // Store applied filters for display
        setAppliedFilters(fieldOption || {});
    };

    const refreshFilterList = async () => {
        // Only refresh if we have applied filters (meaning filters were applied)
        if (!appliedFilters || Object.keys(appliedFilters).length === 0) {
            return;
        }

        try {
            // Build payload from appliedFilters
            const payload: any = {
                property_category: currentCategory || appliedFilters.property_category || 'BUY',
            };

            if (appliedFilters.city) payload.city = appliedFilters.city;
            if (appliedFilters.address) payload.address = appliedFilters.address;
            if (appliedFilters.property_type) payload.property_type = appliedFilters.property_type;
            if (appliedFilters.min_price) payload.min_price = appliedFilters.min_price;
            if (appliedFilters.max_price) payload.max_price = appliedFilters.max_price;
            if (appliedFilters.min_size) payload.min_size = appliedFilters.min_size;
            if (appliedFilters.max_size) payload.max_size = appliedFilters.max_size;
            if (appliedFilters.rating) payload.rating = appliedFilters.rating;

            const { result, error } = await apiRequest({
                endpoint: "v1/mobile/search-properties",
                method: "POST",
                data: payload,
            });

            if (result) {
                setFilterData(result.data);
            }

            if (error) {
                console.log("Refresh Filter List Error:", error);
            }
        } catch (err) {
            console.error("Refresh Filter List Error:", err);
        }
    };

    const makeFavorite = async (property: any) => {
        try {
            setLoader(true);
            // Optimistically update UI
            setFavoriteStates(prev => ({
                ...prev,
                [property.id]: !prev[property.id]
            }));

            const { result, error } = await apiRequest({
                endpoint: `v1/favourites/${property.id}/toggle`,
                method: 'POST',
            });

            if (result) {
                console.log("Favorite toggle result:", JSON.stringify(result));
                showSuccessToast('Favorite status updated successfully');
                // Refresh the filtered list to get updated favorite status
                refreshFilterList();
            }

            if (error) {
                console.log("Error:", error);
                // Revert state on error
                setFavoriteStates(prev => ({
                    ...prev,
                    [property.id]: !prev[property.id]
                }));
                showErrorToast(`Favorite Error: ${error}`);
            }

        } catch (err) {
            console.error("Unexpected Error:", err);
            // Revert state on error
            setFavoriteStates(prev => ({
                ...prev,
                [property.id]: !prev[property.id]
            }));
            showErrorToast(`Unexpected Error: ${err}`);
        } finally {
            setLoader(false);
        }
    };

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={styles.container}>
                    <View style={styles.headerView}>
                        <View style={styles.inRow}>
                            <TouchableOpacity style={styles.backBox} onPress={() => navigation.goBack()}>
                                <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                            </TouchableOpacity>
                            <View style={styles.titleView}>
                                <NMText fontSize={20} fontFamily='semiBold' color={Colors.textSecondary}>
                                    Properties List
                                </NMText>
                                {/* <NMText fontSize={14} fontFamily='regular' color={Colors.textSecondary}>
                                    1,142 Ads in Rayadh
                                </NMText> */}
                            </View>
                        </View>
                        <View style={styles.inRow}>
                            {/* <Image source={require('../../../assets/icons/bookMark.png')} style={[styles.headerIcon, { marginRight: 10 }]} /> */}
                            {/* <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} /> */}
                        </View>
                    </View>
                    <View style={styles.filterView}>
                        <Pressable style={{ width: '76%' }} onPress={() => setFilterVisible(true)}>
                            <NMTextInput
                                placeholder='Search here'
                                rightIcon={
                                    <Image source={require('../../../assets/icons/search.png')} style={styles.searchIcon} />
                                }
                                containerStyle={styles.inputContainer}
                                mainViewStyle={{ width: '100%' }}
                                editable={false}
                            />
                        </Pressable>
                        <TouchableOpacity style={styles.filterSlider} onPress={() => setFilterVisible(true)} activeOpacity={0.7}>
                            <Image source={require('../../../assets/icons/slidersBold.png')} style={styles.filterIcon} />
                        </TouchableOpacity>
                    </View>

                    {/* Applied Filters Display */}
                    {Object.keys(appliedFilters).filter(key => key !== 'property_category').length > 0 && (
                        <View style={styles.filtersContainer}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.filtersScrollContent}
                            >
                                {/* currentCategory */}
                                {currentCategory && (
                                    <View style={styles.filterChip}>
                                        <NMText fontSize={12} fontFamily='regular' color={Colors.primary}>
                                            Category: {currentCategory}
                                        </NMText>
                                    </View>
                                )}
                                {appliedFilters.city && (
                                    <View style={styles.filterChip}>
                                        <NMText fontSize={12} fontFamily='regular' color={Colors.primary}>
                                            City: {appliedFilters.city}
                                        </NMText>
                                    </View>
                                )}
                                {appliedFilters.address && (
                                    <View style={styles.filterChip}>
                                        <NMText fontSize={12} fontFamily='regular' color={Colors.primary}>
                                            Location: {appliedFilters.address}
                                        </NMText>
                                    </View>
                                )}
                                {appliedFilters.property_type && (
                                    <View style={styles.filterChip}>
                                        <NMText fontSize={12} fontFamily='regular' color={Colors.primary}>
                                            Type: {appliedFilters.property_type}
                                        </NMText>
                                    </View>
                                )}
                                {(appliedFilters.min_price || appliedFilters.max_price) && (
                                    <View style={styles.filterChip}>
                                        <NMText fontSize={12} fontFamily='regular' color={Colors.primary}>
                                            Price: {appliedFilters.min_price ? `SAR ${appliedFilters.min_price.toLocaleString()}` : ''} {appliedFilters.min_price && appliedFilters.max_price ? '-' : ''} {appliedFilters.max_price ? `SAR ${appliedFilters.max_price.toLocaleString()}` : ''}
                                        </NMText>
                                    </View>
                                )}
                                {(appliedFilters.min_size || appliedFilters.max_size) && (
                                    <View style={styles.filterChip}>
                                        <NMText fontSize={12} fontFamily='regular' color={Colors.primary}>
                                            Size: {appliedFilters.min_size || ''} {appliedFilters.min_size && appliedFilters.max_size ? '-' : ''} {appliedFilters.max_size ? `${appliedFilters.max_size} SqFt` : ''}
                                        </NMText>
                                    </View>
                                )}
                                {appliedFilters.rating && (
                                    <View style={styles.filterChip}>
                                        <NMText fontSize={12} fontFamily='regular' color={Colors.primary}>
                                            Rating: {appliedFilters.rating}⭐
                                        </NMText>
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    )}

                    {filterData?.data?.map((item, index) => (
                        <FilterListCard
                            key={index}
                            item={item}
                            SelectedCategory={currentCategory}
                            isFavorite={item.is_favourite || favoriteStates[item.id] || false}
                            onFavoritePress={(pressedItem) => makeFavorite(pressedItem)}
                        />
                    ))}
                </View>
                <FilterSheet
                    visible={filterVisible}
                    onClose={() => setFilterVisible(false)}
                    onApplyFilter={handleApplyFilter}
                />
                <LoaderModal visible={loader} />
            </ScrollView>
        </NMSafeAreaWrapper>
    )
}

export default FilterList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background
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
    backBox: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.background
    },
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    headerLogo: {
        width: 100,
        height: 40,
        resizeMode: 'contain'
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleView: {
        marginLeft: 10
    },
    filterView: {
        marginTop: 10,
        width: '100%',
        marginHorizontal: '5%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputContainer: {
        height: 50,
        width: '100%',
        borderColor: Colors.white
    },
    searchIcon: {
        width: 22,
        height: 22
    },
    filterIcon: {
        width: 18,
        height: 18,
        tintColor: Colors.white,
        resizeMode: 'contain'
    },
    filterSlider: {
        width: 46,
        height: 46,
        backgroundColor: Colors.primary,
        borderRadius: 8,
        marginLeft: '2%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filtersContainer: {
        marginTop: 10,
        marginHorizontal: '5%',
        marginBottom: 10,
    },
    filtersScrollContent: {
        flexDirection: 'row',
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
})