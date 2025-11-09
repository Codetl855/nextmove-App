import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import NMText from '../../../components/common/NMText';
import { Colors } from '../../../theme/colors';
import { UploadCloud, Trash2Icon } from 'lucide-react-native'
import NMTextInput from '../../../components/common/NMTextInput';
import { LocateIcon, CheckSquare2 } from 'lucide-react-native'
import NMButton from '../../../components/common/NMButton';

const AddProperties: React.FC = () => {

    const [step, setStep] = useState(1)
    const dummy4Images = [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    ]

    const handleNextPress = () => {
        if (step <= 3) {
            setStep(step + 1)
        }
    }

    const StepOne = () => (
        <>
            <NMTextInput
                label='Title'
                placeholder='Enter'
                multiline
                numberOfLines={5}
                mainViewStyle={{ marginVertical: 10 }}
            />

            <NMTextInput
                label='Description'
                placeholder='Enter'
                multiline
                numberOfLines={5}
                mainViewStyle={{ marginVertical: 10 }}
                inputStyle={{ textAlignVertical: 'top', height: 120 }}
            />

            <View style={styles.inRowInputs}>
                <NMTextInput
                    label="Property Type"
                    placeholder="Enter"
                    mainViewStyle={{ width: '46%' }}
                />
                <NMTextInput
                    label="Property Status"
                    placeholder="Enter"
                    mainViewStyle={{ width: '46%' }}
                />
            </View>


            <View style={styles.inRowInputs}>
                <NMTextInput
                    label="Property Label"
                    placeholder="Enter"
                    mainViewStyle={{ width: '46%' }}
                />
                <NMTextInput
                    label="Size (SqFt)"
                    placeholder="Enter"
                    mainViewStyle={{ width: '46%' }}
                />
            </View>

            <View style={styles.inRowInputs}>
                <NMTextInput
                    label="Land Area (SqFt)"
                    placeholder="Enter"
                    mainViewStyle={{ width: '46%' }}
                />
                <NMTextInput
                    label="Property ID"
                    placeholder="Enter"
                    mainViewStyle={{ width: '46%' }}
                />
            </View>

            <View style={styles.inRowInputs}>
                <NMTextInput
                    label="Rooms"
                    placeholder="Enter"
                    mainViewStyle={{ width: '46%' }}
                />
                <NMTextInput
                    label="Bedrooms"
                    placeholder="Enter"
                    mainViewStyle={{ width: '46%' }}
                />
            </View>

            <View style={styles.inRowInputs}>
                <NMTextInput
                    label="Bathrooms"
                    placeholder="Enter"
                    mainViewStyle={{ width: '46%' }}
                />
                <NMTextInput
                    label="Garages"
                    placeholder="Enter"
                    mainViewStyle={{ width: '46%' }}
                />
            </View>

            <View style={styles.inRowInputs}>
                <NMTextInput
                    label="Garages Size (SqFt)"
                    placeholder="Enter"
                    mainViewStyle={{ width: '46%' }}
                />
                <NMTextInput
                    label="Year Built"
                    placeholder="Enter"
                    mainViewStyle={{ width: '46%' }}
                />
            </View>

            <NMTextInput
                label='Full Address'
                placeholder='Enter'
                multiline
                numberOfLines={5}
                mainViewStyle={{ marginVertical: 10 }}
            />

            <View style={styles.inRowInputs}>
                <NMTextInput
                    label="Zip Code"
                    placeholder="Enter"
                    mainViewStyle={{ width: '46%' }}
                />
                <NMTextInput
                    label="City"
                    placeholder="Enter"
                    mainViewStyle={{ width: '46%' }}
                />
            </View>

            <NMTextInput
                label='State'
                placeholder='Enter'
                multiline
                numberOfLines={5}
                mainViewStyle={{ marginVertical: 10 }}
            />

            <NMTextInput
                label='Location'
                placeholder='Enter'
                multiline
                numberOfLines={5}
                rightIcon={<LocateIcon color={Colors.primary} size={24} />}
                mainViewStyle={{ marginVertical: 10 }}
            />

            <Image source={require('../../../assets/images/mapImage.png')} style={styles.mapStyle} />

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
    )

    const StepTwo = () => (
        <>
            <NMTextInput
                label='Price'
                placeholder='Enter'
                multiline
                numberOfLines={5}
                mainViewStyle={{ marginVertical: 10 }}
            />
            <View style={styles.termBox}>
                <View style={[styles.inRow, { justifyContent: 'space-between' }]}>
                    <NMText fontSize={16} fontFamily="semiBold" color={Colors.textSecondary}>
                        Terms & Rules
                    </NMText>
                    <View style={styles.inRow}>
                        <CheckSquare2 color={Colors.whitEC} size={24} fill={Colors.primary} />
                        <NMText fontSize={14} fontFamily="regular" color={Colors.textSecondary}>
                            Allow Auction
                        </NMText>
                    </View>
                </View>
                <NMTextInput
                    label='Terms & Rules'
                    placeholder='Enter'
                    multiline
                    numberOfLines={5}
                    mainViewStyle={{ marginVertical: 10 }}
                    inputStyle={{ textAlignVertical: 'top', height: 120 }}
                />
            </View>
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
    )

    const StepThree = () => (
        <>
            <View style={[styles.inRow, { marginTop: 10 }]}>
                <CheckSquare2 color={Colors.white} size={24} fill={Colors.primary} />
                <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                    Step-free access
                </NMText>
            </View>
            <View style={[styles.inRow, { marginTop: 10 }]}>
                <CheckSquare2 color={Colors.white} size={24} fill={Colors.background} />
                <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                    Disabled parking spot
                </NMText>
            </View>
            <View style={[styles.inRow, { marginTop: 10 }]}>
                <CheckSquare2 color={Colors.white} size={24} fill={Colors.background} />
                <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                    Guest entrance wider than 32 inches
                </NMText>
            </View>
            <View style={[styles.inRow, { marginTop: 10 }]}>
                <CheckSquare2 color={Colors.white} size={24} fill={Colors.primary} />
                <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                    Step-free access
                </NMText>
            </View>
            <View style={[styles.inRow, { marginTop: 10 }]}>
                <CheckSquare2 color={Colors.white} size={24} fill={Colors.background} />
                <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                    Disabled parking spot
                </NMText>
            </View>
            <View style={[styles.inRow, { marginTop: 10 }]}>
                <CheckSquare2 color={Colors.white} size={24} fill={Colors.background} />
                <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                    Guest entrance wider than 32 inches
                </NMText>
            </View>
            <View style={[styles.inRow, { marginTop: 10 }]}>
                <CheckSquare2 color={Colors.white} size={24} fill={Colors.primary} />
                <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                    Step-free access
                </NMText>
            </View>
            <View style={[styles.inRow, { marginTop: 10 }]}>
                <CheckSquare2 color={Colors.white} size={24} fill={Colors.background} />
                <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                    Disabled parking spot
                </NMText>
            </View>
            <View style={[styles.inRow, { marginTop: 10 }]}>
                <CheckSquare2 color={Colors.white} size={24} fill={Colors.background} />
                <NMText fontSize={16} fontFamily="regular" color={Colors.textPrimary}>
                    Guest entrance wider than 32 inches
                </NMText>
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
                />
                <NMButton
                    title="Save & Submit"
                    backgroundColor={Colors.primary}
                    textColor={Colors.white}
                    borderRadius={8}
                    height={44}
                    width="46%"
                />
            </View>

        </>
    )


    return (
        <NMSafeAreaWrapper statusBarColor={Colors.white} statusBarStyle="dark-content">
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Header */}
                <View style={styles.headerView}>
                    <View style={styles.headerLeft}>
                        <Image
                            source={require('../../../assets/icons/drawer.png')}
                            style={styles.headerIcon}
                        />
                        <NMText
                            fontSize={20}
                            fontFamily="semiBold"
                            color={Colors.textSecondary}
                            style={styles.headerTitle}>
                            Add Property
                        </NMText>
                    </View>
                    <Image
                        source={require('../../../assets/icons/notification.png')}
                        style={styles.headerIcon}
                    />
                </View>

                <View style={styles.contentBox}>
                    <View style={styles.imageSelectionBox}>
                        <UploadCloud size={60} color={Colors.primary} strokeWidth={1.5} />
                        <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary}>
                            Drop your images here, or click to browse
                        </NMText>
                        <NMText fontSize={10} fontFamily="regular" color={Colors.textPrimary}>
                            Max file size 8MB (.jpeg / .png mp4)
                        </NMText>
                    </View>

                    <View style={styles.imagesViewBox}>
                        {dummy4Images.map((item, i) => (
                            <View style={styles.imageOuterBox} key={i}>
                                <Image
                                    source={{ uri: item }}
                                    style={styles.imageBox}
                                />
                                <View style={styles.deleteIcon}>
                                    <Trash2Icon size={14} color={Colors.white} strokeWidth={2} />
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.contentBox}>
                    <View style={[styles.inRow, { justifyContent: "space-between" }]}>
                        <NMText fontSize={20} fontFamily="semiBold" color={Colors.textPrimary}>
                            {step === 1 ? 'Information' : step === 2 ? 'Price' : 'Amenities '}
                        </NMText>
                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                            Steps: <NMText fontSize={14} fontFamily="medium" color={Colors.textPrimary}>{step.toString()}/3
                            </NMText>
                        </NMText>
                    </View>
                    {
                        step === 1 ? (
                            <StepOne />
                        ) : step === 2 ? (
                            <StepTwo />
                        ) : (
                            <StepThree />
                        )
                    }

                </View>
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
