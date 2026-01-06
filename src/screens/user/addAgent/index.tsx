import { Image, ScrollView, StyleSheet, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper'
import { Colors } from '../../../theme/colors'
import { CameraIcon, ChevronDown, ChevronLeft } from 'lucide-react-native'
import NMText from '../../../components/common/NMText'
import NMTextInput from '../../../components/common/NMTextInput'
import NMButton from '../../../components/common/NMButton'
import { pickImagesFromGallery } from '../../../utils/mediaPicker'
import { Asset } from 'react-native-image-picker'
import { apiRequest } from '../../../services/apiClient'
import { showErrorToast, showSuccessToast } from '../../../utils/toastService'
import { useNavigation } from '@react-navigation/native'

interface AgentFormData {
    first_name: string
    email: string
    mobile: string
    website: string
    address: string
    zip_code: string
    city: string
    state: string
    about: string
    facebook: string
    instagram: string
    twitter: string
}

interface Props {
    route?: {
        params?: {
            agent?: AgentFormData & { profile_image?: string }
            isEdit?: boolean
        }
    }
}

const AddAgent: React.FC<Props> = ({ route }) => {
    const navigation = useNavigation()
    const isEditMode = route?.params?.isEdit || false
    const agentData = route?.params?.agent

    const [profileImage, setProfileImage] = useState<Asset | null>(null)
    const [existingImageUrl, setExistingImageUrl] = useState<string>('')
    const [loader, setLoader] = useState(false)
    const [formData, setFormData] = useState<AgentFormData>({
        first_name: '',
        email: '',
        mobile: '',
        website: '',
        address: '',
        zip_code: '',
        city: '',
        state: '',
        about: '',
        facebook: '',
        instagram: '',
        twitter: ''
    })
    const [errors, setErrors] = useState<Partial<AgentFormData>>({})

    useEffect(() => {
        if (isEditMode && agentData) {
            setFormData({
                first_name: agentData?.user?.first_name || '',
                email: agentData?.user?.email || '',
                mobile: agentData?.user?.mobile || '',
                website: agentData.website || '',
                address: agentData?.user?.address || '',
                zip_code: agentData.zip_code || '',
                city: agentData.city || '',
                state: agentData.state || '',
                about: agentData.about || '',
                facebook: agentData.facebook || '',
                instagram: agentData.instagram || '',
                twitter: agentData.twitter || ''
            })
            if (agentData?.user?.profile_image_url) {
                setExistingImageUrl(agentData?.user?.profile_image_url)
            }
        }
    }, [isEditMode, agentData])

    // Single function to update any form field
    const updateField = (field: keyof AgentFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const handleImagePick = async () => {
        const images = await pickImagesFromGallery({ multiple: false })
        if (images && images.length > 0) {
            setProfileImage(images[0])
            setExistingImageUrl('')
        }
    }

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^[0-9]{10,15}$/
        return phoneRegex.test(phone.replace(/[-\s]/g, ''))
    }

    const validateZip = (zip: string): boolean => {
        const zipRegex = /^[0-9]{5,6}$/
        return zipRegex.test(zip)
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<AgentFormData> = {}

        if (!formData.first_name.trim()) {
            newErrors.first_name = 'Name is required'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email'
        }

        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile is required'
        } else if (!validatePhone(formData.mobile)) {
            newErrors.mobile = 'Please enter a valid mobile number'
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required'
        }

        if (!formData.zip_code.trim()) {
            newErrors.zip_code = 'Zip code is required'
        } else if (!validateZip(formData.zip_code)) {
            newErrors.zip_code = 'Please enter a valid zip code'
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required'
        }

        if (!formData.state.trim()) {
            newErrors.state = 'State is required'
        }

        if (!formData.about.trim()) {
            newErrors.about = 'About is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSave = async () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please fill all required fields correctly')
            return
        }

        const data = new FormData()

        data.append('first_name', formData.first_name)
        data.append('email', formData.email)
        data.append('mobile', formData.mobile)
        data.append('website', formData.website)
        data.append('address', formData.address)
        data.append('zip_code', formData.zip_code)
        data.append('city', formData.city)
        data.append('state', formData.state)
        data.append('about', formData.about)
        data.append('facebook', formData.facebook)
        data.append('instagram', formData.instagram)
        data.append('twitter', formData.twitter)

        if (profileImage?.uri) {
            const imageFile = {
                uri: profileImage.uri,
                type: profileImage.type || 'image/jpeg',
                name: profileImage.fileName || `profile_${Date.now()}.jpg`,
            }
            data.append('profile_image', imageFile as any)
        }

        try {
            setLoader(true)
            const { result, error } = await apiRequest({
                endpoint: isEditMode ? `v1/agent/${agentData?.id}` : 'v1/agent',
                method: isEditMode ? 'PUT' : 'POST',
                data: data,
                config: {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            })

            setLoader(false)

            if (error) {
                console.log('API Error:', error)
                showErrorToast(`Failed to ${isEditMode ? 'update' : 'add'} agent - ${error}`)
                return
            }

            showSuccessToast(`Agent ${isEditMode ? 'updated' : 'added'} successfully!`)
            handleCancel()
            navigation.goBack()
            // Navigate back here if needed
        } catch (err) {
            setLoader(false)
            showErrorToast(`Failed to ${isEditMode ? 'update' : 'add'} agent`)
            console.error('Add/Edit Agent Error:', err)
        }
    }

    const handleCancel = () => {
        setFormData({
            first_name: '',
            email: '',
            mobile: '',
            website: '',
            address: '',
            zip_code: '',
            city: '',
            state: '',
            about: '',
            facebook: '',
            instagram: '',
            twitter: ''
        })
        setProfileImage(null)
        setExistingImageUrl('')
        setErrors({})
    }

    // Determine which image to show
    const displayImage = profileImage?.uri || existingImageUrl

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={styles.headerView}>
                    <View style={styles.inRow}>
                        <TouchableOpacity style={styles.backBox}>
                            <ChevronLeft color={Colors.black} size={24} strokeWidth={2} />
                        </TouchableOpacity>
                        <View style={styles.titleView}>
                            <NMText fontSize={20} fontFamily='semiBold' color={Colors.textSecondary}>
                                {isEditMode ? 'Edit Agent' : 'Add Agent'}
                            </NMText>
                        </View>
                    </View>
                    {/* <View style={styles.inRow}>
                        <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} />
                    </View> */}
                </View>
                <View style={styles.contentBox}>
                    <NMText fontSize={20} fontFamily='semiBold' color={Colors.textPrimary}>
                        Account Settings
                    </NMText>

                    <View style={styles.imageAvatar}>
                        {displayImage && (
                            <Image
                                source={{ uri: displayImage }}
                                style={styles.imageAvatar}
                                resizeMode='cover'
                            />
                        )}
                    </View>
                    <TouchableOpacity style={styles.pickerView} onPress={handleImagePick}>
                        <CameraIcon color={Colors.white} size={18} strokeWidth={2} />
                    </TouchableOpacity>
                    <View style={{ height: 20 }} />

                    <NMTextInput
                        label='Name'
                        placeholder='Enter your name'
                        required
                        value={formData.first_name}
                        onChangeText={(value) => updateField('first_name', value)}
                        error={errors.first_name}
                    />

                    <NMTextInput
                        label='Email'
                        placeholder='Enter your email'
                        required
                        inputType='email'
                        value={formData.email}
                        onChangeText={(value) => updateField('email', value)}
                        error={errors.email}
                    />

                    <NMTextInput
                        label='Mobile'
                        placeholder='Enter your mobile'
                        required
                        value={formData.mobile}
                        onChangeText={(value) => updateField('mobile', value)}
                        error={errors.mobile}
                        keyboardType='phone-pad'
                    />

                    <NMTextInput
                        label='Website'
                        placeholder='Enter your website'
                        value={formData.website}
                        onChangeText={(value) => updateField('website', value)}
                    />

                    <NMTextInput
                        label='Address'
                        placeholder='Enter your address'
                        required
                        value={formData.address}
                        onChangeText={(value) => updateField('address', value)}
                        error={errors.address}
                    />

                    <View style={[styles.inRow, { justifyContent: 'space-between' }]}>
                        <NMTextInput
                            label='Zip Code'
                            placeholder='Enter your zip'
                            required
                            mainViewStyle={{ width: '48%' }}
                            value={formData.zip_code}
                            onChangeText={(value) => updateField('zip_code', value)}
                            error={errors.zip_code}
                            keyboardType='numeric'
                        />
                        <NMTextInput
                            label='City'
                            placeholder='Select'
                            required
                            rightIcon={<ChevronDown color={Colors.border} size={18} strokeWidth={2} />}
                            mainViewStyle={{ width: '48%' }}
                            value={formData.city}
                            onChangeText={(value) => updateField('city', value)}
                            error={errors.city}
                        />
                    </View>

                    <NMTextInput
                        label='State'
                        placeholder='Select'
                        required
                        rightIcon={<ChevronDown color={Colors.border} size={18} strokeWidth={2} />}
                        value={formData.state}
                        onChangeText={(value) => updateField('state', value)}
                        error={errors.state}
                    />

                    <NMTextInput
                        label='About'
                        placeholder='Enter your about'
                        required
                        multiline
                        numberOfLines={5}
                        inputStyle={{ height: 100, textAlignVertical: 'top' }}
                        value={formData.about}
                        onChangeText={(value) => updateField('about', value)}
                        error={errors.about}
                    />

                    <NMText fontSize={16} fontFamily='semiBold' color={Colors.textPrimary} style={{ marginTop: 20 }}>
                        Social Media
                    </NMText>

                    <NMTextInput
                        label='Facebook'
                        placeholder='Enter'
                        value={formData.facebook}
                        onChangeText={(value) => updateField('facebook', value)}
                    />

                    <NMTextInput
                        label='Instagram'
                        placeholder='Enter'
                        value={formData.instagram}
                        onChangeText={(value) => updateField('instagram', value)}
                    />

                    <NMTextInput
                        label='Twitter'
                        placeholder='Enter'
                        value={formData.twitter}
                        onChangeText={(value) => updateField('twitter', value)}
                    />

                    <View style={[styles.inRow, { justifyContent: 'space-between', marginTop: 20 }]}>
                        <NMButton
                            title='Cancel'
                            textColor={Colors.primary}
                            backgroundColor='transparent'
                            borderRadius={8}
                            width={'48%'}
                            style={{ borderWidth: 1, borderColor: Colors.primary }}
                            onPress={handleCancel}
                            disabled={loader}
                        />
                        <NMButton
                            title={'Save'}
                            textColor={Colors.white}
                            backgroundColor={Colors.primary}
                            borderRadius={8}
                            width={'48%'}
                            onPress={handleSave}
                            disabled={loader}
                            loading={loader}
                        />
                    </View>
                </View>
            </ScrollView>
        </NMSafeAreaWrapper>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBox: {
        padding: 8,
    },
    titleView: {
        marginLeft: 8,
    },
    headerIcon: {
        width: 24,
        height: 24,
    },
    contentBox: {
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    imageAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.background,
        alignSelf: 'center',
        overflow: 'hidden',
    },
    pickerView: {
        position: 'absolute',
        right: '35%',
        top: 120,
        backgroundColor: Colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.white,
    },
})

export default AddAgent