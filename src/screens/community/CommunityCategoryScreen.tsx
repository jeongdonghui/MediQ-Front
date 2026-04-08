import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'CommunityCategory'>;

type BoardGroup = {
  id: string;
  title: string;
  items: string[];
};

const BOARD_GROUPS: BoardGroup[] = [
{ id: 'free', title: '자유 게시판', items: ['자유게시판'] },
  { id: 'head', title: '머리 게시판', items: ['두부'] },
  { id: 'face', title: '얼굴 게시판', items: ['안면부', '안구', '구강 및 인후', '귀'] },
  { id: 'neck', title: '목 게시판', items: ['목 앞', '목 옆면', '목 뒷면', '뒷목'] },
  { id: 'chest', title: '가슴 게시판', items: ['가슴 중앙', '좌우 흉부', '유방'] },
  { id: 'pit', title: '명치 게시판', items: ['명치 중앙'] },
  { id: 'upper', title: '상복부 게시판', items: ['우상복부', '좌상복부', '상복부 중앙'] },
  { id: 'middle', title: '중복부 게시판', items: ['배꼽 주변', '옆구리'] },
  { id: 'lower', title: '하복부 게시판', items: ['우하복부', '좌하복부', '하복부 중앙'] },
  { id: 'pelvis', title: '골반 및 서혜부 게시판', items: ['골반 부근', '서혜부', '생식기', '항문'] },
  { id: 'arm', title: '팔 게시판', items: ['어깨', '상완/삼각근', '아래팔/손목', '손'] },
  { id: 'leg', title: '다리 게시판', items: ['허벅지 및 고관절', '무릎', '종아리 및 발목', '발'] },
  { id: 'skin', title: '피부 게시판', items: ['피부 표면', '피부 종창 및 부종'] },
  { id: 'nerve', title: '신경 게시판', items: ['감각 이상', '조절 기능'] },
  { id: 'whole', title: '전신 증상 게시판', items: ['통증 및 컨디션', '손발 및 대사'] },
  { id: 'back', title: '비만(등) 게시판', items: ['등', '허리', '꼬리뼈'] },
];

const INITIAL_COLLAPSED: Record<string, boolean> = {
  head: false,
  face: false,
  neck: false,
  chest: false,
  pit: false,
  upper: false,
  middle: false,
  lower: false,
  pelvis: false,
  arm: false,
  leg: false,
  skin: false,
  nerve: false,
  whole: false,
  back: false,
};

export default function CommunityCategoryScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  const [favoriteItems, setFavoriteItems] = useState<string[]>([]);
  const [collapsedMap, setCollapsedMap] =
    useState<Record<string, boolean>>(INITIAL_COLLAPSED);

  const toggleFavoriteItem = (item: string) => {
    setFavoriteItems((prev) =>
      prev.includes(item) ? prev.filter((v) => v !== item) : [item, ...prev],
    );
  };

  const toggleCollapse = (groupId: string) => {
    setCollapsedMap((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const filteredGroups = useMemo(() => {
    const keyword = search.trim().replace(/\s/g, '');

    if (!keyword) return BOARD_GROUPS;

    return BOARD_GROUPS.map((group) => {
      const filteredItems = group.items.filter((item) => {
        const normalizedItem = item.replace(/\s/g, '');
        const normalizedTitle = group.title.replace(/\s/g, '');
        return (
          normalizedItem.includes(keyword) ||
          normalizedTitle.includes(keyword)
        );
      });

      return {
        ...group,
        items: filteredItems,
      };
    }).filter((group) => group.items.length > 0 || group.title.replace(/\s/g, '').includes(keyword));
  }, [search]);

  const favoriteSectionItems = useMemo(() => {
    return favoriteItems;
  }, [favoriteItems]);

  const moveToBoard = (boardName: string) => {
    navigation.navigate('CommunityHome', {
      selectedBoard: boardName,
    });
  };

  const renderItemRow = (item: string) => {
    const isFavorite = favoriteItems.includes(item);

    return (
      <View key={item} style={styles.itemRow}>
        <TouchableOpacity
          style={styles.itemPressArea}
          activeOpacity={0.85}
          onPress={() => moveToBoard(item)}
        >
          <Text style={styles.itemText}>{item}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.starTouch}
          activeOpacity={0.85}
          onPress={() => toggleFavoriteItem(item)}
        >
          <Text style={isFavorite ? styles.starActive : styles.starDefault}>
            {isFavorite ? '⭐️' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.topSpacing} />

        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.85}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>{'‹'}</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>커뮤니티</Text>

          <View style={styles.headerRightPlaceholder} />
        </View>

        <View style={styles.searchWrap}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="검색어를 입력해 주세요."
            placeholderTextColor="#8A8A8A"
            style={styles.searchInput}
          />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {favoriteSectionItems.length > 0 && (
            <View style={styles.favoriteSection}>
              <Text style={styles.favoriteTitle}>즐겨찾는 게시판</Text>
              {favoriteSectionItems.map((item) => (
                <View key={`favorite-${item}`} style={styles.itemRow}>
                  <TouchableOpacity
                    style={styles.itemPressArea}
                    activeOpacity={0.85}
                    onPress={() => moveToBoard(item)}
                  >
                    <Text style={styles.itemText}>{item}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.starTouch}
                    activeOpacity={0.85}
                    onPress={() => toggleFavoriteItem(item)}
                  >
                    <Text style={styles.starActive}>⭐️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {filteredGroups.map((group) => {
            const isCollapsed = collapsedMap[group.id];

            return (
              <View key={group.id} style={styles.groupBlock}>
                <View style={styles.groupHeader}>
                  <TouchableOpacity
                    style={styles.groupTitleTouch}
                    activeOpacity={0.85}
                    onPress={() => moveToBoard(group.title)}
                  >
                    <Text style={styles.groupTitle}>{group.title}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.foldTouch}
                    activeOpacity={0.85}
                    onPress={() => toggleCollapse(group.id)}
                  >
                    <Text
                      style={[
                        styles.foldIcon,
                        isCollapsed && styles.foldIconCollapsed,
                      ]}
                    >
                      ⌃
                    </Text>
                  </TouchableOpacity>
                </View>

                {!isCollapsed && group.items.map(renderItemRow)}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const BLUE = '#5D9BEA';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BLUE,
  },

  container: {
    flex: 1,
    backgroundColor: BLUE,
  },

  topSpacing: {
    height: 12,
  },

  headerRow: {
    height: 42,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  backText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: 28,
  },

  headerTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  headerRightPlaceholder: {
    width: 32,
  },

  searchWrap: {
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  searchInput: {
    height: 42,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#333333',
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 28,
  },

  favoriteSection: {
    paddingTop: 4,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.26)',
    paddingHorizontal: 12,
  },

  favoriteTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '900',
    marginBottom: 6,
  },

  groupBlock: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.26)',
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 12,
  },

  groupHeader: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  groupTitleTouch: {
    flex: 1,
    paddingRight: 12,
  },

  groupTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  foldTouch: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  foldIcon: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  foldIconCollapsed: {
    transform: [{ rotate: '180deg' }],
  },

  itemRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 4,
    paddingRight: 0,
  },

  itemPressArea: {
    flex: 1,
    minHeight: 42,
    justifyContent: 'center',
    paddingRight: 10,
  },

  itemText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  starTouch: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  starDefault: {
    color: '#FFFFFF',
    fontSize: 17,
  },

  starActive: {
    fontSize: 17,
  },
});