import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>개인정보 처리방침</Text>

        <Text style={styles.text}>
MediQ는 이용자의 개인정보를 중요하게 생각하며 다음과 같이 보호합니다.

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

개인정보는 관련 법령에 따라 안전하게 관리됩니다.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EEF4FF',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
  },
});
