import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Withdraw'>;

export default function TermsWithdrawScreen({ navigation }: Props) {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const canSubmit = useMemo(() => {
    return password.trim().length > 0 && passwordConfirm.trim().length > 0;
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
        />

        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.inputBox}
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          placeholder="비밀번호 재 입력"
          placeholderTextColor="#B6B6B6"
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.withdrawBtn, !canSubmit && styles.withdrawBtnDisabled]}
          onPress={() => canSubmit && setShowConfirm(true)}
          disabled={!canSubmit}
        >
          <Text style={styles.withdrawBtnText}>탈퇴</Text>
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
              >
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>

              <View style={styles.confirmVertical} />

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => {
                  setShowConfirm(false);
                  navigation.goBack();
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