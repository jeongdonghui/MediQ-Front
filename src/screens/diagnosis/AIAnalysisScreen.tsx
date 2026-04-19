// src/screens/diagnosis/AIAnalysisScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { createReport } from '../../api/reports';

type Props = NativeStackScreenProps<RootStackParamList, 'AIAnalysis'>;

const BLUE = '#3B82F6';
const BG = '#F6F7FB';
const mascot = require('../../assets/image/mediq_character.png');

export default function AIAnalysisScreen({ navigation, route }: Props) {
  // ✅ AppNavigator에서 정의한 이름 그대로 받아야 함
  const { area, location, symptoms, painScopes, severityLevel, onset } = route.params;

  const phases = useMemo(
    () => [
      { title: 'AI가 증상을 정리 중이에요', sub: '선택한 정보들을 구조화하고 있어요' },
      { title: '가능성 높은 원인을 추리는 중', sub: '증상 패턴을 매칭하고 있어요' },
      { title: '증상 특성을 분석 중', sub: '가능한 원인을 정리하고 있어요' },
      { title: 'MediQ 리포트 작성 중', sub: '결과를 보기 좋게 정리하고 있어요' },
    ],
    []
  );

  const [pct, setPct] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const done = pct >= 100;

  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ✅ done이면 회전 멈춤
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

  const [reportId, setReportId] = useState<number | null>(null);

  useEffect(() => {
    // ✅ 서버에 문진 기록 전송 API 호출 (비동기로 백그라운드 처리)
    createReport({
      mainSymptom: `[${location}] ${symptoms?.join(', ') || '관련 증상'}`,
      painIntensity: severityLevel || 0,
      symptomArea: painScopes && painScopes.length > 0 ? painScopes[0] : 'LOCALIZED', // ✅ body area가 아닌 통증 범위를 전달
      symptomDuration: onset || 'TODAY',
      additionalSymptom: painScopes?.join(', ') || ''
    }).then(res => {
      console.log('AI Report created successfully:', res);
      if (res && res.id) {
        setReportId(res.id);
      }
    }).catch(err => {
      console.warn('Failed to create AI Report:', err);
    });

    let mounted = true;

    const id = setInterval(() => {
      setPct((prev) => {
        if (!mounted) return prev;
        if (prev >= 100) return 100;

        const boost = prev < 45 ? 3 : prev < 80 ? 2 : 1;
        const next = Math.min(100, prev + boost);
        return next;
      });
    }, 120);

    // pct가 변할 때 phaseIdx를 업데이트하거나, setInterval 내에서 따로 계산
    // 여기서는 간단히 pct를 감시하는 또 다른 useEffect를 쓰거나, setInterval 내에서 pct 값을 직접 관리하는 것이 좋음.
    // 하지만 현재 구조를 최소한으로 수정하여 에러를 피함.
    const phaseCheckId = setInterval(() => {
      if (!mounted) return;
      setPct(currentPct => {
        const nextPhase = currentPct < 30 ? 0 : currentPct < 60 ? 1 : currentPct < 85 ? 2 : 3;
        setPhaseIdx(nextPhase);
        return currentPct;
      });
    }, 120);


    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const goResult = () => {
    const suspected = area === 'HEAD_FACE' ? '편두통' : '근육통';
    const english = area === 'HEAD_FACE' ? 'Migraine' : 'Myalgia';

    navigation.replace('Result', {
      reportId: reportId,
      summary: {
        suspected,
        english,
        shortExplain:
          suspected === '편두통'
            ? '한쪽 머리가 지끈거리고 빛/소리에 예민해질 수 있어요.'
            : '근육 과사용/긴장/염좌 등으로 통증이 생길 수 있어요.',
        bodyPartLabel: location,
        checklist: [
          { label: '선택 증상', value: symptoms?.length ? symptoms.join(', ') : '없음' },
          { label: '발생 시점', value: String(onset) },
          { label: '통증 강도', value: String(severityLevel) },
          { label: '통증 범위', value: painScopes?.length ? painScopes.join(', ') : '미선택' },
        ],
        department: suspected === '편두통' ? '신경과 / 가정의학과' : '정형외과 / 재활의학과',
        urgency: severityLevel >= 4 ? 'HIGH' : severityLevel >= 3 ? 'MEDIUM' : 'LOW',
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI 증상 분석</Text>
      <Text style={styles.h1}>{phases[phaseIdx].title}</Text>
      <Text style={styles.h2}>{phases[phaseIdx].sub}</Text>

      <View style={styles.visualWrap}>
        <View style={styles.glow} />

        <Animated.View style={[styles.ringSpin, { transform: [{ rotate: spinDeg }] }]}>
          <View style={styles.ringBase} />
          <View style={styles.ringAccent} />
        </Animated.View>

        <View style={styles.centerCircle}>
          <Text style={styles.pct}>{pct}%</Text>
          <Text style={styles.pctSub}>{done ? '완료' : '분석 중'}</Text>
        </View>

        <Image source={mascot} style={styles.mascot} resizeMode="contain" />
      </View>

      {done && (
        <Pressable style={styles.btn} onPress={goResult}>
          <Text style={styles.btnTxt}>결과 확인</Text>
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
  title: { fontSize: 12, fontWeight: '900', color: '#111827', opacity: 0.75, marginBottom: 10 },
  h1: { fontSize: 18, fontWeight: '900', color: '#111827', textAlign: 'center' },
  h2: { marginTop: 6, fontSize: 12.5, fontWeight: '700', color: '#6B7280', textAlign: 'center', lineHeight: 18 },

  visualWrap: { width: R, height: R, marginTop: 34, alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', width: R + 34, height: R + 34, borderRadius: 999, backgroundColor: '#DCEBFF', opacity: 0.9 },

  ringSpin: { position: 'absolute', width: R, height: R, alignItems: 'center', justifyContent: 'center' },
  ringBase: { position: 'absolute', width: R, height: R, borderRadius: 999, borderWidth: 10, borderColor: '#E7EEFF' },
  ringAccent: { position: 'absolute', width: R, height: R, borderRadius: 999, borderWidth: 10, borderColor: 'transparent', borderTopColor: BLUE, borderRightColor: BLUE },

  centerCircle: { width: R - 56, height: R - 56, borderRadius: 999, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EEF2FF' },
  pct: { fontSize: 26, fontWeight: '900', color: BLUE },
  pctSub: { marginTop: 6, fontSize: 12, fontWeight: '900', color: '#6B7280' },

  mascot: { position: 'absolute', top: -12, width: 86, height: 86 },

  btn: { position: 'absolute', left: 20, right: 20, bottom: 26, height: 54, borderRadius: 14, backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center' },
  btnTxt: { color: '#fff', fontSize: 15, fontWeight: '900' },
});