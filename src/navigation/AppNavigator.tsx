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

import AIAnalysisScreen from '../screens/diagnosis/AIAnalysisScreen';
import ResultScreen from '../screens/diagnosis/ResultScreen';
import OTCMedicineScreen from '../screens/diagnosis/OTCMedicineScreen';
import PharmacyMapScreen from '../screens/diagnosis/PharmacyMapScreen';

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

export type OnsetKey =
  | 'NOW'
  | 'TODAY'
  | 'YESTERDAY'
  | 'DAYS_2_3'
  | 'WEEK_PLUS'
  | 'MONTH_PLUS';

export type SummaryCard = {
  suspected: string;
  english?: string;
  shortExplain: string;
  bodyPartLabel: string;
  checklist: { label: string; value: string }[];
  department: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
};

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

  // ✅ 추가 흐름(여기서부터)
  AIAnalysis: {
    area: Area;
    category: string;
    location: string;
    symptoms: string[];
    otherText?: string;
    painScopes: PainScopeKey[];
    severityLevel: number; // 0~4
    onset: OnsetKey;
  };

  Result: {
    summary: SummaryCard;
  };

  OTCMedicine: {
    suspected: string;
  };

  PharmacyMap: {
    query?: string; // default "약국"
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

        {/* ✅ 여기부터 새로 추가된 화면들 */}
        <Stack.Screen name="AIAnalysis" component={AIAnalysisScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="OTCMedicine" component={OTCMedicineScreen} />
        <Stack.Screen name="PharmacyMap" component={PharmacyMapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}