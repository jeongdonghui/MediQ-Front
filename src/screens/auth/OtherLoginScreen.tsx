// src/screens/auth/OtherLoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';

const BLUE = '#3FA2FF';
const WHITE = '#FFFFFF';

type Props = {
  navigation?: any;
};

const OtherLoginScreen: React.FC<Props> = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleBack = () => {
    navigation?.goBack?.();
  };

  const handleLogin = () => {
    console.log('MediQ 자체 로그인', { userId, password });
  };

  const handleFindId = () => {
    console.log('아이디 찾기');
  };

  const handleFindPw = () => {
    console.log('비밀번호 찾기');
  };

  return (
    <View style={styles.container}>
      {/* 상단 파란 영역 */}
      <View style={styles.topBlue} />

      {/* 흰 카드 */}
      <View style={styles.card}>
        {/* ✅ 헤더(원래 위치 유지: 카드 안) */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            style={styles.backBtn}
          >
            {/* ✅ [CHANGED] '<' → '‹' (모양만 변경) */}
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>MediQ 자체 로그인</Text>

          {/* 오른쪽 공간 맞춤용 더미 */}
          <View style={styles.headerRightDummy} />
        </View>

        {/* 입력 영역 */}
        <View style={styles.formArea}>
          <View style={styles.inputShadowWrap}>
            <TextInput
              value={userId}
              onChangeText={setUserId}
              placeholder="아이디"
              placeholderTextColor="#A3A3A3"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <View style={[styles.inputShadowWrap, { marginTop: 14 }]}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호"
              placeholderTextColor="#A3A3A3"
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>

          <View style={styles.findRow}>
            <TouchableOpacity onPress={handleFindId} activeOpacity={0.7}>
              <Text style={styles.findText}>아이디 찾기</Text>
            </TouchableOpacity>

            <Text style={styles.findDivider}> | </Text>

            <TouchableOpacity onPress={handleFindPw} activeOpacity={0.7}>
              <Text style={styles.findText}>비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 하단 로그인 버튼 */}
        <View style={styles.bottomArea}>
          <TouchableOpacity
            onPress={handleLogin}
            activeOpacity={0.85}
            style={styles.loginBtn}
          >
            <Text style={styles.loginBtnText}>로그인</Text>
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

  // 상단 파란 영역
  topBlue: {
    height: 120,
    backgroundColor: BLUE,
  },

  // 흰 카드
  card: {
    flex: 1,
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 18,
  },

  // 헤더
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backText: {
    // ✅ [CHANGED] 모양/느낌만 부드럽게
    fontSize: 28,
    fontWeight: '500',
    color: '#111111',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },
  headerRightDummy: {
    width: 36,
    height: 36,
  },

  // 폼 영역
  formArea: {
    paddingTop: 8,
  },

  // 입력창
  inputShadowWrap: {
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  input: {
    height: 52,
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#111111',
  },

  // 아이디/비번 찾기
  findRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  findText: {
    fontSize: 12,
    color: '#8A8A8A',
    fontWeight: '600',
  },
  findDivider: {
    fontSize: 12,
    color: '#B0B0B0',
    marginHorizontal: 6,
  },

  // 하단 로그인 버튼
  bottomArea: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  loginBtn: {
    height: 54,
    borderRadius: 10,
    backgroundColor: '#5FB2FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
