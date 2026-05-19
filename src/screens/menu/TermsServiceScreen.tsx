import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert, // ✅ 관리자 액션 테스트를 위해 추가
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ 관리자 상태 감지를 위해 추가

type Props = NativeStackScreenProps<RootStackParamList, 'ServiceTerms'>;

function TermItem({
  title,
  date,
}: {
  title: string;
  date: string;
}) {
  return (
    <View style={styles.item}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemDate}>{date}</Text>
    </View>
  );
}

export default function TermsServiceScreen({ navigation }: Props) {
  const [isAdmin, setIsAdmin] = useState(false);

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

  // ✅ 관리자 전용 새 약관 등록 핸들러
  const handleCreateTerm = () => {
    Alert.alert('관리자 기능', '새로운 서비스 이용약관 등록 폼으로 이동하거나 팝업을 띄우는 지점입니다.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideBtn}>
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>

        {/* ✅ 관리자일 때 헤더 타이틀 문구 분기 처리 */}
        <Text style={styles.title}>
          {isAdmin ? '이용약관 관리 (관리자)' : '서비스 이용약관'}
        </Text>

        {/* ----------------------------------------------------
            🔥 관리자 모드 UI 분기 처리 영역 (헤더 우측 버튼)
            ---------------------------------------------------- */}
        {isAdmin ? (
          <TouchableOpacity onPress={handleCreateTerm} style={styles.adminAddBtn}>
            <Text style={styles.adminAddText}>＋</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideBtn}>
            <Text style={styles.close}>X</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <TermItem title="MediQ 약관 개정 안내(260121)" date="2026.01.21" />
        <TermItem title="MediQ 약관 개정 안내(250119)" date="2025.01.19" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  sideBtn: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    fontSize: 26,
    color: '#111111',
  },
  close: {
    fontSize: 22,
    color: '#111111',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  item: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 8,
  },
  itemDate: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  /* ✅ 관리자 전용 추가 스타일셋 */
  adminAddBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#EEF4FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CFE0FF',
  },
  adminAddText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6EA8FF',
    marginTop: -2, // 플러스 기호 수직 보정
  },
});