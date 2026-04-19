// src/screens/home/CalendarAddModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Switch,
} from 'react-native';

const BLUE = '#3FA2FF';
const WHITE = '#FFFFFF';
const TEXT = '#111';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (record: any) => void;
}

export default function CalendarAddModal({ visible, onClose, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [isRepeat, setIsRepeat] = useState(false);
  
  // ✅ 날짜/시간/알람 상태 추가
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('19:00');
  const [alarmMinutes, setAlarmMinutes] = useState(30);

  const toggleAlarm = () => {
    // 0(없음) -> 10 -> 30 -> 60 순환
    if (alarmMinutes === 0) setAlarmMinutes(10);
    else if (alarmMinutes === 10) setAlarmMinutes(30);
    else if (alarmMinutes === 30) setAlarmMinutes(60);
    else setAlarmMinutes(0);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    // ✅ 선택한 날짜와 시간을 합쳐서 저장
    const newRecord = {
      id: Date.now().toString(),
      date: `${date}T${startTime}:00`,
      summary: {
        suspected: title,
        bodyPartLabel: '직접 입력',
        checklist: [],
        department: '-',
        shortExplain: memo,
        alarm: alarmMinutes > 0 ? `${alarmMinutes}분 전` : '알람 없음',
      },
      type: 'EVENT',
    };
    
    onSave(newRecord);
    setTitle('');
    setMemo('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.modalContent}>
            <View style={styles.dragHandle} />
            
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeText}>취소</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>일정 등록</Text>
              <TouchableOpacity onPress={handleSave}>
                <Text style={styles.saveHeaderBtn}>저장</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.inputSection}>
                <View style={styles.titleRow}>
                    <View style={styles.verticalBar} />
                    <TextInput
                        style={styles.titleInput}
                        placeholder="제목"
                        placeholderTextColor="#999"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* ✅ 날짜/시간 입력 필드 - 터치하여 수정 가능하도록 변경 */}
                <View style={styles.row}>
                    <TextInput 
                      style={styles.timeInputDate}
                      value={date}
                      onChangeText={setDate}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#999"
                    />
                    <TextInput 
                      style={styles.timeInput}
                      value={startTime}
                      onChangeText={setStartTime}
                      placeholder="HH:mm"
                      placeholderTextColor="#999"
                    />
                    <Text style={styles.arrow}>{'>'}</Text>
                    <TextInput 
                      style={styles.timeInput}
                      value={endTime}
                      onChangeText={setEndTime}
                      placeholder="HH:mm"
                      placeholderTextColor="#999"
                    />
                </View>

                <View style={[styles.row, { marginTop: 10 }]}>
                    <Text style={[styles.icon, { transform: [{ rotate: '45deg' }] }]}>↺</Text>
                    <Text style={styles.label}>반복 설정</Text>
                    <Switch 
                      value={isRepeat} 
                      onValueChange={setIsRepeat} 
                      trackColor={{ false: '#D1D5DB', true: BLUE }}
                    />
                </View>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.row} onPress={toggleAlarm}>
                    <Text style={styles.icon}>🔔</Text>
                    <View style={styles.chip}>
                        <Text style={styles.chipText}>
                          {alarmMinutes > 0 ? `${alarmMinutes}분 전 알람` : '알람 없음'}
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={[styles.row, { alignItems: 'flex-start', marginTop: 20 }]}>
                    <Text style={styles.icon}>📋</Text>
                    <TextInput
                        style={styles.memoInput}
                        placeholder="메모를 입력하세요"
                        placeholderTextColor="#999"
                        value={memo}
                        onChangeText={setMemo}
                        multiline
                    />
                </View>
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>저장</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  safe: { flex: 1, backgroundColor: 'transparent' },
  modalContent: {
    flex: 1,
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 60,
  },
  dragHandle: { width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginTop: 10 },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  closeText: { fontSize: 16, color: '#666' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: TEXT },
  saveHeaderBtn: { fontSize: 16, color: BLUE, fontWeight: '700' },

  scrollContent: { padding: 24 },
  inputSection: { marginBottom: 30 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  verticalBar: { width: 4, height: 24, backgroundColor: '#63B015', borderRadius: 2, marginRight: 12 },
  titleInput: { flex: 1, fontSize: 20, fontWeight: '900', color: TEXT },

  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  timeInputDate: { fontSize: 16, fontWeight: '700', color: TEXT, flex: 1.5, backgroundColor: '#F9FAFB', borderRadius: 8, padding: 8, marginRight: 8 },
  timeInput: { fontSize: 16, fontWeight: '900', color: TEXT, flex: 1, backgroundColor: '#F9FAFB', borderRadius: 8, padding: 8, textAlign: 'center' },
  arrow: { marginHorizontal: 10, color: '#999' },
  icon: { fontSize: 18, marginRight: 12, color: '#666' },
  label: { flex: 1, fontSize: 16, color: '#999' },

  divider: { height: 1, backgroundColor: '#F5F5F5', marginVertical: 10 },
  chip: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  chipText: { color: '#666', fontSize: 13 },

  memoInput: { flex: 1, fontSize: 16, color: TEXT, minHeight: 100, textAlignVertical: 'top' },

  saveBtn: {
    backgroundColor: BLUE,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BLUE,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  saveBtnText: { color: WHITE, fontSize: 16, fontWeight: '900' },
});
