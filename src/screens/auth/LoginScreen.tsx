// src/screens/auth/LoginScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

import { login as kakaoSdkLogin } from '@react-native-seoul/kakao-login';
import { loginWithKakao } from '../../api/auth';
import { saveTokens } from '../../utils/storage';

type Props = {
  navigation?: any;
};

const BLUE = '#3FA2FF';
const WHITE = '#FFFFFF';

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const handleKakaoLogin = async () => {
    try {
      // 1. 카카오 공식 SDK 띄워서 카카오 앱을 통한 로그인 (또는 웹뷰)
      const token = await kakaoSdkLogin();
      
      // 2. 받은 카카오 토큰을 우리 백엔드로 전달
      const res = await loginWithKakao(token.accessToken);
      
      // 3. 백엔드에서 내려준 JWT 저장 후 홈으로 이동
      if (res.accessToken) {
        await saveTokens(res.accessToken, res.refreshToken);
        Alert.alert('로그인 성공', '카카오 로그인 되었습니다.');
        navigation?.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        Alert.alert('로그인 성공', '서버 응답에 토큰이 없습니다.');
      }
    } catch (err: any) {
      if (err?.code === 'E_CANCELLED_OPERATION') {
        console.log('사용자가 로그인을 취소함');
      } else {
        console.error('Kakao login error: ', err);
        Alert.alert('로그인 실패', '카카오 로그인 중 오류가 발생했습니다.');
      }
    }
  };

  const handleMediqLogin = () => {
    console.log('MediQ 자체 로그인');
    navigation?.navigate('OtherLogin'); // ✅ 기존 OtherLogin을 “MediQ 로그인” 화면으로 쓸 예정이면 유지
  };

  const handleSignup = () => {
    console.log('회원가입');
    navigation?.navigate('IdInput'); // ✅ [CHANGED] 회원가입 → 아이디 입력 화면으로 이동
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

        {/* ✅ [CHANGED] MediQ 자체 로그인 버튼 (btn_mediq) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleMediqLogin}
          style={[styles.buttonWrapper, styles.mediqButtonWrapper]}
        >
          <Image
            source={require('../../assets/image/btn_mediq.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>

        {/* ✅ [CHANGED] 회원가입 */}
        <TouchableOpacity
          onPress={handleSignup}
          activeOpacity={0.7}
          style={styles.signupWrapper}
        >
          <Text style={styles.signupText}>회원가입</Text>
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
    width: 190,
    height: 80,
    resizeMode: 'contain',
  },

  // ===== 하단 버튼 영역 =====
  bottomContainer: {
    paddingHorizontal: 32,
    paddingBottom: 42,
  },

  buttonWrapper: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 12,
  },

  // ✅ [CHANGED] 두 번째 버튼 상단 간격만 살짝
  mediqButtonWrapper: {
    marginTop: 6,
  },

  buttonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // ✅ [CHANGED] 회원가입 텍스트
  signupWrapper: {
    marginTop: 10,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 12,
    color: WHITE,
    opacity: 0.95,
  },
});
