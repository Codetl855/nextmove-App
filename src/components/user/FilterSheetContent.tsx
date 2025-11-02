import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import MultiRangeSlider from '../common/NMultiRangeSlider';
import NMText from '../common/NMText';
import { Colors } from '../../theme/colors';

interface FilterSheetContentProps {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    city: string;
    location: string;
    propertyType: 'Residential' | 'Commercial';
    setPropertyType: (type: 'Residential' | 'Commercial') => void;
    selectedPropertySubType: string;
    setSelectedPropertySubType: (type: string) => void;
    setPriceMin: (value: number) => void;
    setPriceMax: (value: number) => void;
    setSizeMin: (value: number) => void;
    setSizeMax: (value: number) => void;
    selectedRating: number | null;
    setSelectedRating: (rating: number | null) => void;
}

const FilterSheetContent: React.FC<FilterSheetContentProps> = ({
    selectedCategory,
    setSelectedCategory,
    city,
    location,
    propertyType,
    setPropertyType,
    selectedPropertySubType,
    setSelectedPropertySubType,
    setPriceMin,
    setPriceMax,
    setSizeMin,
    setSizeMax,
    selectedRating,
    setSelectedRating,
}) => {
    const categoryTabs = [
        { id: 'BUY', label: 'BUY' },
        { id: 'RENT', label: 'RENT' },
        { id: 'STAY', label: 'STAY' },
    ];

    const residentialTypes = [
        { id: 'apartment', label: 'Apartment' },
        { id: 'villa', label: 'Villa' },
        { id: 'townhouse', label: 'Townhouse' },
        { id: 'hotel', label: 'Hotel Apartment' },
    ];

    const ratings = [5.0, 4.0, 3.0, 2.0];

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            bounces={true}
        >
            {/* Category Tabs */}
            <View style={styles.categoryView}>
                {categoryTabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => setSelectedCategory(tab.id)}
                        style={[
                            styles.categoryTab,
                            {
                                backgroundColor:
                                    selectedCategory === tab.id
                                        ? Colors.primary
                                        : 'transparent',
                            },
                        ]}
                    >
                        <NMText
                            fontSize={16}
                            fontFamily={
                                selectedCategory === tab.id ? 'semiBold' : 'regular'
                            }
                            color={
                                selectedCategory === tab.id
                                    ? Colors.white
                                    : Colors.textPrimary
                            }
                        >
                            {tab.label}
                        </NMText>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.divider} />

            {/* City */}
            <TouchableOpacity style={styles.fieldContainer}>
                <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                    City
                </NMText>
                <View style={styles.inputRow}>
                    <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                        {city}
                    </NMText>
                    <ChevronRight size={20} color={Colors.textPrimary} />
                </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Location */}
            <View style={styles.fieldContainer}>
                <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                    Location
                </NMText>
                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                    {location}
                </NMText>
            </View>

            <View style={styles.divider} />

            {/* Property Type */}
            <View style={styles.sectionContainer}>
                <NMText fontSize={16} fontFamily="semiBold" color={Colors.textSecondary}>
                    Property Type
                </NMText>

                <View style={styles.typeTabsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.typeTab,
                            propertyType === 'Residential' && styles.typeTabActive,
                        ]}
                        onPress={() => setPropertyType('Residential')}
                    >
                        <NMText
                            fontSize={14}
                            fontFamily={
                                propertyType === 'Residential' ? 'semiBold' : 'regular'
                            }
                            color={
                                propertyType === 'Residential'
                                    ? Colors.primary
                                    : Colors.textLight
                            }
                        >
                            Residential
                        </NMText>
                        {propertyType === 'Residential' && (
                            <View style={styles.activeUnderline} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.typeTab,
                            propertyType === 'Commercial' && styles.typeTabActive,
                        ]}
                        onPress={() => setPropertyType('Commercial')}
                    >
                        <NMText
                            fontSize={14}
                            fontFamily={
                                propertyType === 'Commercial' ? 'semiBold' : 'regular'
                            }
                            color={
                                propertyType === 'Commercial'
                                    ? Colors.primary
                                    : Colors.textLight
                            }
                        >
                            Commercial
                        </NMText>
                        {propertyType === 'Commercial' && (
                            <View style={styles.activeUnderline} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Property Sub Types */}
                <View style={styles.subTypesContainer}>
                    <ScrollView
                        horizontal
                        contentContainerStyle={{ gap: 10 }}
                        showsHorizontalScrollIndicator={false}
                    >
                        {residentialTypes.map((type) => (
                            <TouchableOpacity
                                key={type.id}
                                style={[
                                    styles.subTypeButton,
                                    selectedPropertySubType === type.label &&
                                    styles.subTypeButtonActive,
                                ]}
                                onPress={() => setSelectedPropertySubType(type.label)}
                            >
                                <NMText
                                    fontSize={16}
                                    fontFamily={
                                        selectedPropertySubType === type.label
                                            ? 'semiBold'
                                            : 'regular'
                                    }
                                    color={
                                        selectedPropertySubType === type.label
                                            ? Colors.white
                                            : Colors.textPrimary
                                    }
                                >
                                    {type.label}
                                </NMText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>

            {/* Price Range */}
            <MultiRangeSlider
                title="Price Range"
                min={100}
                max={650000}
                initialMinValue={5000}
                initialMaxValue={300000}
                step={1000}
                prefix="$"
                onValuesChange={(min, max) => {
                    setPriceMin(min);
                    setPriceMax(max);
                }}
            />

            <View style={styles.divider} />

            {/* Size */}
            <MultiRangeSlider
                title="Size"
                min={500}
                max={1500}
                initialMinValue={600}
                initialMaxValue={750}
                step={1000}
                suffix="SqFt"
                onValuesChange={(min, max) => {
                    setSizeMin(min);
                    setSizeMax(max);
                }}
            />

            <View style={styles.divider} />

            {/* Rating */}
            <View style={styles.sectionContainer}>
                <NMText fontSize={16} fontFamily="semiBold" color={Colors.textSecondary}>
                    Rating
                </NMText>
                <View style={styles.ratingsContainer}>
                    {ratings.map((rating) => (
                        <TouchableOpacity
                            key={rating}
                            style={[
                                styles.ratingButton,
                                selectedRating === rating && styles.ratingButtonActive,
                            ]}
                            onPress={() => setSelectedRating(rating)}
                        >
                            <Text style={styles.starIcon}>⭐</Text>
                            <NMText
                                fontSize={16}
                                fontFamily="medium"
                                color={
                                    selectedRating === rating
                                        ? Colors.primary
                                        : Colors.textLight
                                }
                            >
                                {rating}
                            </NMText>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    categoryView: {
        width: '60%',
        height: 40,
        backgroundColor: Colors.background,
        borderRadius: 8,
        marginBottom: 16,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    categoryTab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fieldContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginHorizontal: 20,
    },
    sectionContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    typeTabsContainer: {
        flexDirection: 'row',
        gap: 32,
        marginTop: 10,
    },
    typeTab: {
        paddingBottom: 8,
    },
    typeTabActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#B8935E',
    },
    activeUnderline: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: Colors.primary,
    },
    subTypesContainer: {
        flexDirection: 'row',
        marginTop: 16,
    },
    subTypeButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6,
        backgroundColor: Colors.background,
    },
    subTypeButtonActive: {
        backgroundColor: '#B8935E',
    },
    ratingsContainer: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
        marginTop: 12,
    },
    ratingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
    },
    ratingButtonActive: {
        backgroundColor: '#FFF9F0',
        borderWidth: 1,
        borderColor: '#B8935E',
    },
    starIcon: {
        fontSize: 18,
    },
});

export default FilterSheetContent;