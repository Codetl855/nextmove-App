import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../../screens/user/splash';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../../screens/user/auth/login';
import SignUpScreen from '../../screens/user/auth/signUp';
import VerificationCodeScreen from '../../screens/user/auth/verificationCode';
import ForgotPasswordScreen from '../../screens/user/auth/forgotPassword';

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
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default UserStack;
