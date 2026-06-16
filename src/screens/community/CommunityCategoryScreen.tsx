import React, { useMemo, useState, useEffect } from 'react';
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
import { BOARD_GROUPS, BoardGroup } from './communityStore';
import { getCommunityBoards } from '../../api/community'; // 실제 API 파일에서 가져옴

type Props = NativeStackScreenProps<RootStackParamList, 'CommunityCategory'>;

export default function CommunityCategoryScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');
  
  // 기본 상태값은 스토어의 하드코딩 데이터를 백업용으로 들고 있습니다.
  const [boards, setBoards] = useState<BoardGroup[]>(BOARD_GROUPS);
  const [favoriteItems, setFavoriteItems] = useState<string[]>([]);
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});

  // 화면이 켜질 때 실제 API를 호출하여 서버 데이터를 연동합니다.
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const serverData = await getCommunityBoards();
        
        // 제공해주신 API 응답 데이터(BoardGroup[]) 규격에 맞춰 정확하게 매핑합니다.
        if (serverData && serverData.length > 0) {
          const mappedBoards: BoardGroup[] = serverData.map((bg) => ({
            id: bg.categoryGroup,         // 서버의 categoryGroup 필드
            title: bg.categoryGroup,       // 화면에 헤더로 뿌려줄 타이틀
            items: bg.boards.map((b) => b.name), // 내부 boards 배열 안의 name들만 추출
          }));
          
          setBoards(mappedBoards);
        }
      } catch (error) {
        console.warn('카테고리 목록을 불러오지 못했습니다. 로컬 데이터를 표시합니다.', error);
        // 네트워크 에러나 서버 장애 시, 초기값으로 세팅된 BOARD_GROUPS가 자연스럽게 유지됩니다.
      }
    };
    
    fetchBoards();
  }, []);

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
    if (!keyword) return boards;

    return boards.map((group) => {
      const filteredItems = group.items.filter((item) => {
        const normalizedItem = item.replace(/\s/g, '');
        const normalizedTitle = group.title.replace(/\s/g, '');
        return normalizedItem.includes(keyword) || normalizedTitle.includes(keyword);
      });
      return { ...group, items: filteredItems };
    }).filter((group) => group.items.length > 0 || group.title.replace(/\s/g, '').includes(keyword));
  }, [search, boards]);

  const moveToBoard = (boardName: string) => {
    navigation.navigate('CommunityHome', { selectedBoard: boardName });
  };

  const renderItemRow = (item: string) => {
    const isFavorite = favoriteItems.includes(item);
    return (
      <View key={item} style={styles.itemRow}>
        <TouchableOpacity style={styles.itemPressArea} activeOpacity={0.85} onPress={() => moveToBoard(item)}>
          <Text style={styles.itemText}>{item}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.starTouch} activeOpacity={0.85} onPress={() => toggleFavoriteItem(item)}>
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
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={() => navigation.goBack()}>
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

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {favoriteItems.length > 0 && (
            <View style={styles.favoriteSection}>
              <Text style={styles.favoriteTitle}>즐겨찾는 게시판</Text>
              {favoriteItems.map((item) => (
                <View key={`favorite-${item}`} style={styles.itemRow}>
                  <TouchableOpacity style={styles.itemPressArea} activeOpacity={0.85} onPress={() => moveToBoard(item)}>
                    <Text style={styles.itemText}>{item}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.starTouch} activeOpacity={0.85} onPress={() => toggleFavoriteItem(item)}>
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
                  <TouchableOpacity style={styles.groupTitleTouch} activeOpacity={0.85} onPress={() => moveToBoard(group.title)}>
                    <Text style={styles.groupTitle}>{group.title}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.foldTouch} activeOpacity={0.85} onPress={() => toggleCollapse(group.id)}>
                    <Text style={[styles.foldIcon, isCollapsed && styles.foldIconCollapsed]}>⌃</Text>
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
  safe: { flex: 1, backgroundColor: BLUE },
  container: { flex: 1, backgroundColor: BLUE },
  topSpacing: { height: 12 },
  headerRow: { height: 42, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  backBtn: { width: 32, height: 32, alignItems: 'flex-start', justifyContent: 'center' },
  backText: { fontSize: 28, color: '#FFFFFF', fontWeight: '300', lineHeight: 28 },
  headerTitle: { fontSize: 16, color: '#FFFFFF', fontWeight: '800' },
  headerRightPlaceholder: { width: 32 },
  searchWrap: { paddingHorizontal: 12, marginBottom: 10 },
  searchInput: { height: 42, backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 12, fontSize: 13, color: '#333333' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 28 },
  favoriteSection: { paddingTop: 4, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.26)', paddingHorizontal: 12 },
  favoriteTitle: { fontSize: 14, color: '#FFFFFF', fontWeight: '900', marginBottom: 6 },
  groupBlock: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.26)', paddingTop: 10, paddingBottom: 8, paddingHorizontal: 12 },
  groupHeader: { minHeight: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  groupTitleTouch: { flex: 1, paddingRight: 12 },
  groupTitle: { fontSize: 15, color: '#FFFFFF', fontWeight: '800' },
  foldTouch: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  foldIcon: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  foldIconCollapsed: { transform: [{ rotate: '180deg' }] },
  itemRow: { minHeight: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 4, paddingRight: 0 },
  itemPressArea: { flex: 1, minHeight: 42, justifyContent: 'center', paddingRight: 10 },
  itemText: { fontSize: 13, color: '#FFFFFF', fontWeight: '600' },
  starTouch: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  starDefault: { color: '#FFFFFF', fontSize: 17 },
  starActive: { fontSize: 17 },
});