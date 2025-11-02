import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper'
import { Colors } from '../../../theme/colors'
import { CameraIcon, ChevronDown, ChevronLeft, Edit3Icon } from 'lucide-react-native'
import NMText from '../../../components/common/NMText'
import NMTextInput from '../../../components/common/NMTextInput'
import NMButton from '../../../components/common/NMButton'

const AddAgent: React.FC = () => {
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
                                Add Agent
                            </NMText>
                        </View>
                    </View>
                    <View style={styles.inRow}>
                        <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} />
                    </View>
                </View>
                <View style={styles.contentBox}>
                    <NMText fontSize={20} fontFamily='semiBold' color={Colors.textPrimary}>
                        Account Settings
                    </NMText>

                    <View style={styles.imageAvatar} />
                    <TouchableOpacity style={styles.pickerView}>
                        <CameraIcon color={Colors.white} size={18} strokeWidth={2} />
                    </TouchableOpacity>
                    <View style={{ height: 20 }} />
                    <NMTextInput
                        label='Name'
                        placeholder='Enter your name'
                    />

                    <NMTextInput
                        label='Email'
                        placeholder='Enter your email'
                    />

                    <NMTextInput
                        label='Phone'
                        placeholder='Enter your phone'
                    />

                    <NMTextInput
                        label='Website'
                        placeholder='Enter your website'
                    />

                    <NMTextInput
                        label='Address'
                        placeholder='Enter your address'
                    />

                    <View style={[styles.inRow, { justifyContent: 'space-between' }]}>
                        <NMTextInput
                            label='Zip'
                            placeholder='Enter your zip'
                            mainViewStyle={{ width: '48%' }}
                        />
                        <NMTextInput
                            label='City'
                            placeholder='Select '
                            rightIcon={<ChevronDown color={Colors.border} size={18} strokeWidth={2} />}
                            mainViewStyle={{ width: '48%' }}
                        />
                    </View>

                    <NMTextInput
                        label='State'
                        placeholder='Select '
                        rightIcon={<ChevronDown color={Colors.border} size={18} strokeWidth={2} />}
                    />

                    <NMTextInput
                        label='About'
                        placeholder='Enter your about'
                        multiline
                        numberOfLines={5}
                        inputStyle={{ height: 100, textAlignVertical: 'top' }}
                    />

                    <NMText fontSize={16} fontFamily='semiBold' color={Colors.textPrimary} style={{ marginTop: 20 }}>
                        Social Media
                    </NMText>

                    <NMTextInput
                        label='Facbook'
                        placeholder='Enter'
                    />

                    <NMTextInput
                        label='Instagram'
                        placeholder='Enter'
                    />

                    <NMTextInput
                        label='Twitter'
                        placeholder='Enter'
                    />

                    <NMText fontSize={16} fontFamily='semiBold' color={Colors.textPrimary} style={{ marginTop: 20 }}>
                        Documents
                    </NMText>

                    <NMText fontSize={14} fontFamily='medium' color={Colors.textPrimary} style={{ marginTop: 10 }}>
                        Upload Documents
                    </NMText>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between', borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 10 }}>
                        <NMText fontSize={14} fontFamily='regular' color={Colors.textLight}>
                            Choose File
                        </NMText>
                        <View style={{ backgroundColor: Colors.background, paddingHorizontal: 14, borderRadius: 8, paddingVertical: 8 }}>
                            <NMText fontSize={14} fontFamily='medium' color={Colors.primary}>
                                Browse
                            </NMText>
                        </View>
                    </View>

                    <View style={[styles.inRow, { justifyContent: 'space-between', marginTop: 20 }]}>
                        <NMButton
                            title='Cancel'
                            textColor={Colors.primary}
                            backgroundColor='transparent'
                            borderRadius={8}
                            width={'48%'}
                            style={{ borderWidth: 1, borderColor: Colors.primary }}
                        />
                        <NMButton
                            title='Save'
                            textColor={Colors.white}
                            backgroundColor={Colors.primary}
                            borderRadius={8}
                            width={'48%'}
                        />
                    </View>
                </View>
            </ScrollView>
        </NMSafeAreaWrapper>
    )
}

export default AddAgent

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
    contentBox: {
        backgroundColor: Colors.white,
        margin: 20,
        padding: 20,
        borderRadius: 12
    },
    imageAvatar: {
        width: 100,
        height: 100,
        borderRadius: 16,
        backgroundColor: Colors.border,
        marginTop: 10
    },
    pickerView: {
        width: 60,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 60 / 2,
        backgroundColor: Colors.black,
        marginTop: -40,
        marginLeft: 20
    }
})