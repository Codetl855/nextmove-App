import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import NMText from '../common/NMText'
import { MapPin, Heart } from 'lucide-react-native'
import { Colors } from '../../theme/colors'
import { useNavigation } from '@react-navigation/native'

interface Props {
    item: any;
    SelectedCategory?: string;
    onFavoritePress?: (item: any) => void;
    isFavorite?: boolean
}

const FilterListCard: React.FC<Props> = ({ item, SelectedCategory, onFavoritePress, isFavorite }) => {

    if (!item) {
        return null;
    }

    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.8}
            onPress={() =>
                navigation.navigate('PropertyDetailScreen', {
                    property: item,
                    SelectedCategory: SelectedCategory,
                })
            }
        >

            {/* Property Image */}
            <Image
                source={{ uri: item.primary_image }}
                style={styles.imageStyle}
            />

            {/* Content */}
            <View style={styles.textContainer}>

                {/* Title */}
                <NMText fontSize={16} fontFamily='semiBold' color={Colors.textPrimary} style={{ width: '78%' }} numberOfLines={1} ellipsizeMode='tail'>
                    {item.title}
                </NMText>

                {/* Address */}
                <View style={styles.locationContainer}>
                    <MapPin size={16} color={Colors.primary} />
                    <NMText fontSize={14} fontFamily='regular' color={Colors.textLight}>
                        {item.address}
                    </NMText>
                </View>

                {/* Features (these are not in API → default 0) */}
                {/* <View style={styles.featuresContainer}>
                    <View style={styles.feature}>
                        <Image source={require('../../assets/icons/sqf.png')} style={styles.featureIcon} />
                        <NMText fontSize={12} fontFamily='regular' color={Colors.textPrimary}>
                            {item?.size || 0}sqf
                        </NMText>
                    </View>

                    <View style={styles.feature}>
                        <Image source={require('../../assets/icons/bed.png')} style={styles.featureIcon} />
                        <NMText fontSize={12} fontFamily='regular' color={Colors.textPrimary}>
                            {item?.bedrooms || 0} Beds
                        </NMText>
                    </View>

                    <View style={styles.feature}>
                        <Image source={require('../../assets/icons/bath.png')} style={styles.featureIcon} />
                        <NMText fontSize={12} fontFamily='regular' color={Colors.textPrimary}>
                            {item?.bathrooms || 0} Baths
                        </NMText>
                    </View>
                </View> */}

                {/* Price + Added Date */}
                <View style={styles.priceContainer}>
                    <NMText fontSize={12} fontFamily='regular' color={Colors.textLight}>
                        Added: {item.added_on}
                    </NMText>

                    <NMText fontSize={14} fontFamily='semiBold' color={Colors.primary}>
                        ${item.price}
                    </NMText>
                </View>

                {/* Favorite Button */}
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => onFavoritePress?.(item)}
                    activeOpacity={0.7}
                >
                    <Heart
                        size={16}
                        color={isFavorite ? Colors.primary : Colors.border}
                        fill={isFavorite ? Colors.primary : Colors.border}
                        strokeWidth={2}
                    />
                </TouchableOpacity>

            </View>
        </TouchableOpacity>
    )
}

export default FilterListCard

// import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
// import React from 'react'
// import NMText from '../common/NMText'
// import { MapPin, Heart } from 'lucide-react-native'
// import { Colors } from '../../theme/colors'
// import { useNavigation } from '@react-navigation/native'

// interface Props {
//     SelectedCategory?: string
// }
// const FilterListCard: React.FC<Props> = ({ SelectedCategory }) => {
//     const navigation = useNavigation();

//     return (
//         <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={() => navigation.navigate('PropertyDetailScreen', { SelectedCategory })}>
//             <Image source={{ uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800' }} style={styles.imageStyle} />
//             <View style={styles.textContainer}>
//                 <NMText fontSize={16} fontFamily='semiBold' color={Colors.textPrimary}>
//                     Duplex orkit villa.
//                 </NMText>
//                 <View style={styles.locationContainer}>
//                     <MapPin size={16} color={Colors.primary} />
//                     <NMText fontSize={14} fontFamily='regular' color={Colors.textLight}>
//                         Al Orubah Street, Um Al Hammam Dist.</NMText>
//                 </View>
//                 <View style={styles.featuresContainer}>

//                     <View style={styles.feature}>
//                         <Image source={require('../../assets/icons/sqf.png')} style={styles.featureIcon} />
//                         <NMText fontSize={12} fontFamily='regular' color={Colors.textPrimary}>
//                             8000sqf
//                         </NMText>
//                     </View>

//                     <View style={styles.feature}>
//                         <Image source={require('../../assets/icons/bed.png')} style={styles.featureIcon} />
//                         <NMText fontSize={12} fontFamily='regular' color={Colors.textPrimary}>
//                             4 Beds
//                         </NMText>
//                     </View>

//                     <View style={styles.feature}>
//                         <Image source={require('../../assets/icons/bath.png')} style={styles.featureIcon} />
//                         <NMText fontSize={12} fontFamily='regular' color={Colors.textPrimary}>
//                             4 Baths
//                         </NMText>
//                     </View>
//                 </View>
//                 <View style={styles.priceContainer}>
//                     <NMText fontSize={12} fontFamily='regular' color={Colors.textLight}>
//                         Added: 22 hours ago
//                     </NMText>
//                     <NMText fontSize={14} fontFamily='semiBold' color={Colors.primary}>
//                         $7250,00
//                     </NMText>
//                 </View>
//                 <View style={styles.favoriteButton}>
//                     <Heart
//                         size={16}
//                         color={Colors.textPrimary}
//                         fill={Colors.background}
//                         strokeWidth={2}
//                     />
//                 </View>
//             </View>
//         </TouchableOpacity>
//     )
// }

// export default FilterListCard

const styles = StyleSheet.create({
    container: {
        marginHorizontal: '5%',
        flexDirection: 'row',
        backgroundColor: Colors.white,
        marginVertical: 6,
        padding: 14,
        borderRadius: 12
    },
    imageStyle: {
        width: 110,
        height: 90,
        // height: 113,
        borderRadius: 12,
    },
    textContainer: {
        flex: 1,
        marginLeft: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        marginTop: 6,
    },
    featuresContainer: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 4,
    },
    featureIcon: {
        width: 14,
        height: 14,
        resizeMode: 'contain',
        marginRight: 2,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    favoriteButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
})