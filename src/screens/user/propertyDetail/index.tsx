import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, Bookmark, Heart, Share2, MapPin, PhoneCallIcon, Mail, ChevronRight, PlusIcon } from 'lucide-react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import { Colors } from '../../../theme/colors';
import NMText from '../../../components/common/NMText';
import NMButton from '../../../components/common/NMButton';
import NMTextInput from '../../../components/common/NMTextInput';
import PropertyDescriptionModal from '../../../components/user/PropertyDescriptionModal';
import BookKnowModal from '../../../components/user/BookKnowModal';
import CommentView from '../../../components/user/CommentView';
import CommentSheetModal from '../../../components/user/CommentSheetModal';
import { apiRequest } from '../../../services/apiClient';
import { showErrorToast, showSuccessToast } from '../../../utils/toastService';
import LoaderModal from '../../../components/common/NMLoaderModal';

const PropertyDetailScreen: React.FC = ({ navigation, route }) => {
    const { SelectedCategory, property } = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [commentSheetVisible, setCommentSheetVisible] = useState(false);
    const [bookModalVisible, setBookModalVisible] = useState(false);
    const [isFavourite, setIsFavourite] = useState(false);
    const [loader, setLoader] = useState(false);
    const [detailData, setDetailData] = useState<any>({});
    const propertyImages = [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    ];

    const getPropertyDetails = async () => {
        try {
            setLoader(true);
            const { result, error } = await apiRequest({
                endpoint: `v1/get-property/${property.id}`,
                method: 'GET',
            });

            if (result) {
                console.log("Properties List:", JSON.stringify(result));
                setDetailData(result.data);
                setIsFavourite(result?.data?.is_favourite);
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

    const makeFavorite = async () => {
        try {
            setLoader(true);

            const { result, error } = await apiRequest({
                endpoint: `v1/favourites/${property.id}/toggle`,
                method: 'POST',
            });

            if (result) {
                setIsFavourite(!isFavourite);
                console.log("Properties List:", JSON.stringify(result));
                showSuccessToast('Favorite status updated successfully');
                getPropertyDetails();
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
        getPropertyDetails();
    }, []);

    const handleSubmission = async (reviewText: string, rating: number) => {
        const newReview = {
            property_id: property.id,
            review_text: reviewText,
            rating: rating,
        };

        try {
            setLoader(true);
            const { result, error } = await apiRequest({
                endpoint: `v1/reviews`,
                method: 'POST',
                data: newReview,
            });

            if (result) {
                console.log("reviews post:", JSON.stringify(result));
                setCommentSheetVisible(false);
                getPropertyDetails();
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


    return (
        <NMSafeAreaWrapper statusBarColor={Colors.black} statusBarStyle="light-content">
            <View style={styles.container}>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: detailData?.media?.[0]?.media_url }}
                            style={styles.mainImage}
                            resizeMode="cover"
                        />

                        <View style={styles.topNav}>
                            <TouchableOpacity style={styles.iconButton}>
                                <ChevronLeft color="#000" size={24} strokeWidth={2} />
                            </TouchableOpacity>
                            <View style={styles.rightIcons}>
                                <TouchableOpacity style={styles.iconButton}>
                                    <Bookmark color="#000" size={20} strokeWidth={2} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconButton} onPress={() => makeFavorite()}>
                                    <Heart
                                        color={isFavourite ? Colors.primary : '#000'}
                                        fill={isFavourite ? Colors.primary : Colors.background}
                                        size={20}
                                        strokeWidth={2} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconButton}>
                                    <Share2 color="#000" size={20} strokeWidth={2} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.contentView}>
                        <View style={styles.imageSlider}>
                            {detailData?.media?.map((image, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: image?.media_url }}
                                    style={styles.imageSliderStyle}
                                    resizeMode="cover"
                                />
                            ))}
                        </View>
                        <View style={styles.contentHeader}>
                            <View style={[styles.inRow, { justifyContent: 'space-between', }]}>
                                <NMText fontSize={18} fontFamily='bold' color={Colors.textPrimary} style={styles.adjuestTitle}>
                                    {detailData?.title}
                                </NMText>
                                <View style={styles.inRow}>
                                    <NMText fontSize={16} fontFamily='bold' color={Colors.primary}>
                                        $ {detailData?.price}
                                    </NMText>
                                    <NMText fontSize={12} fontFamily='medium' color={Colors.primary}>/Month</NMText>
                                </View>
                            </View>
                            <View style={[styles.inRow, { marginTop: 6 }]}>
                                <MapPin size={18} color={Colors.primary} />
                                <NMText fontSize={14} fontFamily='regular' color={Colors.textPrimary}>
                                    {detailData?.address}
                                </NMText>
                            </View>
                        </View>

                        <NMText fontSize={18} fontFamily='light' color={Colors.textLight}>
                            {detailData?.description}
                        </NMText>

                        <View style={styles.featuresContainer}>

                            <View style={styles.feature}>
                                <Image source={require('../../../assets/icons/sqf.png')} style={styles.featureIcon} />
                                <NMText fontSize={14} fontFamily='regular' color={Colors.textPrimary}>
                                    {detailData?.size}sqf
                                </NMText>
                            </View>

                            <View style={styles.feature}>
                                <Image source={require('../../../assets/icons/bed.png')} style={styles.featureIcon} />
                                <NMText fontSize={14} fontFamily='regular' color={Colors.textPrimary}>
                                    {detailData?.bed || 0} Beds
                                </NMText>
                            </View>

                            <View style={styles.feature}>
                                <Image source={require('../../../assets/icons/bath.png')} style={styles.featureIcon} />
                                <NMText fontSize={14} fontFamily='regular' color={Colors.textPrimary}>
                                    {detailData?.bath || 0} Baths
                                </NMText>
                            </View>

                            <View style={styles.feature}>
                                <Image source={require('../../../assets/icons/kitchen.png')} style={styles.featureIcon} />
                                <NMText fontSize={14} fontFamily='regular' color={Colors.textPrimary}>
                                    {detailData?.kitchen || 0} Kitchen
                                </NMText>
                            </View>
                        </View>

                        <NMButton
                            title='View Full Description'
                            backgroundColor='transparent'
                            textColor={Colors.primary}
                            fontSize={14}
                            fontFamily='medium'
                            borderRadius={8}
                            style={styles.buttonStyle}
                            onPress={() => setModalVisible(true)}
                        />

                        <Image source={require('../../../assets/images/mapImage.png')} style={styles.mapStyle} />

                        <View style={styles.adBox}>
                            <NMText fontSize={16} fontFamily='regular' color={Colors.textLight}>
                                Ad Posted by
                            </NMText>
                            <View style={styles.adBoxContent}>
                                <View style={styles.avater} />
                                <View>
                                    <NMText fontSize={16} fontFamily='medium' color={Colors.textPrimary}>
                                        Amazon Real Estate
                                    </NMText>
                                    <View style={[styles.inRow, { marginTop: 6 }]}>
                                        <MapPin size={18} color={Colors.primary} />
                                        <NMText fontSize={14} fontFamily='regular' color={Colors.textLight}>
                                            Al Orubah Street, Um Al Hammam Dist.
                                        </NMText>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.adBoxDivider} />

                            <View style={[styles.inRow, { alignSelf: 'center', justifyContent: 'center' }]}>
                                <NMText fontSize={14} fontFamily='medium' color={Colors.primary}>
                                    View All Properties
                                </NMText>
                                <ChevronRight size={20} color={Colors.primary} />
                            </View>
                        </View>

                        {SelectedCategory == 'BUY' ? (
                            <View style={styles.AuctionBox}>
                                <NMText fontSize={18} fontFamily='medium' color={Colors.textPrimary}>
                                    Auction
                                </NMText>
                                <NMText fontSize={14} fontFamily='medium' color={Colors.textPrimary} >
                                    Bid Amount
                                </NMText>
                                <View style={[styles.inRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                                    <NMTextInput
                                        placeholder='Enter'
                                        mainViewStyle={styles.inputStyle}

                                    />
                                    <NMButton
                                        title='Place a Bid'
                                        width={'30%'}
                                        backgroundColor={Colors.black}
                                        borderRadius={8}
                                        height={44}
                                    />
                                </View>
                            </View>) : (
                            <View style={styles.contentContainer}>
                                <View style={[styles.inRow, { justifyContent: 'space-between' }]}>
                                    <NMText fontSize={18} fontFamily='medium' color={Colors.textPrimary}>
                                        Guest Reviews
                                    </NMText>
                                    <NMButton
                                        title='Add Review'
                                        leftIcon={<PlusIcon color={Colors.black} size={16} strokeWidth={2} fill={Colors.black} />}
                                        width={'36%'}
                                        height={46}
                                        borderRadius={8}
                                        backgroundColor='transparent'
                                        textColor={Colors.black}
                                        fontFamily='medium'
                                        fontSize={14}
                                        style={{ borderWidth: 1, borderColor: Colors.black }}
                                        onPress={() => setCommentSheetVisible(true)}
                                    />
                                </View>
                                <View style={{ height: 15 }} />
                                {/* {[1, 2, 3, 4, 5].map((item, index, arr) => (
                                    <CommentView
                                        key={index}
                                        widthSet={index === arr.length - 1 ? 0 : 1}
                                    />
                                ))} */}
                                {detailData?.latest_reviews?.map((review, index, arr) => (
                                    <CommentView
                                        key={review.id}
                                        widthSet={index === arr.length - 1 ? 0 : 1}
                                        rating={review.rating}
                                        comment={review.review_text}
                                        userName={`${review.user?.first_name ?? ''} ${review.user?.last_name ?? ''}`}
                                        userImage={review.user?.profile_image_url}
                                        time={review.created_at}
                                    />
                                ))}


                                <CommentSheetModal
                                    visible={commentSheetVisible}
                                    onClose={() => setCommentSheetVisible(false)}
                                    onSubmit={handleSubmission}
                                />
                            </View>
                        )}
                    </View>
                </ScrollView>
                <View style={styles.bottomNav}>
                    <NMButton
                        title='Email'
                        leftIcon={<Mail size={20} color={Colors.primary} />}
                        backgroundColor={Colors.white}
                        textColor={Colors.primary}
                        borderRadius={8}
                        height={44}
                        width={SelectedCategory !== 'BUY' ? '28%' : '46%'}
                        style={{ borderColor: Colors.primary, borderWidth: 1 }}
                    />
                    <NMButton
                        title='Call'
                        leftIcon={<PhoneCallIcon size={20} color={SelectedCategory !== 'BUY' ? Colors.primary : Colors.white} />}
                        backgroundColor={SelectedCategory !== 'BUY' ? Colors.white : Colors.primary}
                        textColor={SelectedCategory !== 'BUY' ? Colors.primary : Colors.white}
                        borderRadius={8}
                        height={44}
                        width={SelectedCategory !== 'BUY' ? '28%' : '46%'}
                        style={{ borderColor: Colors.primary, borderWidth: 1 }}
                    />
                    {SelectedCategory !== 'BUY' && (
                        <NMButton
                            title='Book Now'
                            backgroundColor={Colors.primary}
                            textColor={Colors.white}
                            borderRadius={8}
                            height={44}
                            width={'38%'}
                            onPress={() => setBookModalVisible(true)}
                        />
                    )}
                </View>
            </View>
            <PropertyDescriptionModal
                detailData={detailData}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                showTabINBuy={SelectedCategory == 'BUY'}
            />
            <BookKnowModal
                visible={bookModalVisible}
                onClose={() => setBookModalVisible(false)}
            />
            <LoaderModal visible={loader} />
        </NMSafeAreaWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        width: '100%',
        height: 280,
        position: 'relative',
    },
    mainImage: {
        width: '100%',
        height: 320,
    },
    topNav: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    iconButton: {
        width: 34,
        height: 34,
        borderRadius: 8,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    rightIcons: {
        flexDirection: 'row',
        gap: 10,
    },
    contentView: {
        flex: 1,
        padding: '5%',
        marginTop: -4,
        backgroundColor: Colors.white,
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24
    },
    contentHeader: {
        paddingVertical: 10,
    },
    inRow: {
        flexDirection: 'row',
    },
    adjuestTitle: {
        width: '65%',
        lineHeight: 24,
    },
    featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
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
    buttonStyle: {
        marginTop: 10,
        borderColor: Colors.primary,
        borderWidth: 1
    },
    mapStyle: {
        width: '100%',
        height: 200,
        marginTop: 10,
        borderRadius: 16,
        resizeMode: 'contain'
    },
    adBox: {
        marginTop: 10,
        backgroundColor: Colors.background,
        borderRadius: 16,
        padding: 14
    },
    adBoxContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 16
    },
    avater: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    adBoxDivider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 14
    },
    AuctionBox: {
        marginTop: 10,
        backgroundColor: Colors.background,
        padding: 14,
        gap: 10
    },
    inputStyle: {
        width: '66%',
        marginRight: 10
    },
    bottomNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        paddingVertical: 10,
    },
    imageSlider: {
        width: '74%',
        padding: 4,
        backgroundColor: Colors.white,
        alignSelf: 'center',
        marginTop: -50,
        borderRadius: 8,
        flexDirection: 'row',
        gap: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    imageSliderStyle: {
        width: 55,
        height: 55,
        borderRadius: 8,
        resizeMode: 'contain'
    },
    contentContainer: {
        flex: 1,
        padding: '2%',
        marginTop: 10,
        backgroundColor: Colors.white,
    },

});

export default PropertyDetailScreen;