// src/screens/diagnosis/OTCMedicineScreen.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'OTCMedicine'>;

const BLUE = '#3B82F6';
const BG = '#EEF2F7';

export default function OTCMedicineScreen({ navigation, route }: Props) {
  const { suspected } = route.params;

  const content = useMemo(() => {
    // ✅ 스샷처럼 “편두통”이면 통증 중심 예시
    if (suspected === '편두통') {
      return {
        headerTitle: '종합 분석 결과',
        bubble: '근처 약국이나 편의점에서 구매가능해요!',
        cardTitle: '추천 상비약',
        note:
          '※ 아래 상비약은 경미한 증상 완화 목적이며,\n통증이 지속되거나 심해질 경우 즉시 병원 방문을 권장합니다.',
        sectionTitle: '통증만 있는 경우 (열·염증 거의 없음)',
        rows: [
          { k: '추천 성분', v: '아세트아미노펜 (Acetaminophen)' },
          { k: '대표 계열', v: '타이레놀' },
          { k: '주의사항', v: '증상이 지속되거나 악화되면 병원 방문,\n음주 후 복용 금지' },
        ],
        bottomCta: '내 주변 약국 찾기',
      };
    }

    // ✅ 그 외는 기본 템플릿
    return {
      headerTitle: '종합 분석 결과',
      bubble: '근처 약국이나 편의점에서 구매가능해요!',
      cardTitle: '추천 상비약',
      note:
        '※ 아래 상비약은 경미한 증상 완화 목적이며,\n통증이 지속되거나 심해질 경우 즉시 병원 방문을 권장합니다.',
      sectionTitle: '통증만 있는 경우 (열·염증 거의 없음)',
      rows: [
        { k: '추천 성분', v: '아세트아미노펜' },
        { k: '대표 계열', v: '타이레놀' },
        { k: '주의사항', v: '지속/악화 시 진료 권장' },
      ],
      bottomCta: '내 주변 약국 찾기',
    };
  }, [suspected]);

  const goPharmacy = () => navigation.navigate('PharmacyMap', { query: '약국' });

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.pop()} style={styles.topBtn}>
          <Text style={styles.topBtnText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.topTitle}>{content.headerTitle}</Text>

        <View style={styles.topBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 스샷처럼 카드 위 검정 말풍선 */}
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{content.bubble}</Text>
        </View>

        {/* 메인 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{content.cardTitle}</Text>
          <Text style={styles.note}>{content.note}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>{content.sectionTitle}</Text>

          {/* 표 형태 */}
          <View style={styles.table}>
            {content.rows.map((r, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.k}>{r.k}</Text>
                <Text style={styles.v}>{r.v}</Text>
              </View>
            ))}
          </View>

          {/* 가운데 회색 '이전' 버튼 */}
          <TouchableOpacity style={styles.midBtn} onPress={() => navigation.pop()}>
            <Text style={styles.midBtnText}>이전</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 하단 파란 버튼 */}
      <TouchableOpacity style={styles.bottomBtn} onPress={goPharmacy}>
        <Text style={styles.bottomBtnText}>{content.bottomCta}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  topBar: {
    height: 52,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  topBtn: { width: 72 },
  topBtnText: { fontSize: 26, color: '#111' },
  topTitle: { flex: 1, textAlign: 'center', fontWeight: '900', color: '#111827' },

  scroll: { padding: 18, paddingBottom: 110 },

  bubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 12,
  },
  bubbleText: { color: '#fff', fontSize: 12, fontWeight: '900' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },

  cardTitle: { fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 8 },

  note: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    lineHeight: 16,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 14,
    marginBottom: 14,
  },

  sectionTitle: { fontSize: 15, fontWeight: '900', color: '#111827', marginBottom: 10 },

  table: { marginTop: 2 },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  k: {
    width: 86,
    fontSize: 12,
    fontWeight: '800',
    color: '#9CA3AF',
  },
  v: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'right',
    lineHeight: 18,
  },

  midBtn: {
    marginTop: 16,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  midBtnText: { color: '#111827', fontWeight: '900' },

  bottomBtn: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    height: 54,
    borderRadius: 12,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
});