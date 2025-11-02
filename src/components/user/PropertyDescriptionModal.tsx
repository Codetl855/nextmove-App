import React, { useState } from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import NMText from '../common/NMText';
import { Colors } from '../../theme/colors';

interface PropertyDescriptionModalProps {
    visible: boolean;
    onClose: () => void;
    showTabINBuy?: boolean
}

const PropertyDescriptionModal: React.FC<PropertyDescriptionModalProps> = ({
    visible,
    onClose,
    showTabINBuy
}) => {
    const [activeTab, setActiveTab] = useState<'details' | 'features' | 'nearby' | 'thingsToKnow'>('details');

    const renderPropertyDetails = () => (
        <View style={styles.tabContent}>
            <DetailRow label="ID" value="#1234" bgColor={Colors.background} />
            <DetailRow label="Area" value="1000 SqFT" />
            <DetailRow label="Price" value="$25,000" bgColor={Colors.background} />
            <DetailRow label="Build Year" value="2025" />
            <DetailRow label="Type" value="Villa" bgColor={Colors.background} />
            <DetailRow label="Status" value="For Sale" />
            <DetailRow label="Room" value="5" bgColor={Colors.background} />
            <DetailRow label="Baths" value="4" />
            <DetailRow label="Garage" value="1" bgColor={Colors.background} />
            <DetailRow label="Added" value="1 Week Ago" />
        </View>
    );

    const renderFeatures = () => (
        <View style={styles.tabContent}>
            <NMText fontSize={16} fontFamily="light" color={Colors.textLight}>
                Risk management and compliance, when approached strategically, have the potential to go beyond mitigating threats and protecting the company's operations & reputation. They can actually generate value and create opportunities.
            </NMText>

            <View style={styles.featuresGrid}>
                <View style={styles.featuresColumn}>
                    <FeatureItem label="A/C & Heating" />
                    <FeatureItem label="Swimming Pool" />
                    <FeatureItem label="Garden" />
                    <FeatureItem label="Pet Friendly" />
                    <FeatureItem label="Refrigerator" />
                    <FeatureItem label="Elevator" />
                </View>
                <View style={styles.featuresColumn}>
                    <FeatureItem label="Garages" />
                    <FeatureItem label="Parking" />
                    <FeatureItem label="Disabled Access" />
                    <FeatureItem label="Ceiling Height" />
                    <FeatureItem label="Fireplace" />
                    <FeatureItem label="Wifi" />
                </View>
            </View>
        </View>
    );

    const renderWhatsNearby = () => (
        <View style={styles.tabContent}>
            <DetailRow label="School" value="0.7 km" bgColor={Colors.background} />
            <DetailRow label="Hospital" value="0.4 km" />
            <DetailRow label="University" value="1.2 km" bgColor={Colors.background} />
            <DetailRow label="Metro Station" value="1.8 km" />
            <DetailRow label="Grocery Center" value="0.6 km" bgColor={Colors.background} />
            <DetailRow label="Gym / Wellness" value="1.3 km" />
            <DetailRow label="Market" value="1.1 km" bgColor={Colors.background} />
            <DetailRow label="Park" value="0.1 km" />
        </View>
    );

    const renderThingsToKnow = () => (
        <View style={styles.tabContent}>
            <View style={styles.rulesContainer}>
                <NMText fontSize={16} fontFamily="medium" color={Colors.textPrimary}>
                    House rules
                </NMText>
                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                    Check-in after 1:00 PM
                </NMText>
                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                    Checkout before 11:00 AM
                </NMText>
                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                    2 guests maximum
                </NMText>
            </View>
            <View style={[styles.rulesContainer, { marginVertical: 10 }]}>
                <NMText fontSize={16} fontFamily="medium" color={Colors.textPrimary}>
                    Safety & property
                </NMText>
                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                    Carbon monoxide alarm not reported
                </NMText>
                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                    Smoke alarm not reported
                </NMText>
                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                    Exterior security cameras on property
                </NMText>
            </View>
            <View style={styles.rulesContainer}>
                <NMText fontSize={16} fontFamily="medium" color={Colors.textPrimary}>
                    Cancellation policy
                </NMText>
                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                    Add your trip dates to get the cancellation details for this stay.
                </NMText>

            </View>
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>

                    <View style={styles.header}>
                        <View style={styles.dragIndicator} />
                    </View>

                    <View style={styles.titleRow}>
                        <NMText fontSize={20} fontFamily="semiBold" color={Colors.textSecondary}>
                            Description
                        </NMText>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="#000" size={24} strokeWidth={2} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'details' && styles.activeTab]}
                            onPress={() => setActiveTab('details')}
                        >
                            <NMText
                                fontSize={16}
                                fontFamily={activeTab === 'details' ? 'semiBold' : 'regular'}
                                color={activeTab === 'details' ? Colors.primary : Colors.textLight}
                            >
                                Property Details
                            </NMText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'features' && styles.activeTab]}
                            onPress={() => setActiveTab('features')}
                        >
                            <NMText
                                fontSize={16}
                                fontFamily={activeTab === 'features' ? 'semiBold' : 'regular'}
                                color={activeTab === 'features' ? Colors.primary : Colors.textLight}
                            >
                                Features
                            </NMText>
                        </TouchableOpacity>
                        {showTabINBuy ?
                            (<TouchableOpacity
                                style={[styles.tab, activeTab === 'nearby' && styles.activeTab]}
                                onPress={() => setActiveTab('nearby')}
                            >
                                <NMText
                                    fontSize={16}
                                    fontFamily={activeTab === 'nearby' ? 'semiBold' : 'regular'}
                                    color={activeTab === 'nearby' ? Colors.primary : Colors.textLight}
                                >
                                    What's Nearby?
                                </NMText>
                            </TouchableOpacity>) :
                            (<TouchableOpacity
                                style={[styles.tab, activeTab === 'thingsToKnow' && styles.activeTab]}
                                onPress={() => setActiveTab('thingsToKnow')}
                            >
                                <NMText
                                    fontSize={16}
                                    fontFamily={activeTab === 'thingsToKnow' ? 'semiBold' : 'regular'}
                                    color={activeTab === 'thingsToKnow' ? Colors.primary : Colors.textLight}
                                >
                                    Things to Know
                                </NMText>
                            </TouchableOpacity>)
                        }
                    </View>

                    {activeTab === 'details' && renderPropertyDetails()}
                    {activeTab === 'features' && renderFeatures()}
                    {activeTab === 'nearby' && renderWhatsNearby()}
                    {activeTab === 'thingsToKnow' && renderThingsToKnow()}
                </View>
            </View>
        </Modal>
    );
};

