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
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideBtn}>
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>서비스 이용약관</Text>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideBtn}>
          <Text style={styles.close}>X</Text>
        </TouchableOpacity>
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
});