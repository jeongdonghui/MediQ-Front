import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

export default function NoticeTermsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>공지사항 및 이용약관</Text>

        <Text style={styles.text}>
MediQ 서비스 이용을 환영합니다.

본 서비스 이용 시 다음 약관이 적용됩니다.

1. 서비스 목적
사용자의 건강 정보 이해를 돕기 위한 정보 제공 서비스입니다.

2. 서비스 이용
사용자는 본 서비스를 정상적인 범위 내에서 이용해야 합니다.

3. 책임 제한
MediQ는 의료기관이 아니며 의료 행위를 제공하지 않습니다.

4. 약관 변경
서비스 정책은 필요 시 변경될 수 있습니다.
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