import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { X, Calendar, ChevronDown, SquareCheckIcon, StarIcon } from 'lucide-react-native';
import NMText from '../common/NMText';
import { Colors } from '../../theme/colors';
import NMTextInput from '../common/NMTextInput';
import NMButton from '../common/NMButton';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CommentSheetModalProps {
    visible: boolean;
    onClose?: () => void;
    onSubmit: (review: string, rating: number) => void;
}

const CommentSheetModal: React.FC<CommentSheetModalProps> = ({
    visible,
    onClose,
    onSubmit
}) => {

    const navigation = useNavigation();
    const [userInfo, setUserInfo] = useState<any>({});
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const getLoginUser = async () => {
        const user = await AsyncStorage.getItem('loginUser');;
        const parsedUser = JSON.parse(user);
        setUserInfo(parsedUser);
    }

    useEffect(() => {
        getLoginUser();
        setComment('');
    }, []);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>

                    <View style={styles.header}>
                        <View style={styles.dragIndicator} />
                    </View>

                    <View style={styles.titleRow}>
                        <View style={styles.titleContainer}>
                            <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                                Leave A Comment
                            </NMText>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="#000" size={24} strokeWidth={2} />
                        </TouchableOpacity>
                    </View>

                    <NMText fontSize={16} fontFamily="light" color={Colors.textLight} style={{ marginHorizontal: 20 }}>
                        Your email address will not be published. Required fields are marked *
                    </NMText>

                    <NMTextInput
                        label='Name'
                        placeholder='Enter your name'
                        mainViewStyle={{ marginVertical: 10, marginHorizontal: 20 }}
                        value={`${userInfo?.user?.first_name} ${userInfo?.user?.last_name}`}
                        editable={false}
                    />

                    <NMTextInput
                        label='Email'
                        placeholder='Enter your email'
                        mainViewStyle={{ marginVertical: 10, marginHorizontal: 20 }}
                        value={userInfo?.user?.email}
                        editable={false}
                    />

                    <NMTextInput
                        label='Review'
                        placeholder='Enter your review'
                        multiline
                        numberOfLines={5}
                        mainViewStyle={{ marginVertical: 10, marginHorizontal: 20 }}
                        inputStyle={{ textAlignVertical: 'top', height: 100 }}
                        required
                        value={comment}
                        onChangeText={(text) => setComment(text)}
                        maxLength={200}
                        error={comment.length === 0 ? 'Review is required' : comment.length > 200 ? 'Review cannot exceed 200 characters' : ''}
                    />

                    <View style={styles.starReview}>
                        <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary} style={{ marginHorizontal: 20 }}>
                            Rate Us
                        </NMText>
                        <View style={styles.inRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                    <StarIcon
                                        size={24}
                                        color={star <= rating ? Colors.star : Colors.border}
                                        fill={star <= rating ? Colors.star : 'none'}
                                        strokeWidth={2}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                    </View>

                    <NMButton
                        title="Post Comment"
                        fontFamily='semiBold'
                        width={'92%'}
                        borderRadius={8}
                        style={{ alignSelf: 'center', marginTop: 10 }}
                        onPress={() => {
                            onSubmit(comment, rating);
                            if (onClose) {
                                onClose();
                            }
                        }}
                    />

                </View>
            </View>
        </Modal>
    );
};



const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 20,
    },
    header: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 6,
    },
    dragIndicator: {
        width: 40,
        height: 4,
        backgroundColor: Colors.background,
        borderRadius: 2,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    closeButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBox: {
        marginLeft: 8,
        backgroundColor: Colors.statusBg,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    priceBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: Colors.background,
        borderRadius: 8,
        paddingVertical: 10,
        marginHorizontal: 20
    },
    checkInBox: {
        marginTop: 10,
        marginHorizontal: 20
    },
    dateBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        borderColor: Colors.border,
        borderWidth: 1.5,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 10
    },
    costBoxContainer: {
        marginTop: 10,
        marginHorizontal: 20,
        padding: 16,
        backgroundColor: Colors.background,
        borderRadius: 8
    },
    costBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    agreeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 2
    },
    starReview: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
        marginHorizontal: 20,
        backgroundColor: Colors.background,
        borderRadius: 8,
        paddingVertical: 16
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },

});

export default CommentSheetModal;
