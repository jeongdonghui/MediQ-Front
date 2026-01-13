// src/screens/OtherLoginScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

const BLUE = '#3FA2FF';
const WHITE = '#FFFFFF';

type Props = {
  navigation?: any;
};

const OtherLoginScreen: React.FC<Props> = ({ navigation }) => {
  const handleFacebook = () => {
    console.log('페이스북으로 시작하기');
  };

  const handleNaver = () => {
    console.log('네이버로 시작하기');
  };

  const handleCert = () => {
    console.log('본인 인증으로 시작하기');
    navigation?.navigate('NameInput'); // ✅ 이름 입력 화면으로 이동
  };

  return (
    <View style={styles.container}>
      {/* 상단 로고 (LoginScreen과 동일 구조) */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/image/logo_mediq.png')}
          style={styles.logoImage}
        />
      </View>

      {/* 하단 카드 영역 */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>다른 방법으로 로그인</Text>

          {/* 1. 페이스북 */}
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.8}
            onPress={handleFacebook}
          >
            <Image
              source={require('../../assets/image/btn_facebook.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.rowText}>페이스북으로 시작하기</Text>
          </TouchableOpacity>

          {/* 2. 네이버 */}
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.8}
            onPress={handleNaver}
          >
            <Image
              source={require('../../assets/image/btn_naver.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.rowText}>네이버로 시작하기</Text>
          </TouchableOpacity>

          {/* 3. 본인 인증 */}
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.8}
            onPress={handleCert}
          >
            <Image
              source={require('../../assets/image/btn_phone.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.rowText}>본인 인증으로 시작하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OtherLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLUE,
  },

  // 로고 영역 (LoginScreen 기준)
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 220,
    height: 90,
    resizeMode: 'contain',
  },

  // ⬇️ 아래 공백 줄이기: marginBottom 제거
  cardContainer: {
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  rowText: {
    fontSize: 15,
    color: '#222222',
  },
});
