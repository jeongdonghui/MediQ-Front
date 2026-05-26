// src/screens/diagnosis/AIAnalysisScreen.tsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Image,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { createReport } from '../../api/reports';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AIAnalysis'
>;

const BLUE = '#3B82F6';
const BG = '#F6F7FB';

const mascot = require('../../assets/image/mediq_character.png');

export default function AIAnalysisScreen({
  navigation,
  route,
}: Props) {
  // ✅ 이전 단계에서 전달받은 문진 데이터
  const {
    area,
    category,
    location,
    symptoms,
    otherText,
    painScopes,
    severityLevel,
    onset,
  } = route.params;

  // ✅ AI 분석 단계 텍스트
  const phases = useMemo(
    () => [
      {
        title: 'AI가 증상을 정리 중이에요',
        sub: '선택한 정보들을 구조화하고 있어요',
      },
      {
        title: '가능성 높은 원인을 추리는 중',
        sub: '증상 패턴을 매칭하고 있어요',
      },
      {
        title: '증상 특성을 분석 중',
        sub: '가능한 원인을 정리하고 있어요',
      },
      {
        title: 'MediQ 리포트 작성 중',
        sub: '결과를 보기 좋게 정리하고 있어요',
      },
    ],
    []
  );

  const [pct, setPct] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [reportId, setReportId] = useState<number | null>(
    null
  );

  const done = pct >= 100;

  // ✅ 회전 애니메이션
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (done) return;

    spin.setValue(0);

    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    loop.start();

    return () => loop.stop();
  }, [done, spin]);

  const spinDeg = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // ✅ AI 분석 및 서버 저장
  useEffect(() => {
    // =========================
    // 실제 서버로 전송되는 JSON
    // =========================

    const requestBody = {
      body_input_data: {
        step_1_main_area: area || '',
        step_2_detailed_region: category || '',
        step_3_sub_region: location || '',
        step_4_symptom: {
          type:
            symptoms && symptoms.length > 0
              ? symptoms[0]
              : 'UNKNOWN',

          is_other: !!otherText,

          other_symptom_detail: otherText || '',
        },

        step_5_pain_range:
          painScopes && painScopes.length > 0
            ? painScopes[0]
            : 'LOCALIZED',

        step_6_intensity: severityLevel || 0,

        step_7_onset_time: onset || 'TODAY',
      },
    };

    // ✅ 디버깅 로그
    console.log(
      'REPORT REQUEST:',
      JSON.stringify(requestBody, null, 2)
    );

    // ✅ 서버 API 요청
    createReport(requestBody)
      .then(res => {
        console.log(
          'AI Report created successfully:',
          res
        );

        // ✅ 서버에서 생성된 report id 저장
        // POST /api/reports 는 Long 숫자 하나만 반환 (res 자체가 reportId)
        if (res !== null && res !== undefined) {
          setReportId(Number(res));
        }
      })
      .catch(err => {
        console.warn(
          'Failed to create AI Report:',
          err
        );
      });

    // =========================
    // 퍼센트 애니메이션
    // =========================

    let mounted = true;

    const timer = setInterval(() => {
      setPct(prev => {
        if (!mounted) return prev;

        if (prev >= 100) {
          return 100;
        }

        const boost =
          prev < 45
            ? 3
            : prev < 80
              ? 2
              : 1;

        const next = Math.min(100, prev + boost);

        // 단계 변경
        const nextPhase =
          next < 30
            ? 0
            : next < 60
              ? 1
              : next < 85
                ? 2
                : 3;

        setPhaseIdx(nextPhase);

        return next;
      });
    }, 120);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [
    area,
    category,
    location,
    symptoms,
    otherText,
    painScopes,
    severityLevel,
    onset,
  ]);

  // ✅ 결과 화면 이동
  const goResult = () => {
    navigation.replace('Result', {
      reportId,
      summary: {
        // 실제 병명/진료과/설명은 ResultScreen에서 GET /api/reports/{reportId} 응답의
        // aiAnalysisResult 필드를 파싱하여 표시합니다.
        suspected: '분석 중...',
        english: '',
        shortExplain: '',
        bodyPartLabel: location,
        checklist: [
          {
            label: '선택 증상',
            value: symptoms?.length ? symptoms.join(', ') : '없음',
          },
          { label: '발생 시점', value: String(onset) },
          { label: '통증 강도', value: String(severityLevel) },
          {
            label: '통증 범위',
            value: painScopes?.length ? painScopes.join(', ') : '미선택',
          },
        ],
        department: '',
        urgency:
          severityLevel >= 4 ? 'HIGH' : severityLevel >= 3 ? 'MEDIUM' : 'LOW',
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        AI 증상 분석
      </Text>

      <Text style={styles.h1}>
        {phases[phaseIdx].title}
      </Text>

      <Text style={styles.h2}>
        {phases[phaseIdx].sub}
      </Text>

      <View style={styles.visualWrap}>
        <View style={styles.glow} />

        <Animated.View
          style={[
            styles.ringSpin,
            {
              transform: [
                {
                  rotate: spinDeg,
                },
              ],
            },
          ]}
        >
          <View style={styles.ringBase} />
          <View style={styles.ringAccent} />
        </Animated.View>

        <View style={styles.centerCircle}>
          <Text style={styles.pct}>
            {pct}%
          </Text>

          <Text style={styles.pctSub}>
            {done ? '완료' : '분석 중'}
          </Text>
        </View>

        <Image
          source={mascot}
          style={styles.mascot}
          resizeMode="contain"
        />
      </View>

      {done && (
        <Pressable
          style={styles.btn}
          onPress={goResult}
        >
          <Text style={styles.btnTxt}>
            결과 확인
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const R = 210;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    paddingTop: 70,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111827',
    opacity: 0.75,
    marginBottom: 10,
  },

  h1: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
  },

  h2: {
    marginTop: 6,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },

  visualWrap: {
    width: R,
    height: R,
    marginTop: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  glow: {
    position: 'absolute',
    width: R + 34,
    height: R + 34,
    borderRadius: 999,
    backgroundColor: '#DCEBFF',
    opacity: 0.9,
  },

  ringSpin: {
    position: 'absolute',
    width: R,
    height: R,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ringBase: {
    position: 'absolute',
    width: R,
    height: R,
    borderRadius: 999,
    borderWidth: 10,
    borderColor: '#E7EEFF',
  },

  ringAccent: {
    position: 'absolute',
    width: R,
    height: R,
    borderRadius: 999,
    borderWidth: 10,
    borderColor: 'transparent',
    borderTopColor: BLUE,
    borderRightColor: BLUE,
  },

  centerCircle: {
    width: R - 56,
    height: R - 56,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },

  pct: {
    fontSize: 26,
    fontWeight: '900',
    color: BLUE,
  },

  pctSub: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '900',
    color: '#6B7280',
  },

  mascot: {
    position: 'absolute',
    top: -12,
    width: 86,
    height: 86,
  },

  btn: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 26,
    height: 54,
    borderRadius: 14,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnTxt: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },
});