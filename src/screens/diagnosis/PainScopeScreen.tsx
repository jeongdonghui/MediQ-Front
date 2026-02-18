// src/screens/diagnosis/PainScopeScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, PainScopeKey } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'PainScope'>;

type Item = {
  key: PainScopeKey;
  title: string;
  subtitle: string;
  icon: any;
  helpTitle: string;
  helpBody: string;
};

export default function PainScopeScreen({ navigation, route }: Props) {
  const { area, category, location, symptoms, otherText } = route.params;

  const [selected, setSelected] = useState<Set<PainScopeKey>>(new Set());
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpItem, setHelpItem] = useState<Item | null>(null);

  const items = useMemo<Item[]>(
    () => [
      {
        key: 'LOCALIZED',
        title: '국소 통증 (Localized)',
        subtitle: '[딱 여기]',
        icon: require('../../assets/image/pain_scope/pain_localized.png'),
        helpTitle: '국소 통증',
        helpBody: '통증이 “딱 한 지점”에 고정되어 느껴져요.\n예) 손가락으로 짚을 수 있는 한 점이 아파요.',
      },
      {
        key: 'DIFFUSE',
        title: '확산 통증 (Diffuse)',
        subtitle: '[넓은 근처]',
        icon: require('../../assets/image/pain_scope/pain_diffuse.png'),
        helpTitle: '확산 통증',
        helpBody: '통증이 한 점이 아니라 넓게 퍼져 있어요.\n예) 손바닥을 대야 할 만큼 넓은 곳이 아파요.',
      },
      {
        key: 'RADIATING',
        title: '방사통 (Radiating)',
        subtitle: '[쭉쭉 퍼짐]',
        icon: require('../../assets/image/pain_scope/pain_radiating.png'),
        helpTitle: '방사통',
        helpBody: '통증이 한 줄로 쭉 내려가거나 뻗어요.\n예) 번개가 치듯 한 줄로 쭉 퍼져요.',
      },
      {
        key: 'REFERRED',
        title: '연관통 (Referred)',
        subtitle: '[먼 곳까지]',
        icon: require('../../assets/image/pain_scope/pain_referred.png'),
        helpTitle: '연관통',
        helpBody: '아픈 곳과 느껴지는 부위가 다를 수 있어요.\n예) 배가 아픈데 어깨까지 같이 아파요.',
      },
      {
        key: 'MULTIPLE',
        title: '다발성 통증 (Multiple)',
        subtitle: '[여러 군데]',
        icon: require('../../assets/image/pain_scope/pain_multiple.png'),
        helpTitle: '다발성 통증',
        helpBody: '여러 부위가 동시에 아파요.\n예) 여기랑 저기, 두 군데가 동시에 아파요.',
      },
      {
        key: 'MIGRATORY',
        title: '유동성 통증 (Migratory)',
        subtitle: '[왔다 갔다]',
        icon: require('../../assets/image/pain_scope/pain_migratory.png'),
        helpTitle: '유동성 통증',
        helpBody: '통증 위치가 시간이 지나며 바뀌어요.\n예) 어제는 여기였는데 오늘은 저기로 옮겨요.',
      },
    ],
    []
  );

  const toggle = (k: PainScopeKey) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const canNext = selected.size > 0;

  const goNext = () => {
    if (!canNext) return;
    navigation.navigate('PainSeverity', {
      area,
      category,
      location,
      symptoms,
      otherText,
      painScopes: Array.from(selected),
    });
  };

  const openHelp = (it: Item) => {
    setHelpItem(it);
    setHelpOpen(true);
  };

  const closeHelp = () => {
    setHelpOpen(false);
    setHelpItem(null);
  };

  const Card = ({ it }: { it: Item }) => {
    const active = selected.has(it.key);
    return (
      <Pressable
        onPress={() => toggle(it.key)}
        style={({ pressed }) => [
          styles.card,
          active && styles.cardActive,
          pressed && { opacity: 0.98 },
        ]}
      >
        <Pressable
          onPress={() => openHelp(it)}
          hitSlop={10}
          style={({ pressed }) => [styles.qBtn, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.qTxt}>?</Text>
        </Pressable>

        <Image source={it.icon} style={styles.icon} resizeMode="contain" />
        <Text style={[styles.cardTitle, active && styles.cardTitleActive]}>{it.title}</Text>
        <Text style={styles.cardSub}>{it.subtitle}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 상단바 */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
          <Text style={styles.backTxt}>{'‹'}</Text>
        </Pressable>
        <Text style={styles.topTitle}>통증 범위 확인</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressTrack} />
        <View style={[styles.progressFill, { width: '62%' }]} />
      </View>

      <View style={styles.header}>
        <Text style={styles.h1}>어떤 통증인가요?</Text>
        <Text style={styles.h2}>비슷한 통증을 모두 선택해주세요.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {items.map((it) => (
            <Card key={it.key} it={it} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <Pressable
          onPress={goNext}
          disabled={!canNext}
          style={[styles.nextBtn, !canNext && styles.nextBtnDisabled]}
        >
          <Text style={[styles.nextTxt, !canNext && styles.nextTxtDisabled]}>다음</Text>
        </Pressable>
      </View>

      {/* 도움말 모달 */}
      <Modal visible={helpOpen} transparent animationType="fade" onRequestClose={closeHelp}>
        <Pressable style={styles.modalDim} onPress={closeHelp}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>{helpItem?.helpTitle ?? ''}</Text>
            <Text style={styles.modalBody}>{helpItem?.helpBody ?? ''}</Text>
            <Pressable onPress={closeHelp} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseTxt}>닫기</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const BLUE = '#3B82F6';
const BG = '#F3F8FF';
const CARD_BG = '#FFFFFF';
const SELECT_BG = '#DCEBFF';
const BORDER = '#E6EEF8';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2F3F5' },

  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backTxt: { fontSize: 28, color: '#111827', lineHeight: 30 },
  topTitle: { fontSize: 14, fontWeight: '900', color: '#111827' },

  progressWrap: { height: 6, marginHorizontal: 16, marginBottom: 10, position: 'relative' },
  progressTrack: { height: 3, backgroundColor: '#E5E7EB', borderRadius: 999 },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 3,
    backgroundColor: BLUE,
    borderRadius: 999,
  },

  header: { paddingHorizontal: 18, paddingBottom: 12 },
  h1: { fontSize: 22, fontWeight: '900', color: '#111827', marginBottom: 6 },
  h2: { fontSize: 13, color: '#6B7280' },

  scroll: { paddingHorizontal: 18, paddingBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  card: {
    width: '47.5%',
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    paddingTop: 16,
    paddingBottom: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardActive: {
    backgroundColor: SELECT_BG,
    borderColor: BLUE,
    shadowOpacity: 0.12,
    elevation: 3,
  },

  qBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qTxt: { color: '#FFFFFF', fontSize: 12, fontWeight: '900', lineHeight: 12 },

  icon: { width: 36, height: 36, marginBottom: 10 },
  cardTitle: { fontSize: 12.5, fontWeight: '900', color: BLUE, textAlign: 'center' },
  cardTitleActive: { color: BLUE },
  cardSub: { marginTop: 6, fontSize: 12, fontWeight: '800', color: '#9CA3AF' },

  bottom: { paddingHorizontal: 18, paddingBottom: 18, paddingTop: 10 },
  nextBtn: {
    height: 56,
    borderRadius: 12,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnDisabled: { backgroundColor: '#CBD5E1' },
  nextTxt: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  nextTxtDisabled: { color: '#FFFFFF' },

  modalDim: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  modalCard: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  modalTitle: { fontSize: 15, fontWeight: '900', color: '#111827', marginBottom: 8 },
  modalBody: { fontSize: 13, color: '#374151', lineHeight: 18 },
  modalCloseBtn: {
    marginTop: 14,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseTxt: { fontSize: 13, fontWeight: '900', color: '#111827' },
});