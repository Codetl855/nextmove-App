import React from 'react';
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
    isFavorite = false,
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
                        {price}
                    </NMText>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const PropertyCardList: React.FC = () => {
    const properties = [
        {
            id: '1',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            title: '59345 STONEWALL DR, Plaque ...',
            sqft: 8000,
            beds: 4,
            baths: 4,
            agentName: 'Arlene McCoy',
            agentImage: 'https://i.pravatar.cc/150?img=47',
            price: '$7250,00',
        },
        {
            id: '2',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            title: '1234 MAPLE STREET, Modern...',
            sqft: 6500,
            beds: 3,
            baths: 3,
            agentName: 'John Doe',
            agentImage: 'https://i.pravatar.cc/150?img=12',
            price: '$5500,00',
        },
        {
            id: '3',
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
            title: '7890 OAK AVENUE, Luxury...',
            sqft: 9500,
            beds: 5,
            baths: 5,
            agentName: 'Jane Smith',
            agentImage: 'https://i.pravatar.cc/150?img=32',
            price: '$8900,00',
        },
    ];

    const screenWidth = Dimensions.get('window').width;
    const marginHorizontal = screenWidth * 0.05;

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
                        key={property.id}
                        image={property.image}
                        title={property.title}
                        sqft={property.sqft}
                        beds={property.beds}
                        baths={property.baths}
                        agentName={property.agentName}
                        agentImage={property.agentImage}
                        price={property.price}
                        onPress={() => console.log('Property pressed:', property.id)}
                        onFavoritePress={() => console.log('Favorite pressed:', property.id)}
                    />
                ))}
            </ScrollView>
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
    },
});

export default PropertyCardList;