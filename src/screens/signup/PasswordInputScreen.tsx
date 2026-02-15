// src/screens/signup/PasswordInputScreen.tsx
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

type Props = { navigation?: any; route?: any };

const PasswordInputScreen: React.FC<Props> = ({ navigation, route }) => {
  const idFromPrev = route?.params?.id ?? '';

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const pwRef = useRef<TextInput | null>(null);
  const pw2Ref = useRef<TextInput | null>(null);

  const handleBack = () => navigation?.goBack();

  useEffect(() => {
    const t = setTimeout(() => pwRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  // ✅ 8~16자 + 영문(대/소) + 숫자 + 특수문자 포함
  const isPasswordValid = useMemo(() => {
    const v = password;
    if (v.length < 8 || v.length > 16) return false;
    const hasUpper = /[A-Z]/.test(v);
    const hasLower = /[a-z]/.test(v);
    const hasNumber = /[0-9]/.test(v);
    const hasSpecial = /[^A-Za-z0-9]/.test(v);
    return hasUpper && hasLower && hasNumber && hasSpecial;
  }, [password]);

  // ✅ 1차 조건 만족하면 2차 입력칸 노출
  const showConfirm = isPasswordValid;

  // ✅ 2차 입력이 일치하는지
  const isConfirmValid = useMemo(() => {
    if (!showConfirm) return false;
    return passwordConfirm.length > 0 && passwordConfirm === password;
  }, [passwordConfirm, password, showConfirm]);

  // ✅ 다음 버튼: 2차까지 일치해야 활성화
  const isNextDisabled = !isConfirmValid;

  const onNext = () => {
    navigation?.navigate('NameInput', {
      id: idFromPrev,
      password,
    });
  };

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
            {showConfirm
              ? '비밀번호를\n한번 더 입력해주세요'
              : '비밀번호를\n입력해주세요'}
          </Text>

          {/* 비밀번호 */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>비밀번호</Text>
            <Text style={styles.hintText}>
              8~16자의 영문 대/소문자, 숫자, 특수문자를 사용
            </Text>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              ref={pwRef}
              style={[styles.input, { flex: 1 }]}
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                // 1차 비밀번호가 바뀌면 2차는 무효화
                if (passwordConfirm) setPasswordConfirm('');
              }}
              placeholder=""
              placeholderTextColor="rgba(255,255,255,0.6)"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={() => {
                if (showConfirm) {
                  setTimeout(() => pw2Ref.current?.focus(), 80);
                }
              }}
            />

            <View
              style={[
                styles.checkCircle,
                isPasswordValid && styles.checkCircleOn,
              ]}
            >
              <Text style={styles.checkText}>✓</Text>
            </View>
          </View>

          <View style={styles.underline} />

          {/* 비밀번호 재입력: 조건 만족 후 등장 */}
          {showConfirm && (
            <>
              <View style={[styles.labelRow, { marginTop: 18 }]}>
                <Text style={styles.label}>비밀번호 재 확인</Text>
                <Text style={styles.hintText}>{' '}</Text>
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  ref={pw2Ref}
                  style={[styles.input, { flex: 1 }]}
                  value={passwordConfirm}
                  onChangeText={(t) => setPasswordConfirm(t)}
                  placeholder=""
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                />

                <View
                  style={[
                    styles.checkCircle,
                    isConfirmValid && styles.checkCircleOn,
                  ]}
                >
                  <Text style={styles.checkText}>✓</Text>
                </View>
              </View>

              <View style={styles.underline} />
            </>
          )}
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

export default PasswordInputScreen;

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
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 10,
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

  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  checkCircleOn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderColor: WHITE,
  },
  checkText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: '800',
    marginTop: -1,
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
