import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Pressable, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'DetailCategory'>;

type CardItem = {
  key: string;
  title: string;
  desc?: string;
};

export default function DetailCategoryScreen({ navigation, route }: Props) {
  const { area } = route.params;
  const [selected, setSelected] = useState<string | null>(null);

  const { headerTitle, headerDesc, items } = useMemo(() => {
    if (area === 'HEAD_FACE') {
      return {
        headerTitle: '머리/얼굴 쪽 아픈 곳을 선택해주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [
          { key: 'HEAD', title: '머리', desc: '두부' },
          { key: 'FACE', title: '얼굴', desc: '안면부 / 안구 / 구강 및 인후 / 귀' },
        ] as CardItem[],
      };
    }

    if (area === 'NECK_CHEST') {
      return {
        headerTitle: '목/가슴 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [
          { key: 'NECK', title: '목', desc: '목 세부 부위' },
          { key: 'CHEST', title: '가슴', desc: '가슴 / 명치' },
          { key: 'EPIGASTRIC', title: '명치', desc: '명치 중심' },
        ] as CardItem[],
      };
    }

    if (area === 'PELVIS_WAIST') {
      return {
        headerTitle: '복부/골반 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [
          { key: 'UPPER ABDOMEN', title: '상복부', desc: '우상복부 / 좌상복부 / 상복부 중앙 ' },
          { key: 'MIDDLE ABDOMEN', title: '중복부', desc: '배꼽 주변 / 옆구리' },
          { key: 'LOWER ABDOMEN', title: '하복부', desc: '우하복부 / 좌하복부 / 하복부 중앙' },
          { key: 'PELVIS_GROIN', title: '골반 및 서해부', desc: '골반뼈 부근 / 사타구니 / 생식기 / 항문' },
        ] as CardItem[],
      };
    }

    if (area === 'ARM_LEG') {
      return {
        headerTitle: '팔/다리 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [
          { key: 'ARM', title: '팔', desc: '어깨 / 심팔 및 팔꿈치 / 아랫 팔 및 손목 / 손' },
          { key: 'LEG', title: '다리', desc: '허벅지 및 고관절 /  무릎 / 종아리 및 발목 / 발' },
        ] as CardItem[],
      };
    }

    if (area === 'FULL_ETC') {
      return {
        headerTitle: '복부/골반 쪽 아픈 곳을 눌러주세요.',
        headerDesc: '불편한 부위를 선택해주세요.',
        items: [
          { key: 'SKIN', title: '피부' },
          { key: 'NERVOUS SYSTEM', title: '신경' },
          { key: 'GENERAL SYMPTOMS', title: '전신증상' },
          { key: 'BACK', title: '배면(뒷부분)' },
        ] as CardItem[],
      };
    }

    return {
      headerTitle: '세부 부위를 선택해주세요.',
      headerDesc: '',
      items: [] as CardItem[],
    };
  }, [area]);

  const onDone = () => {
    if (!selected) return;
    navigation.navigate('DetailLocation', { area, category: selected });
  };

  const Card = ({ item }: { item: CardItem }) => {
    const active = selected === item.key;
    return (
      <Pressable
        onPress={() => setSelected(item.key)}
        style={({ pressed }) => [
          styles.cardItem,
          active && styles.cardItemActive,
          pressed && { opacity: 0.97 },
        ]}
      >
        <Text style={[styles.cardTitle, active && styles.cardTitleActive]}>{item.title}</Text>
        {!!item.desc && (
          <Text style={[styles.cardDesc, active && styles.cardDescActive]}>{item.desc}</Text>
        )}
      </Pressable>
    );
  };

  const canSubmit = !!selected;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
          <Text style={styles.backTxt}>{'‹'}</Text>
        </Pressable>
        <Text style={styles.topTitle}>세부 부위 선택</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.header}>
        <Text style={styles.h1}>{headerTitle}</Text>
        {!!headerDesc && <Text style={styles.h2}>{headerDesc}</Text>}
      </View>

      <View style={styles.listWrap}>
        {items.map((it) => (
          <Card key={it.key} item={it} />
        ))}
      </View>

      <View style={styles.bottomArea}>
        <Pressable
          onPress={onDone}
          disabled={!canSubmit}
          style={[styles.doneBtn, canSubmit ? styles.doneBtnEnabled : styles.doneBtnDisabled]}
        >
          <Text style={[styles.doneTxt, canSubmit ? styles.doneTxtEnabled : styles.doneTxtDisabled]}>
            선택 완료
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const BLUE = '#3B82F6';
const BG = '#F3F8FF';
const CARD_BG = '#FFFFFF';
const SELECT_BG = '#DCEBFF';
const BORDER = '#E6EEF8';
const SHADOW = '#000000';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backTxt: { fontSize: 28, color: '#111827', lineHeight: 30 },
  topTitle: { fontSize: 14, fontWeight: '800', color: '#111827' },

  header: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 10 },
  h1: { fontSize: 16, fontWeight: '900', color: '#111827', marginBottom: 4 },
  h2: { fontSize: 12, color: '#6B7280' },

  listWrap: { paddingHorizontal: 18, gap: 12, flex: 1 },

  cardItem: {
    backgroundColor: CARD_BG,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: SHADOW,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardItemActive: {
    backgroundColor: SELECT_BG,
    borderColor: BLUE,
    shadowOpacity: 0.12,
    elevation: 3,
  },

  cardTitle: { fontSize: 13, fontWeight: '800', color: BLUE, marginBottom: 6, textAlign: 'center' },
  cardTitleActive: { color: BLUE },

  cardDesc: { fontSize: 11, color: '#6B7280', textAlign: 'center' },
  cardDescActive: { color: '#4B5563' },

  bottomArea: { paddingHorizontal: 18, paddingBottom: 18, paddingTop: 10 },

  doneBtn: {
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnEnabled: { backgroundColor: BLUE },
  doneBtnDisabled: { backgroundColor: '#E5E7EB' },

  doneTxt: { fontSize: 13, fontWeight: '800' },
  doneTxtEnabled: { color: '#FFFFFF' },
  doneTxtDisabled: { color: '#9CA3AF' },
});