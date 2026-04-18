// src/screens/diagnosis/ResultScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export default function ResultScreen({ navigation, route }: Props) {
  const { summary } = route.params;
  const [isSaved, setIsSaved] = useState(false);

  const goOTC = () => navigation.navigate('OTCMedicine', { suspected: summary.suspected });
  const goPharmacy = () => navigation.navigate('PharmacyMap', { query: '약국' });

  const registerToCalendar = async () => {
    try {
      const existingRecordsStr = await AsyncStorage.getItem('DIAGNOSIS_RECORDS');
      const records = existingRecordsStr ? JSON.parse(existingRecordsStr) : [];
      
      const newRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        summary: summary,
        // Determine type for color-coding
        type: summary.suspected.includes('두통') ? 'MIGRAINE' : (summary.suspected.includes('복통') ? 'STOMACH' : 'OTHER'),
      };

      records.push(newRecord);
      await AsyncStorage.setItem('DIAGNOSIS_RECORDS', JSON.stringify(records));
      
      setIsSaved(true);
      Alert.alert('등록 완료', '진단 결과가 달력에 등록되었습니다.', [
        { text: '확인', onPress: () => navigation.navigate('Calendar') }
      ]);
    } catch (e) {
      console.error('Failed to save diagnosis record', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.pop()} style={styles.topBtn}>
          <Text style={styles.topBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>종합 분석 결과</Text>
        <TouchableOpacity onPress={() => navigation.popToTop()} style={styles.topBtn}>
          <Text style={styles.topRight}>분석 종료</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 120 }}>
        <Text style={styles.bigTitle}>
          {summary.suspected} 증상이{'\n'}의심됩니다.
        </Text>

        {/* ✅ 의료 번역 리포트 카드(이 카드만 가운데정렬) */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, styles.centerText]}>의료 번역 리포트</Text>

          <View style={styles.quoteBox}>
            <Text style={[styles.quoteText, styles.centerText]}>
              “{summary.bodyPartLabel} 부위가 불편해요.”
            </Text>
          </View>

          <Text style={[styles.diagTitle, styles.centerText]}>
            {summary.suspected} {summary.english ? `(${summary.english})` : ''}
          </Text>

          <Text style={[styles.blueDesc, styles.centerText]}>{summary.shortExplain}</Text>
        </View>

        {/* ✅ 의료진에게 보여줄 카드(여긴 그대로) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>의료진에게 보여줄 카드</Text>

          {summary.checklist.map((it, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.rowLabel}>{it.label}</Text>
              <Text style={styles.rowValue}>{it.value}</Text>
            </View>
          ))}

          <View style={styles.row}>
            <Text style={styles.rowLabel}>진료 권장</Text>
            <Text style={styles.rowValue}>{summary.department}</Text>
          </View>

          <TouchableOpacity style={styles.smallBtn} onPress={goOTC}>
            <Text style={styles.smallBtnText}>알맞은 상비약 보러가기</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.smallBtn, { backgroundColor: isSaved ? '#E5E7EB' : '#3B82F6', marginTop: 10 }]} 
            onPress={registerToCalendar}
            disabled={isSaved}
          >
            <Text style={[styles.smallBtnText, { color: isSaved ? '#9CA3AF' : '#FFF' }]}>
              {isSaved ? '달력 등록 완료' : '캘린더에 등록하기'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.bottomBtn} onPress={goPharmacy}>
        <Text style={styles.bottomBtnText}>내 주변 병원 찾기</Text>
      </TouchableOpacity>
    </View>
  );
}

const BLUE = '#3B82F6';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7FB' },

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
  topRight: { textAlign: 'right', color: BLUE, fontWeight: '900' },

  bigTitle: { fontSize: 20, fontWeight: '900', color: '#111827', marginBottom: 14 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: { fontSize: 13, fontWeight: '900', color: '#111827', marginBottom: 10 },

  quoteBox: {
    backgroundColor: '#F2F4F8',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center', // ✅ 가운데 느낌 강화
  },
  quoteText: { color: '#333', fontSize: 13 },

  diagTitle: { fontSize: 16, fontWeight: '900', color: '#2B55FF', marginTop: 6 },
  blueDesc: { marginTop: 8, color: '#2B55FF', fontSize: 12, lineHeight: 17 },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  rowLabel: { fontSize: 12, color: '#6B7280' },
  rowValue: { fontSize: 12, color: '#111827', fontWeight: '900', flexShrink: 1, textAlign: 'right' },

  smallBtn: {
    marginTop: 14,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBtnText: { color: '#2B55FF', fontWeight: '900' },

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

  // ✅ 추가: 가운데정렬용
  centerText: {
    textAlign: 'center',
  },
});