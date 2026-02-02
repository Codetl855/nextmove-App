import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import NMText from '../../../components/common/NMText';
import { Colors } from '../../../theme/colors';
import { TabType } from './types';

interface TabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
    const tabs: TabType[] = ['Booking', 'Auction'];

    return (
        <View style={styles.tabsContainer}>
            {tabs.map(tab => (
                <TouchableOpacity
                    key={tab}
                    style={[styles.tab, activeTab === tab && styles.activeTab]}
                    onPress={() => onTabChange(tab)}
                >
                    <NMText
                        fontSize={16}
                        fontFamily={activeTab === tab ? 'semiBold' : 'regular'}
                        color={activeTab === tab ? Colors.white : Colors.textPrimary}
                    >
                        {tab}
                    </NMText>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: '5%',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: Colors.white,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        backgroundColor: Colors.primary,
    },
});

export default React.memo(Tabs);





