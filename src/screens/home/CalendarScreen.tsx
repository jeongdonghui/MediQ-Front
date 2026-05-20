// src/screens/home/CalendarScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Modal,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import CalendarAddModal from './CalendarAddModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCalendarMonthly, createCalendarEvent, deleteCalendarEvent, type CalendarEventRequest, type CalendarEventResponse } from '../../api/calendar';

const { width } = Dimensions.get('window');

const BLUE = '#3FA2FF';
const GREEN = '#63B015';
const GOLD = '#D1B000';
const WHITE = '#FFFFFF';
const BG = '#F6F7FB';
const TEXT = '#111';
import { Alert } from 'react-native';

interface DiagnosisRecord {
  id: string;
  date: string;
  summary: {
    suspected: string;
    bodyPartLabel: string;
    checklist: { label: string; value: string }[];
    department: string;
    english?: string;
    shortExplain: string;
  };
  type: 'MIGRAINE' | 'STOMACH' | 'OTHER' | 'EVENT' | 'DIAGNOSIS';
}

export default function CalendarScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [records, setRecords] = useState<DiagnosisRecord[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [activeRecord, setActiveRecord] = useState<DiagnosisRecord | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // ✅ 초기 데이터 로드 (mount 시 1회) - 캐시된 데이터가 있으면 먼저 보여줌
  useEffect(() => {
    const initLocalCache = async () => {
      try {
        const stored = await AsyncStorage.getItem('@calendar_records_cache');
        if (stored) {
          setRecords(JSON.parse(stored));
        }
      } catch (e) {}
    };
    initLocalCache();
  }, []);

  // ✅ 데이터 변경 시 캐시 업데이트 (선택적)
  useEffect(() => {
    const updateCache = async () => {
      try {
        await AsyncStorage.setItem('@calendar_records_cache', JSON.stringify(records));
      } catch (e) {}
    };
    if (records.length > 0) updateCache();
  }, [records]);

  useEffect(() => {
    if (isFocused) {
      loadRecords();
      
      // ✅ 진단 결과 화면에서 넘어온 데이터가 있다면 즉시 반영
      const params = (navigation as any).getState()?.routes.find((r: any) => r.name === 'Calendar')?.params;
      if (params?.newDiagnosis) {
        setRecords(prev => {
          const exists = prev.some(r => r.id === params.newDiagnosis.id);
          if (exists) return prev;
          return [...prev, params.newDiagnosis];
        });
        // ✅ 파라미터가 비어있지 않을 때만 setParams를 호출하여 무한 루프 가능성 차단
        navigation.setParams({ newDiagnosis: undefined });
      }
    }
  }, [isFocused, currentDate]);

  const loadRecords = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const data = await getCalendarMonthly(year, month);
      
      if (data && Array.isArray(data)) {
        const mapped = data.map((ev: any) => {
          const sTime = ev.startDate?.includes('T') ? ev.startDate.split('T')[1].substring(0, 5) : '00:00';
          const eTime = ev.endDate?.includes('T') ? ev.endDate.split('T')[1].substring(0, 5) : '00:00';
          return {
            id: String(ev.id),
            date: ev.startDate || '',
            startTime: sTime,
            endTime: eTime,
            summary: {
              suspected: ev.title,
              bodyPartLabel: ev.majorCategory || '진단 내역',
              checklist: [],
              department: ev.recommendedDepartment || '-',
              shortExplain: ev.memo || ev.symptomExpression || '',
            },
            type: ev.type || (ev.reportId ? 'DIAGNOSIS' : 'EVENT'),
          };
        });
        setRecords(mapped);
      }
    } catch (e) {
      console.error('Failed to load calendar events', e);
      Alert.alert('조회 실패', '서버에서 일정을 가져오는데 실패했습니다.');
    }
  };

  const saveRecord = async (newRecord: any) => {
    const baseDate = newRecord.date.split('T')[0];
    const apiData: CalendarEventRequest = {
      title: newRecord.summary.suspected,
      startDate: `${baseDate}T${newRecord.startTime}:00`,
      endDate: `${baseDate}T${newRecord.endTime}:00`,
      memo: newRecord.summary.shortExplain,
    };
    try {
      // ✅ 서버 등록 시도
      const saved = await createCalendarEvent(apiData);
      
      // ✅ 서버 성공 시에만 로컬 상태 반영 및 새로고침
      if (saved) {
        Alert.alert('등록 완료', '일정이 서버에 저장되었습니다.');
        loadRecords();
      }
    } catch (e: any) {
      console.error('Save record failed', e);
      const errorMsg = e.response?.data?.message || '서버 저장 중 오류가 발생했습니다.';
      Alert.alert('저장 실패', errorMsg);
    }
  };

  const handleDeleteRecord = async (id: string | number) => {
    try {
      // ✅ 서버 삭제 시도
      await deleteCalendarEvent(Number(id));
      
      // ✅ 서버 삭제 성공 시에만 UI 업데이트
      setRecords(prev => prev.filter(r => r.id !== String(id)));
      setActiveRecord(null);
      setModalVisible(false);
      Alert.alert('삭제 완료', '일정이 삭제되었습니다.');
      
    } catch (e: any) {
      console.error('Delete failed', e);
      const errorMsg = e.response?.data?.message || '서버 삭제 중 오류가 발생했습니다.';
      Alert.alert('삭제 실패', errorMsg);
    }
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysArr = [];
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    // Padding for first week
    for (let i = 0; i < startDay; i++) {
      daysArr.push(<View key={`pad-${i}`} style={styles.dayBox} />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
      
      // Find bars for this date
      const daysBars = records.map(r => {
        const startDate = new Date(r.date);
        startDate.setHours(0,0,0,0);
        const endDate = new Date(r.date);
        // endDate.setDate(endDate.getDate() + 3); // ❌ 하드코딩된 기간 삭제
        endDate.setHours(23,59,59,999);

        const targetDate = new Date(year, month, d);
        if (targetDate >= startDate && targetDate <= endDate) {
            const isStart = targetDate.getTime() === startDate.getTime();
            const isEnd = targetDate.getDate() === endDate.getDate() && targetDate.getMonth() === endDate.getMonth();
            return { ...(r as any), isStart, isEnd };
        }
        return null;
      }).filter((b): b is any => b !== null);

      daysArr.push(
        <TouchableOpacity
          key={d}
          style={styles.dayBox}
          onPress={() => setSelectedDate(new Date(year, month, d))}
        >
          {isSelected && <View style={styles.selectedCircle} />}
          <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{d}</Text>
          <View style={styles.barsContainer}>
            {daysBars?.map((b, idx) => {
              if (!b) return null;
              return (
                <View 
                  key={b.id || idx} 
                  style={[
                    styles.bar, 
                    { 
                      backgroundColor: b.type === 'MIGRAINE' ? GREEN : (b.type === 'STOMACH' ? GOLD : (b.type === 'DIAGNOSIS' ? BLUE : '#9CA3AF')),
                      borderTopLeftRadius: b.isStart ? 4 : 0,
                      borderBottomLeftRadius: b.isStart ? 4 : 0,
                      borderTopRightRadius: b.isEnd ? 4 : 0,
                      borderBottomRightRadius: b.isEnd ? 4 : 0,
                      marginLeft: b.isStart ? 4 : 0,
                      marginRight: b.isEnd ? 4 : 0,
                    }
                  ]} 
                >
                    {(b.isStart || d === 1) && (
                        <Text style={styles.barTitle} numberOfLines={1}>{b.summary?.suspected || '내용 없음'}</Text>
                    )}
                </View>
              );
            })}
          </View>
        </TouchableOpacity>
      );
    }

    return daysArr;
  };

  // ✅ 상단 카드는 진단 결과(DIAGNOSIS)만 표시하도록 필터링 (안전한 접근 적용)
  const diagnosisRecords = (records || []).filter(r => r && r.type === 'DIAGNOSIS');
  const lastRecord = diagnosisRecords.length > 0 ? diagnosisRecords[diagnosisRecords.length - 1] : null;
  const filteredRecordsForDate = (records || []).filter(r => {
    if (!r || !r.date) return false;
    const rDate = new Date(r.date);
    return rDate.getDate() === selectedDate.getDate() && 
           rDate.getMonth() === selectedDate.getMonth() && 
           rDate.getFullYear() === selectedDate.getFullYear();
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>캘린더</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Summary Card */}
        {lastRecord ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryDate}>
              {lastRecord.date 
                ? new Date(lastRecord.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }) 
                : '날짜 정보 없음'}
            </Text>
            <Text style={styles.summaryTitle}>
              <Text style={{ fontWeight: '900' }}>{lastRecord.summary?.suspected || '일정'}</Text>이{'\n'}진행되고 있어요.
            </Text>
            <Text style={styles.summarySub}>따뜻한 물과 찜질을 자주 해주세요</Text>
          </View>
        ) : (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>기록된 진단 결과가 없습니다.</Text>
          </View>
        )}

        {/* Recently Logged */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>최근 기록</Text>
            <TouchableOpacity onPress={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}>
              <Text style={styles.sectionSub}>{viewMode === 'calendar' ? '리스트로 보기' : '캘린더로 보기'}</Text>
            </TouchableOpacity>
          </View>

          {viewMode === 'calendar' ? (
            <View style={styles.calendarContainer}>
              {/* ... existing monthly navigation ... */}
              <View style={styles.monthNav}>
                <TouchableOpacity onPress={handlePrevMonth}>
                  <Text style={styles.navText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.monthTitle}>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</Text>
                <TouchableOpacity onPress={handleNextMonth}>
                  <Text style={styles.navText}>›</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.weekRow}>
                {['일', '월', '화', '수', '목', '금', '토'].map(w => (
                  <Text key={w} style={styles.weekText}>{w}</Text>
                ))}
              </View>

              <View style={styles.daysGrid}>
                {renderCalendar()}
              </View>
            </View>
          ) : (
            <View style={styles.listContainer}>
                {(records || []).slice().reverse().map((r, i) => (
                    <View key={r?.id || i} style={styles.historyCard}>
                        <Text style={styles.historyCardTitle}>{r?.summary?.suspected || '제목 없음'}</Text>
                        <View style={styles.historyDetailRow}>
                            <Text style={styles.historyLabel}>등록 일자</Text>
                            <Text style={styles.historyValue}>
                              {r?.date ? new Date(r.date).toLocaleDateString('ko-KR') : '-'}
                            </Text>
                        </View>
                        <View style={styles.historyDetailRow}>
                            <Text style={styles.historyLabel}>진단 구분</Text>
                            <Text style={styles.historyValue}>{r?.type === 'DIAGNOSIS' ? 'AI 리포트' : '직접 등록'}</Text>
                        </View>
                    </View>
                ))}
                
                <TouchableOpacity 
                    style={styles.addRecordBtn}
                    onPress={() => setAddModalVisible(true)}
                >
                    <Text style={styles.addRecordText}>+ 기록 추가하기</Text>
                </TouchableOpacity>
            </View>
          )}

          {viewMode === 'calendar' && (
            <View style={styles.selectedDateInfo}>
              <Text style={styles.selectedDateTitle}>
                {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 ({['일', '월', '화', '수', '목', '금', '토'][selectedDate.getDay()]})
              </Text>
              
              {filteredRecordsForDate.length > 0 ? (
                filteredRecordsForDate.map(r => (
                  <TouchableOpacity 
                    key={r.id} 
                    style={styles.recordItem}
                    onPress={() => {
                      setActiveRecord(r);
                      setModalVisible(true);
                    }}
                  >
                    <View style={[styles.typeIndicator, { backgroundColor: r.type === 'MIGRAINE' ? GREEN : (r.type === 'STOMACH' ? GOLD : BLUE) }]} />
                    <Text style={styles.recordTime}>하루종일</Text>
                    <Text style={styles.recordSuspected}>{r.summary?.suspected || '내용 없음'}</Text>
                  </TouchableOpacity>
                ))
              ) : null}

              <TouchableOpacity 
                style={styles.recordItemPlus}
                onPress={() => setAddModalVisible(true)}
              >
                <Text style={styles.recordPlusText}>+ 새로운 일정 등록하기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <CalendarAddModal 
        visible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={saveRecord}
      />

      {/* Result Summary Modal */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              {activeRecord?.type === 'DIAGNOSIS' ? (
                <View style={styles.modalBadge}>
                  <Text style={styles.modalBadgeText}>의료진 제시용</Text>
                </View>
              ) : (
                <View style={[styles.modalBadge, { backgroundColor: '#E5E7EB' }]}>
                  <Text style={[styles.modalBadgeText, { color: '#4B5563' }]}>일정 상세</Text>
                </View>
              )}
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeModal}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={styles.modalTitle}>
                  {activeRecord?.type === 'DIAGNOSIS' ? '결과 요약 카드' : '등록된 일정'}
                </Text>
                <Text style={styles.modalSub}>
                  {activeRecord?.type === 'DIAGNOSIS' 
                    ? '의사 선생님께 이 화면을 보여주세요' 
                    : '기록하신 일정의 상세 내용입니다'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => activeRecord && handleDeleteRecord(activeRecord.id)}>
                <Text style={{ color: '#FF3B30', fontSize: 13, fontWeight: '700' }}>삭제</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalDivider} />

            {activeRecord && (
              <View style={styles.detailsList}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{activeRecord.type === 'DIAGNOSIS' ? '주호소 (CC)' : '제목'}</Text>
                  <Text style={styles.detailValue}>{activeRecord.summary?.suspected || '내용 없음'}</Text>
                </View>

                {activeRecord.type === 'DIAGNOSIS' ? (
                  <>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>발생부위</Text>
                      <Text style={styles.detailValue}>{activeRecord.summary?.bodyPartLabel || '-'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>발생 시점</Text>
                      <Text style={styles.detailValue}>진단 기록 참조</Text>
                    </View>
                    <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.detailLabel}>진료 권장</Text>
                        <Text style={[styles.detailValue, { color: BLUE }]}>{activeRecord.summary?.department || '-'}</Text>
                    </View>
                  </>
                ) : null}

                {activeRecord.summary?.shortExplain ? (
                  <View style={[styles.detailRow, { borderTopWidth: 1, borderTopColor: '#F3F4F6', flexDirection: 'column', alignItems: 'flex-start' }]}>
                    <Text style={[styles.detailLabel, { marginBottom: 6 }]}>메모</Text>
                    <Text style={[styles.detailValue, { textAlign: 'left', fontWeight: '500' }]}>{activeRecord.summary?.shortExplain}</Text>
                  </View>
                ) : null}
              </View>
            )}

            {activeRecord?.type === 'DIAGNOSIS' && (
              <TouchableOpacity 
                style={styles.modalBtn}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('OTCMedicine', { suspected: activeRecord?.summary?.suspected || '내용 없음' });
                }}
              >
                <Text style={styles.modalBtnText}>알맞은 상비약 보러가기</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WHITE },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: WHITE,
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 32, color: '#333' },
  title: { fontSize: 18, fontWeight: '900', color: '#111' },

  scrollContent: { padding: 16, backgroundColor: WHITE },

  summaryCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  summaryDate: { fontSize: 13, color: '#6B7280', marginBottom: 8 },
  summaryTitle: { fontSize: 19, color: '#111', lineHeight: 28, marginBottom: 8 },
  summarySub: { fontSize: 13, color: '#9CA3AF' },

  historySection: { marginTop: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#111' },
  sectionSub: { fontSize: 13, color: '#9CA3AF' },

  calendarContainer: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  monthNav: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, marginBottom: 20 },
  navText: { fontSize: 24, color: '#333' },
  monthTitle: { fontSize: 18, fontWeight: '900', color: '#111' },

  weekRow: { flexDirection: 'row', marginBottom: 10 },
  weekText: { flex: 1, textAlign: 'center', fontSize: 12, color: '#9CA3AF', fontWeight: '700' },

  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  dayBox: { width: '14.28%', height: 50, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  dayText: { fontSize: 14, color: '#333', fontWeight: '500' },
  selectedDayText: { color: WHITE, zIndex: 2 },
  selectedCircle: { position: 'absolute', width: 34, height: 34, borderRadius: 17, backgroundColor: BLUE, zIndex: 1 },

  barsContainer: { position: 'absolute', bottom: 4, left: 0, right: 0, height: 14, justifyContent: 'center' },
  bar: { height: 14, alignItems: 'center', justifyContent: 'center' },
  barTitle: { color: WHITE, fontSize: 8, fontWeight: '700' },

  selectedDateInfo: { marginTop: 10 },
  selectedDateTitle: { fontSize: 16, fontWeight: '900', color: '#111', marginBottom: 16 },
  recordItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  typeIndicator: { width: 3, height: 24, borderRadius: 1.5, marginRight: 12 },
  recordTime: { fontSize: 14, fontWeight: '900', color: '#111', marginRight: 16 },
  recordSuspected: { fontSize: 14, color: '#4B5563' },

  recordItemPlus: {
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordPlusText: { color: '#6B7280', fontSize: 13, fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: WHITE, borderRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalBadge: { backgroundColor: '#374151', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  modalBadgeText: { color: WHITE, fontSize: 10, fontWeight: '700' },
  closeModal: { fontSize: 20, color: '#9CA3AF' },
  modalTitle: { fontSize: 19, fontWeight: '900', color: '#111', marginBottom: 4 },
  modalSub: { fontSize: 13, color: '#6B7280', marginBottom: 20 },
  modalDivider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 20 },
  detailsList: { marginBottom: 24 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  detailLabel: { fontSize: 13, color: '#9CA3AF' },
  detailValue: { fontSize: 13, color: '#111', fontWeight: '900' },
  modalBtn: { backgroundColor: '#F3F4F6', height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  modalBtnText: { color: BLUE, fontWeight: '900' },

  listContainer: { paddingBottom: 20 },
  historyCard: {
      backgroundColor: '#F3F4F6',
      borderRadius: 20,
      padding: 24,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
  },
  historyCardTitle: { fontSize: 16, fontWeight: '900', color: TEXT, marginBottom: 16 },
  historyDetailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  historyLabel: { fontSize: 13, color: TEXT, fontWeight: '700' },
  historyValue: { fontSize: 13, color: '#6B7280' },

  addRecordBtn: {
      height: 60,
      backgroundColor: '#F3F4F6',
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
  },
  addRecordText: { fontSize: 15, fontWeight: '900', color: '#666' },
});