const DetailRow: React.FC<{ label: string; value: string; bgColor?: string }> = ({
    label,
    value,
    bgColor,
}) => (
    <View style={[styles.detailRow, { backgroundColor: bgColor || 'transparent' }]}>
        <NMText fontSize={16} fontFamily="light" color={Colors.textPrimary} style={{ width: '50%' }}>
            {label}
        </NMText>
        <NMText fontSize={16} fontFamily="semiBold" color={Colors.textPrimary}>
            {value}
        </NMText>
    </View>
);

const FeatureItem: React.FC<{ label: string }> = ({ label }) => (
    <View style={styles.featureItem}>
        <Check color="#C4A572" size={18} strokeWidth={2} />
        <NMText fontSize={16} fontFamily="light" color={Colors.textPrimary}>
            {label}
        </NMText>
    </View>
);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 20,
    },
    header: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 8,
    },
    dragIndicator: {
        width: 40,
        height: 4,
        backgroundColor: Colors.background,
        borderRadius: 2,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    closeButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: 8,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        borderBottomWidth: 1.5,
        borderBottomColor: Colors.background,
    },
    tab: {
        paddingVertical: 12,
        paddingHorizontal: 5,
        marginRight: 20,
    },
    activeTab: {
        borderBottomWidth: 2.5,
        borderBottomColor: Colors.primary,
    },
    tabContent: {
        paddingHorizontal: 22,
        paddingVertical: 10,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    featuresGrid: {
        flexDirection: 'row',
        marginTop: 20,
    },
    featuresColumn: {
        flex: 1,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        gap: 10,
    },
    rulesContainer: {
        paddingHorizontal: 22,
        gap: 10,
        backgroundColor: Colors.background,
        paddingVertical: 10,
        borderRadius: 8,
    }
});

export default PropertyDescriptionModal;
