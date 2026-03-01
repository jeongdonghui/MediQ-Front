// src/screens/diagnosis/PainScopeScreen.tsx
import React, { useMemo, useRef, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, PainScopeKey } from '../../navigation/AppNavigator';
import HelpPopup from '../../components/HelpPopup';

type Props = NativeStackScreenProps<RootStackParamList, 'PainScope'>;

const BLUE = '#3B82F6';
const BG = '#F6F7FB';

/**
 * ✅ 네 폴더 스샷 기준 pain_scope 이미지들
 * 경로/파일명만 네 프로젝트와 100% 일치해야 함
 */
const ICONS: Record<PainScopeKey, any> = {
  LOCALIZED: require('../../assets/image/pain_scope/pain_localized.png'),
  DIFFUSE: require('../../assets/image/pain_scope/pain_diffuse.png'),
  RADIATING: require('../../assets/image/pain_scope/pain_radiating.png'),
  REFERRED: require('../../assets/image/pain_scope/pain_referred.png'),
  MULTIPLE: require('../../assets/image/pain_scope/pain_multiple.png'),
  MIGRATORY: require('../../assets/image/pain_scope/pain_migratory.png'),
};


const Q_ICON = require('../../assets/image/Qbtn.png');

type Card = {
  key: PainScopeKey;
  titleKo: string;
  titleEn: string;
  bracket: string;
  helpQuestion: string;
};

export default function PainScopeScreen({ navigation, route }: Props) {
  const { area, category, location, symptoms, otherText } = route.params;

  const cards: Card[] = useMemo(
    () => [
      { key: 'LOCALIZED', titleKo: '국소 통증', titleEn: 'Localized', bracket: '딱 여기', helpQuestion: '"손가락 하나로 콕 집을 수 있나요?"' },
      { key: 'DIFFUSE', titleKo: '확산 통증', titleEn: 'Diffuse', bracket: '넓은 근처', helpQuestion: '"손바닥을 대야 할 만큼 넓은 곳이 아파요?"' },
      { key: 'RADIATING', titleKo: '방사통', titleEn: 'Radiating', bracket: '쭉쭉 퍼짐', helpQuestion: '"처음 아픈 곳에서 옆으로 퍼지거나 뻗치나요?"' },
      { key: 'REFERRED', titleKo: '연관통', titleEn: 'Referred', bracket: '먼 곳까지', helpQuestion: '"아픈 부위와 다른 곳(예: 배→어깨)도 같이 아픈가요?"' },
      { key: 'MULTIPLE', titleKo: '다발성 통증', titleEn: 'Multiple', bracket: '여러 군데', helpQuestion: '"두 군데 이상이 동시에 아픈가요?"' },
      { key: 'MIGRATORY', titleKo: '유동성 통증', titleEn: 'Migratory', bracket: '왔다 갔다', helpQuestion: '"통증 위치가 시간에 따라 이동하나요?"' },
    ],
    []
  );

  const [selected, setSelected] = useState<PainScopeKey[]>([]);
  const toggle = (k: PainScopeKey) => {
    setSelected((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  };

  /**
   * ✅ Q 버튼 누르면 카드 토글이 같이 먹는 문제 해결
   */
  const qPressedRef = useRef(false);
  const safeToggle = (k: PainScopeKey) => {
    if (qPressedRef.current) {
      qPressedRef.current = false;
      return;
    }
    toggle(k);
  };

  // ✅ 팝업 상태
  const [helpKey, setHelpKey] = useState<PainScopeKey | null>(null);
  const openHelp = (k: PainScopeKey) => setHelpKey(k);
  const closeHelp = () => setHelpKey(null);

  const helpCard = helpKey ? cards.find((c) => c.key === helpKey) : null;

  const goNext = () => {
    navigation.navigate('PainSeverity', {
      area,
      category,
      location,
      symptoms,
      otherText,
      painScopes: selected,
    });
  };

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.pop()} style={styles.topBtn}>
          <Text style={styles.topBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>통증 범위 확인</Text>
        <View style={styles.topBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>어떤 통증인가요?</Text>
        <Text style={styles.h2}>비슷한 통증을 모두 선택해주세요.</Text>

        <View style={styles.grid}>
          {cards.map((c) => {
            const isOn = selected.includes(c.key);

            return (
              <Pressable
                key={c.key}
                style={[styles.card, isOn && styles.cardOn]}
                onPress={() => safeToggle(c.key)}
              >
                {/* ✅ Q 버튼 */}
                <Pressable
                  onPressIn={() => {
                    qPressedRef.current = true;
                  }}
                  onPress={() => openHelp(c.key)}
                  style={styles.qBtn}
                  hitSlop={14}
                >
                  <Image source={Q_ICON} style={styles.qIcon} resizeMode="contain" />
                </Pressable>

                <Image source={ICONS[c.key]} style={styles.icon} resizeMode="contain" />

                <Text style={[styles.title, isOn && styles.titleOn]}>
                  {c.titleKo} ({c.titleEn})
                </Text>

                {/* ✅ []는 “누르기 전 화면에 항상 노출” */}
                <Text style={styles.bracket}>[{c.bracket}]</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom button */}
      <Pressable style={styles.bottomBtn} onPress={goNext}>
        <Text style={styles.bottomBtnText}>다음</Text>
      </Pressable>

      {/* ✅ HelpPopup */}
      <HelpPopup
  visible={!!helpCard}
  title={
    helpCard
      ? `${helpCard.titleKo} (${helpCard.titleEn})`
      : ''
  }
  body={helpCard?.helpQuestion ?? ''}
  onClose={() => setHelpKey(null)}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  topBar: {
    height: 52,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  topBtn: { width: 60 },
  topBtnText: { fontSize: 26, color: '#111' },
  topTitle: { flex: 1, textAlign: 'center', fontWeight: '900', color: '#111' },

  content: { padding: 18, paddingBottom: 110 },

  h1: { fontSize: 18, fontWeight: '900', color: '#111', marginTop: 8 },
  h2: { fontSize: 12.5, color: '#6B7280', marginTop: 6 },

  grid: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,

    alignItems: 'center',
    justifyContent: 'center',

    position: 'relative',
  },
  cardOn: {
    borderColor: BLUE,
    shadowOpacity: 0.12,
    elevation: 3,
  },

  qBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    elevation: 999,
  },
  qIcon: { width: 18, height: 18 },

  icon: { width: 34, height: 34, marginBottom: 10 },

  title: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#374151',
    textAlign: 'center',
  },
  titleOn: { color: BLUE },

  bracket: {
    marginTop: 6,
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '900',
    textAlign: 'center',
  },

  bottomBtn: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    height: 54,
    borderRadius: 12,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
});