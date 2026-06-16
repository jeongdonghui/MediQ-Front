import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';

// 부모 컴포넌트(WriteScreen)와 데이터를 주고받기 위한 명확한 타입 인터페이스 정의
interface VoteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (voteData: {
    title: string;
    options: string[];
    multi: boolean;
    anonymous: boolean;
  }) => void;
}

const TEXT = '#222222';

export default function VoteModal({ visible, onClose, onConfirm }: VoteModalProps) {
  const [voteType, setVoteType] = useState<'복수' | '단일'>('복수');
  const [voteTitle, setVoteTitle] = useState('');
  const [voteOption1, setVoteOption1] = useState('');
  const [voteOption2, setVoteOption2] = useState('');
  const [voteOption3, setVoteOption3] = useState('');
  const [allowMulti, setAllowMulti] = useState(true);
  const [allowAnonymous, setAllowAnonymous] = useState(false);
  const [allowExtra, setAllowExtra] = useState(false);

  // 완료 버튼 터치 시 부모에게 규격에 맞는 데이터 구조를 안전하게 전달
  const handleDone = () => {
    const options = [voteOption1, voteOption2, voteOption3]
      .map((v) => v.trim())
      .filter(Boolean);

    onConfirm({
      title: voteTitle.trim(),
      options,
      multi: voteType === '복수' && allowMulti,
      anonymous: allowAnonymous,
    });

    // 데이터 전달 후 초기화 및 모달 닫기
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.voteSheet}>
          <View style={styles.voteHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.voteClose}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.voteHeaderTitle}>투표 만들기</Text>

            <TouchableOpacity onPress={handleDone}>
              <Text style={styles.voteDone}>완료</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.voteTypeRow}>
            <TouchableOpacity
              style={[
                styles.voteTypeChip,
                voteType === '복수' && styles.voteTypeChipActive,
              ]}
              onPress={() => setVoteType('복수')}
            >
              <Text
                style={[
                  styles.voteTypeChipText,
                  voteType === '복수' && styles.voteTypeChipTextActive,
                ]}
              >
                복수
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.voteTypeChip,
                voteType === '단일' && styles.voteTypeChipActive,
              ]}
              onPress={() => setVoteType('단일')}
            >
              <Text
                style={[
                  styles.voteTypeChipText,
                  voteType === '단일' && styles.voteTypeChipTextActive,
                ]}
              >
                단일
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            value={voteTitle}
            onChangeText={setVoteTitle}
            placeholder="투표 제목"
            placeholderTextColor="#B7B7B7"
            style={styles.voteInput}
          />

          <TextInput
            value={voteOption1}
            onChangeText={setVoteOption1}
            placeholder="선택지 1"
            placeholderTextColor="#B7B7B7"
            style={styles.voteInput}
          />

          <TextInput
            value={voteOption2}
            onChangeText={setVoteOption2}
            placeholder="선택지 2"
            placeholderTextColor="#B7B7B7"
            style={styles.voteInput}
          />

          <TextInput
            value={voteOption3}
            onChangeText={setVoteOption3}
            placeholder="선택지 추가"
            placeholderTextColor="#B7B7B7"
            style={styles.voteInput}
          />

          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => setAllowMulti((prev) => !prev)}
          >
            <Text style={styles.radioIcon}>{allowMulti ? '●' : '○'}</Text>
            <Text style={styles.radioText}>복수선택 허용</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => setAllowAnonymous((prev) => !prev)}
          >
            <Text style={styles.radioIcon}>{allowAnonymous ? '●' : '○'}</Text>
            <Text style={styles.radioText}>익명 투표</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioRow}
            onPress={() => setAllowExtra((prev) => !prev)}
          >
            <Text style={styles.radioIcon}>{allowExtra ? '●' : '○'}</Text>
            <Text style={styles.radioText}>선택항목 추가 허용</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.38)',
    justifyContent: 'flex-end',
  },
  voteSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 18,
  },
  voteHeader: {
    height: 42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voteClose: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '700',
  },
  voteHeaderTitle: {
    fontSize: 17,
    color: TEXT,
    fontWeight: '900',
  },
  voteDone: {
    fontSize: 14,
    color: '#5B9BF7',
    fontWeight: '800',
  },
  voteTypeRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 12,
  },
  voteTypeChip: {
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8EDF5',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  voteTypeChipActive: {
    backgroundColor: '#5D9BEA',
  },
  voteTypeChipText: {
    fontSize: 12,
    color: '#55708F',
    fontWeight: '800',
  },
  voteTypeChipTextActive: {
    color: '#FFFFFF',
  },
  voteInput: {
    height: 42,
    backgroundColor: '#F6F8FC',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
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
    fontWeight: '600',
  },
});