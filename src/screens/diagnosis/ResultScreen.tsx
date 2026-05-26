// src/screens/diagnosis/ResultScreen.tsx

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

import {
  getReportDetail,
  deleteReport,
  submitAiFeedback,
} from '../../api/reports';

import { createCalendarEvent } from '../../api/calendar';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export default function ResultScreen({ navigation, route }: Props) {
  const { summary, reportId } = route.params;

  const [isSaved, setIsSaved] = useState(false);

  const [apiReport, setApiReport] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  // ✅ aiAnalysisResult 파싱: "[편두통] 관련 진료과: 신경과\n설명: ..." 형식
  const parsedAi = useMemo(() => {
    if (!apiReport?.aiAnalysisResult) return null;
    const result: string = apiReport.aiAnalysisResult;
    const nameMatch = result.match(/\[(.+?)\]/);
    const deptMatch = result.match(/관련 진료과:\s*(.+)/);
    const descMatch = result.match(/설명:\s*([\s\S]+)/);
    return {
      suspected: nameMatch ? nameMatch[1] : summary.suspected,
      department: deptMatch ? deptMatch[1].trim() : summary.department,
      description: descMatch ? descMatch[1].trim() : result,
    };
  }, [apiReport, summary]);

  // ✅ 상세조회 API
  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!reportId) {
          setLoading(false);
          return;
        }

        const res = await getReportDetail(reportId);

        console.log('상세 리포트 조회 성공:', res);

        setApiReport(res);
      } catch (err) {
        console.warn('리포트 상세조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  // ✅ 상비약 이동 — AI 파싱 결과 질환명 우선, 없으면 summary 사용
  const goOTC = () => {
    navigation.navigate('OTCMedicine', {
      suspected: parsedAi?.suspected || summary.suspected,
    });
  };

  // ✅ 병원찾기 이동
  const goPharmacy = () => {
    navigation.navigate('PharmacyMap', {
      query: '약국',
    });
  };

  // ✅ 캘린더 등록 API
  const registerToCalendar = async () => {
    try {
      const baseDate = new Date().toISOString().split('T')[0];
      await createCalendarEvent({
        title: summary.suspected,
        startDate: `${baseDate}T00:00:00`,
        endDate: `${baseDate}T23:59:00`,
        memo: summary.shortExplain || '',
      });

      setIsSaved(true);

      Alert.alert(
        '등록 완료',
        '진단 결과가 캘린더에 등록되었습니다.',
      );
    } catch (e) {
      console.warn('캘린더 등록 실패:', e);

      Alert.alert(
        '등록 실패',
        '캘린더 등록 중 오류가 발생했습니다.',
      );
    }
  };

  // ✅ AI 분석 도움됐어요
  const handleGoodFeedback = async () => {
    try {
      if (!reportId) return;

      await submitAiFeedback(reportId, {
        feedbackType: 'GOOD',
      });

      Alert.alert('감사합니다!', '피드백이 제출되었습니다.');
    } catch (e) {
      console.warn('좋아요 피드백 실패:', e);
    }
  };

  // ✅ AI 분석 별로예요
  const handleBadFeedback = async () => {
    try {
      if (!reportId) return;

      await submitAiFeedback(reportId, {
        feedbackType: 'BAD',
      });

      Alert.alert('의견 감사합니다.', '개선에 반영하겠습니다.');
    } catch (e) {
      console.warn('별로예요 피드백 실패:', e);
    }
  };

  // ✅ 보조문진 삭제 API
  const handleDeleteReport = () => {
    Alert.alert(
      '보조문진 삭제',
      '정말 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!reportId) return;

              await deleteReport(reportId);

              Alert.alert(
                '삭제 완료',
                '보조문진이 삭제되었습니다.',
                [
                  {
                    text: '확인',
                    onPress: () => navigation.popToTop(),
                  },
                ],
              );
            } catch (e) {
              console.warn('보조문진 삭제 실패:', e);

              Alert.alert(
                '삭제 실패',
                '삭제 중 오류가 발생했습니다.',
              );
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 상단 */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.pop()}
          style={styles.topBtn}
        >
          <Text style={styles.topBtnText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.topTitle}>
          종합 분석 결과
        </Text>

        <TouchableOpacity
          onPress={() => navigation.popToTop()}
          style={styles.topBtn}
        >
          <Text style={styles.topRight}>
            종료
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 18,
          paddingBottom: 140,
        }}
      >
        <Text style={styles.bigTitle}>
          {parsedAi?.suspected || summary?.suspected || '분석 중...'} 증상이{'\n'}
          의심됩니다.
        </Text>

        {/* AI 결과 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            의료 번역 리포트
          </Text>

          <Text style={styles.diagTitle}>
            {parsedAi?.suspected || summary.suspected}
          </Text>

          <Text style={styles.blueDesc}>
            {parsedAi?.description || summary.shortExplain || '분석 결과를 불러오는 중입니다.'}
          </Text>
        </View>

        {/* 의료진 카드 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            의료진에게 보여줄 카드
          </Text>

          {summary?.checklist?.map(
            (it: any, i: number) => (
              <View key={i} style={styles.row}>
                <Text style={styles.rowLabel}>
                  {it.label}
                </Text>

                <Text style={styles.rowValue}>
                  {it.value}
                </Text>
              </View>
            ),
          )}

          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              진료 권장
            </Text>

            <Text style={styles.rowValue}>
              {parsedAi?.department || summary.department}
            </Text>
          </View>
        </View>

        {/* 피드백 */}
        <View style={styles.feedbackRow}>
          <TouchableOpacity
            style={styles.feedbackBtn}
            onPress={handleGoodFeedback}
          >
            <Text style={styles.feedbackText}>
              👍 도움됐어요
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.feedbackBtn}
            onPress={handleBadFeedback}
          >
            <Text style={styles.feedbackText}>
              👎 별로예요
            </Text>
          </TouchableOpacity>
        </View>

        {/* 기능 버튼 */}
        <TouchableOpacity
          style={styles.smallBtn}
          onPress={goOTC}
        >
          <Text style={styles.smallBtnText}>
            알맞은 상비약 보기
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallBtn}
          onPress={registerToCalendar}
        >
          <Text style={styles.smallBtnText}>
            캘린더 등록
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDeleteReport}
        >
          <Text style={styles.deleteText}>
            보조문진 삭제
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 하단 */}
      <TouchableOpacity
        style={styles.bottomBtn}
        onPress={goPharmacy}
      >
        <Text style={styles.bottomBtnText}>
          내 주변 병원 찾기
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },

  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  topBar: {
    height: 52,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  topBtn: {
    width: 72,
  },

  topBtnText: {
    fontSize: 26,
    color: '#111',
  },

  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '900',
  },

  topRight: {
    textAlign: 'right',
    color: '#3B82F6',
    fontWeight: '900',
  },

  bigTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 14,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 10,
  },

  diagTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2B55FF',
  },

  blueDesc: {
    marginTop: 8,
    color: '#2B55FF',
    fontSize: 12,
    lineHeight: 17,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },

  rowLabel: {
    fontSize: 12,
    color: '#6B7280',
  },

  rowValue: {
    fontSize: 12,
    fontWeight: '900',
  },

  feedbackRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },

  feedbackBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  feedbackText: {
    fontWeight: '700',
  },

  smallBtn: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  smallBtnText: {
    color: '#2B55FF',
    fontWeight: '900',
  },

  deleteBtn: {
    marginTop: 10,
    alignItems: 'center',
  },

  deleteText: {
    color: '#EF4444',
    fontWeight: '700',
  },

  bottomBtn: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
});