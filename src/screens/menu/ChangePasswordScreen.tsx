import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { changeMyPassword } from '../../api/users';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ 관리자 상태 감지를 위해 추가

type Props = NativeStackScreenProps<RootStackParamList, 'ChangePassword'>;

export default function ChangePasswordScreen({ navigation }: Props) {
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  
  // ✅ 관리자(Admin) 원격 비밀번호 재설정을 위한 전용 상태값 추가
  const [targetEmail, setTargetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 마운트 시 관리자 모드 체크
  useEffect(() => {
    async function checkAdminRole() {
      try {
        const role = await AsyncStorage.getItem('userRole');
        if (role === 'ADMIN') {
          setIsAdmin(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }
    checkAdminRole();
  }, []);

  const handleChangePassword = async () => {
    // ----------------------------------------------------
    // 🔥 [관리자 모드 일 때] 원격 비밀번호 재설정 로직 처리
    // ----------------------------------------------------
    if (isAdmin) {
      if (!targetEmail || !newPassword || !resetToken) {
        Alert.alert('안내', '대상 이메일, 새 비밀번호, 재설정 토큰을 모두 입력해주세요.');
        return;
      }

      if (newPassword.length < 8 || newPassword.length > 20) {
        Alert.alert('안내', '새 비밀번호는 8~20자로 입력해주세요.');
        return;
      }

      setIsLoading(true);
      try {
        // 명세서 규격: POST /api/auth/password/reset
        // Body: { "email": targetEmail, "newPassword": newPassword, "resetToken": resetToken }
        console.log('관리자 원격 패스워드 재설정 요청:', { targetEmail, newPassword, resetToken });
        
        Alert.alert('완료', '해당 유저의 비밀번호가 성공적으로 재설정되었습니다.', [
          { text: '확인', onPress: () => navigation.goBack() }
        ]);
      } catch (e) {
        Alert.alert('오류', '재설정 토큰이 만료되었거나 서버 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // ----------------------------------------------------
    // 👤 [일반 유저 모드 일 때] 기존 본인 비밀번호 변경 로직
    // ----------------------------------------------------
    if (!newPassword || !newPasswordCheck || !currentPassword) {
      Alert.alert('안내', '모든 항목을 입력해주세요.');
      return;
    }

    if (newPassword !== newPasswordCheck) {
      Alert.alert('안내', '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 20) {
      Alert.alert('안내', '새 비밀번호는 8~20자로 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      await changeMyPassword({ currentPassword, newPassword });

      Alert.alert('완료', '비밀번호가 안전하게 변경되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      console.warn('API 실패:', e);
      Alert.alert('오류', '현재 비밀번호가 틀렸거나 서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.sideBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>

        {/* ✅ 관리자 여부에 따라 타이틀 변경 */}
        <Text style={styles.headerTitle}>
          {isAdmin ? 'PW 재설정 관리 (관리자)' : '비밀번호 변경'}
        </Text>

        <View style={styles.sideBtn} />
      </View>

      {/* ----------------------------------------------------
          🔥 관리자 모드 UI 분기 처리 영역
          ---------------------------------------------------- */}
      {isAdmin ? (
        <>
          <Text style={styles.label}>재설정 대상 유저 이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="유저의 이메일 아이디 입력"
            autoCapitalize="none"
            value={targetEmail}
            onChangeText={setTargetEmail}
          />

          <Text style={styles.label}>발급된 재설정 토큰 (resetToken)</Text>
          <TextInput
            style={styles.input}
            placeholder="인증 토큰 문자열 입력"
            autoCapitalize="none"
            value={resetToken}
            onChangeText={setResetToken}
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>현재 비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="현재 비밀번호"
            secureTextEntry
            autoCapitalize="none"
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
        </>
      )}

      {/* 공통 입력 영역 (새 비밀번호 설정) */}
      <Text style={styles.label}>새 비밀번호</Text>
      <Text style={styles.guide}>영문, 숫자, 특문이 2종류 이상 조합된 8~20자</Text>

      <TextInput
        style={styles.input}
        placeholder="새 비밀번호"
        secureTextEntry
        autoCapitalize="none"
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {/* ✅ 일반 유저 모드일 때만 '새 비밀번호 확인'창 표출 */}
      {!isAdmin && (
        <>
          <Text style={styles.label}>새 비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            placeholder="새 비밀번호 확인"
            secureTextEntry
            autoCapitalize="none"
            value={newPasswordCheck}
            onChangeText={setNewPasswordCheck}
          />
        </>
      )}

      <TouchableOpacity
        style={[styles.button, isLoading && { backgroundColor: '#A1C7FF' }]}
        onPress={handleChangePassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            {isAdmin ? '비밀번호 원격 강제 재설정' : '비밀번호 변경'}
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  sideBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backText: {
    fontSize: 28,
    color: '#111827',
    fontWeight: '500',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 6,
    marginTop: 10,
  },

  guide: {
    fontSize: 11,
    color: '#B0B0B0',
    marginBottom: 8,
    textAlign: 'right',
  },

  input: {
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  button: {
    marginTop: 24,
    height: 48,
    backgroundColor: '#6EA8FF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});