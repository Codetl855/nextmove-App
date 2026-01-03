import React, { useEffect, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../../screens/user/splash';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import LoginScreen from '../../screens/user/auth/login';
import SignUpScreen from '../../screens/user/auth/signUp';
import VerificationCodeScreen from '../../screens/user/auth/verificationCode';
import ForgotPasswordScreen from '../../screens/user/auth/forgotPassword';
import PropertyDetailScreen from '../../screens/user/propertyDetail';
import BookingPayment from '../../screens/user/bookingPayment';
import BlogsList from '../../screens/user/blogsList';
import BlogDetail from '../../screens/user/blogDetail';
import AddAgent from '../../screens/user/addAgent';
import DrawerStack from '../drawer';
import PropertyListingScreen from '../../screens/user/propertyListing';
import RequestBookingDetail from '../../screens/user/requestBookingDetail';
import BookingRequestsScreen from '../../screens/user/bookingRequests';
import BookingRequestStatusDetail from '../../screens/user/bookingRequestStatusDetail';
import FavoriteProperties from '../../screens/user/favoriteProperties';
import SavedSearch from '../../screens/user/savedSearch';
import ReviewsScreen from '../../screens/user/reviews';
import BookFunActivities from '../../screens/user/bookFunActivities';
import HistoryScreen from '../../screens/user/history';
import SettingScreen from '../../screens/user/settings';
import ResetPasswordScreen from '../../screens/user/resetPassword';
import PrivacyPolicyScreen from '../../screens/user/privacyPolicy';
import PackagesScreen from '../../screens/user/packages';
import PaymentMethod from '../../screens/user/paymentMethod';
import NotificationsScreen from '../../screens/user/notifications';
import AddProperties from '../../screens/user/addProperties';
import ChatScreen from '../../screens/user/chat';
import StripePaymentModal from '../../components/user/StripModal';
import { setLogoutListener } from '../../services/apiClient';
import UserHistoryScreen from '../../screens/user/userHistory';

const Stack = createStackNavigator();

const UserStack: React.FC = () => {
    const navigationRef = useRef<NavigationContainerRef<any>>(null);

    useEffect(() => {
        // Set up logout listener for token expiration
        setLogoutListener(() => {
            if (navigationRef.current) {
                navigationRef.current.reset({
                    index: 0,
                    routes: [{ name: 'loginScreen' }],
                });
            }
        });

        // Cleanup on unmount
        return () => {
            setLogoutListener(() => { });
        };
    }, []);

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="loginScreen" component={LoginScreen} />
                <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                <Stack.Screen name="VerificationCodeScreen" component={VerificationCodeScreen} />
                <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
                <Stack.Screen name="UserBottomTab" component={DrawerStack} />
                <Stack.Screen name="PropertyDetailScreen" component={PropertyDetailScreen} />
                <Stack.Screen name="BookingPayment" component={BookingPayment} />
                <Stack.Screen name="BlogsList" component={BlogsList} />
                <Stack.Screen name="BlogDetail" component={BlogDetail} />
                <Stack.Screen name="AddAgent" component={AddAgent} />
                <Stack.Screen name="PropertyListing" component={PropertyListingScreen} />
                <Stack.Screen name="RequestBookingDetail" component={RequestBookingDetail} />
                <Stack.Screen name="BookingRequestsScreen" component={BookingRequestsScreen} />
                <Stack.Screen name="BookingRequestStatusDetail" component={BookingRequestStatusDetail} />
                <Stack.Screen name="FavoriteProperties" component={FavoriteProperties} />
                <Stack.Screen name='SavedSearch' component={SavedSearch} />
                <Stack.Screen name="ReviewsScreen" component={ReviewsScreen} />
                <Stack.Screen name="BookFunActivities" component={BookFunActivities} />
                <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
                <Stack.Screen name="SettingScreen" component={SettingScreen} />
                <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
                <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
                <Stack.Screen name="PackagesScreen" component={PackagesScreen} />
                <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
                <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
                <Stack.Screen name="AddProperties" component={AddProperties} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} />
                <Stack.Screen name="StripePaymentModal" component={StripePaymentModal} />
                <Stack.Screen name="UserHistoryScreen" component={UserHistoryScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default UserStack;
