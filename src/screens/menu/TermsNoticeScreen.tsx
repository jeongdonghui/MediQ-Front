import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'NoticeTerms'>;

function Row({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Text style={styles.rowText}>{label}</Text>
      <Text style={styles.arrow}>{'>'}</Text>
    </TouchableOpacity>
  );
}

export default function TermsNoticeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideBtn}>
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>공지사항 및 약관</Text>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideBtn}>
          <Text style={styles.close}>X</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        <Row
          label="서비스 이용약관"
          onPress={() => navigation.navigate('ServiceTerms')}
        />
        <Row
          label="위치기반 서비스 이용약관 동의"
          onPress={() => navigation.navigate('LocationTerms')}
        />
        <Row
          label="개인정보처리방침"
          onPress={() => navigation.navigate('PrivacyPolicy')}
        />
        <Row
          label="내 증상 체크 운영정책"
          onPress={() => navigation.navigate('SymptomPolicy')}
        />
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
  list: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowText: {
    fontSize: 17,
    color: '#111111',
    fontWeight: '700',
  },
  arrow: {
    fontSize: 20,
    color: '#111111',
    fontWeight: '700',
  },
});