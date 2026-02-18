// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IntroScreen from '../screens/diagnosis/IntroScreen';
import BodySelectScreen from '../screens/diagnosis/BodySelectScreen';
import DetailCategoryScreen from '../screens/diagnosis/DetailCategoryScreen';
import DetailLocationScreen from '../screens/diagnosis/DetailLocationScreen';
import SymptomSelectScreen from '../screens/diagnosis/SymptomSelectScreen';
import PainScopeScreen from '../screens/diagnosis/PainScopeScreen';
import PainSeverityScreen from '../screens/diagnosis/PainSeverityScreen';

export type Area =
  | 'FULL_ETC'
  | 'HEAD_FACE'
  | 'NECK_CHEST'
  | 'PELVIS_WAIST'
  | 'ARM_LEG';

export type PainScopeKey =
  | 'LOCALIZED'
  | 'DIFFUSE'
  | 'RADIATING'
  | 'REFERRED'
  | 'MULTIPLE'
  | 'MIGRATORY';

export type RootStackParamList = {
  Intro: undefined;
  BodySelect: undefined;

  DetailCategory: { area: Area };

  DetailLocation: {
    area: Area;
    category: string;
  };

  SymptomSelect: {
    area: Area;
    category: string;
    location: string;
  };

  PainScope: {
    area: Area;
    category: string;
    location: string;
    symptoms: string[];
    otherText?: string;
  };

  PainSeverity: {
    area: Area;
    category: string;
    location: string;
    symptoms: string[];
    otherText?: string;
    painScopes: PainScopeKey[];
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Intro" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="BodySelect" component={BodySelectScreen} />
        <Stack.Screen name="DetailCategory" component={DetailCategoryScreen} />
        <Stack.Screen name="DetailLocation" component={DetailLocationScreen} />
        <Stack.Screen name="SymptomSelect" component={SymptomSelectScreen} />
        <Stack.Screen name="PainScope" component={PainScopeScreen} />
        <Stack.Screen name="PainSeverity" component={PainSeverityScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}