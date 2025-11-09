
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import { Text } from 'react-native';
import UserBottomTab from '../bottomTabs/UserBottomTab';

const PropertyListingScreen = () => <Text>Property Listing</Text>;
const BookingRequestScreen = () => <Text>Booking Request</Text>;
const FavoritePropertiesScreen = () => <Text>Favorite Properties</Text>;
const SavedSearchesScreen = () => <Text>Saved Searches</Text>;
const ReviewsScreen = () => <Text>Reviews</Text>;
const BookFunActivitiesScreen = () => <Text>Book Fun Activities</Text>;
const PackagesScreen = () => <Text>Packages</Text>;
const SettingScreen = () => <Text>Setting</Text>;

const Drawer = createDrawerNavigator();

const DrawerStack: React.FC = () => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: false,
                drawerType: 'front',
                drawerStyle: {
                    width: '85%',
                },
            }}
            initialRouteName='HomeDrawer'
        >
            <Drawer.Screen
                name="HomeDrawer"
                component={UserBottomTab}
                options={{ title: 'Bottom Tab' }}
            />
            <Drawer.Screen
                name="PropertyListing"
                component={PropertyListingScreen}
                options={{ title: 'Property Listing' }}
            />
            <Drawer.Screen
                name="BookingRequest"
                component={BookingRequestScreen}
                options={{ title: 'Booking Request' }}
            />
            <Drawer.Screen
                name="FavoriteProperties"
                component={FavoritePropertiesScreen}
                options={{ title: 'Favorite Properties' }}
            />
            <Drawer.Screen
                name="SavedSearches"
                component={SavedSearchesScreen}
                options={{ title: 'Saved Searches' }}
            />
            <Drawer.Screen
                name="Reviews"
                component={ReviewsScreen}
                options={{ title: 'Reviews' }}
            />
            <Drawer.Screen
                name="BookFunActivities"
                component={BookFunActivitiesScreen}
                options={{ title: 'Book Fun Activities' }}
            />
            <Drawer.Screen
                name="Packages"
                component={PackagesScreen}
                options={{ title: 'Packages' }}
            />
            <Drawer.Screen
                name="Setting"
                component={SettingScreen}
                options={{ title: 'Settings' }}
            />
        </Drawer.Navigator>
    );
};

export default DrawerStack;
