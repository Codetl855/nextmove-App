import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { ChevronRight } from 'lucide-react-native';
import MultiRangeSlider from '../common/NMultiRangeSlider';
import NMText from '../common/NMText';
import { Colors } from '../../theme/colors';
import { X } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native';

interface FilterSheetProps {
    sheetId: string;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ sheetId }) => {
    const navigation = useNavigation()
    // State Management
    const [selectedCategory, setSelectedCategory] = useState('BUY');
    const [city, setCity] = useState('Riyadh');
    const [location, setLocation] = useState('Riyadh');
    const [propertyType, setPropertyType] = useState<'Residential' | 'Commercial'>('Residential');
    const [selectedPropertySubType, setSelectedPropertySubType] = useState('Villa');
    const [priceMin, setPriceMin] = useState(25000);
    const [priceMax, setPriceMax] = useState(300000);
    const [sizeMin, setSizeMin] = useState(500);
    const [sizeMax, setSizeMax] = useState(1500);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);

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

    const handleReset = () => {
        setSelectedCategory('BUY');
        setCity('Riyadh');
        setLocation('Riyadh');
        setPropertyType('Residential');
        setSelectedPropertySubType('Villa');
        setPriceMin(25000);
        setPriceMax(300000);
        setSizeMin(500);
        setSizeMax(1500);
        setSelectedRating(null);
    };

    const handleApplyFilter = () => {
        const filters = {
            category: selectedCategory,
            city,
            location,
            propertyType,
            propertySubType: selectedPropertySubType,
            priceRange: { min: priceMin, max: priceMax },
            sizeRange: { min: sizeMin, max: sizeMax },
            rating: selectedRating,
        };
        console.log('Applied Filters:', filters);
        SheetManager.hide(sheetId);
        navigation.navigate('Home', { screen: 'FilterList', params: { selectedCategory } });
    };

    return (
        <ActionSheet
            id={sheetId}
            containerStyle={styles.sheetContainer}
            gestureEnabled={true}
            indicatorStyle={styles.indicator}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <NMText fontSize={20} fontFamily='semiBold' color={Colors.textSecondary}>
                        Search Filters
                    </NMText>
                    <TouchableOpacity
                        onPress={() => SheetManager.hide(sheetId)}
                        style={styles.closeButton}
                    >
                        <X size={18} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    keyboardShouldPersistTaps={'always'}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.categoryView}>
                        {categoryTabs.map((tab) => (
                            <TouchableOpacity
                                key={tab.id}
                                onPress={() => setSelectedCategory(tab.id)}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor:
                                        selectedCategory === tab.id ? Colors.primary : 'transparent',
                                }}
                            >
                                <NMText
                                    key={tab.id}
                                    fontSize={16}
                                    fontFamily={selectedCategory === tab.id ? 'semiBold' : 'regular'}
                                    color={selectedCategory === tab.id ? Colors.white : Colors.textPrimary}
                                >
                                    {tab.label}
                                </NMText>

                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.fieldContainer}>
                        <NMText fontSize={14} fontFamily='regular' color={Colors.textLight}>
                            City
                        </NMText>
                        <View style={styles.inputRow}>
                            <NMText fontSize={14} fontFamily='regular' color={Colors.textPrimary}>
                                {city}
                            </NMText>
                            <ChevronRight size={20} color={Colors.textPrimary} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <View style={styles.fieldContainer}>
                        <NMText fontSize={14} fontFamily='regular' color={Colors.textLight}>
                            Location
                        </NMText>
                        <NMText fontSize={14} fontFamily='regular' color={Colors.textPrimary}>
                            {location}
                        </NMText>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.sectionContainer}>
                        <NMText fontSize={16} fontFamily='semiBold' color={Colors.textSecondary}>
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
                                <NMText fontSize={14} fontFamily={propertyType === 'Residential' ? 'semiBold' : 'regular'} color={propertyType === 'Residential' ? Colors.primary : Colors.textLight}>
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
                                <NMText fontSize={14} fontFamily={propertyType === 'Commercial' ? 'semiBold' : 'regular'} color={propertyType === 'Commercial' ? Colors.primary : Colors.textLight}>
                                    Commercial
                                </NMText>

                                {propertyType === 'Commercial' && (
                                    <View style={styles.activeUnderline} />
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.subTypesContainer}>
                            <ScrollView horizontal contentContainerStyle={{ gap: 10 }}>
                                {residentialTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type.id}
                                        style={[
                                            styles.subTypeButton,
                                            selectedPropertySubType === type.label && styles.subTypeButtonActive,
                                        ]}
                                        onPress={() => setSelectedPropertySubType(type.label)}
                                    >
                                        <NMText fontSize={16} fontFamily={selectedPropertySubType === type.label ? 'semiBold' : 'regular'} color={selectedPropertySubType === type.label ? Colors.white : Colors.textPrimary}>
                                            {type.label}
                                        </NMText>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

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
                        <NMText fontSize={16} fontFamily='semiBold' color={Colors.textSecondary}>
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
                                        fontFamily='medium'
                                        color={selectedRating === rating ? Colors.primary : Colors.textLight}
                                    >
                                        {rating}
                                    </NMText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={handleReset}
                        activeOpacity={0.7}
                    >
                        <NMText fontSize={14} fontFamily='regular' color={Colors.primary}>
                            Reset
                        </NMText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={handleApplyFilter}
                        activeOpacity={0.7}
                    >
                        <NMText fontSize={14} fontFamily='regular' color={Colors.white}>
                            Apply Filter
                        </NMText>
                    </TouchableOpacity>
                </View>
            </View>
        </ActionSheet>
    );
};

const styles = StyleSheet.create({
    sheetContainer: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    indicator: {
        width: 60,
        height: 4,
        backgroundColor: Colors.border,
    },
    container: {
        backgroundColor: Colors.white,
        height: '94%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
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
        overflow: 'hidden'
    },
    closeIcon: {
        fontSize: 18,
        color: '#666666',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    fieldContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    label: {
        fontSize: 14,
        color: '#9E9E9E',
        marginBottom: 8,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputText: {
        fontSize: 16,
        color: '#1A1A1A',
        fontWeight: '500',
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 16,
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
    typeTabText: {
        fontSize: 16,
        color: '#9E9E9E',
        fontWeight: '500',
    },
    typeTabTextActive: {
        color: '#B8935E',
        fontWeight: '600',
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
        marginTop: 16
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
    subTypeText: {
        fontSize: 14,
        color: '#666666',
        fontWeight: '500',
    },
    subTypeTextActive: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    ratingsContainer: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
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
    ratingText: {
        fontSize: 16,
        color: '#666666',
        fontWeight: '500',
    },
    ratingTextActive: {
        color: '#B8935E',
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: -40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: '5%',
        paddingTop: 2,
        backgroundColor: '#FFFFFF',
    },
    resetButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    applyButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 8,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default FilterSheet;