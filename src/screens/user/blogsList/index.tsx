import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper'
import NMTextInput from '../../../components/common/NMTextInput'
import { Colors } from '../../../theme/colors'
import NMText from '../../../components/common/NMText'
import BlogListCard from '../../../components/user/BlogListCard'
import BlogFilterModal from '../../../components/user/BlogFilterModal'
import { showErrorToast } from '../../../utils/toastService'
import { apiRequest } from '../../../services/apiClient'
import LoaderModal from '../../../components/common/NMLoaderModal'
import { useNavigation } from '@react-navigation/native'
import { ChevronLeft } from 'lucide-react-native'

const BlogsList: React.FC = () => {
    const navigation = useNavigation();
    const drawerNavigation = navigation.getParent('drawer') || navigation.getParent();
    const [blogModalVisible, setBlogModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [blogsData, setBlogsData] = useState([]);
    const getBlogs = async () => {
        try {
            setLoading(true);
            const { result, error } = await apiRequest({
                endpoint: `v1/blogs/`,
                method: 'GET',
            });

            if (result) {
                setBlogsData(result.data);
            }

            if (error) {
                console.log("Error:", error);
                showErrorToast(`Get Blogs Error: ${error}`);
            }

        } catch (err) {
            console.error("Unexpected Error:", err);
            showErrorToast(`Unexpected Error: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBlogs();
    }, []);

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={styles.container}>
                    <View style={styles.headerView}>
                        <View style={styles.inRow}>
                            <TouchableOpacity style={styles.backBox} onPress={() => navigation.goBack()}>
                                <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                            </TouchableOpacity>
                            <View style={styles.titleView}>
                                <NMText fontSize={20} fontFamily='semiBold' color={Colors.textSecondary}>
                                    Our Latest Blogs
                                </NMText>
                            </View>
                        </View>
                        <View style={styles.inRow}>
                            <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} />
                        </View>
                    </View>
                    <View style={styles.filterView}>
                        <NMTextInput
                            placeholder='Search here'
                            rightIcon={
                                <Image source={require('../../../assets/icons/search.png')} style={styles.searchIcon} />
                            }
                            containerStyle={styles.inputContainer}
                            mainViewStyle={{ width: '76%' }}
                        />
                        <TouchableOpacity style={styles.filterSlider} activeOpacity={0.7} onPress={() => setBlogModalVisible(true)}>
                            <Image source={require('../../../assets/icons/slidersBold.png')} style={styles.filterIcon} />
                        </TouchableOpacity>
                    </View>

                    {blogsData?.data?.map((blog) => (
                        <BlogListCard key={blog.id} item={blog} />
                    ))}
                </View>
                <BlogFilterModal
                    visible={blogModalVisible}
                    onClose={() => setBlogModalVisible(false)}
                />
            </ScrollView>
            <LoaderModal visible={loading} />
        </NMSafeAreaWrapper>
    )
}

export default BlogsList

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
    backBox: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.background
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
    filterView: {
        marginTop: 10,
        width: '100%',
        marginHorizontal: '5%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputContainer: {
        height: 50,
        width: '100%',
        borderColor: Colors.white
    },
    searchIcon: {
        width: 22,
        height: 22
    },
    filterIcon: {
        width: 18,
        height: 18,
        tintColor: Colors.white,
        resizeMode: 'contain'
    },
    filterSlider: {
        width: 46,
        height: 46,
        backgroundColor: Colors.primary,
        borderRadius: 8,
        marginLeft: '2%',
        alignItems: 'center',
        justifyContent: 'center',
    },
})