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

type Props = NativeStackScreenProps<RootStackParamList, 'LocationTerms'>;

export default function TermsLocationScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideBtn}>
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>위치기반 서비스 이용약관 동의</Text>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideBtn}>
          <Text style={styles.close}>X</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.section}>위치기반 서비스 이용 약관</Text>
        <View style={styles.line} />
        <Text style={styles.centerTitle}>위치기반 서비스 이용 약관 (MEDIQ)</Text>

        <Text style={styles.body}>
          제1조 (목적){'\n'}
          본 약관은 MEDIQ 서비스의 위치정보 이용에 관한 기준을 정하기 위한 것입니다.{'\n\n'}

          제2조 (서비스 내용){'\n'}
          회사는 사용자의 위치를 기반으로 가까운 병원, 약국, 기타 건강 관련 장소 정보를 제공할 수 있습니다.{'\n\n'}

          제3조 (수집 항목){'\n'}
          위치정보, 기기식별정보, 서비스 이용기록 등이 포함될 수 있습니다.{'\n\n'}

          제4조 (이용 목적){'\n'}
          • 가까운 병원/약국 찾기{'\n'}
          • 지역 기반 건강 정보 제공{'\n'}
          • 맞춤형 서비스 개선{'\n\n'}

          제5조 (보유 기간){'\n'}
          위치정보는 서비스 제공 목적 달성 후 지체 없이 파기합니다.{'\n\n'}

          제6조 (이용자의 권리){'\n'}
          이용자는 위치정보 이용 동의 철회, 열람, 정정, 삭제를 요청할 수 있습니다.{'\n\n'}

          제7조 (책임 제한){'\n'}
          회사는 위치정보 오차로 인해 발생할 수 있는 간접 손해에 대해 법령이 허용하는 범위 내에서 책임을 제한할 수 있습니다.{'\n\n'}

          제8조 (문의처){'\n'}
          이메일: contact@mediq.co.kr
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
    fontSize: 16,
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