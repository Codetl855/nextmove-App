import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper'
import { Colors } from '../../../theme/colors'
import NMText from '../../../components/common/NMText'
import { ChevronLeft, Heart, Share2, StarIcon, PlusIcon } from 'lucide-react-native'
import NMButton from '../../../components/common/NMButton'
import CommentView from '../../../components/user/CommentView'
import CommentSheetModal from '../../../components/user/CommentSheetModal'

const BlogDetail: React.FC = () => {

    const [commentSheetVisible, setCommentSheetVisible] = useState(false)

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={styles.container}>
                    <View style={styles.headerView}>
                        <View style={styles.inRow}>
                            <TouchableOpacity style={styles.backBox}>
                                <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                            </TouchableOpacity>
                            <View style={styles.titleView}>
                                <NMText fontSize={20} fontFamily='semiBold' color={Colors.textSecondary}>
                                    Blog Detail
                                </NMText>
                            </View>
                        </View>
                        <View style={styles.inRow}>
                            <TouchableOpacity style={[styles.backBox, { marginRight: 10 }]}>
                                <Heart color={Colors.black} size={18} strokeWidth={1.5} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.backBox}>
                                <Share2 color={Colors.black} size={18} strokeWidth={1.5} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.contentContainer}>
                        <NMText fontSize={18} fontFamily='bold' color={Colors.textPrimary}>
                            Building gains into housing stocks and how to trade the sector
                        </NMText>
                        <View style={styles.ratingBox}>
                            <NMText fontSize={14} fontFamily='regular' color={Colors.textSecondary}>
                                60 <NMText fontSize={14} fontFamily='bold' color={Colors.textSecondary}>Reviews</NMText>
                            </NMText>
                            <View style={styles.line} />
                            <View style={styles.inRow}>
                                <View style={styles.inRow}>
                                    {[1, 2, 3, 4, 5].map((item, index) => (
                                        <StarIcon key={index} color={Colors.star} size={16} fill={Colors.star} />
                                    ))}
                                </View>
                                <NMText fontSize={16} fontFamily='regular' color={Colors.textSecondary} style={{ marginLeft: 5 }}>
                                    4.5
                                </NMText>
                            </View>
                        </View>
                        <NMText fontSize={16} fontFamily='regular' color={Colors.textPrimary} style={{ marginTop: 10 }}>
                            Written By: <NMText fontSize={16} fontFamily='semiBold' color={Colors.primary}>Kathryn Murphy</NMText>
                        </NMText>

                        <NMText fontSize={16} fontFamily='regular' color={Colors.textPrimary} style={{ marginTop: 10 }}>
                            Date: <NMText fontSize={16} fontFamily='semiBold' color={Colors.primary}>April 6, 2025</NMText>{'           '}<NMText fontSize={16} fontFamily='regular' color={Colors.textPrimary}>
                                Tags: <NMText fontSize={16} fontFamily='semiBold' color={Colors.primary}>Property</NMText>
                            </NMText>
                        </NMText>

                        <NMText fontSize={16} fontFamily='regular' color={Colors.textPrimary} style={{ marginTop: 10 }}>
                            Comments: <NMText fontSize={16} fontFamily='semiBold' color={Colors.primary}>30</NMText>
                        </NMText>

                        <Image source={{ uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800 ' }} style={styles.blogImage} />

                        <NMText fontSize={20} fontFamily='semiBold' color={Colors.textPrimary} style={{ marginTop: 10 }}>
                            Understanding Housing Stocks
                        </NMText>

                        <NMText fontSize={16} fontFamily='regular' color={Colors.textLight} style={{ marginTop: 10 }}>
                            Housing stocks encompass companies involved in various aspects of the real estate industry, including homebuilders, developers, and related service providers. Factors influencing these stocks range from interest rates and economic indicators to trends in homeownership rates.{'\n\n'}Pay close attention to economic indicators such as employment rates, GDP growth, and consumer confidence. A strong economy often correlates with increased demand for housing, benefiting related stocks.
                        </NMText>

                        <View style={styles.highlightBox}>
                            <NMText fontSize={16} fontFamily='medium' color={Colors.textPrimary} style={{ marginTop: 10 }}>
                                “Lower rates can boost homebuying activity, benefiting housing stocks, while higher rates may have the opposite effect.”
                            </NMText>
                            <NMText fontSize={16} fontFamily='regular' color={Colors.primary} style={{ marginTop: 10 }}>
                                said Mike Fratantoni, MBA’s chief economist.
                            </NMText>
                        </View>

                        <View style={styles.threeImageBox}>
                            <Image source={{ uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800 ' }} style={styles.threeImage} />
                            <Image source={{ uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800 ' }} style={styles.threeImage} />
                            <Image source={{ uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800 ' }} style={styles.threeImage} />
                        </View>

                        <NMText fontSize={20} fontFamily='semiBold' color={Colors.textPrimary} style={{ marginTop: 10 }}>
                            Identify Emerging Trends
                        </NMText>

                        <NMText fontSize={16} fontFamily='regular' color={Colors.textLight} style={{ marginTop: 10 }}>
                            Stay informed about emerging trends in the housing market, such as the demand for sustainable homes, technological advancements, and demographic shifts. Companies aligning with these trends may present attractive investment opportunities.{'\n\n'}Take a long-term investment approach if you believe in the stability and growth potential of the housing sector. Look for companies with solid fundamentals and a track record of success. For short-term traders, capitalize on market fluctuations driven by economic reports, interest rate changes, or industry-specific news. Keep a close eye on earnings reports and government housing data releases.
                        </NMText>

                    </View>

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

                        {[1, 2, 3, 4, 5].map((item, index, arr) => (
                            <CommentView
                                key={index}
                                widthSet={index === arr.length - 1 ? 0 : 1}
                            />
                        ))}

                        <CommentSheetModal
                            visible={commentSheetVisible}
                            onClose={() => setCommentSheetVisible(false)}
                        />
                    </View>
                </View>
            </ScrollView>
        </NMSafeAreaWrapper>
    )
}

export default BlogDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background
    },
    headerView: {
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
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    headerLogo: {
        width: 100,
        height: 40,
        resizeMode: 'contain'
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleView: {
        marginLeft: 10
    },
    backBox: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.background
    },
    contentContainer: {
        marginHorizontal: '5%',
        backgroundColor: Colors.white,
        borderRadius: 8,
        padding: 14,
        marginVertical: 10
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    line: {
        width: 1,
        height: 20,
        backgroundColor: Colors.border,
        marginHorizontal: 10
    },
    blogImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 8,
        marginTop: 10
    },
    highlightBox: {
        backgroundColor: Colors.background,
        padding: 14,
        borderRadius: 8,
        marginTop: 10
    },
    threeImageBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    threeImage: {
        width: '30%',
        height: 80,
        resizeMode: 'cover',
        borderRadius: 8
    }
})