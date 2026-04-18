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

  const handleSave = () => {
    if (!title.trim()) return;
    const newRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      summary: {
        suspected: title,
        bodyPartLabel: '직접 입력',
        checklist: [],
        department: '-',
        shortExplain: memo,
      },
      type: 'OTHER',
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

                <View style={styles.row}>
                    <Text style={styles.timeText}>12월 3일(수)</Text>
                    <Text style={styles.timeValue}>18:00 PM</Text>
                    <Text style={styles.arrow}>{'>'}</Text>
                    <Text style={styles.timeValue}>19:00 PM</Text>
                </View>

                <View style={[styles.row, { marginTop: 10 }]}>
                    <Text style={[styles.icon, { transform: [{ rotate: '45deg' }] }]}>↺</Text>
                    <Text style={styles.label}>매일 반복</Text>
                    <Switch value={isRepeat} onValueChange={setIsRepeat} />
                </View>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.row}>
                    <Text style={styles.icon}>🔔</Text>
                    <View style={styles.chip}>
                        <Text style={styles.chipText}>30분 전 알람</Text>
                    </View>
                </TouchableOpacity>

                <View style={[styles.row, { alignItems: 'flex-start', marginTop: 20 }]}>
                    <Text style={styles.icon}>📋</Text>
                    <TextInput
                        style={styles.memoInput}
                        placeholder="메모"
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
  timeText: { fontSize: 16, fontWeight: '700', color: TEXT, flex: 1 },
  timeValue: { fontSize: 18, fontWeight: '900', color: TEXT },
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
