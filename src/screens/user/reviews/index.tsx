import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, Edit3Icon, StarIcon } from 'lucide-react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import NMText from '../../../components/common/NMText';
import { Colors } from '../../../theme/colors';
import EditReviewModal from '../../../components/user/EditReviewModal';
import { showErrorToast } from '../../../utils/toastService';
import { apiRequest } from '../../../services/apiClient';
import LoaderModal from '../../../components/common/NMLoaderModal';
import { useNavigation } from '@react-navigation/native';

interface ReviewListCardProps {
    review: any;
    onEdit: (review: any) => void;
}

const ReviewListCard: React.FC<ReviewListCardProps> = ({ review: item, onEdit }) => (
    <View style={styles.reviewCard}>
        {/* Rating Stars */}
        <View style={styles.starRow}>
            {[...Array(item?.rating)].map((_, index) => (
                <StarIcon key={index} color={Colors.star} size={16} fill={Colors.star} />
            ))}
        </View>

        {/* Title */}
        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
            {item?.property?.title}
        </NMText>

        {/* Description */}
        <NMText
            fontSize={16}
            fontFamily="regular"
            color={Colors.textLight}
            style={{ marginTop: 6 }}
        >
            {item?.review_text}
        </NMText>

        {/* Edit Button */}
        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(item)}>
            <Edit3Icon color={Colors.textPrimary} size={18} strokeWidth={2} />
        </TouchableOpacity>
    </View>
);

const ReviewsScreen: React.FC = () => {
    const navigation = useNavigation();
    const drawerNavigation = navigation.getParent('drawer') || navigation.getParent();
    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
    const handleCloseEdit = () => setEditModalVisible(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [reviewsData, setReviewsData] = useState<any>([]);
    const [selectedReview, setSelectedReview] = useState<any>(null);

    const handleOpenEdit = (review: any) => {
        setSelectedReview(review);
        setEditModalVisible(true);
    };


    const getReviews = async () => {
        try {
            setLoading(true);
            const { result, error } = await apiRequest({
                endpoint: 'v1/reviews?page=1&per_page=1000',
                method: 'GET',
            });

            if (result) {
                console.log("Reviews List:", JSON.stringify(result.data));
                setReviewsData(result.data);
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

    const handleSaveReview = async (updatedComment: string, updatedRating: number) => {
        const bodyData = {
            rating: updatedRating,
            review_text: updatedComment,
        }

        try {
            setLoading(true);
            const { result, error } = await apiRequest({
                endpoint: `v1/reviews/${selectedReview?.id}`,
                method: 'PUT',
                data: bodyData,
            });

            if (result) {
                console.log("Update Reviews :", JSON.stringify(result));
                getReviews();
                setEditModalVisible(false);
            }

            if (error) {
                console.log("Error put:", error);
                showErrorToast(`Get Properties Error: ${error}`);
            }

        } catch (err) {
            console.error("Unexpected Error put:", err);
            showErrorToast(`Unexpected Error: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getReviews();
    }, []);

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity style={styles.backBox} onPress={() => navigation.goBack()}>
                            <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                        </TouchableOpacity>
                        <NMText
                            fontSize={20}
                            fontFamily="semiBold"
                            color={Colors.textSecondary}
                            style={styles.headerTitle}
                        >
                            Reviews
                        </NMText>
                    </View>
                    {/* <Image
                        source={require('../../../assets/icons/notification.png')}
                        style={styles.headerIcon}
                    /> */}
                </View>

                {/* Reviews List */}
                {reviewsData?.data?.map((review: any) => (
                    <ReviewListCard key={review.id} review={review} onEdit={handleOpenEdit} />
                ))}

                {/* Edit Review Modal */}
                {/* <EditReviewModal visible={editModalVisible} onClose={handleCloseEdit} /> */}
                <EditReviewModal
                    visible={editModalVisible}
                    onClose={() => setEditModalVisible(false)}
                    initialComment={selectedReview?.review_text}
                    initialRating={selectedReview?.rating}
                    onSave={handleSaveReview}
                />

                <LoaderModal visible={loading} />
            </ScrollView>
        </NMSafeAreaWrapper>
    );
};

export default ReviewsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        marginLeft: 10,
    },
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    reviewCard: {
        marginHorizontal: '5%',
        backgroundColor: Colors.white,
        marginVertical: 6,
        padding: 14,
        borderRadius: 12,
    },
    starRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    editButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: Colors.background,
        position: 'absolute',
        top: 10,
        right: 14,
    },
});
