import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator, // ✅ 탈퇴 처리 중 중복 클릭 방지용 로딩 추가
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withdrawAccount } from '../../api/users';

type Props = NativeStackScreenProps<RootStackParamList, 'Withdraw'>;

export default function TermsWithdrawScreen({ navigation }: Props) {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ 로딩 상태 관리 추가

  const canSubmit = useMemo(() => {
    // ✅ 두 입력창이 비어있지 않고, 두 비밀번호가 서로 일치할 때만 버튼 활성화
    return (
      password.trim().length > 0 &&
      passwordConfirm.trim().length > 0 &&
      password === passwordConfirm
    );
  }, [password, passwordConfirm]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.sideBtn} />
        <Text style={styles.title}>회원탈퇴</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideBtn}>
          <Text style={styles.close}>X</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>아이디</Text>
        <View style={styles.inputBoxDisabled}>
          <Text style={styles.disabledText}>hong123</Text>
        </View>

        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.inputBox}
          value={password}
          onChangeText={setPassword}
          placeholder="현재 비밀번호"
          placeholderTextColor="#B6B6B6"
          secureTextEntry
          autoCapitalize="none" // ✅ 첫 글자 대문자 자동 변환 방지
        />

        <Text style={styles.label}>비밀번호 확인</Text> {/* 라벨 텍스트 가독성 보완 */}
        <TextInput
          style={styles.inputBox}
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          placeholder="비밀번호 재 입력"
          placeholderTextColor="#B6B6B6"
          secureTextEntry
          autoCapitalize="none" // ✅ 첫 글자 대문자 자동 변환 방지
        />

        <TouchableOpacity
          style={[styles.withdrawBtn, (!canSubmit || isLoading) && styles.withdrawBtnDisabled]}
          onPress={() => canSubmit && !isLoading && setShowConfirm(true)}
          disabled={!canSubmit || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.withdrawBtnText}>탈퇴</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalBox}>
            <Text style={styles.confirmTitle}>정말로 탈퇴하시겠습니까?</Text>
            <View style={styles.modalDivider} />
            <View style={styles.confirmRow}>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => setShowConfirm(false)}
                disabled={isLoading}
              >
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>

              <View style={styles.confirmVertical} />

              <TouchableOpacity
                style={styles.confirmBtn}
                disabled={isLoading}
                onPress={async () => {
                  setShowConfirm(false);
                  setIsLoading(true);
                  try {
                    // ✅ 명세서 규칙에 맞춰 실제 회원 탈퇴 API 호출
                    await withdrawAccount();

                    // ✅ 서버에서 탈퇴 성공 처리가 떨어졌을 때만 로컬 저장소 토큰 삭제 진행
                    await AsyncStorage.removeItem('accessToken');
                    await AsyncStorage.removeItem('refreshToken');

                    // 오타 수정 ('탈퇴 환료' -> '탈퇴 완료')
                    Alert.alert('탈퇴 완료', '그동안 서비스를 이용해 주셔서 감사합니다.', [
                      {
                        text: '확인',
                        onPress: () => {
                          if (navigation.reset) {
                            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                          } else {
                            navigation.goBack();
                          }
                        }
                      }
                    ]);
                  } catch (e) {
                    console.warn('API 실패:', e);
                    // ⭕ 서버 통신이 완전히 실패한 경우 강제로 앱 진입을 막고 오류 유저 피드백을 주도록 수정
                    Alert.alert('오류', '비밀번호가 일치하지 않거나 서버 오류로 인해 탈퇴 처리에 실패했습니다.');
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                <Text style={styles.withdrawText}>탈퇴</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  sideBtn: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },
  close: {
    fontSize: 22,
    color: '#111111',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  label: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 8,
    marginTop: 18,
  },
  inputBoxDisabled: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F1F1F1',
    justifyContent: 'center',
    paddingHorizontal: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  disabledText: {
    color: '#A3A3A3',
    fontSize: 14,
    fontWeight: '600',
  },
  inputBox: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#111111',
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  withdrawBtn: {
    marginTop: 22,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#6EA8FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  withdrawBtnDisabled: {
    backgroundColor: '#A9C8F8',
  },
  withdrawBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  confirmModalBox: {
    width: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingTop: 22,
  },
  confirmTitle: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 16,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmBtn: {
    flex: 1,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmVertical: {
    width: 1,
    height: 46,
    backgroundColor: '#E5E7EB',
  },
  cancelText: {
    color: '#6EA8FF',
    fontSize: 15,
    fontWeight: '700',
  },
  withdrawText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: '700',
  },
});