import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { BOARD_GROUPS, addPost, type VoteInfo } from './communityStore';

type Props = NativeStackScreenProps<RootStackParamList, 'CommunityWrite'>;

const BLUE = '#5D9BEA';
const BG = '#EEF3F9';
const WHITE = '#FFFFFF';
const TEXT = '#222222';
const LINE = '#E9E9E9';

export default function CommunityWriteScreen({ navigation, route }: Props) {
  const defaultBoard = route.params?.board ?? '자유게시판';

  const [selectedBoard, setSelectedBoard] = useState(defaultBoard);
  const [boardModalVisible, setBoardModalVisible] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [images, setImages] = useState<string[]>([]);
  const [voteModalVisible, setVoteModalVisible] = useState(false);

  const [voteType, setVoteType] = useState<'복수' | '단일'>('복수');
  const [voteTitle, setVoteTitle] = useState('');
  const [voteOption1, setVoteOption1] = useState('');
  const [voteOption2, setVoteOption2] = useState('');
  const [voteOption3, setVoteOption3] = useState('');
  const [allowMulti, setAllowMulti] = useState(true);
  const [allowAnonymous, setAllowAnonymous] = useState(false);
  const [allowExtra, setAllowExtra] = useState(false);

  const boardOptions = useMemo(() => {
    return BOARD_GROUPS.flatMap((group) => group.items);
  }, []);

  const addMockImage = () => {
    if (images.length >= 4) {
      Alert.alert('안내', '사진은 최대 4장까지 첨부할 수 있습니다.');
      return;
    }

    const mockPool = [
      'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=500',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500',
      'https://images.unsplash.com/photo-1584515933487-779824d29309?w=500',
      'https://images.unsplash.com/photo-1612277795421-9bc7706a4a41?w=500',
    ];

    const next = mockPool[images.length % mockPool.length];
    setImages((prev) => [...prev, next]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const builtVote: VoteInfo | null = useMemo(() => {
    const options = [voteOption1, voteOption2, voteOption3]
      .map((v) => v.trim())
      .filter(Boolean);

    if (!voteTitle.trim() || options.length < 2) return null;

    return {
      title: voteTitle.trim(),
      options,
      multi: voteType === '복수' && allowMulti,
      anonymous: allowAnonymous,
    };
  }, [
    allowAnonymous,
    allowMulti,
    voteOption1,
    voteOption2,
    voteOption3,
    voteTitle,
    voteType,
  ]);

  const submitPost = () => {
    if (!title.trim()) {
      Alert.alert('안내', '제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('안내', '내용을 입력해주세요.');
      return;
    }

    addPost({
      category: selectedBoard,
      title: title.trim(),
      content: content.trim(),
      images,
      vote: builtVote,
    });

    navigation.navigate('CommunityHome', {
      selectedBoard,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.blueHeader} />

      <View style={styles.container}>
        <View style={styles.writeCard}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>글쓰기</Text>

            <TouchableOpacity onPress={submitPost}>
              <Text style={styles.doneText}>완료</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.boardSelectBox}
            onPress={() => setBoardModalVisible(true)}
          >
            <Text style={styles.boardPlaceholder}>게시판</Text>

            <View style={styles.boardRight}>
              <Text style={styles.boardValue}>{selectedBoard}</Text>
              <Text style={styles.boardArrow}>⌄</Text>
            </View>
          </TouchableOpacity>

          <ScrollView
            style={styles.contentArea}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="제목을 입력해주세요."
              placeholderTextColor="#9A9A9A"
              style={styles.titleInput}
            />

            <View style={styles.titleDivider} />

            <TextInput
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              placeholder="글을 작성해주세요."
              placeholderTextColor="#B8B8B8"
              style={styles.bodyInput}
            />

            {images.length > 0 && (
              <View style={styles.imageGrid}>
                {images.map((uri, index) => (
                  <View key={`${uri}-${index}`} style={styles.imageWrap}>
                    <Image source={{ uri }} style={styles.gridImage} />
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeImage(index)}
                    >
                      <Text style={styles.removeBtnText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {builtVote && (
              <View style={styles.votePreviewCard}>
                <View style={styles.votePreviewTop}>
                  <Text style={styles.votePreviewTitle}>{builtVote.title}</Text>

                  <View style={styles.voteMetaWrap}>
                    <Text style={styles.voteMetaChip}>
                      {builtVote.multi ? '복수' : '단일'}
                    </Text>
                    <Text style={styles.voteMetaChip}>
                      {builtVote.anonymous ? '익명' : '기명'}
                    </Text>
                  </View>
                </View>

                {builtVote.options.map((option, index) => (
                  <View key={`${option}-${index}`} style={styles.voteOptionRow}>
                    <Text style={styles.voteOptionBullet}>•</Text>
                    <Text style={styles.voteOptionText}>{option}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={{ height: 24 }} />
          </ScrollView>
        </View>

        <View style={styles.bottomToolbar}>
          <TouchableOpacity style={styles.toolBtn} onPress={addMockImage}>
            <Image
              source={require('../../assets/image/icon_camera.png')}
              style={styles.toolImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolBtn}
            onPress={() => setVoteModalVisible(true)}
          >
            <Image
              source={require('../../assets/image/icon_vote.png')}
              style={styles.toolImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <Modal visible={boardModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.boardSheet}>
              <View style={styles.sheetHeader}>
                <TouchableOpacity onPress={() => setBoardModalVisible(false)}>
                  <Text style={styles.sheetClose}>닫기</Text>
                </TouchableOpacity>

                <Text style={styles.sheetTitle}>게시판 선택</Text>

                <View style={styles.sheetSpace} />
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {boardOptions.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.boardOptionRow,
                      selectedBoard === item && styles.boardOptionRowActive,
                    ]}
                    onPress={() => {
                      setSelectedBoard(item);
                      setBoardModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.boardOptionText,
                        selectedBoard === item && styles.boardOptionTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal visible={voteModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.voteSheet}>
              <View style={styles.voteHeader}>
                <TouchableOpacity onPress={() => setVoteModalVisible(false)}>
                  <Text style={styles.voteClose}>✕</Text>
                </TouchableOpacity>

                <Text style={styles.voteHeaderTitle}>투표 만들기</Text>

                <TouchableOpacity onPress={() => setVoteModalVisible(false)}>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },

  blueHeader: {
    height: 84,
    backgroundColor: BLUE,
  },

  container: {
    flex: 1,
    backgroundColor: BG,
  },

  writeCard: {
    flex: 1,
    marginHorizontal: 18,
    marginTop: -36,
    backgroundColor: WHITE,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: 18,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  topRow: {
    height: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  closeText: {
    fontSize: 15,
    color: TEXT,
    fontWeight: '700',
  },

  headerTitle: {
    fontSize: 18,
    color: TEXT,
    fontWeight: '900',
  },

  doneText: {
    fontSize: 15,
    color: BLUE,
    fontWeight: '900',
  },

  boardSelectBox: {
    height: 46,
    borderRadius: 10,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 18,
  },

  boardPlaceholder: {
    fontSize: 14,
    color: '#B6B6B6',
    fontWeight: '700',
  },

  boardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  boardValue: {
    fontSize: 14,
    color: '#7A7A7A',
    fontWeight: '700',
    marginRight: 8,
  },

  boardArrow: {
    fontSize: 14,
    color: '#A8A8A8',
  },

  contentArea: {
    flex: 1,
  },

  contentContainer: {
    paddingBottom: 24,
  },

  titleInput: {
    fontSize: 18,
    color: TEXT,
    fontWeight: '900',
    paddingVertical: 0,
    marginBottom: 16,
  },

  titleDivider: {
    height: 1,
    backgroundColor: LINE,
    marginBottom: 18,
  },

  bodyInput: {
    minHeight: 420,
    fontSize: 13,
    color: '#9F9F9F',
    lineHeight: 24,
    fontWeight: '700',
    paddingVertical: 0,
  },

  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  imageWrap: {
    width: '48.5%',
    marginBottom: 10,
    position: 'relative',
  },

  gridImage: {
    width: '100%',
    height: 108,
    borderRadius: 12,
    backgroundColor: '#EAEAEA',
  },

  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.52)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  removeBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  votePreviewCard: {
    marginTop: 12,
    backgroundColor: '#F7FAFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4ECF8',
    padding: 14,
  },

  votePreviewTop: {
    marginBottom: 10,
  },

  votePreviewTitle: {
    fontSize: 14,
    color: '#2E4D79',
    fontWeight: '900',
    marginBottom: 8,
  },

  voteMetaWrap: {
    flexDirection: 'row',
  },

  voteMetaChip: {
    fontSize: 11,
    color: '#5C8FD6',
    fontWeight: '800',
    backgroundColor: '#EAF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 6,
  },

  voteOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  voteOptionBullet: {
    fontSize: 14,
    color: '#5C8FD6',
    marginRight: 8,
  },

  voteOptionText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '700',
  },

  bottomToolbar: {
    height: 56,
    backgroundColor: WHITE,
    marginHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  toolBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  toolImage: {
    width: 26,
    height: 26,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.38)',
    justifyContent: 'flex-end',
  },

  boardSheet: {
    maxHeight: '72%',
    backgroundColor: WHITE,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 16,
  },

  sheetHeader: {
    height: 42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  sheetClose: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '700',
  },

  sheetTitle: {
    fontSize: 16,
    color: TEXT,
    fontWeight: '900',
  },

  sheetSpace: {
    width: 28,
  },

  boardOptionRow: {
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },

  boardOptionRowActive: {
    backgroundColor: '#E9F1FF',
  },

  boardOptionText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '700',
  },

  boardOptionTextActive: {
    color: '#4C78B5',
  },

  voteSheet: {
    backgroundColor: WHITE,
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