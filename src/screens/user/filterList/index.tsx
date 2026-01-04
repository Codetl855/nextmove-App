import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper'
import NMTextInput from '../../../components/common/NMTextInput'
import { Colors } from '../../../theme/colors'
import NMText from '../../../components/common/NMText'
import FilterListCard from '../../../components/user/FilterListCard'
import FilterSheet from '../../../components/user/FilterSheet'
import { ChevronLeft } from 'lucide-react-native'

const FilterList: React.FC = ({ route, navigation }: any) => {
    const drawerNavigation = navigation?.getParent?.('drawer') || navigation?.getParent?.();

    const { params } = route;
    const { selectedCategory, fiterList } = params || {};

    const [filterVisible, setFilterVisible] = useState(false);
    const [filterData, setFilterData] = useState(fiterList || []);

    const handleApplyFilter = (filters: any, fieldOption: any) => {
        // console.log('Applied Filters result:', filters);
        setFilterData(filters);
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
                                    {/* Villas for Sale */}{selectedCategory}
                                </NMText>
                                {/* <NMText fontSize={14} fontFamily='regular' color={Colors.textSecondary}>
                                    1,142 Ads in Rayadh
                                </NMText> */}
                            </View>
                        </View>
                        <View style={styles.inRow}>
                            <Image source={require('../../../assets/icons/bookMark.png')} style={[styles.headerIcon, { marginRight: 10 }]} />
                            <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} />
                        </View>
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
                        <TouchableOpacity style={styles.filterSlider} onPress={() => setFilterVisible(true)} activeOpacity={0.7}>
                            <Image source={require('../../../assets/icons/slidersBold.png')} style={styles.filterIcon} />
                        </TouchableOpacity>
                    </View>

                    {filterData?.data.map((item, index) => (
                        <FilterListCard key={index} item={item} SelectedCategory={selectedCategory} />
                    ))}
                </View>
                <FilterSheet
                    visible={filterVisible}
                    onClose={() => setFilterVisible(false)}
                    onApplyFilter={handleApplyFilter}
                />
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
})