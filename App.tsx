import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IntroScreen from './src/screens/IntroScreen';
import BodyPickScreen from './src/screens/BodyPickScreen';
import SymptomScreen from './src/screens/SymptomScreen';
import DecisionScreen from './src/screens/DecisionScreen';
import ChatScreen from './src/screens/ChatScreen';

import { DiagnosisProvider } from './src/state/diagnosis';

export type RootStackParamList = {
  Intro: undefined;
  BodyPick: undefined;
  Symptom: undefined;
  Decision: undefined;
  Chat: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <DiagnosisProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Intro"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="BodyPick" component={BodyPickScreen} />
          <Stack.Screen name="Symptom" component={SymptomScreen} />
          <Stack.Screen name="Decision" component={DecisionScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </DiagnosisProvider>
  );
}