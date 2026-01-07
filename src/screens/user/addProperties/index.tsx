import React, { useEffect, useState, useCallback } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import NMText from '../../../components/common/NMText';
import { Colors } from '../../../theme/colors';
import { UploadCloud, Trash2Icon, CheckSquare2, ChevronLeft } from 'lucide-react-native';
import NMTextInput from '../../../components/common/NMTextInput';
import NMButton from '../../../components/common/NMButton';
import NMDropdown from '../../../components/common/NMDropdown';
import NMDatePicker from '../../../components/common/NMDatePicker';
import { pickImagesFromGallery } from '../../../utils/mediaPicker';
import { apiRequest } from '../../../services/apiClient';
import { useForm } from '../../../hooks/useForm';
import { showErrorToast, showSuccessToast } from '../../../utils/toastService';
import ConfirmationModal from '../../../components/user/ConfirmationModal';
import NMLoaderModal from '../../../components/common/NMLoaderModal';
import NMRadioButton from '../../../components/common/NMRadioButton';
import NMDateRangePicker from '../../../components/common/NMDateRangePicker';

const AddProperties: React.FC = ({ navigation, route }: any) => {
    const drawerNavigation = navigation?.getParent?.('drawer') || navigation?.getParent?.();
    const { property } = route.params || {};
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [fieldOption, setFieldOption] = useState<any>({});
    const [images, setImages] = useState<any[]>([]);
    const [imageError, setImageError] = useState('');
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [showDelModal, setShowDelModal] = useState(false);
    const { values, errors, handleChange, validate, setValues } = useForm({
        title: '',
        description: '',
        property_type: '',
        property_category: '',
        size: '',
        land_area: '',
        rooms: '',
        bedrooms: '',
        bathrooms: '',
        garages: '',
        garage_size: '',
        year_built: '',
        address: '',
        zip_code: '',
        city: '',
        state: '',
        location: '',
        price: '',
        terms: '',
        amenities: [] as string[],
        booking_type: '',
        availability_start_date: '',
        availability_end_date: '',
    });

    const selectImages = async () => {
        const result = await pickImagesFromGallery({
            multiple: true,
            includeBase64: false,
        });
        if (result) {
            setImages(result);
            setImageError('');
        }
    };

    const propertyCategories = [
        { label: 'Stay', value: 'Stay' },
        { label: 'Sell', value: 'Sell' },
        { label: 'Rent', value: 'Rent' },
    ];

    const stateOptions = [
        { label: 'NY', value: 'NY' },
        { label: 'CA', value: 'CA' },
        { label: 'TX', value: 'TX' },
    ];

    const toggleAmenity = useCallback((item: string) => {
        handleChange('amenities',
            values.amenities.includes(item)
                ? values.amenities.filter((i: string) => i !== item)
                : [...values.amenities, item]
        );
    }, [values.amenities, handleChange]);

    // Helper function to validate numeric input
    const validateNumericInput = (value: string, fieldName: string): string | null => {
        if (!value) return null;
        // Allow only numbers and decimal point
        const numericRegex = /^[0-9]*\.?[0-9]*$/;
        if (!numericRegex.test(value)) {
            return `${fieldName} must be a number`;
        }
        return null;
    };

    // Helper function to handle numeric field changes
    const handleNumericChange = (field: string, value: string, fieldName: string) => {
        // Only allow numeric characters and decimal point
        const numericValue = value.replace(/[^0-9.]/g, '');
        const error = validateNumericInput(numericValue, fieldName);
        handleChange(field, numericValue, error);
    };

    // Helper function to validate year built
    const handleYearBuiltChange = (value: string) => {
        if (!value) {
            handleChange('year_built', value);
            return;
        }

        const currentYear = new Date().getFullYear();
        const selectedYear = parseInt(value, 10);

        if (isNaN(selectedYear)) {
            handleChange('year_built', value, 'Please enter a valid year');
            return;
        }

        if (selectedYear > currentYear) {
            handleChange('year_built', value, 'Year cannot be in the future');
            return;
        }

        handleChange('year_built', value);
    };

    const loadFieldOptions = async () => {
        setLoading(true);
        const { result, error } = await apiRequest({
            endpoint: 'v1/property-field-options',
            method: 'GET',
        });
        if (result) {
            const data = result.data;
            const propertyTypes = data.propertyTypes.map((item: string) => ({
                label: item,
                value: item,
            }));
            const ameneties = data.ameneties;
            setFieldOption({ propertyTypes, ameneties });
        }
        if (error) {
            console.warn("Failed:", error);
            showErrorToast(`loadFieldOptions: ${error}`);
        }
        setLoading(false);
    };

    // NEW: Function to populate form when editing
    const populatePropertyData = useCallback(() => {
        if (property) {
            // Parse amenities from the property data
            let amenitiesList: string[] = [];
            if (property.ameneties && property.ameneties.amenity_names) {
                try {
                    amenitiesList = JSON.parse(property.ameneties.amenity_names);
                } catch (e) {
                    console.warn('Failed to parse amenities:', e);
                }
            }

            // Create year_built date object if exists
            let yearBuiltValue = '';
            if (property.year_built) {
                yearBuiltValue = String(property.year_built);
            }

            // Set all form values
            setValues({
                title: property.title || '',
                description: property.description || '',
                property_type: property.property_type || '',
                property_category: property.property_category || '',
                size: property.size?.toString() || '',
                land_area: property.land_area?.toString() || '',
                rooms: property.rooms?.toString() || '',
                bedrooms: property.bedrooms?.toString() || '',
                bathrooms: property.bathrooms?.toString() || '',
                garages: property.garages?.toString() || '',
                garage_size: property.garage_size?.toString() || '',
                year_built: yearBuiltValue || '',
                address: property.address || '',
                zip_code: property.zip_code || '',
                city: property.city || '',
                state: property.state || '',
                location: property.location || '',
                price: property.price?.toString() || '',
                terms: property.terms || '',
                amenities: amenitiesList,
                booking_type: property.booking_type || 'instant',
                availability_start_date: property.availability_start_date || '',
                availability_end_date: property.availability_end_date || '',
            });

            // Set images from media
            if (property.media && property.media.length > 0) {
                const mediaImages = property.media.map((media: any) => ({
                    uri: media.media_url,
                    type: 'image/jpeg',
                    fileName: media.media_url.split('/').pop(),
                    property_id: media.property_id,
                    media_id: media.id,
                }));
                setImages(mediaImages);
            }
        }
    }, [property, setValues]);

    useEffect(() => {
        loadFieldOptions();
    }, []);

    // NEW: Populate form data when property exists and field options are loaded
    useEffect(() => {
        if (property && fieldOption.propertyTypes) {
            populatePropertyData();
        }
    }, [property, fieldOption.propertyTypes, populatePropertyData]);

    // Re-validate size and garage_size when land_area changes
    useEffect(() => {
        if (values.land_area && values.size) {
            const sizeNum = parseFloat(values.size);
            const landAreaNum = parseFloat(values.land_area);
            if (!isNaN(sizeNum) && !isNaN(landAreaNum) && landAreaNum > 0) {
                if (sizeNum >= landAreaNum) {
                    if (errors.size !== 'Size must be less than Land Area') {
                        handleChange('size', values.size, 'Size must be less than Land Area');
                    }
                } else if (errors.size === 'Size must be less than Land Area') {
                    handleChange('size', values.size); // Clear error
                }
            }
        }
        if (values.land_area && values.garage_size) {
            const garageSizeNum = parseFloat(values.garage_size);
            const landAreaNum = parseFloat(values.land_area);
            if (!isNaN(garageSizeNum) && !isNaN(landAreaNum) && landAreaNum > 0) {
                if (garageSizeNum >= landAreaNum) {
                    if (errors.garage_size !== 'Garage Size must be less than Land Area') {
                        handleChange('garage_size', values.garage_size, 'Garage Size must be less than Land Area');
                    }
                } else if (errors.garage_size === 'Garage Size must be less than Land Area') {
                    handleChange('garage_size', values.garage_size); // Clear error
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.land_area, values.size, values.garage_size]);

    // Re-validate bedrooms and bathrooms when rooms changes
    useEffect(() => {
        if (values.rooms) {
            const roomsNum = parseInt(values.rooms, 10);
            if (!isNaN(roomsNum) && roomsNum > 0) {
                if (values.bedrooms) {
                    const bedroomsNum = parseInt(values.bedrooms, 10);
                    if (!isNaN(bedroomsNum)) {
                        if (bedroomsNum > roomsNum) {
                            if (errors.bedrooms !== 'Bedrooms cannot exceed total Rooms') {
                                handleChange('bedrooms', values.bedrooms, 'Bedrooms cannot exceed total Rooms');
                            }
                        } else if (errors.bedrooms === 'Bedrooms cannot exceed total Rooms') {
                            handleChange('bedrooms', values.bedrooms); // Clear error
                        }
                    }
                }
                if (values.bathrooms) {
                    const bathroomsNum = parseInt(values.bathrooms, 10);
                    if (!isNaN(bathroomsNum)) {
                        if (bathroomsNum > roomsNum) {
                            if (errors.bathrooms !== 'Bathrooms cannot exceed total Rooms') {
                                handleChange('bathrooms', values.bathrooms, 'Bathrooms cannot exceed total Rooms');
                            }
                        } else if (errors.bathrooms === 'Bathrooms cannot exceed total Rooms') {
                            handleChange('bathrooms', values.bathrooms); // Clear error
                        }
                    }
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.rooms, values.bedrooms, values.bathrooms]);

    const validateStep1 = () => {
        const isValid = validate({
            title: (val) => {
                if (!val) return 'Title is required';
                if (val.length > 200) return 'Title must be 200 characters or less';
                return null;
            },
            description: (val) => {
                if (!val) return 'Description is required';
                if (val.length > 2000) return 'Description must be 2000 characters or less';
                return null;
            },
            property_type: (val) => !val ? 'Property Type is required' : null,
            property_category: (val) => !val ? 'Property Category is required' : null,
            size: (val) => {
                if (!val) return 'Size is required';
                if (!/^[0-9]*\.?[0-9]*$/.test(val)) return 'Size must be a number';
                const sizeNum = parseFloat(val);
                const landAreaNum = parseFloat(values.land_area || '0');
                if (landAreaNum > 0 && sizeNum >= landAreaNum) {
                    return 'Size must be less than Land Area';
                }
                return null;
            },
            land_area: (val) => {
                if (!val) return 'Land Area is required';
                if (!/^[0-9]*\.?[0-9]*$/.test(val)) return 'Land Area must be a number';
                return null;
            },
            year_built: (val) => {
                if (!val) return 'Year Built is required';
                const currentYear = new Date().getFullYear();
                const selectedYear = parseInt(val, 10);
                if (isNaN(selectedYear)) return 'Please enter a valid year';
                if (selectedYear > currentYear) return 'Year cannot be in the future';
                return null;
            },
            address: (val) => {
                if (!val) return 'Full Address is required';
                if (val.length > 500) return 'Address must be 500 characters or less';
                return null;
            },
            zip_code: (val) => {
                if (!val) return 'Zip Code is required';
                if (val.length > 10) return 'Zip Code must be 10 characters or less';
                return null;
            },
            city: (val) => {
                if (!val) return 'City is required';
                if (val.length > 100) return 'City must be 100 characters or less';
                return null;
            },
            state: (val) => {
                if (!val) return 'State is required';
                if (val.length > 100) return 'State must be 100 characters or less';
                return null;
            },
            location: (val) => {
                if (!val) return 'Location is required';
                if (val.length > 500) return 'Location must be 500 characters or less';
                return null;
            },
            rooms: (val) => {
                if (val && !/^[0-9]*$/.test(val)) return 'Rooms must be a number';
                return null;
            },
            bedrooms: (val) => {
                if (val) {
                    if (!/^[0-9]*$/.test(val)) return 'Bedrooms must be a number';
                    const bedroomsNum = parseInt(val, 10);
                    const roomsNum = parseInt(values.rooms || '0');
                    if (roomsNum > 0 && bedroomsNum > roomsNum) {
                        return 'Bedrooms cannot exceed total Rooms';
                    }
                }
                return null;
            },
            bathrooms: (val) => {
                if (val) {
                    if (!/^[0-9]*$/.test(val)) return 'Bathrooms must be a number';
                    const bathroomsNum = parseInt(val, 10);
                    const roomsNum = parseInt(values.rooms || '0');
                    if (roomsNum > 0 && bathroomsNum > roomsNum) {
                        return 'Bathrooms cannot exceed total Rooms';
                    }
                }
                return null;
            },
            garages: (val) => {
                if (val && !/^[0-9]*$/.test(val)) return 'Garages must be a number';
                return null;
            },
            garage_size: (val) => {
                if (val) {
                    if (!/^[0-9]*\.?[0-9]*$/.test(val)) return 'Garage Size must be a number';
                    const garageSizeNum = parseFloat(val);
                    const landAreaNum = parseFloat(values.land_area || '0');
                    if (landAreaNum > 0 && garageSizeNum >= landAreaNum) {
                        return 'Garage Size must be less than Land Area';
                    }
                }
                return null;
            },
            availability_start_date: (val) =>
                values.property_category !== 'Sell' && !val
                    ? 'Availability Start Date is required'
                    : null,
            availability_end_date: (val) =>
                values.property_category !== 'Sell' && !val
                    ? 'Availability End Date is required'
                    : null,
        });

        // Validate images
        if (images.length === 0) {
            setImageError('Please select at least one image');
            return false;
        } else {
            setImageError('');
        }

        return isValid;
    };

    const validateStep2 = () => {
        return validate({
            price: (val) => {
                if (!val) return 'Price is required';
                if (!/^[0-9]*\.?[0-9]*$/.test(val)) return 'Price must be a number';
                return null;
            },
            terms: (val) => {
                if (val && val.length > 2000) return 'Terms & Rules must be 2000 characters or less';
                return null;
            },
        });
    };

    const handleNextPress = () => {
        if (step === 1) {
            if (!validateStep1()) {
                return;
            }
        } else if (step === 2) {
            if (!validateStep2()) {
                return;
            }
        }

        if (step <= 3) {
            setStep(step + 1);
        }
    };

    const handleBackPress = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const isEmpty = (val: any) =>
        val === null ||
        val === undefined ||
        val === '' ||
        (Array.isArray(val) && val.length === 0);

    // Check for duplicate properties
    const checkDuplicateProperty = async (): Promise<boolean> => {
        if (property) return false; // Skip duplicate check for edits

        try {
            const { result, error } = await apiRequest({
                endpoint: 'v1/properties',
                method: 'GET',
            });

            if (result && result.data) {
                const existingProperties = result.data;
                const isDuplicate = existingProperties.some((prop: any) => {
                    return (
                        prop.title?.toLowerCase().trim() === values.title?.toLowerCase().trim() &&
                        prop.address?.toLowerCase().trim() === values.address?.toLowerCase().trim() &&
                        prop.city?.toLowerCase().trim() === values.city?.toLowerCase().trim() &&
                        prop.zip_code?.trim() === values.zip_code?.trim()
                    );
                });

                if (isDuplicate) {
                    showErrorToast('A property with the same details already exists');
                    return true;
                }
            }

            if (error) {
                console.warn('Error checking duplicates:', error);
            }
        } catch (error) {
            console.warn('Error checking duplicates:', error);
        }

        return false;
    };

    const handleSubmit = async () => {
        // // Check for duplicates before submission
        // const isDuplicate = await checkDuplicateProperty();
        // if (isDuplicate) {
        //     return;
        // }

        const data = new FormData();

        Object.keys(values).forEach(key => {
            if (key !== "amenities" && key !== "images") {

                let value = values[key];

                if (key === "year_built" && value) {
                    value = new Date(value).getFullYear();
                }
                if (isEmpty(value)) return;
                data.append(key, value ? value : "");
            }
        });

        if (values.amenities && Array.isArray(values.amenities)) {
            values.amenities.forEach((item, index) => {
                data.append(`amenities[${index}]`, item);
            });
        }

        if (images && images.length > 0) {
            images.forEach((img, index) => {
                data.append(`property_images[${index}]`, {
                    uri: img.uri,
                    type: img.type || "image/jpeg",
                    name: img.fileName || `image_${index}.jpg`,
                });
            });
        }


        try {
            setLoading(true);
            const endPointCheck = property ? `v1/properties/${property.id}` : 'v1/properties';
            const { result, error } = await apiRequest({
                endpoint: endPointCheck,
                method: property ? 'PUT' : 'POST',
                data: data,
                config: {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            });

            if (result) {
                showSuccessToast(property ? 'Property updated successfully!' : 'Property added successfully!');
                // Navigate to home page
                navigation.navigate('UserBottomTab', { screen: 'Home' });
            }

            if (error) {
                showErrorToast(error || 'Failed to add property');
            }
            console.log('any', error, 'right', result);

        } catch (error) {
            showErrorToast('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };
    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <NMTextInput
                            label='Title'
                            placeholder='Enter'
                            multiline
                            value={values.title}
                            onChangeText={(text) => {
                                if (text.length <= 200) {
                                    handleChange('title', text);
                                }
                            }}
                            numberOfLines={2}
                            mainViewStyle={{ marginVertical: 10 }}
                            required
                            error={errors.title}
                            maxLength={200}
                        />
                        <NMTextInput
                            label='Description'
                            placeholder='Enter'
                            multiline
                            value={values.description}
                            onChangeText={(text) => {
                                if (text.length <= 2000) {
                                    handleChange('description', text);
                                }
                            }}
                            numberOfLines={5}
                            mainViewStyle={{ marginVertical: 10 }}
                            inputStyle={{ textAlignVertical: 'top', height: 120 }}
                            required
                            error={errors.description}
                            maxLength={2000}
                        />
                        <NMDropdown
                            label="Property Type"
                            placeholder="Select"
                            data={fieldOption?.propertyTypes || []}
                            value={values.property_type}
                            onChange={(value) => handleChange('property_type', value)}
                            mHorizontal={0}
                            isRequired
                            error={errors.property_type}
                        />
                        <NMDropdown
                            label="Property Category"
                            placeholder="Select"
                            data={propertyCategories}
                            value={values.property_category}
                            onChange={(value) => handleChange('property_category', value)}
                            mHorizontal={0}
                            isRequired
                            error={errors.property_category}
                        />
                        <View style={styles.inRowInputs}>
                            <NMTextInput
                                label="Size (SqFt)"
                                placeholder="Enter"
                                value={values.size}
                                onChangeText={(text) => {
                                    const numericValue = text.replace(/[^0-9.]/g, '');
                                    if (numericValue.length <= 15) {
                                        const error = numericValue && values.land_area ?
                                            (parseFloat(numericValue) >= parseFloat(values.land_area) ?
                                                'Size must be less than Land Area' : null) : null;
                                        handleChange('size', numericValue, error);
                                    }
                                }}
                                mainViewStyle={{ width: '46%' }}
                                required
                                error={errors.size}
                                keyboardType="numeric"
                                maxLength={15}
                            />
                            <NMTextInput
                                label="Land Area (SqFt)"
                                placeholder="Enter"
                                value={values.land_area}
                                onChangeText={(text) => handleNumericChange('land_area', text, 'Land Area')}
                                mainViewStyle={{ width: '46%' }}
                                required
                                error={errors.land_area}
                                keyboardType="numeric"
                                maxLength={15}
                            />
                        </View>
                        <View style={styles.inRowInputs}>
                            <NMTextInput
                                label="Rooms"
                                placeholder="Enter"
                                value={values.rooms}
                                onChangeText={(text) => {
                                    const numericValue = text.replace(/[^0-9]/g, '');
                                    if (numericValue.length <= 3) {
                                        handleChange('rooms', numericValue);
                                    }
                                }}
                                mainViewStyle={{ width: '46%' }}
                                keyboardType="numeric"
                                maxLength={3}
                                error={errors.rooms}
                            />
                            <NMTextInput
                                label="Bedrooms"
                                placeholder="Enter"
                                value={values.bedrooms}
                                onChangeText={(text) => {
                                    const numericValue = text.replace(/[^0-9]/g, '');
                                    if (numericValue.length <= 3) {
                                        const error = numericValue ?
                                            (values.rooms && parseInt(numericValue, 10) > parseInt(values.rooms, 10) ?
                                                'Bedrooms cannot exceed total Rooms' : null) : null;
                                        handleChange('bedrooms', numericValue, error);
                                    }
                                }}
                                mainViewStyle={{ width: '46%' }}
                                keyboardType="numeric"
                                maxLength={3}
                                error={errors.bedrooms}
                            />
                        </View>
                        <View style={styles.inRowInputs}>
                            <NMTextInput
                                label="Bathrooms"
                                placeholder="Enter"
                                value={values.bathrooms}
                                onChangeText={(text) => {
                                    const numericValue = text.replace(/[^0-9]/g, '');
                                    if (numericValue.length <= 3) {
                                        const error = numericValue ?
                                            (values.rooms && parseInt(numericValue, 10) > parseInt(values.rooms, 10) ?
                                                'Bathrooms cannot exceed total Rooms' : null) : null;
                                        handleChange('bathrooms', numericValue, error);
                                    }
                                }}
                                mainViewStyle={{ width: '46%' }}
                                keyboardType="numeric"
                                maxLength={3}
                                error={errors.bathrooms}
                            />
                            <NMTextInput
                                label="Garages"
                                placeholder="Enter"
                                value={values.garages}
                                onChangeText={(text) => {
                                    const numericValue = text.replace(/[^0-9]/g, '');
                                    if (numericValue.length <= 3) {
                                        handleChange('garages', numericValue);
                                    }
                                }}
                                mainViewStyle={{ width: '46%' }}
                                keyboardType="numeric"
                                maxLength={3}
                                error={errors.garages}
                            />
                        </View>
                        <View style={styles.inRowInputs}>
                            <NMTextInput
                                label="Garages Size (SqFt)"
                                placeholder="Enter"
                                value={values.garage_size}
                                onChangeText={(text) => {
                                    const numericValue = text.replace(/[^0-9.]/g, '');
                                    if (numericValue.length <= 15) {
                                        const error = numericValue && values.land_area ?
                                            (parseFloat(numericValue) >= parseFloat(values.land_area) ?
                                                'Garage Size must be less than Land Area' : null) : null;
                                        handleChange('garage_size', numericValue, error);
                                    }
                                }}
                                mainViewStyle={{ width: '46%' }}
                                keyboardType="numeric"
                                maxLength={15}
                                error={errors.garage_size}
                            />
                            <NMDatePicker
                                label="Year Built"
                                placeholder="Select"
                                value={values.year_built}
                                mode="year"
                                onChange={(value) => handleYearBuiltChange(value)}
                                isRequired
                                mHorizontal={0}
                                mainView={{ width: '46%' }}
                                error={errors.year_built}
                                maxDate="today"
                            />
                        </View>
                        {values.property_category !== 'Sell' && (<NMDateRangePicker
                            label="Set Availability"
                            placeholder="Select date range"
                            startDate={values.availability_start_date}
                            endDate={values.availability_end_date}
                            isRequired
                            onChangeRange={(start, end) => {
                                handleChange('availability_start_date', start);
                                handleChange('availability_end_date', end);
                            }}
                            mHorizontal={0}
                            error={errors.availability_end_date || errors.availability_start_date}
                        />)}
                        <NMTextInput
                            label='Full Address'
                            placeholder='Enter'
                            multiline
                            value={values.address}
                            onChangeText={(text) => {
                                if (text.length <= 500) {
                                    handleChange('address', text);
                                }
                            }}
                            numberOfLines={5}
                            mainViewStyle={{ marginVertical: 10 }}
                            required
                            error={errors.address}
                            maxLength={500}
                        />
                        <View style={styles.inRowInputs}>
                            <NMTextInput
                                label="Zip Code"
                                placeholder="Enter"
                                value={values.zip_code}
                                onChangeText={(text) => {
                                    if (text.length <= 10) {
                                        handleChange('zip_code', text);
                                    }
                                }}
                                mainViewStyle={{ width: '46%' }}
                                required
                                error={errors.zip_code}
                                maxLength={10}
                            />
                            <NMTextInput
                                label="City"
                                placeholder="Enter"
                                value={values.city}
                                onChangeText={(text) => {
                                    if (text.length <= 100) {
                                        handleChange('city', text);
                                    }
                                }}
                                mainViewStyle={{ width: '46%' }}
                                required
                                error={errors.city}
                                maxLength={100}
                            />
                        </View>
                        {/* <NMDropdown
                            label="State"
                            placeholder="Select"
                            data={stateOptions}
                            value={values.state}
                            onChange={(value) => handleChange('state', value)}
                            mHorizontal={0}
                            isRequired
                            error={errors.state}
                        /> */}
                        <NMTextInput
                            label='State/Province'
                            placeholder='Enter'
                            value={values.state}
                            onChangeText={(text) => {
                                if (text.length <= 100) {
                                    handleChange('state', text);
                                }
                            }}
                            mainViewStyle={{ marginVertical: 10 }}
                            required
                            error={errors.state}
                            maxLength={100}
                        />
                        <NMTextInput
                            label='Location'
                            placeholder='Enter'
                            multiline
                            value={values.location}
                            onChangeText={(text) => {
                                if (text.length <= 500) {
                                    handleChange('location', text);
                                }
                            }}
                            numberOfLines={5}
                            mainViewStyle={{ marginVertical: 10 }}
                            required
                            error={errors.location}
                            maxLength={500}
                        />
                        {values.property_category !== 'Sell' && (<>
                            <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                Booking Options
                            </NMText>
                            <View style={[styles.inRow, { justifyContent: 'space-between', marginVertical: 10 }]}>
                                <NMRadioButton
                                    label="Instant Booking"
                                    selected={values.booking_type === 'instant booking'}
                                    onPress={() => {
                                        handleChange('booking_type', 'instant booking');
                                    }}
                                    activeOuterColor={Colors.primary}
                                    innerColor={Colors.primary}
                                />
                                <NMRadioButton
                                    label="Approval Needed"
                                    selected={values.booking_type === 'approval needed'}
                                    onPress={() => {
                                        handleChange('booking_type', 'approval needed');
                                    }}
                                    activeOuterColor={Colors.primary}
                                    innerColor={Colors.primary}
                                />
                            </View>
                        </>)}
                        <NMButton
                            title='Next'
                            textColor={Colors.primary}
                            fontSize={14}
                            fontFamily='medium'
                            backgroundColor={Colors.white}
                            borderRadius={8}
                            style={{ borderColor: Colors.primary, borderWidth: 1, marginVertical: 10 }}
                            onPress={handleNextPress}
                        />
                    </>
                );

            case 2:
                return (
                    <>
                        <NMTextInput
                            label='Price'
                            placeholder='Enter'
                            value={values.price}
                            onChangeText={(text) => handleNumericChange('price', text, 'Price')}
                            mainViewStyle={{ marginVertical: 10 }}
                            required
                            error={errors.price}
                            keyboardType="numeric"
                            maxLength={15}
                        />
                        <View style={styles.termBox}>
                            <View style={[styles.inRow, { justifyContent: 'space-between' }]}>
                                <NMText fontSize={16} fontFamily="semiBold" color={Colors.textSecondary}>
                                    Terms & Rules
                                </NMText>
                            </View>
                            <NMTextInput
                                label='Terms & Rules'
                                placeholder='Enter'
                                multiline
                                value={values.terms}
                                onChangeText={(text) => {
                                    if (text.length <= 2000) {
                                        handleChange('terms', text);
                                    }
                                }}
                                numberOfLines={5}
                                mainViewStyle={{ marginVertical: 10 }}
                                inputStyle={{ textAlignVertical: 'top', height: 120 }}
                                maxLength={2000}
                                error={errors.terms}
                            />
                        </View>
                        <View style={styles.inRowBtn}>
                            <NMButton
                                title="Back"
                                backgroundColor={Colors.white}
                                textColor={Colors.primary}
                                borderRadius={8}
                                height={44}
                                width="46%"
                                style={{ borderColor: Colors.primary, borderWidth: 1 }}
                                onPress={handleBackPress}
                            />
                            <NMButton
                                title='Next'
                                textColor={Colors.white}
                                fontSize={14}
                                fontFamily='medium'
                                backgroundColor={Colors.primary}
                                borderRadius={8}
                                height={44}
                                width="46%"
                                onPress={handleNextPress}
                            />
                        </View>
                    </>
                );

            case 3:
                return (
                    <>
                        {fieldOption?.ameneties?.map((item: string, index: number) => {
                            const isSelected = values.amenities.includes(item);
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.inRow, { marginTop: 10 }]}
                                    onPress={() => toggleAmenity(item)}
                                >
                                    <CheckSquare2
                                        color={Colors.white}
                                        size={24}
                                        fill={isSelected ? Colors.primary : Colors.background}
                                    />
                                    <NMText
                                        fontSize={16}
                                        fontFamily="regular"
                                        color={Colors.textPrimary}
                                        style={{ marginLeft: 10 }}
                                    >
                                        {item}
                                    </NMText>
                                </TouchableOpacity>
                            );
                        })}
                        <View style={styles.inRowBtn}>
                            <NMButton
                                title="Back"
                                backgroundColor={Colors.white}
                                textColor={Colors.primary}
                                borderRadius={8}
                                height={44}
                                width="46%"
                                style={{ borderColor: Colors.primary, borderWidth: 1 }}
                                onPress={handleBackPress}
                            />
                            <NMButton
                                title={property ? "Update Property" : "Save & Submit"}
                                backgroundColor={Colors.primary}
                                textColor={Colors.white}
                                borderRadius={8}
                                height={44}
                                width="46%"
                                onPress={handleSubmit}
                                loading={loading}
                            />
                        </View>
                    </>
                );

            default:
                return null;
        }
    };

    const handleDeleteImage = (index: number, data: any) => {
        if (!data.property_id || !data.media_id) {
            const updated = images.filter((_, i) => i !== index);
            setImages(updated);
            return;
        }
        setSelectedImage({ index, data });
        setShowDelModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDelModal(false);
        setSelectedImage(null);
    };

    const handleYesPress = async () => {
        setLoading(true);
        if (selectedImage) {
            const { index, data } = selectedImage;

            const { result, error } = await apiRequest({
                endpoint: `v1/properties-media/${data.property_id}/${data.media_id}`,
                method: 'DELETE',
            });

            if (result) {
                const updated = images.filter((_, i) => i !== index);
                setImages(updated);
                showSuccessToast('Image deleted successfully');
            }

            if (error) {
                showErrorToast(error || 'Failed to delete image');
            }
        }
        setShowDelModal(false);
        setSelectedImage(null);
        setLoading(false);
    }


    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 20 }}
                keyboardShouldPersistTaps="handled"
            >

                <View style={styles.headerView}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity style={styles.backBox} onPress={() => navigation.goBack()}>
                            <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                        </TouchableOpacity>
                        <NMText
                            fontSize={20}
                            fontFamily="semiBold"
                            color={Colors.textSecondary}
                            style={styles.headerTitle}>
                            {property ? 'Edit Property' : 'Add Property'}
                        </NMText>
                    </View>
                    {/* <Image
                        source={require('../../../assets/icons/notification.png')}
                        style={styles.headerIcon}
                    /> */}
                </View>

                <View style={styles.contentBox}>
                    <TouchableOpacity
                        style={styles.imageSelectionBox}
                        activeOpacity={0.8}
                        onPress={selectImages}
                    >
                        <UploadCloud size={60} color={Colors.primary} strokeWidth={1.5} />
                        <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary}>
                            Drop your images here, or click to browse
                        </NMText>
                        <NMText fontSize={10} fontFamily="regular" color={Colors.textPrimary}>
                            Max file size 8MB (.jpeg / .png / .jpg)
                        </NMText>
                    </TouchableOpacity>

                    {imageError ? (
                        <NMText fontSize={12} fontFamily="regular" color={Colors.error} style={{ marginTop: 5 }}>
                            {imageError}
                        </NMText>
                    ) : null}

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.imagesViewBox}
                    >
                        {images.map((item, i) => (
                            <View style={styles.imageOuterBox} key={i}>
                                <Image
                                    source={{ uri: item?.uri }}
                                    style={styles.imageBox}
                                    resizeMode="cover"
                                />
                                <TouchableOpacity
                                    style={styles.deleteIcon}
                                    onPress={() => handleDeleteImage(i, item)}
                                >
                                    <Trash2Icon size={14} color={Colors.white} strokeWidth={2} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.contentBox}>
                    <View style={[styles.inRow, { justifyContent: "space-between" }]}>
                        <NMText fontSize={20} fontFamily="semiBold" color={Colors.textPrimary}>
                            {step === 1 ? 'Information' : step === 2 ? 'Price' : 'Amenities'}
                        </NMText>
                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                            Steps: <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary}>
                                {step.toString()}/3
                            </NMText>
                        </NMText>
                    </View>
                    {renderStepContent()}
                </View>

                <ConfirmationModal
                    visible={showDelModal}
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleYesPress}
                    title="Delete Image"
                    message="Are you sure you want to delete this image? This action cannot be undone."
                    buttonName="Yes, Delete"
                />

                <NMLoaderModal visible={loading} />
            </ScrollView>
        </NMSafeAreaWrapper>
    );
};

