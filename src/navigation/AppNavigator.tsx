import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/home/SplashScreen';
import HomeScreen from '../screens/home/HomeScreen';
import TutorialScreen from '../screens/home/TutorialScreen';

import HamburgerMenuScreen from '../screens/menu/HamburgerMenuScreen';
import MenuScreen from '../screens/menu/MenuScreen';
import PaymentMethodScreen from '../screens/menu/PaymentMethodScreen';
import PaymentCardAddScreen from '../screens/menu/PaymentCardAddScreen';
import ChangePasswordScreen from '../screens/menu/ChangePasswordScreen';
import InterestKeywordScreen from '../screens/menu/InterestKeywordScreen';
import CommunityPolicyScreen from '../screens/menu/CommunityPolicyScreen';
import RestrictionHistoryScreen from '../screens/menu/RestrictionHistoryScreen';
import InquiryHistoryScreen from '../screens/menu/InquiryHistoryScreen';

import TermsNoticeScreen from '../screens/menu/TermsNoticeScreen';
import TermsServiceScreen from '../screens/menu/TermsServiceScreen';
import TermsLocationScreen from '../screens/menu/TermsLocationScreen';
import TermsPrivacyScreen from '../screens/menu/TermsPrivacyScreen';
import TermsSymptomScreen from '../screens/menu/TermsSymptomScreen';
import TermsWithdrawScreen from '../screens/menu/TermsWithdrawScreen';

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
  Splash: undefined;
  Home: undefined;
  Tutorial: undefined;

  HamburgerMenu: {
    loginType: 'mediq' | 'kakao';
  };

  Menu: {
    loginType: 'mediq' | 'kakao';
  };

  PaymentMethod:
    | {
        newCard?: {
          id: string;
          company: string;
          numberMasked: string;
          isBasic?: boolean;
        };
      }
    | undefined;

  PaymentCardAdd: undefined;
  ChangePassword: undefined;
  InterestKeyword: undefined;
  CommunityPolicy: undefined;
  RestrictionHistory: undefined;
  InquiryHistory: undefined;
  NoticeTerms: undefined;
  ServiceTerms: undefined;
  LocationTerms: undefined;
  PrivacyPolicy: undefined;
  SymptomPolicy: undefined;
  Withdraw: undefined;

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

  AIAnalysis: {
    area: Area;
    category: string;
    location: string;
    symptoms: string[];
    otherText?: string;
    painScopes: PainScopeKey[];
    severityLevel: number;
    onset: OnsetKey;
  };

  Result: {
    summary: SummaryCard;
  };

  OTCMedicine: {
    suspected: string;
  };

  PharmacyMap: {
    query?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tutorial" component={TutorialScreen} />

        <Stack.Screen name="HamburgerMenu" component={HamburgerMenuScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
        <Stack.Screen name="PaymentCardAdd" component={PaymentCardAddScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="InterestKeyword" component={InterestKeywordScreen} />
        <Stack.Screen name="CommunityPolicy" component={CommunityPolicyScreen} />
        <Stack.Screen name="RestrictionHistory" component={RestrictionHistoryScreen} />
        <Stack.Screen name="InquiryHistory" component={InquiryHistoryScreen} />
        <Stack.Screen name="NoticeTerms" component={TermsNoticeScreen} />
        <Stack.Screen name="ServiceTerms" component={TermsServiceScreen} />
        <Stack.Screen name="LocationTerms" component={TermsLocationScreen} />
        <Stack.Screen name="PrivacyPolicy" component={TermsPrivacyScreen} />
        <Stack.Screen name="SymptomPolicy" component={TermsSymptomScreen} />
        <Stack.Screen name="Withdraw" component={TermsWithdrawScreen} />

        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="BodySelect" component={BodySelectScreen} />
        <Stack.Screen name="DetailCategory" component={DetailCategoryScreen} />
        <Stack.Screen name="DetailLocation" component={DetailLocationScreen} />
        <Stack.Screen name="SymptomSelect" component={SymptomSelectScreen} />
        <Stack.Screen name="PainScope" component={PainScopeScreen} />
        <Stack.Screen name="PainSeverity" component={PainSeverityScreen} />
        <Stack.Screen name="AIAnalysis" component={AIAnalysisScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="OTCMedicine" component={OTCMedicineScreen} />
        <Stack.Screen name="PharmacyMap" component={PharmacyMapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}