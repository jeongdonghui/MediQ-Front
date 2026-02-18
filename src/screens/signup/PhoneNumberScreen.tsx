// src/screens/signup/PhoneNumberScreen.tsx
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

export default function PhoneNumberScreen({ navigation, route }: Props) {
  const params = route?.params ?? {};

  const id: string = params.id ?? '';
  const password: string = params.password ?? '';
  const name: string = params.name ?? '';
  const nickname: string = params.nickname ?? '';
  const birthFront6: string = params.birthFront6 ?? '';
  const birthBack1: string = params.birthBack1 ?? '';

  // ✅ 뒤로 갔다가 다시 왔을 때 값 유지
  const initialPhone = (params.phone ?? '')
    .toString()
    .replace(/\D/g, '')
    .slice(0, 11);

  const [phone, setPhone] = useState(initialPhone);
  const inputRef = useRef<TextInput | null>(null);

  // ✅ 중복 이동 방지(연타/중복 호출)
  const navLockRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  // ✅ 뒤로: goBack 우선, 스택 비정상일 때 Birthdate로 복구
  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    navigation?.reset?.({
      index: 0,
      routes: [
        {
          name: 'Birthdate',
          params: { id, password, name, nickname },
        },
      ],
    });
  };

  const isNextDisabled = useMemo(() => phone.trim().length < 10, [phone]);

  const onNext = () => {
    if (navLockRef.current) return;

    const trimmed = phone.trim();
    if (trimmed.length < 10) return;

    navLockRef.current = true;
    Keyboard.dismiss();

    navigation?.navigate('CheckInfo', {
      id,
      password,
      name,
      nickname,
      birthFront6,
      birthBack1,
      phone: trimmed,
    });

    setTimeout(() => {
      navLockRef.current = false;
    }, 600);
  };

  const onChangePhone = (t: string) => {
    const digits = t.replace(/\D/g, '').slice(0, 11);
    setPhone(digits);
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
          <Text style={styles.title}>휴대폰 번호를{'\n'}입력해주세요</Text>
          <Text style={styles.label}>휴대폰번호</Text>

          <TextInput
            ref={inputRef}
            style={styles.input}
            value={phone}
            onChangeText={onChangePhone}
            placeholder="01012345678"
            placeholderTextColor="rgba(255,255,255,0.6)"
            keyboardType="number-pad"
            returnKeyType="done"
            maxLength={11}
            // ✅ 엔터로 next 호출은 중복 위험이 있어 버튼만 사용(필요하면 onSubmitEditing={onNext} + lock 유지)
          />

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
  label: { fontSize: 13, color: WHITE, opacity: 0.9, marginBottom: 8 },
  input: { fontSize: 16, color: WHITE, paddingVertical: 4 },
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
  nextBarText: { fontSize: 16, fontWeight: '600', color: BLUE },
});