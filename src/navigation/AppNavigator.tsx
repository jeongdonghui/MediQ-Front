// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import OtherLoginScreen from '../screens/auth/OtherLoginScreen';
import NameInputScreen from '../screens/signup/NameInputScreen';
import BirthdateScreen from '../screens/signup/BirthdateScreen';
import ConfirmInfoScreen from '../screens/signup/ConfirmInfoScreen';
import VerifyCodeScreen from '../screens/auth/VerifyCodeScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import HomeScreen from '../screens/home/HomeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OtherLogin" component={OtherLoginScreen} />
        <Stack.Screen name="NameInput" component={NameInputScreen} />
        <Stack.Screen name="Birthdate" component={BirthdateScreen} />
        <Stack.Screen name="ConfirmInfo" component={ConfirmInfoScreen} />
        <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
