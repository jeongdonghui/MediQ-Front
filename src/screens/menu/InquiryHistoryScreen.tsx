import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { getMyInquiries, createInquiry } from '../../api/inquiries';

type Props = NativeStackScreenProps<RootStackParamList, 'InquiryHistory'>;

type Mode = 'empty' | 'list' | 'write' | 'detail';
type InquiryCategory = '진단' | '커뮤니티' | '결제' | '기타';

type InquiryItem = {
  id: string;
  status: '답변 완료' | '접수 완료';
  number: string;
  text: string;
  date: string;
  answer?: string;
  answerDate?: string;
};

export default function InquiryHistoryScreen({ navigation }: Props) {
  const [mode, setMode] = useState<Mode>('list');
  const [selectedCategory, setSelectedCategory] = useState<InquiryCategory>('진단');
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<number[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);

  const mockInquiries: InquiryItem[] = [
    {
      id: '1',
      status: '답변 완료',
      number: 'No. 2026012112300001',
      text: '결제를 했는데 결제가 실패 되었네요 다시 확인 부탁드립니다.',
      date: '2026.01.21 12:30',
      answer:
        '안녕하세요. MediQ 입니다.\n\n상담번호 : 2026012112300001\n\n문의주신 결제 실패 건 확인되었습니다.\n일시적인 시스템 또는 결제사 오류로 인해 결제가 정상적으로 처리되지 않았을 가능성이 있습니다.\n\n잠시 후 다시 시도해보시거나,\n다른 결제 수단으로 이용해주시길 권장드립니다.\n\n계속 문제가 발생할 경우,\n편하게 다시 문의 주세요. 빠르게 도와드리겠습니다.\n\n감사합니다.',
      answerDate: '2026.01.21 12:40',
    },
    {
      id: '2',
      status: '답변 완료',
      number: 'No. 2026012112300243',
      text: '결제를 했는데 결제가 실패 되었네요 다시 확인 부탁드립니다.',
      date: '2026.01.21 12:30',
      answer:
        '문의하신 내용 확인되었습니다.\n결제 승인 과정에서 일시 오류가 있었던 것으로 보입니다.\n카드 정보를 다시 확인하신 후 재시도 부탁드립니다.',
      answerDate: '2026.01.21 13:05',
    },
  ];

  // API 호출 후 실패 시 더미 데이터로 폴백 연동
  React.useEffect(() => {
    if (mode === 'list') {
      getMyInquiries()
        .then(res => {
          setInquiries(res.length > 0 ? res : mockInquiries);
        })
        .catch(err => {
          console.warn('Failed to fetch inquiries, fallback to mock data.', err);
          setInquiries(mockInquiries);
        });
    }
  }, [mode]);

  const handleBack = () => {
    if (mode === 'write') {
      setMode(inquiries.length > 0 ? 'list' : 'empty');
      return;
    }

    if (mode === 'detail') {
      setSelectedInquiry(null);
      setMode('list');
      return;
    }

    navigation.goBack();
  };

  const handleOpenWrite = () => {
    setMode('write');
  };

  const handleOpenDetail = (item: InquiryItem) => {
    setSelectedInquiry(item);
    setMode('detail');
  };

  const handleAddPhotoBox = () => {
    setPhotos((prev) => [...prev, Date.now()]);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    const formData = new FormData();
    const catEnum = selectedCategory === '결제' ? 'PAYMENT' : selectedCategory === '커뮤니티' ? 'COMMUNITY' : selectedCategory === '기타' ? 'ETC' : 'DIAGNOSIS';
    formData.append('category', catEnum);
    formData.append('content', content);
    // TODO: 실제로 photo/file 데이터 append 해야함

    try {
      await createInquiry(formData);
    } catch (error) {
      console.warn('Create Inquiry Failed', error);
    }

    setContent('');
    setPhotos([]);
    setSelectedCategory('진단');
    setMode('list');
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerSide} onPress={handleBack}>
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>1:1 문의내역</Text>

        <View style={styles.headerSide} />
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>문의 내역이 없어요.</Text>
        </View>

        <TouchableOpacity style={styles.bottomPrimaryBtn} onPress={handleOpenWrite}>
          <Text style={styles.bottomPrimaryBtnText}>1:1 문의하기</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderList = () => {
    return (
      <>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {inquiries.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.inquiryCard}
              activeOpacity={0.85}
              onPress={() => handleOpenDetail(item)}
            >
              <View style={styles.rowTop}>
                <View style={styles.qCircle}>
                  <Text style={styles.qText}>Q</Text>
                </View>

                <View style={styles.inquiryMain}>
                  <Text style={styles.statusText}>{item.status}</Text>
                  <Text style={styles.numberText}>{item.number}</Text>
                  <Text style={styles.titleText}>{item.text}</Text>
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>

        <TouchableOpacity style={styles.bottomPrimaryBtn} onPress={handleOpenWrite}>
          <Text style={styles.bottomPrimaryBtnText}>1:1 문의하기</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderDetail = () => {
    if (!selectedInquiry) return null;

    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.detailContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.detailCard}>
          <View style={styles.rowTop}>
            <View style={styles.qCircle}>
              <Text style={styles.qText}>Q</Text>
            </View>

            <View style={styles.inquiryMain}>
              <Text style={styles.statusText}>{selectedInquiry.status}</Text>
              <Text style={styles.numberText}>{selectedInquiry.number}</Text>
              <Text style={styles.titleText}>{selectedInquiry.text}</Text>
              <Text style={styles.dateText}>{selectedInquiry.date}</Text>
            </View>
          </View>

          {selectedInquiry.answer ? (
            <View style={styles.answerWrap}>
              <Text style={styles.answerTitle}>답변 내용</Text>
              <Text style={styles.answerText}>{selectedInquiry.answer}</Text>
              <Text style={styles.dateText}>{selectedInquiry.answerDate}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    );
  };

  const renderWrite = () => {
    const categories: InquiryCategory[] = ['진단', '커뮤니티', '결제', '기타'];

    return (
      <>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.writeContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.categoryWrap}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryBtn,
                  selectedCategory === category && styles.categoryBtnActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryBtnText,
                    selectedCategory === category && styles.categoryBtnTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.grayBar} />

          <Text style={styles.writeLabel}>내용</Text>
          <View style={styles.textAreaWrap}>
            <TextInput
              style={styles.textArea}
              multiline
              value={content}
              onChangeText={setContent}
              textAlignVertical="top"
              placeholder=""
            />
          </View>

          <Text style={styles.writeLabel}>사진</Text>

          <View style={styles.photoRow}>
            <TouchableOpacity style={styles.uploadBox} onPress={handleAddPhotoBox}>
              <Text style={styles.plus}>＋</Text>
            </TouchableOpacity>

            {photos.map((item) => (
              <View key={item} style={styles.photoItem} />
            ))}
          </View>

          <View style={styles.noticeWrap}>
            <Text style={styles.noticeText}>원활한 상담을 위해 아래 사항을 확인해 주세요.</Text>
            <Text style={styles.noticeBullet}>• 문의 내용을 구체적으로 작성해 주세요.</Text>
            <Text style={styles.noticeBullet}>• 민감한 개인정보는 입력하지 마세요.</Text>
            <Text style={styles.noticeBullet}>• 답변은 영업일 기준 1~2일 이내 제공됩니다.</Text>
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>

        <View style={styles.bottomDualWrap}>
          <TouchableOpacity
            style={styles.bottomCancelBtn}
            onPress={() => setMode(inquiries.length > 0 ? 'list' : 'empty')}
          >
            <Text style={styles.bottomCancelBtnText}>취소</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bottomWriteBtn} onPress={handleSubmit}>
            <Text style={styles.bottomWriteBtnText}>작성하기</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      {mode === 'empty' && renderEmpty()}
      {mode === 'list' && renderList()}
      {mode === 'detail' && renderDetail()}
      {mode === 'write' && renderWrite()}
    </SafeAreaView>
  );
}

