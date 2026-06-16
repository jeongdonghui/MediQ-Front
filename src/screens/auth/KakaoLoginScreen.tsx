// src/screens/auth/KakaoLoginScreen.tsx
import React from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'KakaoLogin'>;

const KAKAO_CLIENT_ID = 'c0cf15545d8db40675729418a3ddc1cd';
const REDIRECT_URI = `kakaoc0cf15545d8db40675729418a3ddc1cd://oauth`;
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

export default function KakaoLoginScreen({ navigation }: Props) {
  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;

    if (url.includes('code=')) {
      const code = url.split('code=')[1];
      console.log('Kakao Auth Code:', code);
      // In a real app, you would send this code to your backend to get an access token.
      // For now, we simulate a successful login and go to Home.
      navigation.replace('Home');
    }

    if (url.includes('error=')) {
      console.error('Kakao Login Error');
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>카카오 로그인</Text>
        <View style={{ width: 44 }} />
      </View>
      <WebView
        source={{ uri: KAKAO_AUTH_URL }}
        onNavigationStateChange={handleNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        originWhitelist={['*']}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 32,
    color: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
});
