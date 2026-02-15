// src/screens/signup/NameInputScreen.tsx
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

type Props = {
  navigation?: any;
  route?: any;
};

type Step = 'NAME' | 'NICKNAME';

export default function NameInputScreen({ navigation, route }: Props) {
  // ✅ 이전 화면에서 넘어온 값들(없어도 동작)
  const idFromPrev = route?.params?.id ?? '';
  const passwordFromPrev = route?.params?.password ?? '';

  const [step, setStep] = useState<Step>('NAME');

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');

  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, [step]);

  const handleBack = () => {
    // 닉네임 단계에서 뒤로가기면 이름 단계로
    if (step === 'NICKNAME') {
      setStep('NAME');
      return;
    }
    navigation?.goBack();
  };

  const titleText = useMemo(() => {
    return step === 'NAME'
      ? `이름을\n입력해주세요`
      : `닉네임을\n입력해주세요`;
  }, [step]);

  const labelText = useMemo(() => {
    return step === 'NAME' ? '이름' : '닉네임';
  }, [step]);

  const value = step === 'NAME' ? name : nickname;

  const isNextDisabled = useMemo(() => {
    if (step === 'NAME') return name.trim().length === 0;
    return nickname.trim().length === 0;
  }, [step, name, nickname]);

  const handleSubmit = () => {
    if (step === 'NAME') {
      const trimmed = name.trim();
      if (!trimmed) return;
      setName(trimmed);
      setStep('NICKNAME');
      return;
    }

    const trimmedNick = nickname.trim();
    if (!trimmedNick) return;
    setNickname(trimmedNick);

    // ✅ 두 화면(이름/닉네임) 끝나면 Birthdate로 이동
    navigation?.navigate('Birthdate', {
      id: idFromPrev,
      password: passwordFromPrev,
      name: name.trim(),
      nickname: trimmedNick,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: BLUE }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>{'‹'}</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>{titleText}</Text>

          <Text style={styles.label}>{labelText}</Text>

          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={(t) => {
              if (step === 'NAME') setName(t);
              else setNickname(t);
            }}
            placeholder=""
            placeholderTextColor="rgba(255,255,255,0.6)"
            returnKeyType="next"
            enablesReturnKeyAutomatically={true}
            keyboardType="default"
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={handleSubmit}
          />

          <View style={styles.underline} />
        </View>

        <TouchableOpacity
          style={[styles.nextBar, isNextDisabled && styles.nextBarDisabled]}
          activeOpacity={isNextDisabled ? 1 : 0.8}
          disabled={isNextDisabled}
          onPress={handleSubmit}
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

  backButton: {
    paddingVertical: 4,
    marginBottom: 8,
  },
  backText: {
    fontSize: 28,
    color: WHITE,
    fontWeight: '500',
  },

  content: {
    flex: 1,
    marginTop: 24,
  },

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
  nextBarDisabled: {
    opacity: 0.4,
  },
  nextBarText: {
    fontSize: 16,
    fontWeight: '600',
    color: BLUE,
  },
});
