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
import { ArrowRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
interface BlogCardProps {
    image: string;
    title: string;
    category: string;
    date: string;
    time: string;
    onPress?: () => void;
    onFavoritePress?: () => void;
    isFavorite?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({
    image,
    title,
    category,
    date,
    time,
    onPress,
    onFavoritePress,
    isFavorite = false,
}) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
                <View style={styles.categoryContainer}>
                    <NMText
                        fontSize={14}
                        fontFamily='medium'
                        color={Colors.textPrimary}
                        numberOfLines={2}
                    >
                        {category}
                    </NMText>
                </View>
                {/* <TouchableOpacity
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
                </TouchableOpacity> */}
            </View>

            <View style={styles.DTCard}>
                <View style={styles.inRow}>
                    <Image
                        source={require('../../assets/icons/calendar.png')}
                        style={styles.featureIcon}
                    />
                    <NMText fontSize={12} fontFamily='regular' color={Colors.textLight}>
                        {date}
                    </NMText>
                </View>

                <View style={styles.divider} />

                <View style={styles.inRow}>
                    <Image
                        source={require('../../assets/icons/clock.png')}
                        style={styles.featureIcon}
                    />
                    <NMText fontSize={12} fontFamily='regular' color={Colors.textLight}>
                        {/* {time} */}
                        5 Min Read
                    </NMText>
                </View>
            </View>
            <View style={styles.horizontalDivider} />
            <View style={styles.content}>
                <NMText
                    fontSize={14}
                    fontFamily='medium'
                    color={Colors.textPrimary}
                    numberOfLines={2}
                >
                    {title}
                </NMText>
            </View>

            <View style={styles.learnMoreContainer}>
                <NMText fontSize={14} fontFamily='semiBold' color={Colors.primary}>
                    Learn More
                </NMText>
                <ArrowRight size={16} color={Colors.primary} />
            </View>
        </TouchableOpacity>
    );
};

const BlogCardList: React.FC<{ blogs: any }> = ({ blogs }) => {
    const navigation = useNavigation();
    const screenWidth = Dimensions.get('window').width;
    const marginHorizontal = screenWidth * 0.05;

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(new Date(isoDate));
    };

    // Handle different data structures: blogs can be array, or object with data property
    const blogsArray = Array.isArray(blogs) ? blogs : (blogs?.data || []);

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
                {blogsArray?.map((blog) => {
                    if (!blog || !blog.id) return null;
                    return (
                        <BlogCard
                            key={blog.id}
                            image={blog?.cover_photo}
                            title={blog?.title}
                            category={blog?.category}
                            date={formatDate(blog?.created_at)}
                            time={blog.time}
                            onPress={() => {
                                console.log('Navigating to BlogDetail with blog:', blog);
                                console.log('Blog ID:', blog.id);
                                console.log('Blog Title:', blog.title);
                                navigation.navigate('BlogDetail', { blog });
                            }}
                            onFavoritePress={() => console.log('Favorite pressed:', blog.id)}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default BlogCardList;

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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1,
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
    categoryContainer: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    favoriteButton: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1,
        elevation: 1,
    },
    DTCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    horizontalDivider: {
        height: 1,
        backgroundColor: Colors.border,
        marginHorizontal: 12,
    },
    divider: {
        width: 2,
        height: 20,
        backgroundColor: Colors.border,
        marginLeft: '16%',
        marginRight: '4%',
    },
    featureIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    content: {
        padding: 12,
    },
    learnMoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 12,
        paddingBottom: 12,
        gap: 4,
    },
});
