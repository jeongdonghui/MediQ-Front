import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity, // ✅ 헤더 및 버튼 클릭을 위해 추가
  TextInput, // ✅ 관리자 편집 기능을 위해 추가
  Alert, // ✅ 수정 완료 알림을 위해 추가
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // ✅ 뒤로가기 제어를 위해 추가
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ 관리자 상태 감지를 위해 추가

export default function NoticeTermsScreen() {
  const navigation = useNavigation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 약관 텍스트 상태 관리 (관리자가 수정할 수 있도록 분리)
  const [policyText, setPolicyText] = useState(
    `MediQ 서비스 이용을 환영합니다.

본 서비스 이용 시 다음 약관이 적용됩니다.

1. 서비스 목적
사용자의 건강 정보 이해를 돕기 위한 정보 제공 서비스입니다.

2. 서비스 이용
사용자는 본 서비스를 정상적인 범위 내에서 이용해야 합니다.

3. 책임 제한
MediQ는 의료기관이 아니며 의료 행위를 제공하지 않습니다.

4. 약관 변경
서비스 정책은 필요 시 변경될 수 있습니다.`
  );

  // ✅ 마운트 시 관리자 모드 체크
  useEffect(() => {
    async function checkAdminRole() {
      try {
        const role = await AsyncStorage.getItem('userRole');
        if (role === 'ADMIN') {
          setIsAdmin(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }
    checkAdminRole();
  }, []);

  // ✅ 관리자 공지 및 이용약관 저장 함수
  const handleUpdatePolicy = async () => {
    if (!policyText.trim()) {
      Alert.alert('안내', '내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // 추후 백엔드 규격 연동 지점 (예: PUT 또는 PATCH /api/admin/policies/notice-terms)
      console.log('관리자 공지사항 및 약관 수정 요청:', policyText);

      Alert.alert('완료', '공지사항 및 약관 내용이 성공적으로 변경되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('오류', '약관 수정 중 서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ✅ 상단 헤더 추가 (전체 디자인 통일감 부여) */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.sideBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isAdmin ? '공지 및 약관 편집 (관리자)' : '공지사항 및 이용약관'}
        </Text>

        <View style={styles.sideBtn} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          {isAdmin ? '공지사항 및 약관 수정 가이드라인' : '공지사항 및 이용약관'}
        </Text>

        {/* ----------------------------------------------------
            🔥 관리자 모드 UI 분기 처리 영역
            ---------------------------------------------------- */}
        {isAdmin ? (
          <View style={styles.adminInputWrap}>
            <TextInput
              style={styles.adminTextArea}
              multiline
              value={policyText}
              onChangeText={setPolicyText}
              textAlignVertical="top"
              placeholder="공지사항 및 이용약관 내용을 편집하세요."
            />
          </View>
        ) : (
          <Text style={styles.text}>{policyText}</Text>
        )}
      </ScrollView>

      {/* ✅ 관리자 모드이고 로딩 중이 아닐 때만 하단 저장 버튼 활성화 */}
      {isAdmin && (
        <TouchableOpacity
          style={[styles.adminButton, isLoading && { backgroundColor: '#A1C7FF' }]}
          onPress={handleUpdatePolicy}
          disabled={isLoading}
        >
          <Text style={styles.adminButtonText}>
            {isLoading ? '저장 중...' : '공지 및 약관 내용 변경 및 저장'}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EEF4FF',
  },
  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 10,
    backgroundColor: '#EEF4FF',
  },
  sideBtn: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100, // 하단 고정 버튼을 고려한 하단 패딩 확보
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 20,
    color: '#111827',
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444444',
  },

  /* ✅ 관리자 모드 전용 추가 스타일셋 */
  adminInputWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    minHeight: 440,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  adminTextArea: {
    fontSize: 14,
    lineHeight: 22,
    color: '#111827',
    minHeight: 420,
  },
  adminButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
    height: 52,
    backgroundColor: '#6EA8FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  adminButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});