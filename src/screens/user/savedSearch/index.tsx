import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import NMText from '../../../components/common/NMText';
import { Colors } from '../../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Bookmark } from 'lucide-react-native';
import { apiRequest } from '../../../services/apiClient';
import { showErrorToast, showSuccessToast } from '../../../utils/toastService';
import LoaderModal from '../../../components/common/NMLoaderModal';
import ConfirmationModal from '../../../components/user/ConfirmationModal';

interface SavedSearchItem {
    id: number;
    user_id: number;
    url: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

interface SavedSearchResponse {
    message: string;
    data: SavedSearchItem[];
}

interface SavedListCardProps {
    searchType: string;
    location: string;
    priceRange: string;
    sizeRange: string;
    date: string;
    url: string;
    onDelete: () => void;
}

const SavedListCard: React.FC<SavedListCardProps> = ({ searchType, location, priceRange, sizeRange, date, url, onDelete }) => {
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        } catch {
            return dateString;
        }
    };

    return (
        <View style={styles.cardContainer}>
            <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
                {searchType || 'Search'}
            </NMText>

            <View style={{ marginTop: 6 }}>
                {location && (
                    <View style={{ marginBottom: 4 }}>
                        <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                            Location:{' '}
                            <NMText fontSize={14} fontFamily="semiBold" color={Colors.textSecondary}>
                                {location || 'Any'}
                            </NMText>
                        </NMText>
                    </View>
                )}

                {priceRange && (
                    <View style={{ marginBottom: 4 }}>
                        <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                            Price:{' '}
                            <NMText fontSize={14} fontFamily="semiBold" color={Colors.textSecondary}>
                                {priceRange}
                            </NMText>
                        </NMText>
                    </View>
                )}

                {sizeRange && (
                    <View>
                        <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                            Size:{' '}
                            <NMText fontSize={14} fontFamily="semiBold" color={Colors.textSecondary}>
                                {sizeRange}
                            </NMText>
                        </NMText>
                    </View>
                )}
            </View>

            {url && (
                <View style={styles.urlContainer}>
                    <NMText fontSize={12} fontFamily="regular" color={Colors.textLight} numberOfLines={2}>
                        URL:{' '}
                        <NMText fontSize={12} fontFamily="medium" color={Colors.textSecondary}>
                            {url}
                        </NMText>
                    </NMText>
                </View>
            )}

            <NMText fontSize={12} fontFamily="regular" color={Colors.textLight} style={{ marginTop: 6 }}>
                Saved: {formatDate(date)}
            </NMText>

            <TouchableOpacity
                style={styles.bookmarkIconContainer}
                onPress={onDelete}
                activeOpacity={0.7}
            >
                <Bookmark
                    color={Colors.primary}
                    size={24}
                    fill={Colors.primary}
                    strokeWidth={2}
                />
            </TouchableOpacity>
        </View>
    );
};

