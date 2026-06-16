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

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 방침 텍스트 상태 관리 (관리자가 수정할 수 있도록 분리)
  const [policyText, setPolicyText] = useState(
    `MediQ는 이용자의 개인정보를 중요하게 생각하며 다음과 같이 보호합니다.

수집 항목
- 이메일
- 로그인 정보
- 서비스 이용 기록

수집 목적
- 사용자 계정 관리
- 서비스 제공 및 개선
- 고객 문의 대응

보관 기간
회원 탈퇴 시 즉시 삭제됩니다.

개인정보는 관련 법령에 따라 안전하게 관리됩니다.`
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

  // ✅ 관리자 개인정보 처리방침 저장 함수
  const handleUpdatePolicy = async () => {
    if (!policyText.trim()) {
      Alert.alert('안내', '내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // 추후 백엔드 규격 연동 지점 (예: PUT 또는 PATCH /api/admin/policies/privacy)
      console.log('관리자 개인정보 처리방침 수정 요청:', policyText);

      Alert.alert('완료', '개인정보 처리방침이 성공적으로 수정 및 반영되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('오류', '방침 수정 중 서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ✅ 상단 헤더 추가 (다른 규칙 화면들과 통일감 부여) */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.sideBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isAdmin ? '방침 편집 (관리자)' : '개인정보 처리방침'}
        </Text>

        <View style={styles.sideBtn} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          {isAdmin ? '개인정보 처리방침 수정 가이드라인' : '개인정보 처리방침'}
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
              placeholder="개인정보 처리방침 내용을 편집하세요."
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
            {isLoading ? '저장 중...' : '방침 내용 변경 및 저장'}
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
    paddingBottom: 100, // 하단 고정 버튼을 고려한 안전 마진
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