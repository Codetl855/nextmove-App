import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ChevronLeft, MapPin, Share2, ChevronDown, ChevronUp } from 'lucide-react-native';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import { Colors } from '../../../theme/colors';
import NMText from '../../../components/common/NMText';
import NMButton from '../../../components/common/NMButton';
import { apiRequest } from '../../../services/apiClient';
import { showErrorToast } from '../../../utils/toastService';
import LoaderModal from '../../../components/common/NMLoaderModal';
import FunActivityBookingModal from '../../../components/user/FunActivityBookingModal';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FunActivityDetail: React.FC = ({ navigation, route }: any) => {
    const { activityId } = route.params;

    const [loader, setLoader] = useState(false);
    const [detailData, setDetailData] = useState<any>({});
    const [bookingModalVisible, setBookingModalVisible] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        whatToExpect: false,
        departureAndReturn: false,
        accessibility: false,
        additionalInformation: false,
        cancellationPolicy: false,
        hostInformation: false,
    });

    const toggleSection = (sectionKey: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey],
        }));
    };

    const CollapsibleSection: React.FC<{
        title: string;
        content: string | React.ReactNode;
        sectionKey: string;
    }> = ({ title, content, sectionKey }) => {
        const isExpanded = expandedSections[sectionKey];

        return (
            <View style={styles.section}>
                <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => toggleSection(sectionKey)}
                    activeOpacity={0.7}
                >
                    <NMText fontSize={18} fontFamily="semiBold" color={Colors.textPrimary}>
                        {title}
                    </NMText>
                    {isExpanded ? (
                        <ChevronUp color={Colors.textPrimary} size={20} strokeWidth={2} />
                    ) : (
                        <ChevronDown color={Colors.textPrimary} size={20} strokeWidth={2} />
                    )}
                </TouchableOpacity>
                {isExpanded && (
                    <View style={styles.sectionContent}>
                        {typeof content === 'string' ? (
                            <NMText fontSize={16} fontFamily='light' color={Colors.textLight} style={styles.description}>
                                {content}
                            </NMText>
                        ) : null}
                    </View>
                )}
            </View>
        );
    };

    const getActivityDetails = async () => {
        try {
            setLoader(true);
            const { result, error } = await apiRequest({
                endpoint: `v1/fun-activities/${activityId}`,
                method: 'GET',
            });

            if (result?.data) {
                setDetailData(result.data);
            }

            if (error) {
                showErrorToast(error);
            }
        } catch (err) {
            console.error('Error fetching activity details:', err);
            showErrorToast('Failed to load activity details');
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        if (activityId) {
            getActivityDetails();
        }
    }, [activityId]);

    return (
        <NMSafeAreaWrapper statusBarColor={Colors.black} statusBarStyle="light-content">
            <LoaderModal visible={loader} />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBox} onPress={() => navigation.goBack()}>
                        <ChevronLeft color="#000" size={24} strokeWidth={2} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.shareBox}>
                        <Share2 color={Colors.black} size={20} strokeWidth={2} />
                    </TouchableOpacity> */}
                </View>

                {/* Image */}
                {detailData.primary_image && (
                    <Image
                        source={{ uri: detailData.primary_image }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                )}

                <View style={styles.content}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <NMText fontSize={18} fontFamily="bold" color={Colors.textPrimary} style={styles.title}>
                            {detailData.title}
                        </NMText>
                        <View style={styles.priceRow}>
                            <NMText fontSize={16} fontFamily="bold" color={Colors.primary}>
                                SAR {detailData.price}
                            </NMText>
                            <NMText fontSize={12} fontFamily="medium" color={Colors.textLight}>
                                /Ticket
                            </NMText>
                        </View>
                    </View>

                    <View style={styles.locationRow}>
                        <MapPin color={Colors.primary} size={16} strokeWidth={1.5} />
                        <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                            {detailData.location}
                        </NMText>
                    </View>

                    {detailData.description && (
                        <View style={styles.section}>
                            <NMText fontSize={18} fontFamily="semiBold" color={Colors.textPrimary} style={styles.sectionTitle}>
                                Overview
                            </NMText>
                            <NMText fontSize={18} fontFamily='light' color={Colors.textLight} style={styles.description}>
                                {detailData.description}
                            </NMText>
                        </View>
                    )}

                    {detailData.what_to_expect && (
                        <CollapsibleSection
                            title="What to Expect"
                            content={detailData.what_to_expect}
                            sectionKey="whatToExpect"
                        />
                    )}

                    {detailData.departure_and_return && (
                        <CollapsibleSection
                            title="Departure and Return"
                            content={detailData.departure_and_return}
                            sectionKey="departureAndReturn"
                        />
                    )}

                    {detailData.accessibility && (
                        <CollapsibleSection
                            title="Accessibility"
                            content={detailData.accessibility}
                            sectionKey="accessibility"
                        />
                    )}

                    {detailData.additional_information && (
                        <CollapsibleSection
                            title="Additional Information"
                            content={detailData.additional_information}
                            sectionKey="additionalInformation"
                        />
                    )}

                    {detailData.cancellation_policy && (
                        <CollapsibleSection
                            title="Cancellation Policy"
                            content={detailData.cancellation_policy}
                            sectionKey="cancellationPolicy"
                        />
                    )}

                    {detailData.user && (
                        <CollapsibleSection
                            title="Host Information"
                            sectionKey="hostInformation"
                            content={
                                <View>
                                    <NMText fontSize={14} fontFamily="regular" color={Colors.textSecondary}>
                                        {detailData.user.first_name} {detailData.user.last_name}
                                    </NMText>
                                    <NMText fontSize={14} fontFamily="regular" color={Colors.textLight} style={{ marginTop: 4 }}>
                                        {detailData.user.email}
                                    </NMText>
                                </View>
                            }
                        />
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <NMButton
                    title="Booking Now"
                    fontFamily="semiBold"
                    width="100%"
                    borderRadius={8}
                    height={50}
                    backgroundColor={Colors.primary}
                    onPress={() => setBookingModalVisible(true)}
                />
            </View>

            <FunActivityBookingModal
                visible={bookingModalVisible}
                onClose={() => setBookingModalVisible(false)}
                activityDetails={detailData}
            />
        </NMSafeAreaWrapper>
    );
};

export default FunActivityDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingTop: 10,
        paddingBottom: 10,
        zIndex: 10,
    },
    backBox: {
        width: 34,
        height: 34,
        borderRadius: 8,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    shareBox: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.white,
    },
    image: {
        width: '100%',
        height: 240,
    },
    content: {
        padding: 20,
    },
    title: {
        width: '68%',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 5,
    },
    section: {
        marginBottom: 15,
        backgroundColor: Colors.white,
        borderRadius: 8,
        overflow: 'hidden',
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: Colors.white,
    },
    sectionContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    sectionTitle: {
        marginBottom: 10,
    },
    description: {
        lineHeight: 22,
    },
    footer: {
        padding: 10,
        backgroundColor: Colors.white,
    },
});

