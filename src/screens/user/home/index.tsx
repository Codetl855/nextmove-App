import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper'
import { Colors } from '../../../theme/colors'
import NMTextInput from '../../../components/common/NMTextInput'
import NMText from '../../../components/common/NMText'
import NMTabs from '../../../components/common/NMTab'
import PropertyCardList from '../../../components/user/PropertyCardList'
import PostAnAd from '../../../components/user/PostAnAd'
import FeatureAgencies from '../../../components/user/FeatureAgencies'
import BlogCardList from '../../../components/user/BlogCardList'
import { SheetProvider, SheetManager } from 'react-native-actions-sheet';
import FilterSheet from '../../../components/user/FilterSheet';
import { useNavigation } from '@react-navigation/native'

const HomeScreen: React.FC = () => {

    const navigation = useNavigation();
    const showFilterSheet = () => {
        SheetManager.show('filter-sheet');
    };

    const hideFilterSheet = () => {
        SheetManager.hide('filter-sheet');
    };

    return (
        <SheetProvider>
            <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
                <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                    <View style={styles.container}>
                        <View style={styles.headerView}>
                            <Image source={require('../../../assets/icons/drawer.png')} style={styles.headerIcon} />
                            <Image source={require('../../../assets/images/HomeLogo.png')} style={styles.headerLogo} />
                            <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} />
                        </View>
                        <View style={styles.filterView}>
                            <NMTextInput
                                placeholder='Search here'
                                rightIcon={
                                    <Image source={require('../../../assets/icons/search.png')} style={styles.searchIcon} />
                                }
                                containerStyle={styles.inputContainer}
                                mainViewStyle={{ width: '76%' }}
                            />
                            <TouchableOpacity style={styles.filterSlider} onPress={showFilterSheet} activeOpacity={0.7}>
                                <Image source={require('../../../assets/icons/slidersBold.png')} style={styles.filterIcon} />
                            </TouchableOpacity>
                        </View>
                        <NMText fontSize={18} fontFamily='medium' style={styles.textStyle}>
                            Recommended For You
                        </NMText>

                        <NMTabs
                            onTabSelect={(tabId) => console.log('Selected:', tabId)}
                            defaultSelected="1"
                        />

                        <PropertyCardList />

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

                        <BlogCardList />
                    </View>
                </ScrollView>
                <FilterSheet sheetId="filter-sheet" />
            </NMSafeAreaWrapper>
        </SheetProvider>
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