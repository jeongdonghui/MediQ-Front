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

type Props = NativeStackScreenProps<RootStackParamList, 'RestrictionHistory'>;

export default function RestrictionHistoryScreen({ navigation }: Props) {
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

        <Text style={styles.title}>이용 제한 내역</Text>

        <View style={styles.sideBtn} />
      </View>

      {/* 내용 */}
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>이용 제한 내역이 없어요.</Text>
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