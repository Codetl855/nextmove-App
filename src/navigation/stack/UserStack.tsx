import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../../screens/user/splash';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../../screens/user/auth/login';
import SignUpScreen from '../../screens/user/auth/signUp';
import VerificationCodeScreen from '../../screens/user/auth/verificationCode';
import ForgotPasswordScreen from '../../screens/user/auth/forgotPassword';
import UserBottomTab from '../bottomTabs/UserBottomTab';
import PropertyDetailScreen from '../../screens/user/propertyDetail';
import BookingPayment from '../../screens/user/bookingPayment';
import BlogsList from '../../screens/user/blogsList';
import BlogDetail from '../../screens/user/blogDetail';
import AddAgent from '../../screens/user/addAgent';

const Stack = createStackNavigator();

const UserStack: React.FC = () => {
    return (
        <NavigationContainer>
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
                <Stack.Screen name="UserBottomTab" component={UserBottomTab} />
                <Stack.Screen name="PropertyDetailScreen" component={PropertyDetailScreen} />
                <Stack.Screen name="BookingPayment" component={BookingPayment} />
                <Stack.Screen name="BlogsList" component={BlogsList} />
                <Stack.Screen name="BlogDetail" component={BlogDetail} />
                <Stack.Screen name="AddAgent" component={AddAgent} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default UserStack;
