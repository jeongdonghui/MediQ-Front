// src/screens/diagnosis/PainSeverityScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, OnsetKey } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'PainSeverity'>;

export default function PainSeverityScreen({ navigation, route }: Props) {
  const { area, category, location, symptoms, otherText, painScopes } = route.params;

  const [severityLevel, setSeverityLevel] = useState(1); // 0~4
  const [onset, setOnset] = useState<OnsetKey>('NOW');

  const faces = useMemo(
    () => [
      { label: '거의 안 아파요', emoji: '🙂' },
      { label: '약간 거슬려요', emoji: '🙂' },
      { label: '불편해요', emoji: '😕' },
      { label: '꽤 아파요', emoji: '😣' },
      { label: '너무 아파요', emoji: '🚑' },
    ],
    []
  );

  const onsetItems = useMemo(
    () => [
      { key: 'NOW' as const, label: '방금전' },
      { key: 'TODAY' as const, label: '오늘' },
      { key: 'YESTERDAY' as const, label: '어제' },
      { key: 'DAYS_2_3' as const, label: '2-3일' },
      { key: 'WEEK_PLUS' as const, label: '일주일이상' },
      { key: 'MONTH_PLUS' as const, label: '1달이상' },
    ],
    []
  );

  const goNext = () => {
    navigation.navigate('AIAnalysis', {
      area,
      category,
      location,
      symptoms,
      otherText,
      painScopes,
      severityLevel,
      onset,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
          <Text style={styles.backTxt}>{'‹'}</Text>
        </Pressable>
        <Text style={styles.topTitle}>통증강도 / 발생시점</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressTrack} />
        <View style={[styles.progressFill, { width: '82%' }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.sevCard}>
          <Text style={styles.h1}>얼마나 아프신가요?</Text>
          <Text style={styles.h2}>통증의 정도를 선택해주세요.</Text>

          <View style={styles.faceWrap}>
            <Text style={styles.faceEmoji}>{faces[severityLevel].emoji}</Text>
            <Text style={styles.faceLabel}>{faces[severityLevel].label}</Text>
          </View>

          <View style={styles.sliderWrap}>
            <Slider
              minimumValue={0}
              maximumValue={4}
              step={1}
              value={severityLevel}
              onValueChange={setSeverityLevel}
              minimumTrackTintColor={BLUE}
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor={BLUE}
            />
            <View style={styles.sliderTicks}>
              <Text style={styles.tick}>약함</Text>
              <Text style={styles.tick}>보통</Text>
              <Text style={styles.tick}>매우 심함</Text>
            </View>
          </View>
        </View>

        <View style={styles.onsetHeader}>
          <Text style={styles.h3}>언제부터 그러셨나요?</Text>
        </View>

        <View style={styles.onsetGrid}>
          {onsetItems.map((it) => {
            const active = onset === it.key;
            return (
              <Pressable
                key={it.key}
                onPress={() => setOnset(it.key)}
                style={({ pressed }) => [
                  styles.onsetBtn,
                  active && styles.onsetBtnActive,
                  pressed && { opacity: 0.98 },
                ]}
              >
                <Text style={[styles.onsetTxt, active && styles.onsetTxtActive]}>{it.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      <View style={styles.bottom}>
        <Pressable onPress={goNext} style={styles.cta}>
          <Text style={styles.ctaTxt}>AI 분석 시작</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const BLUE = '#3B82F6';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F4F6' },

  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backTxt: { fontSize: 28, color: '#111827', lineHeight: 30 },
  topTitle: { fontSize: 13, fontWeight: '900', color: '#111827' },

  progressWrap: { height: 6, marginHorizontal: 16, marginBottom: 10, position: 'relative' },
  progressTrack: { height: 3, backgroundColor: '#E5E7EB', borderRadius: 999 },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 3,
    backgroundColor: BLUE,
    borderRadius: 999,
  },

  scroll: { paddingHorizontal: 18, paddingBottom: 20 },

  sevCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  h1: { fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 6 },
  h2: { fontSize: 12, color: '#6B7280' },

  faceWrap: { marginTop: 14, alignItems: 'center' },
  faceEmoji: { fontSize: 26, marginBottom: 6 },
  faceLabel: { fontSize: 13, fontWeight: '900', color: '#111827' },

  sliderWrap: { marginTop: 12 },
  sliderTicks: { marginTop: 6, flexDirection: 'row', justifyContent: 'space-between' },
  tick: { fontSize: 10.5, color: '#9CA3AF', fontWeight: '800' },

  onsetHeader: { marginTop: 14, marginBottom: 10 },
  h3: { fontSize: 12.5, fontWeight: '900', color: '#111827' },

  onsetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  onsetBtn: {
    width: '48%',
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  onsetBtnActive: {
    backgroundColor: '#DCEBFF',
    borderColor: BLUE,
  },
  onsetTxt: { fontSize: 12, fontWeight: '900', color: '#111827' },
  onsetTxtActive: { color: BLUE },

  bottom: { paddingHorizontal: 18, paddingBottom: 18, paddingTop: 10 },
  cta: {
    height: 52,
    borderRadius: 12,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTxt: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
});