export default AddProperties;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    backBox: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        marginLeft: 10,
    },
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    contentBox: {
        marginTop: 20,
        marginHorizontal: '5%',
        padding: 16,
        backgroundColor: Colors.white,
        borderRadius: 12,
    },
    imageSelectionBox: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.background,
        borderStyle: 'dashed',
        borderColor: Colors.primary,
        borderWidth: 2,
        borderRadius: 12,
        padding: 16
    },
    imageBox: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagesViewBox: {
        flexDirection: 'row',
        marginTop: 16,
        justifyContent: 'space-between',
    },
    imageOuterBox: {
        width: 66,
        height: 66,
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: 8
    },
    deleteIcon: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: Colors.overlay,
    },
    inRowInputs: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mapStyle: {
        width: '100%',
        height: 200,
        marginTop: 20,
        borderRadius: 12,
        marginBottom: 20
    },
    termBox: {
        gap: 8,
        backgroundColor: Colors.background,
        padding: 16,
        borderRadius: 12
    },
    inRowBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});

// import React, { useEffect, useState, useCallback } from 'react';
// import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
// import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
// import NMText from '../../../components/common/NMText';
// import { Colors } from '../../../theme/colors';
// import { UploadCloud, Trash2Icon, CheckSquare2 } from 'lucide-react-native';
// import NMTextInput from '../../../components/common/NMTextInput';
// import NMButton from '../../../components/common/NMButton';
// import NMDropdown from '../../../components/common/NMDropdown';
// import NMDatePicker from '../../../components/common/NMDatePicker';
// import { pickImagesFromGallery } from '../../../utils/mediaPicker';
// import { apiRequest } from '../../../services/apiClient';
// import { useForm } from '../../../hooks/useForm';
// import { showErrorToast, showSuccessToast } from '../../../utils/toastService';

