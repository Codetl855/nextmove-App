import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MapPin, Download, ChevronLeft, Edit3Icon, StarIcon } from 'lucide-react-native';
import { Colors } from '../../../theme/colors';
import NMSafeAreaWrapper from '../../../components/common/NMSafeAreaWrapper';
import NMText from '../../../components/common/NMText';
import { apiRequest, getLoginUser } from '../../../services/apiClient';

const ProfileScreen: React.FC = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'agents'>('overview');
    const [userData, setUserData] = useState<any>(null);
    const [agencyAgents, setAgencyAgents] = useState<any[]>([]);
    const renderOverview = () => (
        <View style={styles.tabContent}>
            <NMText fontSize={16} fontFamily='light' color={Colors.textLight}>
                Your real estate business needs a successful company name to better sell real estate and get found in more website search results and stand out on social media sites. Hello real estate agents, here is your inspiration list of catchy, unique, clever and cool, names and logos for your new small business.
            </NMText>

            <View style={styles.statsContainer}>
                {[
                    { label: 'Total Listing', value: 243 },
                    { label: 'Property Sold', value: 136 },
                    { label: 'Property Rent', value: 105 },
                ].map((item, i) => (
                    <View key={i} style={styles.statBox}>
                        <NMText fontSize={16} fontFamily='regular' color={Colors.textPrimary}>
                            {item.label}
                        </NMText>
                        <NMText fontSize={24} fontFamily='bold' color={Colors.primary}>
                            {item.value}
                        </NMText>
                    </View>
                ))}
            </View>
        </View>
    );

    const renderDocuments = () => (
        <View style={styles.tabContent}>
            <DocumentItem title="License Document.pdf" size="2.5 Mb" />
            <DocumentItem title="Property Photos.pdf" size="2.5 Mb" />
            <TouchableOpacity style={styles.addButton}>
                <NMText fontSize={14} fontFamily='medium' color={Colors.primary}>
                    Add Document
                </NMText>
            </TouchableOpacity>
        </View>
    );

    const loadUser = async () => {
        const user = await getLoginUser();
        if (user) {
            setUserData(user?.user);
        } else {
            console.log('No user found');
        }
    };

    const getAllAgencyAgents = async () => {
        try {
            const { result, error } = await apiRequest({
                endpoint: 'v1/agency-agents',
                method: 'GET',
            });
            if (error) {
                console.error('Error fetching agents:', error);
            } else {
                setAgencyAgents(result?.data?.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch agency agents', err);
        }
    }

    useEffect(() => {
        loadUser();
        getAllAgencyAgents();
    }, []);

    const renderAgents = () => (
        <View style={styles.tabContent}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {agencyAgents?.map((agent) => (
                    <AgentCard
                        key={agent.id}
                        image={agent.user.profile_image_url}
                        name={`${agent.user.first_name}${agent.user.last_name ? ' ' + agent.user.last_name : ''}`}
                        role={agent.user.role}
                        onPress={() => navigation.navigate('AddAgent', { agent: agent, isEdit: true })}
                    />
                ))}
            </ScrollView>
            <TouchableOpacity style={styles.addButton}>
                <NMText fontSize={14} fontFamily='medium' color={Colors.primary}>
                    Add Agent
                </NMText>
            </TouchableOpacity>
        </View>
    );

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
                                Profile
                            </NMText>
                        </View>
                    </View>
                    <View style={styles.inRow}>
                        <TouchableOpacity style={[styles.backBox, { marginRight: 10 }]} onPress={() => navigation.navigate('AddAgent')}>
                            <Edit3Icon color={Colors.black} size={18} strokeWidth={1.5} />
                        </TouchableOpacity>
                        <Image source={require('../../../assets/icons/notification.png')} style={styles.headerIcon} />
                    </View>
                </View>

                <View style={styles.headerCard}>
                    <View style={styles.logoContainer}>
                        {userData?.profile_image_url ? (
                            <Image
                                source={{ uri: userData.profile_image_url }}
                                style={styles.logo}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.logo} />
                        )}
                    </View>

                    <View style={styles.ratingContainer}>
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <StarIcon key={i} color={Colors.star} size={16} fill={Colors.star} />
                            ))}
                            <NMText fontSize={16} fontFamily='regular' color={Colors.textSecondary} style={{ marginLeft: 5 }}>
                                5.0
                            </NMText>
                        </View>
                        <NMText fontSize={14} fontFamily='regular' color={Colors.textSecondary}>
                            60 <NMText fontSize={14} fontFamily='bold' color={Colors.textSecondary}>Reviews</NMText>
                        </NMText>
                    </View>

                    <NMText fontSize={16} fontFamily='semiBold' color={Colors.textPrimary}>
                        {/* Avenue Realty */}
                        {userData ? `${userData.first_name} ${userData.last_name ?? ""}` : 'Avenue Realty'}
                    </NMText>

                    <View style={styles.addressRow}>
                        <MapPin color={Colors.primary} size={16} strokeWidth={2} />
                        <NMText fontSize={14} fontFamily='regular' color={Colors.primary}>
                            {userData?.address}
                        </NMText>
                    </View>

                    <InfoRow label="Agency" value="Universo Realtors" />
                    <InfoRow label="Agent Licens" value="LC-5758-2048-3944" />
                    <InfoRow label="Phone" value={userData?.mobile} />
                    <InfoRow label="Email" value={userData?.email} />
                    <InfoRow label="Website" value="www.rainbowinc.com" />

                    <View style={styles.tabsContainer}>
                        {['overview', 'documents', 'agents'].map(tab => (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.tab, activeTab === tab && styles.activeTab]}
                                onPress={() => setActiveTab(tab as any)}
                            >
                                <NMText
                                    fontSize={16}
                                    fontFamily={activeTab === tab ? 'semiBold' : 'regular'}
                                    color={activeTab === tab ? Colors.primary : Colors.textLight}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </NMText>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'documents' && renderDocuments()}
                    {activeTab === 'agents' && renderAgents()}
                </View>
            </ScrollView>
        </NMSafeAreaWrapper>
    );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <View style={styles.infoRow}>
        <NMText fontSize={16} fontFamily="regular" color={Colors.textLight} style={{ width: '40%' }}>
            {label}
        </NMText>
        <NMText fontSize={16} fontFamily="medium" color={Colors.textPrimary}>
            {value}
        </NMText>
    </View>
);

