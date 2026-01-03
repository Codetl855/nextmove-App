import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { X } from 'lucide-react-native';
import MultiRangeSlider from '../common/NMultiRangeSlider';
import NMText from '../common/NMText';
import NMTextInput from '../common/NMTextInput';
import { Colors } from '../../theme/colors';
import { apiRequest } from '../../services/apiClient';
import { showErrorToast } from '../../utils/toastService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FilterSheetProps {
    visible: boolean;
    onClose: () => void;
    onApplyFilter: (filters: any, fieldOption: any) => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ visible, onClose, onApplyFilter }) => {
    const [selectedCategory, setSelectedCategory] = useState('BUY');
    const [city, setCity] = useState('');
    const [location, setLocation] = useState('');
    const [propertyType, setPropertyType] = useState<'Residential' | 'Commercial'>('Residential');
    const [selectedPropertySubType, setSelectedPropertySubType] = useState('');
    const [priceMin, setPriceMin] = useState<number | null>(null);
    const [priceMax, setPriceMax] = useState<number | null>(null);
    const [sizeMin, setSizeMin] = useState<number | null>(null);
    const [sizeMax, setSizeMax] = useState<number | null>(null);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [fieldOption, setFieldOption] = useState<any>({
        propertyTypes: [],
        ameneties: [],
    });

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

    const ratings = [5.0, 4.0, 3.0, 2.0, 1.0];

    const handleReset = () => {
        setSelectedCategory('BUY');
        setCity('');
        setLocation('');
        setPropertyType('Residential');
        setSelectedPropertySubType('');
        setPriceMin(null);
        setPriceMax(null);
        setSizeMin(null);
        setSizeMax(null);
        setSelectedRating(null);
    };

    const handleApplyFilter = () => {
        filterApi();
    };

    const loadFieldOptions = async () => {
        setLoading(true);
        const { result, error } = await apiRequest({
            endpoint: 'v1/property-field-options',
            method: 'GET',
        });
        if (result) {
            const data = result.data;
            const propertyTypes = data?.propertyTypes?.map((item: string) => ({
                label: item,
                value: item,
            }));
            const ameneties = data.ameneties;
            setFieldOption({ propertyTypes, ameneties });

            // Set first property type as default if available
            // if (propertyTypes.length > 0) {
            //     setSelectedPropertySubType(propertyTypes[0].label);
            // }
        }
        if (error) {
            console.warn("Failed:", error);
            showErrorToast(`loadFieldOptions: ${error}`);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadFieldOptions();
    }, []);

    const filterApi = async () => {
        // Build payload with only selected/non-empty values
        const payload: any = {
            property_category: selectedCategory, // Always include category
        };

        // Add optional fields only if they have values
        if (city && city.trim() !== '') {
            payload.city = city;
        }

        if (location && location.trim() !== '') {
            payload.address = location;
        }

        if (selectedPropertySubType && selectedPropertySubType.trim() !== '') {
            payload.property_type = selectedPropertySubType;
        }

        if (priceMin !== null) {
            payload.min_price = priceMin;
        }

        if (priceMax !== null) {
            payload.max_price = priceMax;
        }

        if (sizeMin !== null) {
            payload.min_size = sizeMin;
        }

        if (sizeMax !== null) {
            payload.max_size = sizeMax;
        }

        if (selectedRating !== null) {
            payload.rating = selectedRating;
        }

        //

        try {
            const { result, error } = await apiRequest({
                endpoint: "v1/search-properties",
                method: "POST",
                data: payload,
            });

            if (result) {
                onApplyFilter(result.data, payload);
                onClose();
                console.log("Filter API Result:", JSON.stringify(result.data));
            }

            if (error) {
                console.log("Filter API Error:", error);
                showErrorToast(`Filter API Error: ${error}`);
            }
        } catch (err) {
            console.error("Filter API Error:", err);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Indicator */}
                    <View style={styles.indicator} />

                    {/* Header */}
                    <View style={styles.header}>
                        <NMText fontSize={20} fontFamily='semiBold' color={Colors.textSecondary}>
                            Search Filters
                        </NMText>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <X size={18} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* ScrollView Content */}
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps={'always'}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Category Tabs */}
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

                        {/* City */}
                        <View style={styles.inputFieldContainer}>
                            <NMTextInput
                                label="City"
                                placeholder="Enter city"
                                value={city}
                                onChangeText={setCity}
                                mainViewStyle={{ marginVertical: 0 }}
                            />
                        </View>

                        <View style={styles.divider} />

                        {/* Location */}
                        <View style={styles.inputFieldContainer}>
                            <NMTextInput
                                label="Location"
                                placeholder="Enter location"
                                value={location}
                                onChangeText={setLocation}
                                mainViewStyle={{ marginVertical: 0 }}
                            />
                        </View>

                        <View style={styles.divider} />

                        {/* Property Type */}
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
                                <ScrollView horizontal contentContainerStyle={{ gap: 10 }} showsHorizontalScrollIndicator={false}>
                                    {fieldOption.propertyTypes.map((type: any) => (
                                        <TouchableOpacity
                                            key={type.value}
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
                            step={50}
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
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                            </ScrollView>
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
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color={Colors.white} /> : <NMText fontSize={14} fontFamily='regular' color={Colors.white}>
                                Apply Filter
                            </NMText>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        height: SCREEN_HEIGHT * 0.82,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    indicator: {
        width: 60,
        height: 4,
        backgroundColor: Colors.border,
        alignSelf: 'center',
        marginTop: 12,
        borderRadius: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
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
    fieldContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    inputFieldContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
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
        marginTop: 16,
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
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
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
// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     ScrollView,
//     Modal,
//     Dimensions,
// } from 'react-native';
// import { X } from 'lucide-react-native';
// import MultiRangeSlider from '../common/NMultiRangeSlider';
// import NMText from '../common/NMText';
// import NMTextInput from '../common/NMTextInput';
// import { Colors } from '../../theme/colors';
// import { apiRequest } from '../../services/apiClient';
// import { showErrorToast } from '../../utils/toastService';

// const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// interface FilterSheetProps {
//     visible: boolean;
//     onClose: () => void;
//     onApplyFilter: (filters: any) => void;
// }

// const FilterSheet: React.FC<FilterSheetProps> = ({ visible, onClose, onApplyFilter }) => {
//     // State Management
//     const [selectedCategory, setSelectedCategory] = useState('BUY');
//     const [city, setCity] = useState('Riyadh');
//     const [location, setLocation] = useState('Riyadh');
//     const [propertyType, setPropertyType] = useState<'Residential' | 'Commercial'>('Residential');
//     const [selectedPropertySubType, setSelectedPropertySubType] = useState('Villa');
//     const [priceMin, setPriceMin] = useState(25000);
//     const [priceMax, setPriceMax] = useState(300000);
//     const [sizeMin, setSizeMin] = useState(500);
//     const [sizeMax, setSizeMax] = useState(1500);
//     const [selectedRating, setSelectedRating] = useState<number | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [fieldOption, setFieldOption] = useState<any>({
//         propertyTypes: [],
//         ameneties: [],
//     });

//     const categoryTabs = [
//         { id: 'BUY', label: 'BUY' },
//         { id: 'RENT', label: 'RENT' },
//         { id: 'STAY', label: 'STAY' },
//     ];

//     const residentialTypes = [
//         { id: 'apartment', label: 'Apartment' },
//         { id: 'villa', label: 'Villa' },
//         { id: 'townhouse', label: 'Townhouse' },
//         { id: 'hotel', label: 'Hotel Apartment' },
//     ];

//     const ratings = [5.0, 4.0, 3.0, 2.0, 1.0];

//     const handleReset = () => {
//         setSelectedCategory('BUY');
//         setCity('Riyadh');
//         setLocation('Riyadh');
//         setPropertyType('Residential');
//         setSelectedPropertySubType('Villa');
//         setPriceMin(25000);
//         setPriceMax(300000);
//         setSizeMin(500);
//         setSizeMax(1500);
//         setSelectedRating(null);
//     };

//     const handleApplyFilter = () => {
//         const filters = {
//             category: selectedCategory,
//             city,
//             location,
//             propertyType,
//             propertySubType: selectedPropertySubType,
//             priceRange: { min: priceMin, max: priceMax },
//             sizeRange: { min: sizeMin, max: sizeMax },
//             rating: selectedRating,
//         };

//         filterApi();
//     };

//     const loadFieldOptions = async () => {
//         setLoading(true);
//         const { result, error } = await apiRequest({
//             endpoint: 'v1/property-field-options',
//             method: 'GET',
//         });
//         if (result) {
//             const data = result.data;
//             const propertyTypes = data.propertyTypes.map((item: string) => ({
//                 label: item,
//                 value: item,
//             }));
//             const ameneties = data.ameneties;
//             setFieldOption({ propertyTypes, ameneties });
//         }
//         if (error) {
//             console.warn("Failed:", error);
//             showErrorToast(`loadFieldOptions: ${error}`);
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         loadFieldOptions();
//     }, []);
//     const filterApi = async () => {
//         const payload = {
//             address: location,
//             city: city,
//             property_type: selectedPropertySubType,
//             property_category: selectedCategory,
//             min_price: priceMin,
//             max_price: priceMax,
//             min_size: sizeMin,
//             max_size: sizeMax,
//             rating: selectedRating
//         };
//         console.log('payload', payload);

//         try {
//             const { result, error } = await apiRequest({
//                 endpoint: "v1/search-properties",
//                 method: "POST",
//                 data: payload,
//             });

//             if (result) {
//                 onApplyFilter(result.data);
//                 onClose();
//                 console.log("Filter API Result:", JSON.stringify(result.data));
//             }

//             if (error) {
//                 console.log("Filter API Error:", error);
//                 showErrorToast(`Filter API Error: ${error}`);
//             }
//         } catch (err) {
//             console.error("Filter API Error:", err);
//         }
//     }

//     return (
//         <Modal
//             visible={visible}
//             transparent={true}
//             animationType="slide"
//             onRequestClose={onClose}
//         >
//             <View style={styles.modalOverlay}>
//                 <View style={styles.modalContainer}>
//                     {/* Indicator */}
//                     <View style={styles.indicator} />

//                     {/* Header */}
//                     <View style={styles.header}>
//                         <NMText fontSize={20} fontFamily='semiBold' color={Colors.textSecondary}>
//                             Search Filters
//                         </NMText>
//                         <TouchableOpacity
//                             onPress={onClose}
//                             style={styles.closeButton}
//                         >
//                             <X size={18} color={Colors.textSecondary} />
//                         </TouchableOpacity>
//                     </View>

//                     {/* ScrollView Content */}
//                     <ScrollView
//                         style={styles.scrollView}
//                         contentContainerStyle={styles.scrollContent}
//                         keyboardShouldPersistTaps={'always'}
//                         showsVerticalScrollIndicator={false}
//                     >
//                         {/* Category Tabs */}
//                         <View style={styles.categoryView}>
//                             {categoryTabs.map((tab) => (
//                                 <TouchableOpacity
//                                     key={tab.id}
//                                     onPress={() => setSelectedCategory(tab.id)}
//                                     style={{
//                                         flex: 1,
//                                         alignItems: 'center',
//                                         justifyContent: 'center',
//                                         backgroundColor:
//                                             selectedCategory === tab.id ? Colors.primary : 'transparent',
//                                     }}
//                                 >
//                                     <NMText
//                                         fontSize={16}
//                                         fontFamily={selectedCategory === tab.id ? 'semiBold' : 'regular'}
//                                         color={selectedCategory === tab.id ? Colors.white : Colors.textPrimary}
//                                     >
//                                         {tab.label}
//                                     </NMText>
//                                 </TouchableOpacity>
//                             ))}
//                         </View>

//                         <View style={styles.divider} />

//                         {/* City */}
//                         <View style={styles.inputFieldContainer}>
//                             <NMTextInput
//                                 label="City"
//                                 placeholder="Enter city"
//                                 value={city}
//                                 onChangeText={setCity}
//                                 mainViewStyle={{ marginVertical: 0 }}
//                             />
//                         </View>

//                         <View style={styles.divider} />

//                         {/* Location */}
//                         <View style={styles.inputFieldContainer}>
//                             <NMTextInput
//                                 label="Location"
//                                 placeholder="Enter location"
//                                 value={location}
//                                 onChangeText={setLocation}
//                                 mainViewStyle={{ marginVertical: 0 }}
//                             />
//                         </View>

//                         <View style={styles.divider} />

//                         {/* Property Type */}
//                         <View style={styles.sectionContainer}>
//                             <NMText fontSize={16} fontFamily='semiBold' color={Colors.textSecondary}>
//                                 Property Type
//                             </NMText>

//                             <View style={styles.typeTabsContainer}>
//                                 <TouchableOpacity
//                                     style={[
//                                         styles.typeTab,
//                                         propertyType === 'Residential' && styles.typeTabActive,
//                                     ]}
//                                     onPress={() => setPropertyType('Residential')}
//                                 >
//                                     <NMText fontSize={14} fontFamily={propertyType === 'Residential' ? 'semiBold' : 'regular'} color={propertyType === 'Residential' ? Colors.primary : Colors.textLight}>
//                                         Residential
//                                     </NMText>
//                                     {propertyType === 'Residential' && (
//                                         <View style={styles.activeUnderline} />
//                                     )}
//                                 </TouchableOpacity>

//                                 <TouchableOpacity
//                                     style={[
//                                         styles.typeTab,
//                                         propertyType === 'Commercial' && styles.typeTabActive,
//                                     ]}
//                                     onPress={() => setPropertyType('Commercial')}
//                                 >
//                                     <NMText fontSize={14} fontFamily={propertyType === 'Commercial' ? 'semiBold' : 'regular'} color={propertyType === 'Commercial' ? Colors.primary : Colors.textLight}>
//                                         Commercial
//                                     </NMText>
//                                     {propertyType === 'Commercial' && (
//                                         <View style={styles.activeUnderline} />
//                                     )}
//                                 </TouchableOpacity>
//                             </View>

//                             <View style={styles.subTypesContainer}>
//                                 <ScrollView horizontal contentContainerStyle={{ gap: 10 }} showsHorizontalScrollIndicator={false}>
//                                     {fieldOption.propertyTypes.map((type: any) => (
//                                         <TouchableOpacity
//                                             key={type.id}
//                                             style={[
//                                                 styles.subTypeButton,
//                                                 selectedPropertySubType === type.label && styles.subTypeButtonActive,
//                                             ]}
//                                             onPress={() => setSelectedPropertySubType(type.label)}
//                                         >
//                                             <NMText fontSize={16} fontFamily={selectedPropertySubType === type.label ? 'semiBold' : 'regular'} color={selectedPropertySubType === type.label ? Colors.white : Colors.textPrimary}>
//                                                 {type.label}
//                                             </NMText>
//                                         </TouchableOpacity>
//                                     ))}
//                                 </ScrollView>
//                             </View>
//                         </View>

//                         {/* Price Range */}
//                         <MultiRangeSlider
//                             title="Price Range"
//                             min={100}
//                             max={650000}
//                             initialMinValue={5000}
//                             initialMaxValue={300000}
//                             step={1000}
//                             prefix="$"
//                             onValuesChange={(min, max) => {
//                                 setPriceMin(min);
//                                 setPriceMax(max);
//                             }}
//                         />

//                         <View style={styles.divider} />

//                         {/* Size */}
//                         <MultiRangeSlider
//                             title="Size"
//                             min={500}
//                             max={1500}
//                             initialMinValue={600}
//                             initialMaxValue={750}
//                             step={1000}
//                             suffix="SqFt"
//                             onValuesChange={(min, max) => {
//                                 setSizeMin(min);
//                                 setSizeMax(max);
//                             }}
//                         />

//                         <View style={styles.divider} />

//                         {/* Rating */}
//                         <View style={styles.sectionContainer}>
//                             <NMText fontSize={16} fontFamily='semiBold' color={Colors.textSecondary}>
//                                 Rating
//                             </NMText>
//                             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                                 <View style={styles.ratingsContainer}>
//                                     {ratings.map((rating) => (
//                                         <TouchableOpacity
//                                             key={rating}
//                                             style={[
//                                                 styles.ratingButton,
//                                                 selectedRating === rating && styles.ratingButtonActive,
//                                             ]}
//                                             onPress={() => setSelectedRating(rating)}
//                                         >
//                                             <Text style={styles.starIcon}>⭐</Text>
//                                             <NMText
//                                                 fontSize={16}
//                                                 fontFamily='medium'
//                                                 color={selectedRating === rating ? Colors.primary : Colors.textLight}
//                                             >
//                                                 {rating}
//                                             </NMText>
//                                         </TouchableOpacity>
//                                     ))}
//                                 </View>
//                             </ScrollView>
//                         </View>
//                     </ScrollView>

//                     {/* Footer Buttons */}
//                     <View style={styles.footer}>
//                         <TouchableOpacity
//                             style={styles.resetButton}
//                             onPress={handleReset}
//                             activeOpacity={0.7}
//                         >
//                             <NMText fontSize={14} fontFamily='regular' color={Colors.primary}>
//                                 Reset
//                             </NMText>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             style={styles.applyButton}
//                             onPress={handleApplyFilter}
//                             activeOpacity={0.7}
//                         >
//                             <NMText fontSize={14} fontFamily='regular' color={Colors.white}>
//                                 Apply Filter
//                             </NMText>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </View>
//         </Modal>
//     );
// };

// const styles = StyleSheet.create({
//     modalOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         justifyContent: 'flex-end',
//     },
//     modalContainer: {
//         height: SCREEN_HEIGHT * 0.82,
//         backgroundColor: Colors.white,
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//     },
//     indicator: {
//         width: 60,
//         height: 4,
//         backgroundColor: Colors.border,
//         alignSelf: 'center',
//         marginTop: 12,
//         borderRadius: 2,
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//         paddingVertical: 20,
//     },
//     closeButton: {
//         width: 32,
//         height: 32,
//         borderRadius: 8,
//         backgroundColor: Colors.background,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     scrollView: {
//         flex: 1,
//     },
//     scrollContent: {
//         paddingBottom: 100,
//     },
//     categoryView: {
//         width: '60%',
//         height: 40,
//         backgroundColor: Colors.background,
//         borderRadius: 8,
//         marginBottom: 16,
//         alignSelf: 'center',
//         flexDirection: 'row',
//         justifyContent: 'center',
//         overflow: 'hidden',
//     },
//     fieldContainer: {
//         paddingHorizontal: 20,
//         paddingVertical: 16,
//     },
//     inputFieldContainer: {
//         paddingHorizontal: 20,
//         paddingVertical: 12,
//     },
//     inputRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     divider: {
//         height: 1,
//         backgroundColor: '#F0F0F0',
//         marginHorizontal: 20,
//     },
//     sectionContainer: {
//         paddingHorizontal: 20,
//         paddingVertical: 20,
//     },
//     typeTabsContainer: {
//         flexDirection: 'row',
//         gap: 32,
//         marginTop: 10,
//     },
//     typeTab: {
//         paddingBottom: 8,
//     },
//     typeTabActive: {
//         borderBottomWidth: 2,
//         borderBottomColor: '#B8935E',
//     },
//     activeUnderline: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         height: 2,
//         backgroundColor: Colors.primary,
//     },
//     subTypesContainer: {
//         flexDirection: 'row',
//         marginTop: 16,
//     },
//     subTypeButton: {
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//         borderRadius: 6,
//         backgroundColor: Colors.background,
//     },
//     subTypeButtonActive: {
//         backgroundColor: '#B8935E',
//     },
//     ratingsContainer: {
//         flexDirection: 'row',
//         gap: 12,
//         flexWrap: 'wrap',
//         marginTop: 16,
//     },
//     ratingButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 6,
//         paddingHorizontal: 20,
//         paddingVertical: 12,
//         borderRadius: 8,
//         backgroundColor: '#F5F5F5',
//     },
//     ratingButtonActive: {
//         backgroundColor: '#FFF9F0',
//         borderWidth: 1,
//         borderColor: '#B8935E',
//     },
//     starIcon: {
//         fontSize: 18,
//     },
//     footer: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         flexDirection: 'row',
//         gap: 12,
//         paddingHorizontal: 20,
//         paddingVertical: 16,
//         backgroundColor: '#FFFFFF',
//         borderTopWidth: 1,
//         borderTopColor: '#F0F0F0',
//     },
//     resetButton: {
//         flex: 1,
//         paddingVertical: 16,
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: Colors.primary,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     applyButton: {
//         flex: 1,
//         paddingVertical: 16,
//         borderRadius: 8,
//         backgroundColor: Colors.primary,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });

// export default FilterSheet;