// const AddProperties: React.FC = ({ navigation, route }: any) => {
//     const { property } = route.params || {};
//     console.log('print property param', JSON.stringify(property));

//     const [step, setStep] = useState(1);
//     const [loading, setLoading] = useState(false);
//     const [fieldOption, setFieldOption] = useState<any>({});
//     const [images, setImages] = useState<any[]>([]);
//     const [imageError, setImageError] = useState('');
//     const { values, errors, handleChange, validate } = useForm({
//         title: '',
//         description: '',
//         property_type: '',
//         property_category: '',
//         size: '',
//         land_area: '',
//         rooms: '',
//         bedrooms: '',
//         bathrooms: '',
//         garages: '',
//         garage_size: '',
//         year_built: '',
//         address: '',
//         zip_code: '',
//         city: '',
//         state: '',
//         location: '',
//         price: '',
//         terms: '',
//         amenities: [] as string[],
//     });

//     const selectImages = async () => {
//         const result = await pickImagesFromGallery({
//             multiple: true,
//             includeBase64: false,
//         });
//         if (result) {
//             setImages(result);
//             setImageError('');
//         }
//     };

//     const propertyCategories = [
//         { label: 'Stay', value: 'Stay' },
//         { label: 'Sell', value: 'Sell' },
//         { label: 'Rent', value: 'Rent' },
//     ];

