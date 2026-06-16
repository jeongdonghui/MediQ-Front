// src/screens/diagnosis/PharmacyMapScreen.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'PharmacyMap'>;

export default function PharmacyMapScreen({ navigation, route }: Props) {
  const q = route.params?.query ?? '약국';

  // ✅ 카카오맵 웹 검색 URL (설치/키 없이 바로 동작)
  const url = useMemo(() => {
    const query = encodeURIComponent(q);
    return `https://map.kakao.com/?q=${query}`;
  }, [q]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.pop()} style={styles.topBtn}>
          <Text style={styles.topBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>내 주변 약국 찾기</Text>
        <View style={styles.topBtn} />
      </View>

      <WebView source={{ uri: url }} startInLoadingState />

      <View style={styles.tip}>
        <Text style={styles.tipText}>
          * 정확히 “내 주변” 기반으로 하려면 다음 단계에서 GPS 권한 + 좌표 기반 검색(카카오 로컬 API)로 업그레이드하면 돼.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: { height: 52, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  topBtn: { width: 60 },
  topBtnText: { fontSize: 26, color: '#111' },
  topTitle: { flex: 1, textAlign: 'center', fontWeight: '700', color: '#111' },
  tip: { padding: 10, backgroundColor: '#F7F8FC', borderTopWidth: 1, borderTopColor: '#EEE' },
  tipText: { fontSize: 11, color: '#555', lineHeight: 14 },
});