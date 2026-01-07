import React, { useState } from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import { Heart } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import NMText from '../common/NMText';
import { apiRequest } from '../../services/apiClient';
import { showErrorToast, showSuccessToast } from '../../utils/toastService';
import LoaderModal from '../common/NMLoaderModal';
import { useNavigation } from '@react-navigation/native';

interface PropertyCardProps {
    image: string;
    title: string;
    sqft: number;
    beds: number;
    baths: number;
    agentName: string;
    agentImage: string;
    price: string;
    onPress?: () => void;
    onFavoritePress?: () => void;
    isFavorite?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
    image,
    title,
    sqft,
    beds,
    baths,
    agentName,
    agentImage,
    price,
    onPress,
    onFavoritePress,
    isFavorite,
}) => {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />

                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={onFavoritePress}
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

            <View style={styles.content}>
                <NMText fontSize={14} fontFamily='medium' color={Colors.textPrimary} numberOfLines={1}>
                    {title}
                </NMText>

                <View style={styles.featuresContainer}>

                    <View style={styles.feature}>
                        <Image source={require('../../assets/icons/sqf.png')} style={styles.featureIcon} />
                        <NMText fontSize={14} fontFamily='regular' color={Colors.textPrimary}>
                            {sqft}sqf
                        </NMText>
                    </View>

                    <View style={styles.feature}>
                        <Image source={require('../../assets/icons/bed.png')} style={styles.featureIcon} />
                        <NMText fontSize={14} fontFamily='regular' color={Colors.textPrimary}>
                            {beds} Beds
                        </NMText>
                    </View>

                    <View style={styles.feature}>
                        <Image source={require('../../assets/icons/bath.png')} style={styles.featureIcon} />
                        <NMText fontSize={14} fontFamily='regular' color={Colors.textPrimary}>
                            {baths} Baths
                        </NMText>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.agentContainer}>
                        <Image source={{ uri: agentImage }} style={styles.agentImage} />
                        <NMText fontSize={14} fontFamily='medium' color={Colors.textPrimary}>
                            {agentName}
                        </NMText>
                    </View>
                    <NMText fontSize={14} fontFamily='bold' color={Colors.primary}>
                        $ {price}
                    </NMText>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const PropertyCardList: React.FC<{ properties: any[] }> = ({ properties }) => {
    const navigation = useNavigation();
    const [favoriteStates, setFavoriteStates] = useState<{ [key: string]: boolean }>({});
    const [loader, setLoader] = useState(false);

    const screenWidth = Dimensions.get('window').width;
    const marginHorizontal = screenWidth * 0.05;

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
                console.log("Properties List:", JSON.stringify(result));
                showSuccessToast('Favorite status updated successfully');
            }

            if (error) {
                console.log("Error:", error);
                // Revert state on error
                setFavoriteStates(prev => ({
                    ...prev,
                    [property.id]: !prev[property.id]
                }));
                showErrorToast(`Get Properties Error: ${error}`);
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
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    {
                        paddingLeft: marginHorizontal,
                        paddingRight: marginHorizontal,
                    },
                ]}
            >
                {properties.map((property) => (
                    <PropertyCard
                        key={property?.id}
                        image={property?.media[0]?.media_url}
                        title={property?.title}
                        sqft={property?.size || 0}
                        beds={property?.bedrooms || 0}
                        baths={property?.bathrooms || 0}
                        agentName={property?.owner?.first_name + ' ' + property?.owner?.last_name}
                        agentImage={property?.owner?.profile_image_url}
                        price={property?.price}
                        isFavorite={property.is_favourite || favoriteStates[property.id] || false}
                        onPress={() => navigation.navigate('PropertyDetailScreen', { property })}
                        onFavoritePress={() => makeFavorite(property)}
                    />
                ))}
            </ScrollView>
            <LoaderModal visible={loader} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 14,
    },
    scrollContent: {
        gap: 16,
        paddingBottom: 4,
    },
    card: {
        width: 265,
        backgroundColor: Colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    imageContainer: {
        width: '100%',
        height: 150,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        backgroundColor: Colors.border,
    },
    favoriteButton: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: 36,
        height: 36,
        borderRadius: 36 / 2,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    content: {
        padding: 12,
    },
    featuresContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginVertical: 10,
        padding: 14,
        borderBottomWidth: 1,
        borderColor: Colors.border,
        borderTopWidth: 1,
    },
    featureIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    agentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    agentImage: {
        width: 28,
        height: 28,
        borderRadius: 28 / 2,
        backgroundColor: Colors.border,
    },
});

export default PropertyCardList;
// import React from 'react';
// import {
//     View,
//     Image,
//     StyleSheet,
//     TouchableOpacity,
//     Dimensions,
//     ScrollView,
// } from 'react-native';
// import { Heart } from 'lucide-react-native';
// import { Colors } from '../../theme/colors';
// import NMText from '../common/NMText';
// import { apiRequest } from '../../services/apiClient';
// import { showErrorToast, showSuccessToast } from '../../utils/toastService';

// interface PropertyCardProps {
//     image: string;
//     title: string;
//     sqft: number;
//     beds: number;
//     baths: number;
//     agentName: string;
//     agentImage: string;
//     price: string;
//     onPress?: () => void;
//     onFavoritePress?: () => void;
//     isFavorite?: boolean;
// }

