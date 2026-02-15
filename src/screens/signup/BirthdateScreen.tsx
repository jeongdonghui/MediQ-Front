// src/screens/signup/BirthdateScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';

const BLUE = '#3FA2FF';
const WHITE = '#FFFFFF';

type Props = { navigation?: any; route?: any };

export default function BirthdateScreen({ navigation, route }: Props) {
  const params = route?.params ?? {};

  const id: string = params.id ?? '';
  const password: string = params.password ?? '';
  const name: string = params.name ?? '';
  const nickname: string = params.nickname ?? '';

  // ✅ 뒤로 갔다가 다시 왔을 때 값 유지(있으면 채우기)
  const initialFront6 = (params.birthFront6 ?? '').toString().replace(/\D/g, '').slice(0, 6);
  const initialBack1 = (params.birthBack1 ?? '').toString().replace(/\D/g, '').slice(0, 1);

  // 앞 6자리(YYMMDD) + 뒤 1자리
  const [front6, setFront6] = useState(initialFront6);
  const [back1, setBack1] = useState(initialBack1);

  const frontRef = useRef<TextInput | null>(null);
  const backRef = useRef<TextInput | null>(null);

  // ✅ 중복 이동 방지(연타/중복 렌더)
  const navLockRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      // 값이 이미 6자리면 뒤로 바로 포커스
      if (front6.length === 6) backRef.current?.focus();
      else frontRef.current?.focus();
    }, 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ 뒤로는 goBack, 스택이 비정상이면 NameInput으로 복구
  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation?.reset?.({
      index: 0,
      routes: [{ name: 'NameInput', params: { id, password } }],
    });
  };

  const onChangeFront = (t: string) => {
    const digits = t.replace(/\D/g, '').slice(0, 6);
    setFront6(digits);

    if (digits.length === 6) {
      // 키보드 이벤트/렌더 타이밍 때문에 약간 딜레이
      setTimeout(() => backRef.current?.focus(), 60);
    }
  };

  const onChangeBack = (t: string) => {
    const digit = t.replace(/\D/g, '').slice(0, 1);
    setBack1(digit);
  };

  const isNextDisabled = useMemo(
    () => front6.length !== 6 || back1.length !== 1,
    [front6, back1],
  );

  const onNext = () => {
    if (navLockRef.current) return;
    if (front6.length !== 6 || back1.length !== 1) return;

    navLockRef.current = true;
    Keyboard.dismiss();

    navigation?.navigate('PhoneNumber', {
      id,
      password,
      name,
      nickname,
      birthFront6: front6,
      birthBack1: back1,
    });

    setTimeout(() => {
      navLockRef.current = false;
    }, 600);
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
            생년월일을{'\n'}입력해주세요
          </Text>

          <Text style={styles.label}>생년월일</Text>

          <View style={styles.birthRow}>
            <TextInput
              ref={frontRef}
              style={[styles.input, styles.frontInput]}
              value={front6}
              onChangeText={onChangeFront}
              placeholder="예시:900101"
              placeholderTextColor="rgba(255,255,255,0.6)"
              keyboardType="number-pad"
              returnKeyType="next"
              maxLength={6}
              onSubmitEditing={() => {
                if (front6.length === 6) backRef.current?.focus();
              }}
            />

            <Text style={styles.hyphen}> - </Text>

            <TextInput
              ref={backRef}
              style={[styles.input, styles.backInput]}
              value={back1}
              onChangeText={onChangeBack}
              placeholder=""
              placeholderTextColor="rgba(255,255,255,0.6)"
              keyboardType="number-pad"
              returnKeyType="done"
              secureTextEntry
              maxLength={1}
              onSubmitEditing={onNext} // ✅ 여기서만 next 호출(버튼과 중복되지만 lock으로 1회만)
            />

            <Text style={styles.dots}>●●●●●●</Text>
          </View>

          <View style={styles.underline} />
        </View>

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
}

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

  label: {
    fontSize: 13,
    color: WHITE,
    opacity: 0.9,
    marginBottom: 8,
  },

  birthRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    fontSize: 16,
    color: WHITE,
    paddingVertical: 4,
  },
  frontInput: { width: 140 },
  hyphen: {
    color: WHITE,
    fontSize: 16,
    marginHorizontal: 8,
    opacity: 0.9,
  },
  backInput: { width: 30, textAlign: 'center' },
  dots: {
    marginLeft: 10,
    color: WHITE,
    fontSize: 16,
    letterSpacing: 2,
    opacity: 0.9,
  },

  underline: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginTop: 8,
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
  nextBarText: { fontSize: 16, fontWeight: '600', color: BLUE },
});