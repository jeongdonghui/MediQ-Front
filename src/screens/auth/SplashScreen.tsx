// src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const WHITE = '#FFFFFF';

type Props = {
  navigation?: any;
  route?: any;
};

const SplashScreen: React.FC<Props> = ({ navigation, route }) => {
  useEffect(() => {
    const initApp = async () => {
      // 1. 목적지 결정
      let nextScreen = route?.params?.next;
      const payload = route?.params?.payload ?? undefined;

      if (!nextScreen) {
        // 앱 초기 구동 시 토큰 체크
        try {
          const token = await AsyncStorage.getItem('accessToken');
          nextScreen = token ? 'Home' : 'Login';
        } catch (e) {
          nextScreen = 'Login';
        }
      }

      // 2. 1.5초 대기 후 이동
      const timer = setTimeout(() => {
        navigation?.reset({
          index: 0,
          routes: [{ name: nextScreen, params: payload }],
        });
      }, 1500);

      return timer;
    };

    let t: any;
    initApp().then(timer => { t = timer; });

    return () => { if (t) clearTimeout(t); };
  }, [navigation, route]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/image/logo_mediqC.png')}
        style={styles.logo}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180, // 시안 비율 맞게 적당히
    height: 60,
    resizeMode: 'contain',
  },
});
