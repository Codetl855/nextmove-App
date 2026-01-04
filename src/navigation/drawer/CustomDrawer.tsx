import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import {
    DrawerContentScrollView,
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { X, ArrowRight } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import NMText from '../../components/common/NMText';
import NMButton from '../../components/common/NMButton';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getLoginUser } from '../../services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MenuItem {
    id: number;
    label: string;
    icon: any;
    route: string;
}

const CustomDrawer: React.FC<DrawerContentComponentProps> = (props) => {
    const navigation = useNavigation();
    const [loginUser, setLoginUser] = useState<any>(null);
    const loadUser = async () => {
        const user = await getLoginUser();
        if (user) {
            setLoginUser(user?.user);
        } else {
            console.log('No user found');
        }
    };
    useEffect(() => {
        loadUser();
    }, []);
    const menuItems: MenuItem[] = [
        { id: 1, label: 'Property Listing', icon: require('../../assets/icons/property.png'), route: 'PropertyListing' },
        { id: 2, label: 'History', icon: require('../../assets/icons/booking.png'), route: 'UserHistoryScreen' },
        { id: 3, label: 'Booking Request', icon: require('../../assets/icons/booking.png'), route: 'BookingRequestsScreen' },
        { id: 4, label: 'Favorite Properties', icon: require('../../assets/icons/favorite.png'), route: 'FavoriteProperties' },
        { id: 5, label: 'Saved Searches', icon: require('../../assets/icons/saved.png'), route: 'SavedSearch' },
        { id: 6, label: 'Reviews', icon: require('../../assets/icons/reviews.png'), route: 'ReviewsScreen' },
        { id: 7, label: 'Book Fun Activities', icon: require('../../assets/icons/bookFun.png'), route: 'BookFunActivities' },
        { id: 8, label: 'Packages', icon: require('../../assets/icons/package.png'), route: 'PackagesScreen' },
        { id: 9, label: 'Setting', icon: require('../../assets/icons/setting.png'), route: 'SettingScreen' },
    ];

    const handleNavigation = (route: string) => {
        navigation.navigate(route as never);
    };

    const handleLogout = async () => {
        try {
            // Clear only loginUser from AsyncStorage
            await AsyncStorage.removeItem('loginUser');
            // Reset navigation to login screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'loginScreen' as never }],
            });
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={[styles.container]}
                edges={['top', 'bottom']}
            >
                <View style={styles.container}>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => props.navigation.closeDrawer()}
                    >
                        <X color={Colors.white} size={20} strokeWidth={2} />
                    </TouchableOpacity>

                    <DrawerContentScrollView
                        {...props}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >

                        <View style={styles.profileSection}>
                            <Image
                                source={{ uri: loginUser?.profile_image_url || 'https://via.placeholder.com/80' }}
                                style={styles.profileImage}
                                resizeMode="cover"
                            />
                            <View style={styles.profileInfo}>
                                <NMText fontSize={14} fontFamily="regular" color={Colors.textLight}>
                                    Greetings
                                </NMText>
                                <NMText fontSize={20} fontFamily="semiBold" color={Colors.textPrimary}>
                                    {`${loginUser?.first_name || 'User'} ${loginUser?.last_name || ''}`}
                                </NMText>
                                <NMButton
                                    title="View Profile"
                                    textColor={Colors.primary}
                                    backgroundColor={Colors.white}
                                    fontSize={12}
                                    fontFamily="semiBold"
                                    rightIcon={<ArrowRight color={Colors.primary} size={20} strokeWidth={2} />}
                                    borderRadius={8}
                                    width="80%"
                                    height={40}
                                    onPress={() =>
                                        (navigation as any).navigate('UserBottomTab', {
                                            screen: 'HomeDrawer',
                                            params: { screen: 'Profile' },
                                        })
                                    }
                                />
                            </View>
                        </View>

                        <View style={styles.menuContainer}>
                            {menuItems.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.menuItem}
                                    onPress={() => handleNavigation(item.route)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.iconContainer}>
                                        <Image source={item.icon} style={styles.iconImage} />
                                    </View>
                                    <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                        {item.label}
                                    </NMText>
                                </TouchableOpacity>
                            ))}

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={handleLogout}
                                activeOpacity={0.7}
                            >
                                <View style={styles.iconContainer}>
                                    <Image source={require('../../assets/icons/logout.png')} style={styles.iconImage} />
                                </View>
                                <NMText fontSize={14} fontFamily="regular" color={Colors.textPrimary}>
                                    Logout
                                </NMText>
                            </TouchableOpacity>

                            <View style={styles.versionContainer}>
                                <NMText fontSize={14} fontFamily="regular" color={Colors.primary}>
                                    App Version: 1.0.0
                                </NMText>
                            </View>
                        </View>
                    </DrawerContentScrollView>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    closeButton: {
        width: 30,
        height: 30,
        backgroundColor: Colors.primary,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginTop: 10,
        marginRight: 20,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: Colors.border,
    },
    profileInfo: {
        flex: 1,
        marginLeft: 8,
    },
    menuContainer: {
        backgroundColor: Colors.white,
        width: '100%',
        borderRadius: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
    },
    iconImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    versionContainer: {
        backgroundColor: Colors.background,
        paddingVertical: 18,
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 8,
        marginTop: 10,
    },
});

export default CustomDrawer;
