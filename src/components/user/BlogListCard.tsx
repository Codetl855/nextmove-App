import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../theme/colors'
import NMText from '../common/NMText'
import { Calendar, Clock } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'

const BlogListCard: React.FC = () => {

    const navigation = useNavigation();

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={() => navigation.navigate('BlogDetail')}>
            <Image
                source={{ uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800' }}
                style={styles.imageStyle}
            />
            <View style={styles.textContainer}>
                <NMText fontSize={14} fontFamily='regular' color={Colors.textPrimary}>
                    Skills That You Can Learn In The...
                </NMText>
                <View style={styles.dateBox}>
                    <View style={styles.inRow}>
                        <Calendar size={16} color={Colors.primary} />
                        <NMText fontSize={12} fontFamily='regular' color={Colors.textLight}>
                            15 Jun, 2025
                        </NMText>
                    </View>
                    <View style={styles.line} />
                    <View style={styles.inRow}>
                        <Clock size={16} color={Colors.primary} />
                        <NMText fontSize={12} fontFamily='regular' color={Colors.textLight}>
                            5 Min Read
                        </NMText>
                    </View>
                </View>
                <View style={styles.tagView}>
                    <NMText fontSize={12} fontFamily='regular' color={Colors.textPrimary}>
                        Residential
                    </NMText>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default BlogListCard

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
        width: 90,
        height: 90,
        borderRadius: 8,
        resizeMode: 'cover'
    },
    textContainer: {
        flex: 1,
        marginLeft: 8,
    },
    dateBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 10
    },
    line: {
        width: 1,
        height: 16,
        backgroundColor: Colors.border,
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    tagView: {
        width: '40%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: 8,
        marginTop: 10
    }
})
