import { Image, ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper'
import { Colors } from '../../../theme/colors'
import NMText from '../../../components/common/NMText'
import FilterListCard from '../../../components/user/FilterListCard'

const FavoriteProperties: React.FC = () => {
    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>

                <View style={styles.headerView}>
                    <View style={styles.inRow}>
                        <Image source={require('../../../assets/icons/drawer.png')} style={styles.headerIcon} />
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

                {[...Array(10)].map((_, index) => (
                    <FilterListCard key={index} />
                ))}
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
