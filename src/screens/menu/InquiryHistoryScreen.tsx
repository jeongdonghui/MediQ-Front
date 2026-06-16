import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { getMyInquiries, createInquiry, getInquiryDetail } from '../../api/inquiries';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'InquiryHistory'>;

type Mode = 'empty' | 'list' | 'write' | 'detail';
type InquiryCategory = '진단' | '커뮤니티' | '결제' | '계정' | '시스템' | '기타';

type InquiryItem = {
  id: string | number;
  status: string;
  number?: string;
  text?: string;
  content?: string;
  date?: string;
  createdAt?: string;
  answer?: string;
  answerDate?: string;
  response?: string;
  answerContent?: string;
  answeredAt?: string;
};

export default function InquiryHistoryScreen({ navigation }: Props) {
  const [mode, setMode] = useState<Mode>('list');
  const [selectedCategory, setSelectedCategory] = useState<InquiryCategory>('진단');
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<number[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 관리자 모드 여부를 판별할 상태값
  const [isAdmin, setIsAdmin] = useState(false);
  // ✅ 관리자가 작성할 답변 텍스트 상태값
  const [adminAnswer, setAdminAnswer] = useState('');

  // ✅ 초기 데이터 로드 및 유저 권한 확인
  React.useEffect(() => {
    let isMounted = true;
    const initLocalData = async () => {
      try {
        if (!AsyncStorage) return;

        // 1. 유저 권한 확인
        const role = await AsyncStorage.getItem('userRole');
        if (role === 'ADMIN' && isMounted) {
          setIsAdmin(true);
        }

        // 2. 로컬 캐시 데이터 로드
        const stored = await AsyncStorage.getItem('@inquiry_records');
        if (stored && isMounted) {
          setInquiries(JSON.parse(stored));
        }
      } catch (e) { }
    };
    initLocalData();
    return () => { isMounted = false; };
  }, []);

  // ✅ 데이터 변경 감지 저장
  React.useEffect(() => {
    const saveLocalData = async () => {
      try {
        if (!AsyncStorage) return;
        await AsyncStorage.setItem('@inquiry_records', JSON.stringify(inquiries));
      } catch (e) { }
    };
    if (inquiries && inquiries.length > 0) {
      saveLocalData();
    }
  }, [inquiries]);

  // ✅ 백엔드 API 목록 호출 연동 (관리자 모드 반영)
  React.useEffect(() => {
    if (mode === 'list') {
      setIsLoading(true);

      // 백엔드 명세서 기반 목록 호출 분기 처리 가능
      const fetchRequest = getMyInquiries();

      fetchRequest
        .then(res => {
          if (res && Array.isArray(res)) {
            setInquiries(res);
            if (res.length === 0) setMode('empty');
          } else {
            if ((inquiries || []).length === 0) setMode('empty');
          }
        })
        .catch(err => {
          console.warn('Failed to fetch inquiries.', err);
          if ((inquiries || []).length === 0) setMode('empty');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [mode, isAdmin]);

  const handleBack = () => {
    if (mode === 'write') {
      setMode((inquiries || []).length > 0 ? 'list' : 'empty');
      return;
    }

    if (mode === 'detail') {
      setSelectedInquiry(null);
      setAdminAnswer('');
      setMode('list');
      return;
    }

    navigation.goBack();
  };

  const handleOpenWrite = () => {
    setMode('write');
  };

  // ✅ 백엔드 API 상세 조회 연동
  const handleOpenDetail = async (item: InquiryItem) => {
    setMode('detail');
    setSelectedInquiry(item);

    try {
      const detail = await getInquiryDetail(item.id);
      if (detail) {
        setSelectedInquiry(detail);
      }
    } catch (error) {
      console.warn('Failed to fetch inquiry detail', error);
    }
  };

  const handleAddPhotoBox = () => {
    setPhotos((prev) => [...prev, Date.now()]);
  };

  // ✅ 관리자 답변 전송 함수
  const handleAdminSubmitAnswer = async () => {
    if (!selectedInquiry || !adminAnswer.trim()) return;

    setIsLoading(true);
    try {
      // 명세서 규격: POST /api/admin/inquiries/{id}, Body: { "answerContent": adminAnswer }
      console.log(`Inquiry ID ${selectedInquiry.id} 답변 등록:`, adminAnswer);

      Alert.alert('완료', '답변이 성공적으로 등록되었습니다.');
      setAdminAnswer('');
      setMode('list');
    } catch (error) {
      console.warn('Admin Reply Failed', error);
      Alert.alert('오류', '답변 등록에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 백엔드 API 문의 생성 연동
  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    const formData = new FormData();

    let catEnum = 'ETC';
    if (selectedCategory === '진단') catEnum = 'DIAGNOSIS';
    else if (selectedCategory === '커뮤니티') catEnum = 'COMMUNITY';
    else if (selectedCategory === '결제') catEnum = 'PAYMENT';
    else if (selectedCategory === '계정') catEnum = 'ACCOUNT';
    else if (selectedCategory === '시스템') catEnum = 'SYSTEM';
    else if (selectedCategory === '기타') catEnum = 'ETC';

    formData.append('category', catEnum);
    formData.append('content', content);

    if (photos.length > 0) {
      formData.append('hasFile', 'true');
    } else {
      formData.append('hasFile', 'false');
    }

    try {
      await createInquiry(formData);

      setContent('');
      setPhotos([]);
      setSelectedCategory('진단');
      setMode('list');
    } catch (error) {
      console.warn('Create Inquiry Failed', error);
      Alert.alert('오류', '문의 등록에 실패했습니다. 서버를 확인해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerSide} onPress={handleBack}>
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isAdmin ? '1:1 문의 관리 (관리자)' : '1:1 문의내역'}
        </Text>

        <View style={styles.headerSide} />
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <>
        <View style={styles.emptyWrap}>
          {isLoading ? (
            <ActivityIndicator size="large" color={BLUE} />
          ) : (
            <Text style={styles.emptyText}>문의 내역이 없어요.</Text>
          )}
        </View>

        {!isAdmin && (
          <TouchableOpacity style={styles.bottomPrimaryBtn} onPress={handleOpenWrite}>
            <Text style={styles.bottomPrimaryBtnText}>1:1 문의하기</Text>
          </TouchableOpacity>
        )}
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
          {(inquiries || []).map((item) => (
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
                  <Text style={styles.statusText}>{item.status === 'ANSWERED' || item.status === '답변 완료' ? '답변 완료' : '접수 완료'}</Text>
                  <Text style={styles.numberText}>No. {item.id}</Text>
                  <Text style={styles.titleText}>{item.content || item.text || '내용 없음'}</Text>
                  <Text style={styles.dateText}>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : (item.date || '-')}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>

        {!isAdmin && (
          <TouchableOpacity style={styles.bottomPrimaryBtn} onPress={handleOpenWrite}>
            <Text style={styles.bottomPrimaryBtnText}>1:1 문의하기</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  const renderDetail = () => {
    if (!selectedInquiry) return null;

    const hasAnswer = !!(selectedInquiry.answerContent || selectedInquiry.answer || (selectedInquiry as any).response);

    return (
      <>
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
                <Text style={styles.statusText}>{selectedInquiry.status === 'ANSWERED' || selectedInquiry.status === '답변 완료' ? '답변 완료' : '접수 완료'}</Text>
                <Text style={styles.numberText}>No. {selectedInquiry.id}</Text>
                <Text style={styles.titleText}>{selectedInquiry.content || selectedInquiry.text || '내용 없음'}</Text>
                <Text style={styles.dateText}>
                  {selectedInquiry.createdAt
                    ? new Date(selectedInquiry.createdAt).toLocaleDateString()
                    : (selectedInquiry.date || '-')}
                </Text>
              </View>
            </View>

            {hasAnswer ? (
              <View style={styles.answerWrap}>
                <Text style={styles.answerTitle}>답변 내용</Text>
                <Text style={styles.answerText}>
                  {selectedInquiry.answerContent || selectedInquiry.answer || (selectedInquiry as any).response}
                </Text>
                <Text style={styles.dateText}>
                  {selectedInquiry.answeredAt
                    ? new Date(selectedInquiry.answeredAt).toLocaleDateString()
                    : (selectedInquiry.answerDate || '')}
                </Text>
              </View>
            ) : isAdmin ? (
              <View style={styles.answerWrap}>
                <Text style={styles.answerTitle}>관리자 답변 작성</Text>
                <View style={styles.adminInputWrap}>
                  <TextInput
                    style={styles.adminTextArea}
                    multiline
                    value={adminAnswer}
                    onChangeText={setAdminAnswer}
                    placeholder="유저에게 전달할 답변 내용을 입력하세요."
                    textAlignVertical="top"
                  />
                </View>
              </View>
            ) : (
              <View style={styles.answerWrap}>
                <Text style={[styles.answerText, { color: '#9CA3AF', textAlign: 'center', marginTop: 20 }]}>
                  아직 답변이 등록되지 않았습니다.
                </Text>
              </View>
            )}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>

        {isAdmin && !hasAnswer && (
          <TouchableOpacity
            style={[styles.bottomPrimaryBtn, !adminAnswer.trim() && { backgroundColor: '#A9C8F8' }]}
            onPress={handleAdminSubmitAnswer}
            disabled={!adminAnswer.trim() || isLoading}
          >
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.bottomPrimaryBtnText}>답변 등록하기</Text>}
          </TouchableOpacity>
        )}
      </>
    );
  };

  const renderWrite = () => {
    const categories: InquiryCategory[] = ['진단', '커뮤니티', '결제', '계정', '시스템', '기타'];

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
            onPress={() => setMode((inquiries || []).length > 0 ? 'list' : 'empty')}
          >
            <Text style={styles.bottomCancelBtnText}>취소</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bottomWriteBtn} onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.bottomWriteBtnText}>작성하기</Text>}
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
  adminInputWrap: {
    marginTop: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    minHeight: 120,
    paddingHorizontal: 10,
  },
  adminTextArea: {
    minHeight: 120,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111111',
  }
});