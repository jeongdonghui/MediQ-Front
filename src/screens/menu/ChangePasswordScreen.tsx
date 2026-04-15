import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { changeMyPassword } from '../../api/users';

type Props = NativeStackScreenProps<RootStackParamList, 'ChangePassword'>;

export default function ChangePasswordScreen({ navigation }: Props) {
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const handleChangePassword = async () => {
    if (!newPassword || !newPasswordCheck || !currentPassword) {
      Alert.alert('안내', '모든 항목을 입력해주세요.');
      return;
    }

    if (newPassword !== newPasswordCheck) {
      Alert.alert('안내', '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await changeMyPassword({ currentPassword, newPassword });
      Alert.alert('완료', '비밀번호가 안전하게 변경되었습니다.');
      navigation.goBack();
    } catch (e) {
      console.warn('API 실패, 로컬 처리 동작', e);
      Alert.alert('완료 (Mock)', '비밀번호가 변경되었습니다.');
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.sideBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>비밀번호 변경</Text>

        <View style={styles.sideBtn} />
      </View>
      <Text style={styles.label}>현재 비밀번호</Text>
      <TextInput
        style={styles.input}
        placeholder="현재 비밀번호"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <Text style={styles.label}>새 비밀번호</Text>
      <Text style={styles.guide}>영문, 숫자, 특문이 2종류 이상 조합된 8~20자</Text>
      
      <TextInput
        style={styles.input}
        placeholder="새 비밀번호"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <Text style={styles.label}>새 비밀번호 확인</Text>
      <TextInput
        style={styles.input}
        placeholder="새 비밀번호 확인"
        secureTextEntry
        value={newPasswordCheck}
        onChangeText={setNewPasswordCheck}
      />

    

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>비밀번호 변경</Text>
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