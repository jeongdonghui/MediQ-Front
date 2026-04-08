import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

export default function SymptomPolicyScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>증상정보 이용 정책</Text>

        <Text style={styles.text}>
MediQ는 사용자가 입력한 증상 정보를 기반으로 건강 관련 참고 정보를 제공합니다.
본 서비스는 의료진의 진단을 대체하지 않으며 참고용 정보입니다.

사용자는 서비스 이용 시 다음 사항에 동의합니다.

1. MediQ는 의료 행위를 제공하지 않습니다.
2. 제공되는 정보는 참고용 건강 정보입니다.
3. 응급상황에서는 반드시 병원 또는 119를 이용해야 합니다.
4. 입력된 증상 정보는 서비스 개선을 위해 익명화되어 활용될 수 있습니다.
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