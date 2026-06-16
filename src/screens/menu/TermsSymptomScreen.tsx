import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'SymptomPolicy'>;

export default function TermsSymptomScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideBtn}>
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>내 증상 체크 운영정책</Text>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideBtn}>
          <Text style={styles.close}>X</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.section}>내 증상 체크 운영정책</Text>
        <View style={styles.line} />
        <Text style={styles.centerTitle}>내 증상 체크 운영정책 (MEDIQ)</Text>

        <Text style={styles.body}>
          1. 정책의 목적{'\n'}
          본 운영정책은 MEDIQ의 내 증상 체크 기능 이용 기준을 명확히 하기 위해 마련되었습니다.{'\n\n'}

          2. 서비스 안내(중요){'\n'}
          • 내 증상 체크는 의료 진단, 처방, 치료를 제공하지 않습니다.{'\n'}
          • 본 서비스는 사용자가 입력한 정보를 바탕으로 참고용 분석 결과를 제공합니다.{'\n'}
          • 결과는 의학적 진단을 대체할 수 없습니다.{'\n\n'}

          3. 증상 정보 입력 기준{'\n'}
          • 본인의 증상만 입력해야 합니다.{'\n'}
          • 허위/장난성 입력을 지양해야 합니다.{'\n'}
          • 긴급 증상의 경우 즉시 의료기관 이용을 권장합니다.{'\n\n'}

          4. 분석 결과 제공 방식{'\n'}
          • 선택한 증상, 위치, 범위, 양상 등을 종합해 AI 분석 결과를 제공합니다.{'\n'}
          • 결과는 가능성 중심의 참고 정보입니다.{'\n\n'}

          5. 책임의 한계{'\n'}
          사용자의 최종 건강 판단과 의료 선택은 본인 책임입니다.
        </Text>
      </ScrollView>
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  section: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
    marginTop: 6,
  },
  line: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  centerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 24,
  },
  body: {
    fontSize: 14,
    lineHeight: 24,
    color: '#222222',
  },
});