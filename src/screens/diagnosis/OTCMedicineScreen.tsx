// src/screens/diagnosis/OTCMedicineScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { getMedicinesByDisease, OtcMedicineResponse } from '../../api/medicines';

type Props = NativeStackScreenProps<RootStackParamList, 'OTCMedicine'>;

const BLUE = '#3B82F6';
const BG = '#EEF2F7';

export default function OTCMedicineScreen({
  navigation,
  route,
}: Props) {
  const { suspected } = route.params;

  const [medicineData, setMedicineData] = useState<OtcMedicineResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);

        const res = await getMedicinesByDisease(suspected);

        setMedicineData(res);
      } catch (err: any) {
        console.warn('상비약 조회 실패', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [suspected]);

  const goPharmacy = () =>
    navigation.navigate('PharmacyMap', { query: '약국' });

  const isPrescriptionOnly =
    medicineData?.medicines?.some((m: any) =>
      m.ingredientName?.includes('처방 필수')
    ) || false;

  const recommendedIngredients = medicineData?.medicines
    ? medicineData.medicines
        .map((m: any) => `${m.rank}. ${m.ingredientName}`)
        .join('\n')
    : '-';

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.pop()}
          style={styles.topBtn}
        >
          <Text style={styles.topBtnText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.topTitle}>종합 분석 결과</Text>

        <View style={styles.topBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>
            근처 약국이나 편의점에서 구매가능해요!
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>추천 상비약</Text>

          <Text style={styles.note}>
            ※ 아래 상비약은 경미한 증상 완화 목적이며,{'\n'}
            통증이 지속되거나 심해질 경우 즉시 병원 방문을 권장합니다.
          </Text>

          <View style={styles.divider} />

          {loading ? (
            <ActivityIndicator size="large" color={BLUE} />
          ) : notFound ? (
            <View>
              <Text style={styles.sectionTitle}>
                추천 가능한 상비약이 없습니다.
              </Text>
              <Text style={styles.warningText}>
                병원 진료를 권장합니다.
              </Text>
            </View>
          ) : (
            <>
              {/* 증상 시나리오 */}
              {medicineData?.scenario ? (
                <Text style={styles.scenario}>
                  {medicineData.scenario}
                </Text>
              ) : null}

              <Text style={styles.sectionTitle}>
                통증 완화 추천 의약품 (Top 3)
              </Text>

              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.k}>추천 성분</Text>
                  <Text style={styles.v}>
                    {recommendedIngredients}
                  </Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.k}>증상 시나리오</Text>
                  <Text style={styles.v}>
                    {medicineData?.scenario || '-'}
                  </Text>
                </View>

                <View style={styles.tableRow}>
                  <Text style={styles.k}>주의사항</Text>
                  <Text style={styles.v}>
                    {medicineData?.caution || '-'}
                  </Text>
                </View>
              </View>
            </>
          )}

          <TouchableOpacity
            style={styles.midBtn}
            onPress={() => navigation.pop()}
          >
            <Text style={styles.midBtnText}>이전</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.bottomBtn}
        onPress={goPharmacy}
      >
        <Text style={styles.bottomBtnText}>
          내 주변 약국 찾기
        </Text>
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

  topBtnText: {
    fontSize: 26,
    color: '#111',
  },

  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '900',
    color: '#111827',
  },

  scroll: {
    padding: 18,
    paddingBottom: 110,
  },

  bubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 12,
  },

  bubbleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },

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

  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
  },

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

  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 10,
  },

  warningText: {
    fontSize: 13,
    color: '#EF4444',
    lineHeight: 20,
    fontWeight: '700',
  },

  scenario: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '700',
    marginBottom: 10,
    lineHeight: 18,
  },

  table: {
    marginTop: 2,
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
  },

  cautionRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 4,
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

  cautionText: {
    color: '#EF4444',
    fontWeight: '700',
  },

  midBtn: {
    marginTop: 16,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  midBtnText: {
    color: '#111827',
    fontWeight: '900',
  },

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

  bottomBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
});