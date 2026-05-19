import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ 관리자 상태 감지를 위해 추가

type Props = NativeStackScreenProps<RootStackParamList, 'RestrictionHistory'>;

export default function RestrictionHistoryScreen({ navigation }: Props) {
  // ✅ 관리자 모드 여부를 가릴 상태값 추가
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ 마운트 시 유저 롤 확인
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

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.sideBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>

        {/* ✅ 관리자일 때 헤더 타이틀 문구 분기 처리 */}
        <Text style={styles.title}>
          {isAdmin ? '이용 제한 관리 (관리자)' : '이용 제한 내역'}
        </Text>

        <View style={styles.sideBtn} />
      </View>

      {/* 내용 */}
      <View style={styles.emptyWrap}>
        {/* ✅ 관리자일 때와 일반 유저일 때 텅 빈 화면 문구 변경 */}
        <Text style={styles.emptyText}>
          {isAdmin ? '제재된 유저 내역이 없습니다.' : '이용 제한 내역이 없어요.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  header: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
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

  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B3B3B3',
  },
});