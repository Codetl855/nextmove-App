import { StyleSheet, View, Image } from 'react-native'
import React from 'react'
import NMText from '../common/NMText'
import { Colors } from '../../theme/colors'
import { ThumbsUp, ThumbsDown, StarIcon } from 'lucide-react-native'

interface CommentViewProps {
    widthSet?: number;
    userName: string;
    time: string;
    comment: string;
    rating: number;
    userImage?: string | null;
}

const CommentView: React.FC<CommentViewProps> = ({
    widthSet = 1,
    userName,
    time,
    comment,
    rating,
    userImage
}) => {
    return (
        <View style={[styles.container, { borderBottomWidth: widthSet }]}>

            {/* Avatar */}
            {userImage ? (
                <Image source={{ uri: userImage }} style={styles.avatar} />
            ) : (
                <View style={styles.avatar} />
            )}

            <View style={styles.contentView}>
                {/* User Name */}
                <NMText fontSize={16} fontFamily='medium' color={Colors.textPrimary}>
                    {userName}
                </NMText>

                {/* Date */}
                <NMText fontSize={12} fontFamily='regular' color={Colors.textLight}>
                    {new Date(time).toLocaleDateString('en-GB')}
                </NMText>

                {/* Review Text */}
                <NMText fontSize={16} fontFamily='light' color={Colors.textLight} style={{ marginVertical: 10 }}>
                    {comment}
                </NMText>

                {/* Useful Button */}
                {/* <View style={[styles.inRow, { marginBottom: 4 }]}>
                    <View style={styles.inRow}>
                        <ThumbsUp color={Colors.primary} size={20} strokeWidth={1.5} />
                        <NMText fontSize={12} fontFamily='regular' color={Colors.textPrimary}>
                            Useful
                        </NMText>
                    </View>

                    <View style={[styles.inRow, { marginLeft: 10 }]}>
                        <ThumbsDown color={Colors.primary} size={20} strokeWidth={1.5} />
                        <NMText fontSize={12} fontFamily='regular' color={Colors.textPrimary}>
                            Not Useful
                        </NMText>
                    </View>
                </View> */}
            </View>

            <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                        key={star}
                        size={16}
                        strokeWidth={1.5}
                        color={star <= rating ? Colors.star : Colors.border}
                        fill={star <= rating ? Colors.star : 'transparent'}
                    />
                ))}
            </View>
        </View>
    )
}

export default CommentView

// import { StyleSheet, View } from 'react-native'
// import React from 'react'
// import NMText from '../common/NMText'
// import { Colors } from '../../theme/colors'
// import { ThumbsUp, ThumbsDown, StarIcon } from 'lucide-react-native'

// interface CommentViewProps {
//     widthSet?: number
// }

// const CommentView: React.FC<CommentViewProps> = ({ widthSet = 1 }) => {
//     return (
//         <View style={[styles.container, { borderBottomWidth: widthSet }]}>
//             <View style={styles.avatar} />
//             <View style={styles.contentView}>
//                 <NMText fontSize={16} fontFamily='medium' color={Colors.textPrimary}>
//                     Floyd Miles
//                 </NMText>
//                 <NMText fontSize={12} fontFamily='regular' color={Colors.textLight}>
//                     April 13, 2024
//                 </NMText>
//                 <NMText fontSize={16} fontFamily='light' color={Colors.textLight} style={{ marginVertical: 10 }}>
//                     Risk management and compliance, when approached strategically, have the potential to go beyond mitigating threats and protecting a company’s operations & reputation. They can actually generate value and create opportunities.
//                 </NMText>
//                 <View style={[styles.inRow, { marginBottom: 4 }]}>
//                     <View style={styles.inRow}>
//                         <ThumbsUp color={Colors.primary} size={20} strokeWidth={1.5} />
//                         <NMText fontSize={12} fontFamily='regular' color={Colors.textPrimary}>
//                             Useful
//                         </NMText>
//                     </View>
//                     <View style={[styles.inRow, { marginLeft: 10 }]}>
//                         <ThumbsDown color={Colors.primary} size={20} strokeWidth={1.5} />
//                         <NMText fontSize={12} fontFamily='regular' color={Colors.textPrimary}>
//                             Not Useful
//                         </NMText>
//                     </View>
//                 </View>
//             </View>

//             <View style={styles.starRow}>
//                 {[1, 2, 3, 4, 5].map((item, index) => (
//                     <StarIcon key={index} color={Colors.star} size={16} fill={Colors.star} />
//                 ))}
//             </View>
//         </View>
//     )
// }

// export default CommentView

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
        marginVertical: 10,
        borderColor: Colors.border,
        paddingBottom: 10,
    },
    contentView: {
        width: '84%',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: Colors.border,
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 6,
    },
    starRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        position: 'absolute',
        right: 0,
        top: 0
    }
})