const SavedSearch: React.FC = () => {
    const navigation = useNavigation();
    const [savedSearches, setSavedSearches] = useState<SavedSearchItem[]>([]);
    const [loader, setLoader] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedSearchId, setSelectedSearchId] = useState<number | null>(null);

    const parseSearchUrl = (url: string) => {
        const params: Record<string, string> = {};
        const parts = url.split('&');

        parts.forEach(part => {
            const [key, value] = part.split('=');
            if (key && value !== undefined) {
                params[key] = decodeURIComponent(value || '');
            }
        });

        return params;
    };

    const formatSearchParams = (item: SavedSearchItem) => {
        const params = parseSearchUrl(item.url);
        const searchType = params.type || 'Any';
        const location = params.location || '';

        // Format price range
        let priceRange = '';
        if (params.priceRange) {
            const [min, max] = params.priceRange.split(',');
            if (min && max) {
                priceRange = `SAR ${parseInt(min).toLocaleString()} - SAR ${parseInt(max).toLocaleString()}`;
            }
        }

        // Format size range
        let sizeRange = '';
        if (params.sizeRange) {
            const [min, max] = params.sizeRange.split(',');
            if (min && max) {
                sizeRange = `${parseInt(min).toLocaleString()} - ${parseInt(max).toLocaleString()} Sqft`;
            }
        }

        return {
            searchType,
            location,
            priceRange,
            sizeRange,
            date: item.created_at,
        };
    };

    const getSavedSearches = async () => {
        try {
            setLoader(true);
            const { result, error } = await apiRequest<SavedSearchResponse>({
                endpoint: 'v1/saved-searches?page=1&per_page=1000',
                method: 'GET',
            });

            if (result) {
                console.log("Saved Searches:", JSON.stringify(result.data));
                setSavedSearches(result.data || []);
            }

            if (error) {
                console.log("Error:", error);
                showErrorToast(`Error fetching saved searches: ${error}`);
            }
        } catch (err) {
            console.error("Unexpected Error:", err);
            showErrorToast(`Unexpected Error: ${err}`);
        } finally {
            setLoader(false);
        }
    };

    const deleteSavedSearch = async (id: number) => {
        try {
            setLoader(true);
            const { result, error } = await apiRequest({
                endpoint: `v1/saved-searches/${id}`,
                method: 'DELETE',
            });

            if (error) {
                console.log("Error:", error);
                showErrorToast(`Error deleting saved search: ${error}`);
                return;
            }

            if (result) {
                showSuccessToast('Saved search deleted successfully');
                // Refresh the list after deletion
                await getSavedSearches();
            }
        } catch (err) {
            console.error("Unexpected Error:", err);
            showErrorToast(`Unexpected Error: ${err}`);
        } finally {
            setLoader(false);
            setDeleteModalVisible(false);
            setSelectedSearchId(null);
        }
    };

    const handleDeletePress = (id: number) => {
        setSelectedSearchId(id);
        setDeleteModalVisible(true);
    };

    const handleConfirmDelete = () => {
        if (selectedSearchId) {
            deleteSavedSearch(selectedSearchId);
        }
    };

    useEffect(() => {
        getSavedSearches();
    }, []);

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>

                <View style={styles.header}>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.backBox} onPress={() => navigation.goBack()}>
                            <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                        </TouchableOpacity>
                        <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary} style={styles.headerTitle}>
                            Saved Searches
                        </NMText>
                    </View>
                </View>

                {savedSearches.length === 0 && !loader && (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '46%' }}>
                        <NMText fontSize={16} fontFamily="medium" color={Colors.textSecondary}>
                            No saved searches found
                        </NMText>
                    </View>
                )}

                {savedSearches.map((item) => {
                    const params = formatSearchParams(item);
                    return (
                        <SavedListCard
                            key={item.id}
                            searchType={params.searchType}
                            location={params.location}
                            priceRange={params.priceRange}
                            sizeRange={params.sizeRange}
                            date={params.date}
                            url={item.url}
                            onDelete={() => handleDeletePress(item.id)}
                        />
                    );
                })}

                <LoaderModal visible={loader} />
                <ConfirmationModal
                    visible={deleteModalVisible}
                    onClose={() => {
                        setDeleteModalVisible(false);
                        setSelectedSearchId(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    title="Delete Saved Search?"
                    message="Are you sure you want to delete this saved search? This action cannot be undone."
                    buttonName="Delete"
                />
            </ScrollView>
        </NMSafeAreaWrapper>
    );
};

export default SavedSearch;

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
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    headerTitle: {
        marginLeft: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardContainer: {
        marginHorizontal: '5%',
        backgroundColor: Colors.white,
        marginVertical: 6,
        padding: 14,
        borderRadius: 12,
    },
    urlContainer: {
        marginTop: 6,
        paddingRight: 40,
    },
    bookmarkIconContainer: {
        position: 'absolute',
        top: 10,
        right: 14,
        padding: 4,
    },
});