// const PropertyCard: React.FC<PropertyCardProps> = ({
//     image,
//     title,
//     sqft,
//     beds,
//     baths,
//     agentName,
//     agentImage,
//     price,
//     onPress,
//     onFavoritePress,
//     isFavorite = false,
// }) => {
//     return (
//         <TouchableOpacity
//             style={styles.card}
//             onPress={onPress}
//             activeOpacity={0.9}
//         >
//             <View style={styles.imageContainer}>
//                 <Image source={{ uri: image }} style={styles.image} />

//                 <TouchableOpacity
//                     style={styles.favoriteButton}
//                     onPress={onFavoritePress}
//                     activeOpacity={0.7}
//                 >
//                     <Heart
//                         size={16}
//                         color={isFavorite ? Colors.primary : Colors.border}
//                         fill={isFavorite ? Colors.primary : Colors.border}
//                         strokeWidth={2}
//                     />
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.content}>
//                 <NMText fontSize={14} fontFamily='medium' color={Colors.textPrimary} numberOfLines={1}>
//                     {title}
//                 </NMText>

//                 <View style={styles.featuresContainer}>

//                     <View style={styles.feature}>
//                         <Image source={require('../../assets/icons/sqf.png')} style={styles.featureIcon} />
//                         <NMText fontSize={14} fontFamily='regular' color={Colors.textPrimary}>
//                             {sqft}sqf
//                         </NMText>
//                     </View>

//                     <View style={styles.feature}>
//                         <Image source={require('../../assets/icons/bed.png')} style={styles.featureIcon} />
//                         <NMText fontSize={14} fontFamily='regular' color={Colors.textPrimary}>
//                             {beds} Beds
//                         </NMText>
//                     </View>

//                     <View style={styles.feature}>
//                         <Image source={require('../../assets/icons/bath.png')} style={styles.featureIcon} />
//                         <NMText fontSize={14} fontFamily='regular' color={Colors.textPrimary}>
//                             {baths} Baths
//                         </NMText>
//                     </View>
//                 </View>

//                 <View style={styles.footer}>
//                     <View style={styles.agentContainer}>
//                         <Image source={{ uri: agentImage }} style={styles.agentImage} />
//                         <NMText fontSize={14} fontFamily='medium' color={Colors.textPrimary}>
//                             {agentName}
//                         </NMText>
//                     </View>
//                     <NMText fontSize={14} fontFamily='bold' color={Colors.primary}>
//                         $ {price}
//                     </NMText>
//                 </View>
//             </View>
//         </TouchableOpacity>
//     );
// };

// const PropertyCardList: React.FC<{ properties: any[] }> = ({ properties }) => {


//     const screenWidth = Dimensions.get('window').width;
//     const marginHorizontal = screenWidth * 0.05;

//     const makeFavorite = async (property: any) => {
//         try {
//             const { result, error } = await apiRequest({
//                 endpoint: `v1/favourites/${property.id}/toggle`,
//                 method: 'GET',
//             });

//             if (result) {
//                 console.log("Properties List:", JSON.stringify(result));
//                 showSuccessToast('Favorite status updated successfully');
//             }

//             if (error) {
//                 console.log("Error:", error);
//                 showErrorToast(`Get Properties Error: ${error}`);
//             }

//         } catch (err) {
//             console.error("Unexpected Error:", err);
//             showErrorToast(`Unexpected Error: ${err}`);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={[
//                     styles.scrollContent,
//                     {
//                         paddingLeft: marginHorizontal,
//                         paddingRight: marginHorizontal,
//                     },
//                 ]}
//             >
//                 {properties.map((property) => (
//                     <PropertyCard
//                         key={property.id}
//                         image={property.media[0]?.media_url}
//                         title={property.title}
//                         sqft={property.size || 0}
//                         beds={property.bedrooms || 0}
//                         baths={property.bathrooms || 0}
//                         agentName={'Unknown Agent'}
//                         agentImage={'https://i.pravatar.cc/150?img=47'}
//                         price={property.price}
//                         onPress={() => console.log('Property pressed:', property.id)}
//                         onFavoritePress={() => makeFavorite(property)}
//                     />
//                 ))}
//             </ScrollView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         paddingVertical: 14,
//     },
//     scrollContent: {
//         gap: 16,
//         paddingBottom: 4,
//     },
//     card: {
//         width: 265,
//         backgroundColor: Colors.white,
//         borderRadius: 16,
//         overflow: 'hidden',
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 0.18,
//         shadowRadius: 1.00,
//         elevation: 1,
//     },
//     imageContainer: {
//         width: '100%',
//         height: 150,
//         position: 'relative',
//     },
//     image: {
//         width: '100%',
//         height: '100%',
//         resizeMode: 'cover',
//         backgroundColor: Colors.border,
//     },
//     favoriteButton: {
//         position: 'absolute',
//         top: 14,
//         right: 14,
//         width: 36,
//         height: 36,
//         borderRadius: 36 / 2,
//         backgroundColor: Colors.white,
//         alignItems: 'center',
//         justifyContent: 'center',
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 0.18,
//         shadowRadius: 1.00,
//         elevation: 1,
//     },
//     content: {
//         padding: 12,
//     },
//     featuresContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 14,
//         marginVertical: 10,
//         padding: 14,
//         borderBottomWidth: 1,
//         borderColor: Colors.border,
//         borderTopWidth: 1,
//     },
//     featureIcon: {
//         width: 20,
//         height: 20,
//         resizeMode: 'contain',
//     },
//     feature: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 2,
//     },
//     footer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//     },
//     agentContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//     },
//     agentImage: {
//         width: 28,
//         height: 28,
//         borderRadius: 28 / 2,
//     },
// });

// export default PropertyCardList;