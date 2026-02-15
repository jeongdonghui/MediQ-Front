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
import NotificationScreen from '../screens/notifications/NotificationScreen';
import IdInputScreen from '../screens/signup/IdInputScreen';
import PasswordInputScreen from '../screens/signup/PasswordInputScreen';
import PhoneNumberScreen from '../screens/signup/PhoneNumberScreen';
import CheckInfoScreen from '../screens/signup/CheckInfoScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* ✅ [CHANGED] OtherLogin만 아래에서 올라오는 애니메이션 */}
        <Stack.Screen
          name="OtherLogin"
          component={OtherLoginScreen}
          options={{ animation: 'slide_from_bottom' }}
        />

        <Stack.Screen name="NameInput" component={NameInputScreen} />
        <Stack.Screen name="Birthdate" component={BirthdateScreen} />
        <Stack.Screen name="ConfirmInfo" component={ConfirmInfoScreen} />
        <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="IdInput" component={IdInputScreen} />
        <Stack.Screen name="PasswordInput" component={PasswordInputScreen} />
        <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
        <Stack.Screen name="CheckInfo" component={CheckInfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