const BLUE = '#5D84E8';
const BG = '#F6F6F7';
const TEXT = '#111111';
const SUB = '#8E8E93';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  header: {
    height: 52,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },

  headerSide: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  back: {
    fontSize: 24,
    color: TEXT,
    fontWeight: '500',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: TEXT,
    letterSpacing: -0.2,
  },

  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: '#A9A9A9',
    fontWeight: '700',
  },

  scroll: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },

  inquiryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  qCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#6EA8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },

  qText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  inquiryMain: {
    flex: 1,
  },

  statusText: {
    color: '#6EA8FF',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },

  numberText: {
    fontSize: 15,
    color: TEXT,
    fontWeight: '800',
    marginBottom: 6,
  },

  titleText: {
    fontSize: 14,
    color: TEXT,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 10,
  },

  dateText: {
    fontSize: 12,
    color: SUB,
    fontWeight: '500',
  },

  detailContent: {
    padding: 16,
  },

  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  answerWrap: {
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    paddingTop: 16,
  },

  answerTitle: {
    fontSize: 14,
    color: TEXT,
    fontWeight: '800',
    marginBottom: 10,
  },

  answerText: {
    fontSize: 14,
    color: TEXT,
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: 10,
  },

  bottomPrimaryBtn: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 84,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
  },

  bottomPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  writeContent: {
    paddingTop: 14,
    paddingBottom: 24,
  },

  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },

  categoryBtn: {
    minWidth: 88,
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  categoryBtnActive: {
    backgroundColor: '#EEF4FF',
    borderWidth: 1,
    borderColor: '#CFE0FF',
  },

  categoryBtnText: {
    color: '#6B6B6B',
    fontSize: 13,
    fontWeight: '700',
  },

  categoryBtnTextActive: {
    color: TEXT,
  },

  grayBar: {
    height: 16,
    backgroundColor: '#EFEFF1',
    marginBottom: 16,
  },

  writeLabel: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '700',
    marginBottom: 8,
    paddingHorizontal: 16,
  },

  textAreaWrap: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    minHeight: 240,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 14,
  },

  textArea: {
    minHeight: 240,
    padding: 14,
    fontSize: 14,
    color: TEXT,
  },

  photoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 18,
  },

  uploadBox: {
    width: 76,
    height: 76,
    borderRadius: 8,
    backgroundColor: '#E9E9EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  photoItem: {
    width: 76,
    height: 76,
    borderRadius: 8,
    backgroundColor: '#DCDCDC',
  },

  plus: {
    fontSize: 34,
    color: '#A4A4A4',
    fontWeight: '300',
  },

  noticeWrap: {
    paddingHorizontal: 16,
  },

  noticeText: {
    fontSize: 12,
    color: '#8B8B8B',
    marginBottom: 10,
  },

  noticeBullet: {
    fontSize: 12,
    color: '#8B8B8B',
    marginBottom: 4,
  },

  bottomDualWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 84,
    flexDirection: 'row',
  },

  bottomCancelBtn: {
    flex: 1,
    backgroundColor: '#D8D8D8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomCancelBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  bottomWriteBtn: {
    flex: 1,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomWriteBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});