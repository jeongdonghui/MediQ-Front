// src/screens/VerifyCodeScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
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
  route?: any;
};

const VERIFY_DURATION = 120; // 2분

const VerifyCodeScreen: React.FC<Props> = ({ navigation, route }) => {
  const phone = route?.params?.phone ?? ''; // 010... 넘겨받는다고 가정

  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(VERIFY_DURATION);

  const inputRef = useRef<TextInput | null>(null);

  const handleBack = () => {
    navigation?.goBack();
  };

  // 타이머
  useEffect(() => {
    setSecondsLeft(VERIFY_DURATION);

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 화면 들어오면 자동 포커스
  useEffect(() => {
    const t = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
    return () => clearTimeout(t);
  }, []);

  const handleChangeCode = (text: string) => {
    const onlyNums = text.replace(/[^0-9]/g, '');
    setCode(onlyNums.slice(0, 6));
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleResend = () => {
    console.log('인증번호 재전송 요청');
    // TODO: 실제 재전송 API 연동
    setSecondsLeft(VERIFY_DURATION);
  };

  const isConfirmEnabled = code.length === 6 && secondsLeft > 0;

  const handleConfirm = () => {
    if (!isConfirmEnabled) return;
    console.log('인증번호 확인:', code);

    // TODO: 실제 인증 성공 후 다음 화면으로 이동
    navigation?.navigate('Splash');
  };

  return (
    <View style={styles.container}>
      {/* 상단 뒤로가기 */}
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Text style={styles.backText}>{'‹'}</Text>
      </TouchableOpacity>

      {/* 메인 내용 */}
      <View style={styles.content}>
        <Text style={styles.title}>
          인증번호를{'\n'}입력해주세요
        </Text>

        {/* 설명 텍스트 */}
        <Text style={styles.description}>
          {phone || '01012345678'}번호에 인증번호를 보냈어요
        </Text>

        {/* 인증번호 입력 레이블 + 타이머 */}
        <View style={styles.labelRow}>
          <Text style={styles.label}>인증번호 입력</Text>
          <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
        </View>

        {/* 코드 입력 */}
        <TextInput
          ref={inputRef}
          style={styles.codeInput}
          value={code}
          onChangeText={handleChangeCode}
          keyboardType="number-pad"
          maxLength={6}
          placeholder=""
          placeholderTextColor="rgba(255,255,255,0.7)"
          onSubmitEditing={handleConfirm}
        />
        <View style={styles.underline} />

        {/* 재전송 링크 */}
        <View style={styles.resendRow}>
          <Text style={styles.resendText}>
            인증문자가 오지 않나요?{' '}
          </Text>
          <TouchableOpacity onPress={handleResend} activeOpacity={0.8}>
            <Text style={styles.resendLink}>인증번호 재전송</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 키보드 위 "인증" 바 (코드 입력 시에만 표시) */}
      {code.length > 0 && (
        <TouchableOpacity
          style={[
            styles.confirmBar,
            !isConfirmEnabled && styles.confirmBarDisabled,
          ]}
          activeOpacity={isConfirmEnabled ? 0.8 : 1}
          disabled={!isConfirmEnabled}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmBarText}>인증</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VerifyCodeScreen;

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

  description: {
    fontSize: 13,
    color: WHITE,
    opacity: 0.9,
    marginBottom: 24,
  },

  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  label: {
    fontSize: 13,
    color: WHITE,
    opacity: 0.9,
    marginBottom: 8,
  },

  timerText: {
    fontSize: 13,
    color: WHITE,
    opacity: 0.9,
  },

  codeInput: {
    fontSize: 22,
    color: WHITE,
    paddingVertical: 4,
    letterSpacing: 4,
  },

  underline: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },

  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },

  resendText: {
    fontSize: 12,
    color: WHITE,
    opacity: 0.9,
  },

  resendLink: {
    fontSize: 12,
    color: WHITE,
    textDecorationLine: 'underline',
  },

  // 하단 인증 바
  confirmBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0, // 키보드 올라오면 바로 위에 붙는 느낌
    height: 52,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBarDisabled: {
    opacity: 0.5,
  },
  confirmBarText: {
    fontSize: 16,
    fontWeight: '600',
    color: BLUE,
  },
});
