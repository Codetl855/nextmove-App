import { Image, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper'
import { Colors } from '../../../theme/colors'
import NMTextInput from '../../../components/common/NMTextInput'
import NMText from '../../../components/common/NMText'
import NMTabs from '../../../components/common/NMTab'
import PropertyCardList from '../../../components/user/PropertyCardList'
import PostAnAd from '../../../components/user/PostAnAd'
import FeatureAgencies from '../../../components/user/FeatureAgencies'
import BlogCardList from '../../../components/user/BlogCardList'
import FilterSheet from '../../../components/user/FilterSheet';
import { useNavigation } from '@react-navigation/native'
import { apiRequest } from '../../../services/apiClient'
import { showErrorToast } from '../../../utils/toastService'
import LoaderModal from '../../../components/common/NMLoaderModal'

const HomeScreen: React.FC = () => {

    const navigation = useNavigation();

    // Get drawer navigation from parent
    const drawerNavigation = navigation.getParent('drawer') || navigation.getParent();
    const [selectedTab, setSelectedTab] = useState('0');
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const [bogsData, setBlogsData] = useState([]);
    const [propertiesTab, setPropertiesTab] = useState([]);
    const tabs = [
        { id: '0', label: 'House' },
        { id: '1', label: 'Apartment' },
        { id: '2', label: 'Villa' },
        { id: '3', label: 'Studio' },
    ];

    const showFilterSheet = () => {
        setFilterVisible(true);
    };
    const loadFieldOptions = async () => {
        setLoading(true);
        const { result, error } = await apiRequest({
            endpoint: 'v1/property-field-options',
            method: 'GET',
        });
        if (result) {
            const data = result.data;
            const propertyTypes = data?.propertyTypes?.map(
                (item: string, index: number) => ({
                    label: item,
                    value: item,
                    id: index.toString(),
                })
            );

            setPropertiesTab(propertyTypes || []);

            if (propertyTypes.length > 0) {
                setSelectedTab(propertyTypes[0].id);
            }
        }
        if (error) {
            console.warn("Failed:", error);
            showErrorToast(`loadFieldOptions: ${error}`);
        }
        setLoading(false);
    };

    const getPropertyList = async () => {
        // Don't call API if propertiesTab is empty or selectedTab doesn't exist
        if (!propertiesTab || propertiesTab.length === 0 || !selectedTab) {
            return;
        }

        // Find the selected tab by ID
        const selectedTabData = propertiesTab.find((tab: any) => tab.id === selectedTab);
        if (!selectedTabData || !selectedTabData.label) {
            return;
        }

        try {
            setLoading(true);
            const { result, error } = await apiRequest({
                endpoint: `v1/mobile/featured-properties/?type=${selectedTabData.label}`,
                method: 'GET',
            });

            if (result) {
                console.log("Properties List:", JSON.stringify(result.data));
                setProperties(result.data);
            }

            if (error) {
                console.log("Error:", error);
                showErrorToast(`Get Properties Error: ${error}`);
            }

        } catch (err) {
            console.error("Unexpected Error:", err);
            showErrorToast(`Unexpected Error: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const getBlogs = async () => {
        try {
            setLoading(true);
            const { result, error } = await apiRequest({
                endpoint: `v1/blogs-list?per_page=5`,
                method: 'GET',
            });

            if (result) {
                setBlogsData(result.data);
            }

            if (error) {
                console.log("Error:", error);
                showErrorToast(`Get Blogs Error: ${error}`);
            }

        } catch (err) {
            console.error("Unexpected Error:", err);
            showErrorToast(`Unexpected Error: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyFilter = (filters: any, fieldOption: any) => {
        console.log('Applied Filters:', fieldOption);
        navigation.navigate('Home', { screen: 'FilterList', params: { selectedCategory: fieldOption.property_category, fiterList: filters } });
    };

    useEffect(() => {
        loadFieldOptions();
        getBlogs();
    }, []);

    useEffect(() => {
        if (propertiesTab.length > 0) {
            getPropertyList();
        }
    }, [selectedTab, propertiesTab]);

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={styles.container}>
                    <View style={styles.headerView}>
                        <TouchableOpacity onPress={() => {
                            if (drawerNavigation && 'openDrawer' in drawerNavigation) {
                                drawerNavigation.openDrawer();
                            } else if (navigation && 'openDrawer' in navigation) {
                                (navigation as any).openDrawer();
                            }
                        }}>
                            <Image source={require('../../../assets/icons/drawer.png')} style={styles.headerIcon} />
                        </TouchableOpacity>
                        <Image source={require('../../../assets/images/HomeLogo.png')} style={styles.headerLogo} />
                        <View style={styles.headerIcon} />
                        {/* <TouchableOpacity onPress={() => navigation.navigate('NotificationsScreen')}>
                            <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} />
                        </TouchableOpacity> */}
                    </View>
                    <View style={styles.filterView}>
                        <Pressable onPress={showFilterSheet} style={{ width: '76%' }}>
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
                        <TouchableOpacity style={styles.filterSlider} onPress={showFilterSheet} activeOpacity={0.7}>
                            <Image source={require('../../../assets/icons/slidersBold.png')} style={styles.filterIcon} />
                        </TouchableOpacity>
                    </View>
                    <NMText fontSize={18} fontFamily='medium' style={styles.textStyle}>
                        Recommended For You
                    </NMText>

                    <NMTabs
                        tabs={propertiesTab.length > 0 ? propertiesTab : tabs}
                        onTabSelect={(tabId) => setSelectedTab(tabId)}
                        defaultSelected={selectedTab || "0"}
                    />

                    {properties.length > 0 ? (
                        <PropertyCardList properties={properties} onFavoriteUpdate={getPropertyList} />
                    ) : (
                        <NMText fontSize={14} fontFamily='regular' color={Colors.textSecondary} style={{ marginTop: 20, marginHorizontal: '5%' }}>
                            No properties available for the selected type.
                        </NMText>
                    )}

                    <PostAnAd />

                    <FeatureAgencies />

                    <View style={styles.blogView}>
                        <NMText fontSize={16} fontFamily='medium' color={Colors.textPrimary}>
                            Our Latest Blogs
                        </NMText>
                        <NMText fontSize={14} fontFamily='medium' color={Colors.primary} onPress={() => navigation.navigate('BlogsList')}>
                            View All
                        </NMText>
                    </View>

                    <BlogCardList blogs={bogsData} />
                </View>
            </ScrollView>
            <FilterSheet
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApplyFilter={handleApplyFilter}
            />
            <LoaderModal visible={loading} />
        </NMSafeAreaWrapper>
    )
}

export default HomeScreen

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
    headerIcon: {
        width: 28,
        height: 28,
        resizeMode: 'contain'
    },
    headerLogo: {
        width: 100,
        height: 40,
        resizeMode: 'contain'
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
    textStyle: {
        marginTop: 20,
        marginHorizontal: '5%',
        color: Colors.textPrimary
    },
    blogView: {
        marginHorizontal: '5%',
        marginVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})