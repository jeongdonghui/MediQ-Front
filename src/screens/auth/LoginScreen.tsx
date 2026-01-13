// src/screens/LoginScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

type Props = {
  navigation?: any;
};

const BLUE = '#3FA2FF';
const WHITE = '#FFFFFF';

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const handleKakaoLogin = () => {
    console.log('카카오 로그인');
  };

  const handleAppleLogin = () => {
    console.log('애플 로그인');
  };

  const handleOtherLogin = () => {
    console.log('다른 방법으로 로그인');
    navigation?.navigate('OtherLogin');
  };

  return (
    <View style={styles.container}>
      {/* 가운데 로고 */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/image/logo_mediq.png')}
          style={styles.logoImage}
        />
      </View>

      {/* 하단 버튼 영역 */}
      <View style={styles.bottomContainer}>
        {/* 카카오 로그인 버튼 */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleKakaoLogin}
          style={styles.buttonWrapper}
        >
          <Image
            source={require('../../assets/image/btn_kakao.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>

        {/* 애플 로그인 버튼 */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleAppleLogin}
          style={[styles.buttonWrapper, styles.appleButtonWrapper]}
        >
          <Image
            source={require('../../assets/image/btn_apple.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>

        {/* 다른 방법으로 로그인 */}
        <TouchableOpacity
          onPress={handleOtherLogin}
          activeOpacity={0.7}
          style={styles.otherLoginWrapper}
        >
          <Text style={styles.otherLoginText}>다른 방법으로 로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLUE,
  },

  // ===== 로고 영역 =====
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 190,   // 시안 기준 대략 비율
    height: 80,
    resizeMode: 'contain',
  },

  // ===== 하단 버튼 영역 =====
  bottomContainer: {
    paddingHorizontal: 32,
    paddingBottom: 42,
  },

  // 버튼을 감싸는 공통 박스 (두 버튼 크기 완전 동일)
  buttonWrapper: {
    width: '100%',
    height: 56,        // 시안보다 살짝 크게 (필요하면 52로 줄여도 됨)
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 12,
  },
  appleButtonWrapper: {
    marginTop: 6,
  },

  // 실제 버튼 이미지 (틀 내부를 꽉 채우도록)
  buttonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // “다른 방법으로 로그인”
  otherLoginWrapper: {
    marginTop: 10,
    alignItems: 'center',
  },
  otherLoginText: {
    fontSize: 12,
    color: WHITE,
    opacity: 0.95,
  },
})