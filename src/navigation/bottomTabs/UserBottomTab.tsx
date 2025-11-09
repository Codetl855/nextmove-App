import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import NMSafeAreaWrapper from '../../components/common/NMSafeAreaWrapper';
import HomeScreen from '../../screens/user/home';
import { createStackNavigator } from '@react-navigation/stack';
import FilterList from '../../screens/user/filterList';
import Transactions from '../../screens/user/Transactions';
import ChatList from '../../screens/user/ChatList';
import ProfileScreen from '../../screens/user/profileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


interface CustomAddButtonProps {
    onPress: () => void;
}

const CustomAddButton: React.FC<CustomAddButtonProps> = ({ onPress }) => (
    <TouchableOpacity
        style={styles.addButton}
        onPress={onPress}
        activeOpacity={0.9}>
        <View style={styles.addButtonInner}>
            <Image
                source={require('../../assets/icons/plus-square.png')}
                style={styles.addIcon}
                resizeMode="contain"
            />
        </View>
    </TouchableOpacity>
);

const HomeStack: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='HomeMain'>
            <Stack.Screen name="HomeMain" component={HomeScreen} />
            <Stack.Screen name="FilterList" component={FilterList} />
        </Stack.Navigator>
    );
};


const UserBottomTab: React.FC = () => {
    return (
        <NMSafeAreaWrapper statusBarColor={Colors.black} statusBarStyle="light-content">
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: Colors.primary,
                    tabBarInactiveTintColor: Colors.gray,
                    tabBarShowLabel: false,
                    tabBarStyle: styles.tabBar,
                    headerShown: false,
                    tabBarHideOnKeyboard: true,
                }}>
                <Tab.Screen
                    name="Home"
                    component={HomeStack}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.iconContainer}>
                                <Image
                                    source={require('../../assets/icons/home.png')}
                                    style={[
                                        styles.icon,
                                        { tintColor: focused ? Colors.primary : Colors.gray },
                                    ]}
                                    resizeMode="contain"
                                />
                                {focused && <View style={styles.dot} />}
                            </View>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Chat"
                    component={ChatList}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.iconContainer}>
                                <Image
                                    source={require('../../assets/icons/comments.png')}
                                    style={[
                                        styles.icon,
                                        { tintColor: focused ? Colors.primary : Colors.gray },
                                    ]}
                                    resizeMode="contain"
                                />
                                {focused && <View style={styles.dot} />}
                            </View>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Add"
                    component={View}
                    listeners={({ navigation }) => ({
                        tabPress: e => {
                            e.preventDefault();
                            console.log('Add button pressed');
                            navigation.navigate('AddProperties' as never);
                        },
                    })}
                    options={{
                        tabBarIcon: () => <View />,
                        tabBarButton: props => (
                            <CustomAddButton onPress={props.onPress || (() => { })} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Transfer"
                    component={Transactions}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.iconContainer}>
                                <Image
                                    source={require('../../assets/icons/credit-card.png')}
                                    style={[
                                        styles.icon,
                                        { tintColor: focused ? Colors.primary : Colors.gray },
                                    ]}
                                    resizeMode="contain"
                                />
                                {focused && <View style={styles.dot} />}
                            </View>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.iconContainer}>
                                <Image
                                    source={require('../../assets/icons/inbox.png')}
                                    style={[
                                        styles.icon,
                                        { tintColor: focused ? Colors.primary : Colors.gray },
                                    ]}
                                    resizeMode="contain"
                                />
                                {focused && <View style={styles.dot} />}
                            </View>
                        ),
                    }}
                />
            </Tab.Navigator>
        </NMSafeAreaWrapper>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: Colors.white,
        height: 70,
        paddingBottom: 10,
        paddingTop: 10,
        borderTopWidth: 0,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    },
    icon: {
        width: 28,
        height: 28,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
        marginTop: 4,
    },
    addButton: {
        top: -30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonInner: {
        width: 70,
        height: 70,
        borderRadius: 70 / 2,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 8,
        borderColor: Colors.background,
    },
    addIcon: {
        width: 30,
        height: 30,
        tintColor: Colors.white,
    },
});

export default UserBottomTab;
