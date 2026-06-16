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

type Props = NativeStackScreenProps<RootStackParamList, 'PrivacyPolicy'>;

export default function TermsPrivacyScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideBtn}>
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>개인정보 처리방침</Text>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideBtn}>
          <Text style={styles.close}>X</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.section}>개인정보 처리방침</Text>
        <View style={styles.line} />
        <Text style={styles.centerTitle}>개인정보 처리방침 (MEDIQ)</Text>

        <Text style={styles.body}>
          1. 개인정보의 처리 목적{'\n'}
          • 회원 가입 및 본인 확인{'\n'}
          • AI 기반 증상 체크 및 건강 정보 제공{'\n'}
          • 맞춤형 콘텐츠 및 서비스 제공{'\n'}
          • 고객 문의 및 민원 처리{'\n'}
          • 법령상 의무 이행{'\n\n'}

          2. 수집하는 개인정보 항목{'\n'}
          필수 항목{'\n'}
          • 이메일 주소 또는 휴대전화 번호{'\n'}
          • 서비스 이용 기록, 접속 로그{'\n'}
          • 증상 체크 과정에서 입력한 건강 관련 정보{'\n\n'}

          선택 항목{'\n'}
          • 위치정보(동의 시){'\n'}
          • 알림 수신 설정 정보{'\n\n'}

          3. 개인정보의 보유 및 이용 기간{'\n'}
          회원 탈퇴 시까지 보관하며, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.{'\n\n'}

          4. 개인정보의 제3자 제공{'\n'}
          회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.{'\n\n'}

          5. 정보주체의 권리{'\n'}
          이용자는 열람, 정정, 삭제, 처리정지, 동의 철회를 요청할 수 있습니다.{'\n\n'}

          6. 문의처{'\n'}
          contact@mediq.co.kr
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