//     const stateOptions = [
//         { label: 'NY', value: 'NY' },
//         { label: 'CA', value: 'CA' },
//         { label: 'TX', value: 'TX' },
//     ];

//     const toggleAmenity = useCallback((item: string) => {
//         handleChange('amenities',
//             values.amenities.includes(item)
//                 ? values.amenities.filter((i: string) => i !== item)
//                 : [...values.amenities, item]
//         );
//     }, [values.amenities, handleChange]);

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

//     const validateStep1 = () => {
//         const isValid = validate({
//             title: (val) => !val ? 'Title is required' : null,
//             description: (val) => !val ? 'Description is required' : null,
//             property_type: (val) => !val ? 'Property Type is required' : null,
//             property_category: (val) => !val ? 'Property Category is required' : null,
//             size: (val) => !val ? 'Size is required' : null,
//             land_area: (val) => !val ? 'Land Area is required' : null,
//             year_built: (val) => !val ? 'Year Built is required' : null,
//             address: (val) => !val ? 'Full Address is required' : null,
//             zip_code: (val) => !val ? 'Zip Code is required' : null,
//             city: (val) => !val ? 'City is required' : null,
//             state: (val) => !val ? 'State is required' : null,
//             location: (val) => !val ? 'Location is required' : null,
//         });

