import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NMText from '../../../components/common/NMText';
import { Colors } from '../../../theme/colors';

const Header: React.FC = () => {
    const navigation = useNavigation();
    const drawerNavigation = navigation.getParent('drawer') || navigation.getParent();

    const handleDrawerOpen = () => {
        if (drawerNavigation && 'openDrawer' in drawerNavigation) {
            drawerNavigation.openDrawer();
        } else if (navigation && 'openDrawer' in navigation) {
            (navigation as any).openDrawer();
        }
    };

    return (
        <View style={styles.headerView}>
            <View style={styles.inRow}>
                <TouchableOpacity onPress={handleDrawerOpen}>
                    <Image 
                        source={require('../../../assets/icons/drawer.png')} 
                        style={styles.headerIcon} 
                    />
                </TouchableOpacity>
                <NMText 
                    fontSize={20} 
                    fontFamily="semiBold" 
                    color={Colors.textSecondary} 
                    style={styles.headerTitle}
                >
                    History
                </NMText>
            </View>
            <Image 
                source={require('../../../assets/icons/notification.png')} 
                style={styles.headerIcon} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    headerView: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        paddingVertical: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    inRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    headerTitle: {
        marginLeft: 10,
    },
});

export default React.memo(Header);

