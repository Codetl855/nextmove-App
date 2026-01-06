import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, HistoryIcon, MapPinIcon } from 'lucide-react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import NMText from '../../../components/common/NMText';
import NMTabs from '../../../components/common/NMTab';
import { Colors } from '../../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { apiRequest } from '../../../services/apiClient';
import { showErrorToast } from '../../../utils/toastService';
import LoaderModal from '../../../components/common/NMLoaderModal';

interface ActivityCardProps {
    imageUrl: any;
    title: string;
    location: string;
    price: string;
}

interface ActivityCardPropsWithNavigation extends ActivityCardProps {
    activity: Activity;
    onPress: (activity: Activity) => void;
}

const ActivityCard: React.FC<ActivityCardPropsWithNavigation> = ({ imageUrl, title, location, price, activity, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={() => onPress(activity)} activeOpacity={0.8}>
        <Image
            source={{ uri: imageUrl }}
            style={styles.image}
        />

        <View style={styles.textContainer}>
            {/* Title */}
            <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                {title}
            </NMText>

            {/* Location */}
            <View style={styles.locationRow}>
                <MapPinIcon color={Colors.primary} size={20} strokeWidth={1.5} />
                <NMText
                    fontSize={12}
                    fontFamily="regular"
                    color={Colors.textLight}
                    style={{ width: '92%' }}
                >
                    {location}
                </NMText>
            </View>

            {/* Price */}
            <View style={styles.priceTag}>
                <NMText fontSize={14} fontFamily="semiBold" color={Colors.primary}>
                    {price}
                </NMText>
            </View>
        </View>
    </TouchableOpacity>
);

interface Activity {
    id: number;
    title: string;
    location: string;
    price: number;
    primary_image: string | null;
    images: string[];
}

interface TabOption {
    id: string;
    label: string;
}

const BookFunActivities: React.FC = () => {
    const navigation = useNavigation();
    const drawerNavigation = navigation.getParent('drawer') || navigation.getParent();

    const [tabs, setTabs] = useState<TabOption[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [defaultTab, setDefaultTab] = useState<string>('');

    // Fetch categories/tabs on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch activities when category changes
    useEffect(() => {
        if (selectedCategory) {
            fetchActivities(selectedCategory);
        }
    }, [selectedCategory]);

    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            const { result, error } = await apiRequest({
                endpoint: 'v1/fun-activity-field-options',
                method: 'GET',
            });

            if (error) {
                showErrorToast(error);
                return;
            }

            if (result?.data?.categories) {
                const categories = result.data.categories;
                const tabsData = categories.map((category: string, index: number) => ({
                    id: String(index + 1),
                    label: category,
                }));
                setTabs(tabsData);

                // Set default selected category to first tab
                if (categories.length > 0) {
                    setDefaultTab('1');
                    setSelectedCategory(categories[0]);
                }
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            showErrorToast('Failed to load categories');
        } finally {
            setCategoriesLoading(false);
        }
    };

    const fetchActivities = async (category: string) => {
        try {
            setLoading(true);
            const encodedCategory = encodeURIComponent(category);
            const { result, error } = await apiRequest({
                endpoint: `v1/public-fun-activities-list?category=${encodedCategory}&fetch=all`,
                method: 'GET',
            });

            if (error) {
                showErrorToast(error);
                return;
            }

            if (result?.data) {
                setActivities(result.data);
            } else {
                setActivities([]);
            }
        } catch (err) {
            console.error('Error fetching activities:', err);
            showErrorToast('Failed to load activities');
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTabSelect = (tabId: string) => {
        const selectedTab = tabs.find(tab => tab.id === tabId);
        if (selectedTab) {
            setSelectedCategory(selectedTab.label);
        }
    };

    const handleActivityPress = (activity: Activity) => {
        navigation.navigate('FunActivityDetail' as never, { activityId: activity.id } as never);
    };

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <LoaderModal visible={loading || categoriesLoading} />
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
                            Book Fun Activities
                        </NMText>
                    </View>

                    <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate('HistoryScreen' as never)}>
                        <HistoryIcon color={Colors.textPrimary} size={20} strokeWidth={1.5} />
                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                            History
                        </NMText>
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                {tabs.length > 0 && (
                    <NMTabs
                        tabs={tabs}
                        onTabSelect={handleTabSelect}
                        defaultSelected={defaultTab}
                    />
                )}

                {/* Activity Cards */}
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        <ActivityCard
                            key={activity.id}
                            imageUrl={activity.primary_image}
                            title={activity.title}
                            location={activity.location}
                            price={`SAR ${activity.price}`}
                            activity={activity}
                            onPress={handleActivityPress}
                        />
                    ))
                ) : (
                    !loading && (
                        <View style={styles.emptyContainer}>
                            <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                                No activities found
                            </NMText>
                        </View>
                    )
                )}
            </ScrollView>
        </NMSafeAreaWrapper>
    );
};

export default BookFunActivities;

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
    headerRight: {
        backgroundColor: Colors.background,
        padding: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    headerTitle: {
        marginLeft: 10,
    },
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    card: {
        marginHorizontal: '5%',
        backgroundColor: Colors.white,
        marginVertical: 6,
        padding: 14,
        borderRadius: 12,
        flexDirection: 'row',
        gap: 8,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 8,
        backgroundColor: Colors.background,
        resizeMode: 'cover',
    },
    textContainer: {
        flex: 1,
        marginLeft: 8,
    },
    locationRow: {
        flexDirection: 'row',
        gap: 4,
        paddingVertical: 8,
    },
    priceTag: {
        width: 80,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.background,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