//         // Validate images
//         if (images.length === 0) {
//             setImageError('Please select at least one image');
//             return false;
//         } else {
//             setImageError('');
//         }

//         return isValid;
//     };

//     const validateStep2 = () => {
//         return validate({
//             price: (val) => !val ? 'Price is required' : null,
//         });
//     };

//     const handleNextPress = () => {
//         if (step === 1) {
//             if (!validateStep1()) {
//                 return;
//             }
//         } else if (step === 2) {
//             if (!validateStep2()) {
//                 return;
//             }
//         }

//         if (step <= 3) {
//             setStep(step + 1);
//         }
//     };

//     const handleBackPress = () => {
//         if (step > 1) {
//             setStep(step - 1);
//         }
//     };

//     const handleSubmit = async () => {
//         const data = new FormData();

//         Object.keys(values).forEach(key => {
//             if (key !== "amenities" && key !== "images") {

//                 let value = values[key];

//                 if (key === "year_built" && value) {
//                     value = new Date(value).getFullYear();
//                 }

//                 data.append(key, value ? value : "");
//             }
//         });

//         if (values.amenities && Array.isArray(values.amenities)) {
//             values.amenities.forEach((item, index) => {
//                 data.append(`amenities[${index}]`, item);
//             });
//         }

//         if (images && images.length > 0) {
//             images.forEach((img, index) => {
//                 data.append(`property_images[${index}]`, {
//                     uri: img.uri,
//                     type: img.type || "image/jpeg",
//                     name: img.fileName || `image_${index}.jpg`,
//                 });
//             });
//         }

