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

type Step = 'INPUT_ID' | 'SENT_CODE';

const IdInputScreen: React.FC<Props> = ({ navigation }) => {
  const [step, setStep] = useState<Step>('INPUT_ID');

  const [id, setId] = useState('');
  const [code, setCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  // ✅ 인증 성공 여부: 성공해도 입력칸 유지, "다음" 버튼만 활성화
  const [isVerified, setIsVerified] = useState(false);

  // ✅ 인증코드 단계에서만 쓰는 타이머(2:00 시작)
  const [remainSec, setRemainSec] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const idRef = useRef<TextInput | null>(null);
  const codeRef = useRef<TextInput | null>(null);

  const handleBack = () => navigation?.goBack();

  // ✅ unmount 시 interval 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, []);

  // ✅ 단계별 포커스
  useEffect(() => {
    const t = setTimeout(() => {
      if (step === 'INPUT_ID') idRef.current?.focus();
      if (step === 'SENT_CODE') codeRef.current?.focus();
    }, 150);
    return () => clearTimeout(t);
  }, [step]);

  // ✅ 인증코드 단계에서만 타이머 시작
  useEffect(() => {
    if (step !== 'SENT_CODE') {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    // 중복 실행 방지
    if (timerRef.current) return;

    timerRef.current = setInterval(() => {
      setRemainSec(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [step]);

  const trimmedId = useMemo(() => id.trim(), [id]);

  const mmss = useMemo(() => {
    const m = Math.floor(remainSec / 60);
    const s = remainSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, [remainSec]);

  // ✅ 아주 기본 이메일 형태 체크
  const isEmailLike = useMemo(() => {
    const v = trimmedId;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }, [trimmedId]);

  // ---------------------------
  // TODO: 실제 API로 교체할 자리
  // ---------------------------
  // ✅ TS 에러 방지: Promise<void> + setTimeout 콜백 래핑
  const fakeWait = (ms: number): Promise<void> =>
    new Promise<void>(resolve => {
      setTimeout(() => resolve(), ms);
    });

  // ✅ "인증하기" (코드 발송/재발송)
  const onSendCode = async () => {
    if (!trimmedId || !isEmailLike) return;

    try {
      setIsLoading(true);
      await fakeWait(300);

      // 프론트용: 코드 새로 받는 상황이니 인증 상태/입력 초기화
      setIsVerified(false);
      setCode('');
      setRemainSec(120); // ✅ 2분 시작
      setStep('SENT_CODE');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 인증코드 확인 (성공하면 "다음"만 활성화)
  const onVerifyCode = async () => {
    if (!code.trim()) return;

    try {
      setIsLoading(true);
      await fakeWait(300);

      // TODO: 코드 검증 API 결과 true일 때만
      setIsVerified(true);
      // ✅ 디자인: 성공 문구/입력칸 사라짐 없음 → 그대로 유지
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 다음 화면: 비밀번호 입력 화면으로 이동
  const onNext = () => {
    navigation?.navigate('PasswordInput', { id: trimmedId });
  };

  // ✅ 아이디가 바뀌면 인증 단계 무효화
  const onChangeId = (t: string) => {
    setId(t);
    setIsVerified(false);

    if (step !== 'INPUT_ID') {
      setStep('INPUT_ID');
      setCode('');
      setRemainSec(0);
    }
  };

  // ✅ 재전송 버튼
  const onResendCode = async () => {
    await onSendCode();
  };

  // ✅ 버튼 활성 조건
  const isSendDisabled = !trimmedId || !isEmailLike || isLoading;

  // ✅ "다음"은 인증 성공(isVerified)일 때만 활성 (자동 이동 X)
  const isNextDisabled = !isVerified || isLoading;

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
            {step === 'SENT_CODE'
              ? '인증코드를\n입력해주세요'
              : '아이디를\n입력해주세요'}
          </Text>

          {/* ✅ 라벨 + 우측 안내문구(디자인 디테일) */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>아이디</Text>
            <Text style={styles.hintText}>이메일 형식으로 작성해주세요</Text>
          </View>

          {/* 아이디 입력 + 우측 "인증하기" 버튼 */}
          <View style={styles.inputRow}>
            <TextInput
              ref={idRef}
              style={[styles.input, { flex: 1 }]}
              value={id}
              onChangeText={(t) => onChangeId(t)}
              placeholder=""
              placeholderTextColor="rgba(255,255,255,0.6)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />

            <TouchableOpacity
              style={[styles.pillBtn, isSendDisabled && styles.pillBtnDisabled]}
              activeOpacity={0.8}
              disabled={isSendDisabled}
              onPress={onSendCode}
            >
              <Text style={styles.pillBtnText}>
                {isLoading ? '...' : '인증하기'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.underline} />

          {/* ✅ 인증코드 입력(이때만 타이머 + 재전송 UI) */}
          {step === 'SENT_CODE' && (
            <>
              <View style={[styles.labelRow, { marginTop: 18 }]}>
                <Text style={styles.label}>인증코드</Text>
                {/* 디자인에는 우측 안내문구 없음 */}
                <Text style={styles.hintText}>{' '}</Text>
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  ref={codeRef}
                  style={[styles.input, { flex: 1 }]}
                  value={code}
                  onChangeText={(t) => {
                    setCode(t);
                    // 코드가 바뀌면 다시 검증 필요
                    if (isVerified) setIsVerified(false);
                  }}
                  placeholder=""
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                />

                <Text style={styles.timerText}>{mmss}</Text>

                <TouchableOpacity
                  style={[
                    styles.pillBtn,
                    (!code.trim() || remainSec === 0) && styles.pillBtnDisabled,
                  ]}
                  activeOpacity={0.8}
                  disabled={!code.trim() || remainSec === 0 || isLoading}
                  onPress={onVerifyCode}
                >
                  <Text style={styles.pillBtnText}>
                    {isLoading ? '...' : '확인'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.underline} />

              {/* ✅ 디자인: "인증코드가 오지 않았나요?  인증코드 재전송" */}
              <View style={styles.resendRow}>
                <Text style={styles.resendText}>인증코드가 오지 않았나요?</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={isLoading || !trimmedId || !isEmailLike}
                  onPress={onResendCode}
                >
                  <Text style={styles.resendLink}>인증코드 재전송</Text>
                </TouchableOpacity>
              </View>
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

  pillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: WHITE,
  },
  pillBtnDisabled: { opacity: 0.5 },
  pillBtnText: {
    color: BLUE,
    fontWeight: '700',
    fontSize: 12,
  },

  timerText: {
    color: WHITE,
    fontWeight: '700',
    fontSize: 12,
  },

  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  resendText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
  },
  resendLink: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
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