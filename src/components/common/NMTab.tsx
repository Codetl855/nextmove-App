import React, { useState } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Colors } from '../../theme/colors';
import NMText from './NMText';

interface Tab {
    id: string;
    label: string;
}

interface NMTabsProps {
    tabs?: Tab[];
    onTabSelect?: (tabId: string) => void;
    defaultSelected?: string;
    horizontalPadding?: number;
    verticalPadding?: number;
    sideSpacing?: number;
}

const NMTabs: React.FC<NMTabsProps> = ({
    tabs = [
        { id: '1', label: 'House' },
        { id: '2', label: 'Apartment' },
        { id: '3', label: 'Villa' },
        { id: '4', label: 'Studio' },
    ],
    onTabSelect,
    defaultSelected = '1',
}) => {
    const [selectedTab, setSelectedTab] = useState(defaultSelected);

    const handleTabPress = (tabId: string) => {
        setSelectedTab(tabId);
        onTabSelect?.(tabId);
    };

    const screenWidth = Dimensions.get('window').width;
    const marginHorizontal = screenWidth * 0.05;

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    {
                        paddingLeft: marginHorizontal,
                        paddingRight: marginHorizontal,
                    },
                ]}
            >
                {tabs.map((tab, index) => {
                    const isSelected = selectedTab === tab.id;

                    return (
                        <TouchableOpacity
                            key={tab.id}
                            onPress={() => handleTabPress(tab.id)}
                            style={[
                                styles.tab,
                                isSelected ? styles.selectedTab : styles.unselectedTab,
                            ]}
                            activeOpacity={0.7}
                        >
                            <NMText fontSize={14} fontFamily='semiBold' style={
                                isSelected ? styles.selectedText : styles.unselectedText
                            }>
                                {tab.label}
                            </NMText>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 14,
    },
    scrollContent: {
        gap: 16,
    },
    tab: {
        paddingHorizontal: 26,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedTab: {
        backgroundColor: Colors.primary,
    },
    unselectedTab: {
        backgroundColor: Colors.white,
    },
    selectedText: {
        color: Colors.white,
    },
    unselectedText: {
        color: Colors.textPrimary,
    },
});

export default NMTabs;