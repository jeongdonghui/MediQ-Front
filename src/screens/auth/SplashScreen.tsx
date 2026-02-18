// src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const WHITE = '#FFFFFF';

type Props = {
  navigation?: any;
  route?: any;
};

const SplashScreen: React.FC<Props> = ({ navigation, route }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // 다음으로 갈 화면 이름 (없으면 Login으로)
      const nextScreen = route?.params?.next ?? 'Home';

      // 필요하면 같이 넘긴 데이터도 payload에 넣어서 사용 가능
      const payload = route?.params?.payload ?? undefined;

      navigation?.reset({
        index: 0,
        routes: [{ name: nextScreen, params: payload }],
      });
    }, 1500); // 1.5초 후 이동

    return () => clearTimeout(timer);
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
