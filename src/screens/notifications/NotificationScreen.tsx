// src/screens/notifications/NotificationScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';

type Props = {
  navigation?: any;
};

type TabKey = 'ALL' | 'AIBOT' | 'COMMUNITY';

type NotiItem = {
  id: string;
  type: 'AIBOT' | 'COMMUNITY';
  title: string;
  body: string;
  time: string;
};

const BG = '#F4F7FF';
const BLUE = '#2F80ED';
const TEXT_DARK = '#222222';
const TEXT_GRAY = '#777777';
const CARD_BG = '#FFFFFF';
const DIVIDER = '#E6EBF5';

export default function NotificationScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('ALL');

  // 더미 데이터 (나중에 API로 교체)
  const data: NotiItem[] = useMemo(
    () => [
      {
        id: '1',
        type: 'AIBOT',
        title: 'AI봇',
        body: 'AI봇이 회원님께 처방을 기다리고있어요.\n증상분석을 진행하려면 앱에서 확인해보세요.',
        time: '1일전',
      },
      {
        id: '2',
        type: 'COMMUNITY',
        title: '커뮤니티',
        body: '새로운 댓글이 달렸어요.\n내 글에 어떤 이야기가 달렸을까요?',
        time: '3일전',
      },
      {
        id: '3',
        type: 'AIBOT',
        title: 'AI봇',
        body: 'AI봇이 회원님께 처방을 기다리고있어요.\n증상분석을 진행하려면 앱에서 확인해보세요.',
        time: '5일전',
      },
      {
        id: '4',
        type: 'COMMUNITY',
        title: '커뮤니티',
        body: '새로운 댓글이 달렸어요.\n내 글에 어떤 이야기가 달렸을까요?',
        time: '6일전',
      },
      {
        id: '5',
        type: 'AIBOT',
        title: 'AI봇',
        body: 'AI봇이 회원님께 처방을 기다리고있어요.\n증상분석을 진행하려면 앱에서 확인해보세요.',
        time: '13일전',
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    if (activeTab === 'ALL') return data;
    if (activeTab === 'AIBOT') return data.filter((d) => d.type === 'AIBOT');
    return data.filter((d) => d.type === 'COMMUNITY');
  }, [activeTab, data]);

  const renderItem = ({ item }: { item: NotiItem }) => {
    return (
      <View style={styles.itemRow}>
        <View style={styles.iconBox}>
          {/* 아이콘이 따로 있으면 여기 교체 가능 */}
          <Text style={styles.iconText}>i</Text>
        </View>

        <View style={styles.itemTextArea}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemBody} numberOfLines={2}>
            {item.body}
          </Text>
          <Text style={styles.itemTime}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          activeOpacity={0.8}
          style={styles.backBtn}
        >
          {/* back 아이콘 이미지가 없어서 우선 텍스트 처리 (원하면 이미지로 바꿔줄게) */}
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>알림</Text>

        {/* 우측 여백용 (정렬 맞추기) */}
        <View style={{ width: 32 }} />
      </View>

      {/* 탭 */}
      <View style={styles.tabRow}>
        <TabButton
          label="전체"
          active={activeTab === 'ALL'}
          onPress={() => setActiveTab('ALL')}
        />
        <TabButton
          label="AI챗봇"
          active={activeTab === 'AIBOT'}
          onPress={() => setActiveTab('AIBOT')}
        />
        <TabButton
          label="커뮤니티"
          active={activeTab === 'COMMUNITY'}
          onPress={() => setActiveTab('COMMUNITY')}
        />
      </View>

      <View style={styles.tabDivider} />

      {/* 리스트 */}
      <FlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.itemDivider} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.tabBtn}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
      {active && <View style={styles.tabIndicator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: {
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 18, color: TEXT_DARK, fontWeight: '700' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: TEXT_DARK },

  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 18,
  },
  tabBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
    color: TEXT_GRAY,
    fontWeight: '600',
  },
  tabTextActive: { color: TEXT_DARK },
  tabIndicator: {
    marginTop: 6,
    height: 2,
    width: 44,
    backgroundColor: BLUE,
    borderRadius: 2,
  },
  tabDivider: { height: 1, backgroundColor: DIVIDER, marginTop: 2 },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EAF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconText: { fontWeight: '800', color: BLUE },

  itemTextArea: { flex: 1 },
  itemTitle: { fontSize: 12, fontWeight: '700', color: TEXT_DARK, marginBottom: 4 },
  itemBody: { fontSize: 12, color: TEXT_GRAY, lineHeight: 16 },
  itemTime: { marginTop: 6, fontSize: 11, color: TEXT_GRAY },

  itemDivider: { height: 1, backgroundColor: '#EEF1F8' },
});
