// src/screens/NameInputScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
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

const NameInputScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const inputRef = useRef<TextInput | null>(null);

  const handleBack = () => {
    navigation?.goBack();
  };

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    console.log('입력한 이름:', trimmed);
    // TODO: 다음 화면으로 이동 (예: PhoneInput)
    navigation?.navigate('Birthdate', { name: trimmed });
  };

  // 화면 진입 후 약간 딜레이 주고 자동 포커스
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  const isNextDisabled = name.trim().length === 0;

  return (
    <View style={styles.container}>
      {/* 상단 뒤로가기 버튼 */}
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Text style={styles.backText}>{'‹'}</Text>
      </TouchableOpacity>

      {/* 메인 내용 */}
      <View style={styles.content}>
        <Text style={styles.title}>
          이름을{'\n'}입력해주세요
        </Text>

        <Text style={styles.label}>이름</Text>

        <TextInput
          ref={inputRef}
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder=""
          placeholderTextColor="rgba(255,255,255,0.6)"
          returnKeyType="next"                 // iOS에서 키보드 “다음” 버튼
          enablesReturnKeyAutomatically={true} // 내용 없을 때 비활성화
          keyboardType="default"
          autoCapitalize="none"
          onSubmitEditing={handleSubmit}       // 키보드 “다음” 눌렀을 때
        />

        <View style={styles.underline} />
      </View>

      {/* ⬇⬇ 화면 하단 고정 “다음” 버튼 (키보드 안 떠도 사용 가능) */}
      <TouchableOpacity
        style={[styles.nextButton, isNextDisabled && styles.nextButtonDisabled]}
        activeOpacity={isNextDisabled ? 1 : 0.8}
        disabled={isNextDisabled}
        onPress={handleSubmit}
      >
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NameInputScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLUE,
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  backButton: {
    paddingVertical: 4,
    marginBottom: 8,
  },
  backText: {
    fontSize: 20,
    color: WHITE,
    fontWeight: '400',
  },

  content: {
    flex: 1,           // 남은 공간 채우고
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

  // 하단 “다음” 버튼 (임시/보조용)
  nextButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: BLUE,
  },
});