//         try {
//             setLoading(true);
//             const { result, error } = await apiRequest({
//                 endpoint: 'v1/properties',
//                 method: 'POST',
//                 data: data,
//                 config: {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 }
//             });

//             if (result) {
//                 showSuccessToast('Property added successfully!');
//             }

//             if (error) {
//                 showErrorToast(error || 'Failed to add property');
//             }
//         } catch (error) {
//             showErrorToast('An unexpected error occurred');
//         } finally {
//             setLoading(false);
//         }
//     };
//     const renderStepContent = () => {
//         switch (step) {
//             case 1:
//                 return (
//                     <>
//                         <NMTextInput
//                             label='Title'
//                             placeholder='Enter'
//                             multiline
//                             value={values.title}
//                             onChangeText={(text) => handleChange('title', text)}
//                             numberOfLines={2}
//                             mainViewStyle={{ marginVertical: 10 }}
//                             required
//                             error={errors.title}
//                         />
//                         <NMTextInput
//                             label='Description'
//                             placeholder='Enter'
//                             multiline
//                             value={values.description}
//                             onChangeText={(text) => handleChange('description', text)}
//                             numberOfLines={5}
//                             mainViewStyle={{ marginVertical: 10 }}
//                             inputStyle={{ textAlignVertical: 'top', height: 120 }}
//                             required
//                             error={errors.description}
//                         />
//                         <NMDropdown
//                             label="Property Type"
//                             placeholder="Select"
//                             data={fieldOption?.propertyTypes || []}
//                             value={values.property_type}
//                             onChange={(value) => handleChange('property_type', value)}
//                             mHorizontal={0}
//                             isRequired
//                             error={errors.property_type}
//                         />
//                         <NMDropdown
//                             label="Property Category"
//                             placeholder="Select"
//                             data={propertyCategories}
//                             value={values.property_category}
//                             onChange={(value) => handleChange('property_category', value)}
//                             mHorizontal={0}
//                             isRequired
//                             error={errors.property_category}
//                         />
//                         <View style={styles.inRowInputs}>
//                             <NMTextInput
//                                 label="Size (SqFt)"
//                                 placeholder="Enter"
//                                 value={values.size}
//                                 onChangeText={(text) => handleChange('size', text)}
//                                 mainViewStyle={{ width: '46%' }}
//                                 required
//                                 error={errors.size}
//                             />
//                             <NMTextInput
//                                 label="Land Area (SqFt)"
//                                 placeholder="Enter"
//                                 value={values.land_area}
//                                 onChangeText={(text) => handleChange('land_area', text)}
//                                 mainViewStyle={{ width: '46%' }}
//                                 required
//                                 error={errors.land_area}
//                             />
//                         </View>
//                         <View style={styles.inRowInputs}>
//                             <NMTextInput
//                                 label="Rooms"
//                                 placeholder="Enter"
//                                 value={values.rooms}
//                                 onChangeText={(text) => handleChange('rooms', text)}
//                                 mainViewStyle={{ width: '46%' }}
//                             />
//                             <NMTextInput
//                                 label="Bedrooms"
//                                 placeholder="Enter"
//                                 value={values.bedrooms}
//                                 onChangeText={(text) => handleChange('bedrooms', text)}
//                                 mainViewStyle={{ width: '46%' }}
//                             />
//                         </View>
//                         <View style={styles.inRowInputs}>
//                             <NMTextInput
//                                 label="Bathrooms"
//                                 placeholder="Enter"
//                                 value={values.bathrooms}
//                                 onChangeText={(text) => handleChange('bathrooms', text)}
//                                 mainViewStyle={{ width: '46%' }}
//                             />
//                             <NMTextInput
//                                 label="Garages"
//                                 placeholder="Enter"
//                                 value={values.garages}
//                                 onChangeText={(text) => handleChange('garages', text)}
//                                 mainViewStyle={{ width: '46%' }}
//                             />
//                         </View>
//                         <View style={styles.inRowInputs}>
//                             <NMTextInput
//                                 label="Garages Size (SqFt)"
//                                 placeholder="Enter"
//                                 value={values.garage_size}
//                                 onChangeText={(text) => handleChange('garage_size', text)}
//                                 mainViewStyle={{ width: '46%' }}
//                             />
//                             <NMDatePicker
//                                 label="Year Built"
//                                 placeholder="Select"
//                                 value={values.year_built}
//                                 onChange={(value) => handleChange('year_built', value)}
//                                 isRequired
//                                 mHorizontal={0}
//                                 mainView={{ width: '46%' }}
//                                 error={errors.year_built}
//                             />
//                         </View>
//                         <NMTextInput
//                             label='Full Address'
//                             placeholder='Enter'
//                             multiline
//                             value={values.address}
//                             onChangeText={(text) => handleChange('address', text)}
//                             numberOfLines={5}
//                             mainViewStyle={{ marginVertical: 10 }}
//                             required
//                             error={errors.address}
//                         />
//                         <View style={styles.inRowInputs}>
//                             <NMTextInput
//                                 label="Zip Code"
//                                 placeholder="Enter"
//                                 value={values.zip_code}
//                                 onChangeText={(text) => handleChange('zip_code', text)}
//                                 mainViewStyle={{ width: '46%' }}
//                                 required
//                                 error={errors.zip_code}
//                             />
//                             <NMTextInput
//                                 label="City"
//                                 placeholder="Enter"
//                                 value={values.city}
//                                 onChangeText={(text) => handleChange('city', text)}
//                                 mainViewStyle={{ width: '46%' }}
//                                 required
//                                 error={errors.city}
//                             />
//                         </View>
//                         <NMDropdown
//                             label="State"
//                             placeholder="Select"
//                             data={stateOptions}
//                             value={values.state}
//                             onChange={(value) => handleChange('state', value)}
//                             mHorizontal={0}
//                             isRequired
//                             error={errors.state}
//                         />
//                         <NMTextInput
//                             label='Location'
//                             placeholder='Enter'
//                             multiline
//                             value={values.location}
//                             onChangeText={(text) => handleChange('location', text)}
//                             numberOfLines={5}
//                             mainViewStyle={{ marginVertical: 10 }}
//                             required
//                             error={errors.location}
//                         />
//                         <NMButton
//                             title='Next'
//                             textColor={Colors.primary}
//                             fontSize={14}
//                             fontFamily='medium'
//                             backgroundColor={Colors.white}
//                             borderRadius={8}
//                             style={{ borderColor: Colors.primary, borderWidth: 1, marginVertical: 10 }}
//                             onPress={handleNextPress}
//                         />
//                     </>
//                 );