const DocumentItem: React.FC<{ title: string; size: string }> = ({ title, size }) => (
    <View style={styles.documentItem}>
        <View style={styles.documentLeft}>
            <View style={styles.pdfIcon}>
                <Text style={styles.pdfText}>PDF</Text>
            </View>
            <View>
                <NMText fontSize={14} fontFamily='medium' color={Colors.textPrimary}>
                    {title}
                </NMText>
                <NMText fontSize={12} fontFamily='regular' color={Colors.textLight}>
                    {size}
                </NMText>
            </View>
        </View>
        <TouchableOpacity style={styles.downloadButton}>
            <Download color={Colors.primary} size={20} strokeWidth={2} />
        </TouchableOpacity>
    </View>
);

const AgentCard: React.FC<{ image: string; name: string; role: string; onPress?: () => void }> = ({ image, name, role, onPress }) => (
    <TouchableOpacity style={styles.agentCard} activeOpacity={.8} onPress={onPress}>
        <Image source={{ uri: image }} style={styles.agentImage} />
        <NMText fontSize={16} fontFamily='semiBold' color={Colors.textPrimary}>
            {name}
        </NMText>
        <NMText fontSize={14} fontFamily='regular' color={Colors.textLight}>
            {role}
        </NMText>
    </TouchableOpacity>
);

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
    headerCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        margin: 15,
        padding: 20,
    },
    logoContainer: {
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    logo: {
        width: 100,
        height: 100,
        backgroundColor: Colors.background,
        borderRadius: 12,
    },
    ratingContainer: {
        alignItems: 'flex-end',
        position: 'absolute',
        top: 20,
        right: 20,
    },
    starsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        marginBottom: 5,
    },
    addressRow: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 8,
    },
    infoRow: {
        flexDirection: 'row',
        overflow: 'hidden',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginTop: 20,
        paddingTop: 15,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 5,
        marginRight: 20,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.primary,
    },
    tabContent: {
        marginVertical: 15,
    },
    statsContainer: {
        gap: 15,
        marginTop: 15,
    },
    statBox: {
        backgroundColor: Colors.background,
        borderRadius: 8,
        padding: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    documentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: Colors.background,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10
    },
    documentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    pdfIcon: {
        width: 45,
        height: 45,
        backgroundColor: '#FFE5E5',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pdfText: {
        fontSize: 12,
        color: '#FF5252',
        fontWeight: '700',
    },
    downloadButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        marginTop: 20,
        borderWidth: 1.5,
        borderColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    agentCard: {
        width: 120,
        marginRight: 15,
        alignItems: 'center',
        backgroundColor: Colors.background,
        paddingBottom: 10,
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 10
    },
    agentImage: {
        width: 120,
        height: 120,
        marginBottom: 10,
        resizeMode: 'cover',
    },
});

export default ProfileScreen;
