// src/screens/notifications/NotificationScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

type Props = {
  navigation?: any;
};

type TabKey = 'ALL' | 'COMMUNITY' | 'KEYWORD';

type NotiItem = {
  id: string;
  type: 'COMMUNITY' | 'KEYWORD';
  title: string;
  body: string;
  time: string;
  keyword?: string;
};

const BG = '#F4F7FF';
const BLUE = '#2F80ED';
const TEXT_DARK = '#222222';
const TEXT_GRAY = '#777777';
const DIVIDER = '#E6EBF5';
const CHIP_BG = '#EAF2FF';

export default function NotificationScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('ALL');

  // 관심 키워드 더미 데이터
  // 나중에 내 계정의 관심 키워드 API 데이터로 교체
  const keywordList = useMemo(() => ['두통', '정형외과', '야간진료'], []);

  // 더미 알림 데이터 제거
  const data: NotiItem[] = [];

  const filtered = useMemo(() => {
    if (activeTab === 'ALL') return data;
    if (activeTab === 'COMMUNITY') {
      return data.filter(item => item.type === 'COMMUNITY');
    }
    return data.filter(item => item.type === 'KEYWORD');
  }, [activeTab, data]);

  const handleKeywordSetting = () => {
    navigation?.navigate('InterestKeyword');
  };

  const renderItem = ({ item }: { item: NotiItem }) => {
    return (
      <View style={styles.itemRow}>
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>i</Text>
        </View>

        <View style={styles.itemTextArea}>
          <View style={styles.titleRow}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            {item.type === 'KEYWORD' && item.keyword ? (
              <View style={styles.keywordBadge}>
                <Text style={styles.keywordBadgeText}>#{item.keyword}</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.itemBody} numberOfLines={2}>
            {item.body}
          </Text>
          <Text style={styles.itemTime}>{item.time}</Text>
        </View>
      </View>
    );
  };

  const ListHeader = () => {
    if (activeTab !== 'KEYWORD') return null;

    return (
      <View style={styles.keywordSection}>
        <Text style={styles.keywordSectionTitle}>설정한 관심 키워드</Text>

        <View style={styles.keywordChipWrap}>
          {keywordList.map(keyword => (
            <View key={keyword} style={styles.keywordChip}>
              <Text style={styles.keywordChipText}>#{keyword}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.keywordManageBtn}
          onPress={handleKeywordSetting}
        >
          <Text style={styles.keywordManageBtnText}>키워드 추가/삭제하기</Text>
        </TouchableOpacity>

        <View style={styles.sectionDivider} />
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
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>알림</Text>
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
          label="커뮤니티"
          active={activeTab === 'COMMUNITY'}
          onPress={() => setActiveTab('COMMUNITY')}
        />
        <TabButton
          label="키워드"
          active={activeTab === 'KEYWORD'}
          onPress={() => setActiveTab('KEYWORD')}
        />
      </View>

      <View style={styles.tabDivider} />

      {/* 리스트 */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ItemSeparatorComponent={() => <View style={styles.itemDivider} />}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 }}>
             <Text style={{ fontSize: 16, color: '#A0A0A0', fontWeight: '600' }}>새로운 알림이 없습니다.</Text>
          </View>
        }
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 24,
        }}
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
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 18,
    color: TEXT_DARK,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
  },

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
  tabTextActive: {
    color: TEXT_DARK,
  },
  tabIndicator: {
    marginTop: 6,
    height: 2,
    width: 44,
    backgroundColor: BLUE,
    borderRadius: 2,
  },
  tabDivider: {
    height: 1,
    backgroundColor: DIVIDER,
    marginTop: 2,
  },

  keywordSection: {
    marginBottom: 8,
  },
  keywordSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 10,
  },
  keywordChipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordChip: {
    backgroundColor: CHIP_BG,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  keywordChipText: {
    fontSize: 12,
    color: BLUE,
    fontWeight: '600',
  },
  keywordManageBtn: {
    marginTop: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: DIVIDER,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  keywordManageBtnText: {
    fontSize: 13,
    color: BLUE,
    fontWeight: '700',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#EEF1F8',
    marginTop: 14,
  },

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
  iconText: {
    fontWeight: '800',
    color: BLUE,
  },

  itemTextArea: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_DARK,
    marginRight: 6,
  },
  keywordBadge: {
    backgroundColor: '#F1F6FF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  keywordBadgeText: {
    fontSize: 11,
    color: BLUE,
    fontWeight: '600',
  },
  itemBody: {
    fontSize: 12,
    color: TEXT_GRAY,
    lineHeight: 16,
  },
  itemTime: {
    marginTop: 6,
    fontSize: 11,
    color: TEXT_GRAY,
  },

  itemDivider: {
    height: 1,
    backgroundColor: '#EEF1F8',
  },
});