//             case 2:
//                 return (
//                     <>
//                         <NMTextInput
//                             label='Price'
//                             placeholder='Enter'
//                             value={values.price}
//                             onChangeText={(text) => handleChange('price', text)}
//                             mainViewStyle={{ marginVertical: 10 }}
//                             required
//                             error={errors.price}
//                         />
//                         <View style={styles.termBox}>
//                             <View style={[styles.inRow, { justifyContent: 'space-between' }]}>
//                                 <NMText fontSize={16} fontFamily="semiBold" color={Colors.textSecondary}>
//                                     Terms & Rules
//                                 </NMText>
//                             </View>
//                             <NMTextInput
//                                 label='Terms & Rules'
//                                 placeholder='Enter'
//                                 multiline
//                                 value={values.terms}
//                                 onChangeText={(text) => handleChange('terms', text)}
//                                 numberOfLines={5}
//                                 mainViewStyle={{ marginVertical: 10 }}
//                                 inputStyle={{ textAlignVertical: 'top', height: 120 }}
//                             />
//                         </View>
//                         <View style={styles.inRowBtn}>
//                             <NMButton
//                                 title="Back"
//                                 backgroundColor={Colors.white}
//                                 textColor={Colors.primary}
//                                 borderRadius={8}
//                                 height={44}
//                                 width="46%"
//                                 style={{ borderColor: Colors.primary, borderWidth: 1 }}
//                                 onPress={handleBackPress}
//                             />
//                             <NMButton
//                                 title='Next'
//                                 textColor={Colors.white}
//                                 fontSize={14}
//                                 fontFamily='medium'
//                                 backgroundColor={Colors.primary}
//                                 borderRadius={8}
//                                 height={44}
//                                 width="46%"
//                                 onPress={handleNextPress}
//                             />
//                         </View>
//                     </>
//                 );

