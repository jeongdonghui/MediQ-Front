// src/screens/signup/IdInputScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const BLUE = '#3FA2FF';
const WHITE = '#FFFFFF';

type Props = { navigation?: any };

const IdInputScreen: React.FC<Props> = ({ navigation }) => {
  const [id, setId] = useState('');
  const idRef = useRef<TextInput | null>(null);

  const handleBack = () => navigation?.goBack();

  useEffect(() => {
    const t = setTimeout(() => {
      idRef.current?.focus();
    }, 150);
    return () => clearTimeout(t);
  }, []);

  const trimmedId = useMemo(() => id.trim(), [id]);

  // ✅ 아주 기본 이메일 형태 체크
  const isEmailLike = useMemo(() => {
    const v = trimmedId;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }, [trimmedId]);

  // ✅ 다음 화면: 비밀번호 입력 화면으로 이동
  const onNext = () => {
    navigation?.navigate('PasswordInput', { id: trimmedId });
  };

  // ✅ "다음"은 이메일 형식이 올바를 때만 활성
  const isNextDisabled = !trimmedId || !isEmailLike;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: BLUE }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>
            아이디를{'\n'}입력해주세요
          </Text>

          {/* ✅ 라벨 + 우측 안내문구(디자인 디테일) */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>아이디</Text>
            <Text style={styles.hintText}>이메일 형식으로 작성해주세요</Text>
          </View>

          {/* 아이디 입력 */}
          <View style={styles.inputRow}>
            <TextInput
              ref={idRef}
              style={[styles.input, { flex: 1 }]}
              value={id}
              onChangeText={setId}
              placeholder=""
              placeholderTextColor="rgba(255,255,255,0.6)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>

          <View style={styles.underline} />
        </View>

        {/* ✅ 하단 흰 바 버튼 */}
        <TouchableOpacity
          style={[styles.nextBar, isNextDisabled && styles.nextBarDisabled]}
          activeOpacity={isNextDisabled ? 1 : 0.8}
          disabled={isNextDisabled}
          onPress={onNext}
        >
          <Text style={styles.nextBarText}>다음</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default IdInputScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLUE,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 56,
  },

  backButton: { paddingVertical: 4, marginBottom: 8 },
  backText: { fontSize: 28, color: WHITE, fontWeight: '500' },

  content: { flex: 1, marginTop: 24 },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: WHITE,
    lineHeight: 34,
    marginBottom: 40,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  label: {
    fontSize: 13,
    color: WHITE,
    opacity: 0.9,
  },

  hintText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  input: {
    fontSize: 16,
    color: WHITE,
    paddingVertical: 4,
  },

  underline: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },

  nextBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 56,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBarDisabled: { opacity: 0.4 },
  nextBarText: {
    fontSize: 16,
    fontWeight: '600',
    color: BLUE,
  },
});