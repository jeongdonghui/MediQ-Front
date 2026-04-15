import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';

export type VoteData = {
  title: string;
  options: string[];
  multi: boolean;
  anonymous: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (vote: VoteData) => void;
};

export default function VoteModal({ visible, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [date1, setDate1] = useState('2025년 12월 1일 (월)');
  const [date2, setDate2] = useState('2025년 12월 2일 (화)');
  const [date3, setDate3] = useState('');
  const [multi, setMulti] = useState(false);
  const [anonymous, setAnonymous] = useState(true);
  const [allowAdd, setAllowAdd] = useState(false);

  const handleSubmit = () => {
    const options = [date1, date2, date3].map((v) => v.trim()).filter(Boolean);

    if (!title.trim()) return;
    if (options.length < 2) return;

    onSubmit({
      title: title.trim(),
      options,
      multi,
      anonymous,
    });

    setTitle('');
    setDate1('2025년 12월 1일 (월)');
    setDate2('2025년 12월 2일 (화)');
    setDate3('');
    setMulti(false);
    setAnonymous(true);
    setAllowAdd(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalSheet}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.sideText}>취소</Text>
            </TouchableOpacity>

            <Text style={styles.title}>12월</Text>

            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.doneText}>확인</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formBox}>
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={[styles.chip, multi && styles.chipDark]}
                onPress={() => setMulti(true)}
              >
                <Text style={[styles.chipText, multi && styles.chipTextWhite]}>
                  복수
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.chip, !multi && styles.chipDark]}
                onPress={() => setMulti(false)}
              >
                <Text style={[styles.chipText, !multi && styles.chipTextWhite]}>
                  단일
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="투표 제목"
              placeholderTextColor="#B4B4B4"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={styles.input}
              value={date1}
              onChangeText={setDate1}
            />

            <TextInput
              style={styles.input}
              value={date2}
              onChangeText={setDate2}
            />

            <TextInput
              style={styles.input}
              placeholder="날짜 선택"
              placeholderTextColor="#B4B4B4"
              value={date3}
              onChangeText={setDate3}
            />

            <TouchableOpacity style={styles.addRow}>
              <Text style={styles.addText}>+ 항목 추가</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => setMulti((prev) => !prev)}
            >
              <Text style={styles.radioIcon}>{multi ? '●' : '○'}</Text>
              <Text style={styles.radioText}>복수선택</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => setAnonymous((prev) => !prev)}
            >
              <Text style={styles.radioIcon}>{anonymous ? '●' : '○'}</Text>
              <Text style={styles.radioText}>익명 투표</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => setAllowAdd((prev) => !prev)}
            >
              <Text style={styles.radioIcon}>{allowAdd ? '●' : '○'}</Text>
              <Text style={styles.radioText}>선택항목 추가 허용</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>투표 추가하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.38)',
    justifyContent: 'flex-end',
  },

  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 18,
  },

  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sideText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '700',
  },

  title: {
    fontSize: 18,
    color: '#111111',
    fontWeight: '900',
  },

  doneText: {
    fontSize: 14,
    color: '#5B9BF7',
    fontWeight: '800',
  },

  formBox: {
    marginTop: 10,
  },

  chipRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  chip: {
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },

  chipDark: {
    backgroundColor: '#111111',
  },

  chipText: {
    fontSize: 11,
    color: '#555555',
    fontWeight: '800',
  },

  chipTextWhite: {
    color: '#FFFFFF',
  },

  input: {
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#111827',
    marginBottom: 8,
  },

  addRow: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  addText: {
    fontSize: 12,
    color: '#A0A0A0',
    fontWeight: '700',
  },

  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },

  radioIcon: {
    width: 22,
    fontSize: 14,
    color: '#6B7280',
  },

  radioText: {
    fontSize: 12,
    color: '#666666',
  },

  submitBtn: {
    marginTop: 14,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitBtnText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '700',
  },
});