//             case 3:
//                 return (
//                     <>
//                         {fieldOption?.ameneties?.map((item: string, index: number) => {
//                             const isSelected = values.amenities.includes(item);
//                             return (
//                                 <TouchableOpacity
//                                     key={index}
//                                     style={[styles.inRow, { marginTop: 10 }]}
//                                     onPress={() => toggleAmenity(item)}
//                                 >
//                                     <CheckSquare2
//                                         color={Colors.white}
//                                         size={24}
//                                         fill={isSelected ? Colors.primary : Colors.background}
//                                     />
//                                     <NMText
//                                         fontSize={16}
//                                         fontFamily="regular"
//                                         color={Colors.textPrimary}
//                                         style={{ marginLeft: 10 }}
//                                     >
//                                         {item}
//                                     </NMText>
//                                 </TouchableOpacity>
//                             );
//                         })}
//                         <View style={styles.inRowBtn}>
//                             <NMButton
//                                 title="Back"
//                                 backgroundColor={Colors.white}
//                                 textColor={Colors.primary}
//                                 borderRadius={8}
//                                 height={44}
//                                 width="46%"
//                                 style={{ borderColor: Colors.primary, borderWidth: 1 }}
//                                 onPress={handleBackPress}
//                             />
//                             <NMButton
//                                 title="Save & Submit"
//                                 backgroundColor={Colors.primary}
//                                 textColor={Colors.white}
//                                 borderRadius={8}
//                                 height={44}
//                                 width="46%"
//                                 onPress={handleSubmit}
//                                 loading={loading}
//                             />
//                         </View>
//                     </>
//                 );

//             default:
//                 return null;
//         }
//     };

//     return (
//         <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
//             <ScrollView
//                 style={styles.container}
//                 contentContainerStyle={{ paddingBottom: 20 }}
//                 keyboardShouldPersistTaps="handled"
//             >

//                 <View style={styles.headerView}>
//                     <View style={styles.headerLeft}>
//                         <Image
//                             source={require('../../../assets/icons/drawer.png')}
//                             style={styles.headerIcon}
//                         />
//                         <NMText
//                             fontSize={20}
//                             fontFamily="semiBold"
//                             color={Colors.textSecondary}
//                             style={styles.headerTitle}>
//                             {property ? 'Edit Property' : 'Add Property'}
//                         </NMText>
//                     </View>
//                     <Image
//                         source={require('../../../assets/icons/notification.png')}
//                         style={styles.headerIcon}
//                     />
//                 </View>

//                 <View style={styles.contentBox}>
//                     <TouchableOpacity
//                         style={styles.imageSelectionBox}
//                         activeOpacity={0.8}
//                         onPress={selectImages}
//                     >
//                         <UploadCloud size={60} color={Colors.primary} strokeWidth={1.5} />
//                         <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary}>
//                             Drop your images here, or click to browse
//                         </NMText>
//                         <NMText fontSize={10} fontFamily="regular" color={Colors.textPrimary}>
//                             Max file size 8MB (.jpeg / .png / .jpg)
//                         </NMText>
//                     </TouchableOpacity>

//                     {imageError ? (
//                         <NMText fontSize={12} fontFamily="regular" color={Colors.error} style={{ marginTop: 5 }}>
//                             {imageError}
//                         </NMText>
//                     ) : null}

//                     <ScrollView
//                         horizontal
//                         showsHorizontalScrollIndicator={false}
//                         contentContainerStyle={styles.imagesViewBox}
//                     >
//                         {images.map((item, i) => (
//                             <View style={styles.imageOuterBox} key={i}>
//                                 <Image
//                                     source={{ uri: item?.uri }}
//                                     style={styles.imageBox}
//                                     resizeMode="cover"
//                                 />
//                                 <TouchableOpacity
//                                     style={styles.deleteIcon}
//                                     onPress={() => {
//                                         const updated = images.filter((_, index) => index !== i);
//                                         setImages(updated);
//                                     }}
//                                 >
//                                     <Trash2Icon size={14} color={Colors.white} strokeWidth={2} />
//                                 </TouchableOpacity>
//                             </View>
//                         ))}
//                     </ScrollView>
//                 </View>

//                 <View style={styles.contentBox}>
//                     <View style={[styles.inRow, { justifyContent: "space-between" }]}>
//                         <NMText fontSize={20} fontFamily="semiBold" color={Colors.textPrimary}>
//                             {step === 1 ? 'Information' : step === 2 ? 'Price' : 'Amenities'}
//                         </NMText>
//                         <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
//                             Steps: <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary}>
//                                 {step.toString()}/3
//                             </NMText>
//                         </NMText>
//                     </View>
//                     {renderStepContent()}
//                 </View>
//             </ScrollView>
//         </NMSafeAreaWrapper>
//     );
// };

// export default AddProperties;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: Colors.background,
//     },
//     headerView: {
//         width: '100%',
//         backgroundColor: Colors.white,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: '5%',
//         paddingVertical: 20,
//         borderBottomLeftRadius: 20,
//         borderBottomRightRadius: 20,
//     },
//     headerLeft: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     headerTitle: {
//         marginLeft: 10,
//     },
//     headerIcon: {
//         width: 30,
//         height: 30,
//         resizeMode: 'contain',
//     },
//     contentBox: {
//         marginTop: 20,
//         marginHorizontal: '5%',
//         padding: 16,
//         backgroundColor: Colors.white,
//         borderRadius: 12,
//     },
//     imageSelectionBox: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         gap: 8,
//         backgroundColor: Colors.background,
//         borderStyle: 'dashed',
//         borderColor: Colors.primary,
//         borderWidth: 2,
//         borderRadius: 12,
//         padding: 16
//     },
//     imageBox: {
//         width: '100%',
//         height: '100%',
//         resizeMode: 'cover',
//     },
//     imagesViewBox: {
//         flexDirection: 'row',
//         marginTop: 16,
//         justifyContent: 'space-between',
//     },
//     imageOuterBox: {
//         width: 66,
//         height: 66,
//         borderRadius: 12,
//         overflow: 'hidden',
//         marginRight: 8
//     },
//     deleteIcon: {
//         position: 'absolute',
//         top: 4,
//         right: 4,
//         width: 24,
//         height: 24,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 12,
//         backgroundColor: Colors.overlay,
//     },
//     inRowInputs: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//     },
//     inRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     mapStyle: {
//         width: '100%',
//         height: 200,
//         marginTop: 20,
//         borderRadius: 12,
//         marginBottom: 20
//     },
//     termBox: {
//         gap: 8,
//         backgroundColor: Colors.background,
//         padding: 16,
//         borderRadius: 12
//     },
//     inRowBtn: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginTop: 20,
//     },
// });