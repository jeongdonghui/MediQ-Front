import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput, // ✅ 관리자 편집 기능을 위해 추가
  Alert, // ✅ 수정 완료 알림을 위해 추가
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ 관리자 상태 감지를 위해 추가

type Props = NativeStackScreenProps<RootStackParamList, 'CommunityPolicy'>;

export default function CommunityPolicyScreen({ navigation }: Props) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 규칙 텍스트 상태 관리 (관리자가 수정할 수 있도록 분리)
  const [policyText, setPolicyText] = useState(
    `이 커뮤니티는 모든 사용자가 서로 존중하며 자유롭게 의견을 나눌 수 있는 열린 공간입니다.

건강한 커뮤니티 문화를 유지하기 위해 다음과 같은 기본 원칙을 지켜주시기 바랍니다.

1. 타인을 존중해 주세요.
다른 이용자에게 불쾌감이나 상처를 줄 수 있는 욕설, 비방, 조롱, 인신공격, 혐오 표현 등은 허용되지 않습니다.

2. 허위정보 및 과장 광고를 금지합니다.
확인되지 않은 정보, 허위 후기, 과장된 효능 표현, 상업적 홍보 목적의 게시물은 제한될 수 있습니다.

3. 개인정보를 보호해 주세요.
본인 또는 타인의 연락처, 주소, 계좌정보 등 민감한 개인정보를 게시하면 안 됩니다.

4. 저작권을 준수해 주세요.
타인의 사진, 영상, 음악, 글 등 저작물이 포함된 콘텐츠는 권리자의 허락 없이 무단으로 게시할 수 없습니다.

5. 불법 및 유해 콘텐츠를 금지합니다.
불법 행위 조장, 음란물, 도박, 마약, 자해·자살 유도 등 사회적으로 유해한 콘텐츠는 즉시 제한될 수 있습니다.

6. 운영 정책 위반 시 제재될 수 있습니다.
운영 원칙을 위반한 게시물은 예고 없이 삭제될 수 있으며, 이용 제한 또는 영구 정지 조치가 적용될 수 있습니다.

7. 서비스 목적에 맞게 이용해 주세요.
본 커뮤니티는 건강, 증상, 병원, 약국, 생활 관리 등 관련 정보 공유를 위한 공간입니다.

8. 정책은 필요 시 변경될 수 있습니다.
운영정책은 서비스 운영 상황에 따라 사전 고지 후 수정될 수 있습니다.`
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

  // ✅ 관리자 규칙 저장 함수
  const handleUpdatePolicy = async () => {
    if (!policyText.trim()) {
      Alert.alert('안내', '내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // 추후 백엔드 규격 연동 지점 (예: PUT 또는 PATCH /api/admin/policies/community)
      console.log('관리자 커뮤니티 이용규칙 수정 요청:', policyText);

      Alert.alert('완료', '커뮤니티 이용규칙이 성공적으로 수정 및 반영되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('오류', '규칙 수정 중 서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.sideBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>

        {/* ✅ 관리자 여부에 따라 헤더 타이틀 변경 */}
        <Text style={styles.title}>
          {isAdmin ? '이용규칙 편집 (관리자)' : '커뮤니티 이용규칙'}
        </Text>

        <View style={styles.sideBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>
          {isAdmin ? '커뮤니티 이용규칙 수정 가이드라인' : '커뮤니티 이용규칙 안내'}
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
              placeholder="커뮤니티 이용규칙 내용을 편집하세요."
            />
          </View>
        ) : (
          <Text style={styles.body}>{policyText}</Text>
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
            {isLoading ? '저장 중...' : '이용규칙 내용 변경 및 저장'}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
  },

  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
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

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // 버튼 영역을 감안하여 패딩 확장
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
  },

  body: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555555',
  },

  /* ✅ 관리자 모드 전용 추가 스타일셋 */
  adminInputWrap: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    minHeight: 480,
  },

  adminTextArea: {
    fontSize: 14,
    lineHeight: 22,
    color: '#111827',
    minHeight: 460,
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