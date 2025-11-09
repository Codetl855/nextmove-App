import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Edit3Icon, StarIcon } from 'lucide-react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import NMText from '../../../components/common/NMText';
import { Colors } from '../../../theme/colors';
import EditReviewModal from '../../../components/user/EditReviewModal';

interface ReviewListCardProps {
    onEdit: () => void;
}

const ReviewListCard: React.FC<ReviewListCardProps> = ({ onEdit }) => (
    <View style={styles.reviewCard}>
        {/* Rating Stars */}
        <View style={styles.starRow}>
            {[...Array(5)].map((_, index) => (
                <StarIcon key={index} color={Colors.star} size={16} fill={Colors.star} />
            ))}
        </View>

        {/* Title */}
        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
            Best For Family Living
        </NMText>

        {/* Description */}
        <NMText
            fontSize={16}
            fontFamily="regular"
            color={Colors.textLight}
            style={{ marginTop: 6 }}
        >
            "The property was exactly as described and the buying process was smooth and hassle-free."
        </NMText>

        {/* Edit Button */}
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Edit3Icon color={Colors.textPrimary} size={18} strokeWidth={2} />
        </TouchableOpacity>
    </View>
);

const ReviewsScreen: React.FC = () => {
    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);

    const handleOpenEdit = () => setEditModalVisible(true);
    const handleCloseEdit = () => setEditModalVisible(false);

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Image
                            source={require('../../../assets/icons/drawer.png')}
                            style={styles.headerIcon}
                        />
                        <NMText
                            fontSize={20}
                            fontFamily="semiBold"
                            color={Colors.textSecondary}
                            style={styles.headerTitle}
                        >
                            Reviews
                        </NMText>
                    </View>
                    <Image
                        source={require('../../../assets/icons/notification.png')}
                        style={styles.headerIcon}
                    />
                </View>

                {/* Reviews List */}
                {[...Array(10)].map((_, index) => (
                    <ReviewListCard key={index} onEdit={handleOpenEdit} />
                ))}

                {/* Edit Review Modal */}
                <EditReviewModal visible={editModalVisible} onClose={handleCloseEdit} />
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
