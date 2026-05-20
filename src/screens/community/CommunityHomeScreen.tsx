import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { BOARD_GROUPS, type AppCommunityPost, loadPostsFromStorage } from './communityStore';
import { getCommunityPosts } from '../../api/community';

type Props = NativeStackScreenProps<RootStackParamList, 'CommunityHome'>;

const BLUE = '#5D9BEA';
const BG = '#F3F4F6';

export default function CommunityHomeScreen({ navigation, route }: Props) {
  const selectedBoard = route.params?.selectedBoard ?? '자유게시판';
  const [posts, setPosts] = useState<AppCommunityPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 목록 로딩 함수
  const loadPosts = useCallback(async (query?: string) => {
    try {
      // 1. 실제 백엔드 API 호출 시도
      const serverData = await getCommunityPosts({
        search: query?.trim() ? query.trim() : undefined
      });

      if (serverData && Array.isArray(serverData) && serverData.length > 0) {
        const localPosts = await loadPostsFromStorage();

        // 스토어의 AppCommunityPost 구조와 오차 없이 맵핑
        const mapped: AppCommunityPost[] = serverData.map((item: any) => {
          const localMatch = localPosts.find(lp => String(lp.id) === String(item.id));
          return {
            id: item.id,
            category: selectedBoard,
            boardLabel: selectedBoard,
            title: item.title || '',
            excerpt: item.content ? item.content.replace(/\n/g, ' ').slice(0, 35) + (item.content.length > 35 ? '...' : '') : '',
            content: item.content || '',
            author: '익명',
            time: '방금',
            views: Math.max(Number(item.views) || 0, localMatch?.views || 0),
            likes: Math.max(Number(item.likes) || 0, localMatch?.likes || 0),
            comments: Math.max(Number(item.comments) || 0, localMatch?.comments || 0),
            images: item.images ?? [],
            vote: item.vote ?? null,
            isLiked: localMatch ? localMatch.isLiked : false, // 스토어 속성과 안전하게 결합
            commentsList: localMatch ? (localMatch.commentsList || []) : [],
          };
        });

        // 현재 선택된 게시판 카테고리에 맞는 글 필터링
        const matchedGroup = BOARD_GROUPS.find((group) => group.title === selectedBoard);
        let currentBoardPosts = mapped;

        if (selectedBoard === '자유게시판') {
          currentBoardPosts = mapped.filter((post) => post.category === '자유게시판');
        } else if (matchedGroup) {
          currentBoardPosts = mapped.filter(
            (post) => post.category === matchedGroup.title || matchedGroup.items.includes(post.category)
          );
        } else {
          currentBoardPosts = mapped.filter((post) => post.category === selectedBoard);
        }

        setPosts(currentBoardPosts);
        return;
      }
    } catch (error) {
      console.warn('서버 목록 조회 실패, 로컬 스토리지 데이터로 대체합니다.', error);
    }

    // 2. 서버 에러 발생 시 작동하는 완벽한 로컬 Fallback 흐름
    const localData = await loadPostsFromStorage();
    const matchedGroup = BOARD_GROUPS.find((group) => group.title === selectedBoard);
    let filtered = localData;

    if (selectedBoard === '자유게시판') {
      filtered = localData.filter((post) => post.category === '자유게시판');
    } else if (matchedGroup) {
      filtered = localData.filter(
        (post) => post.category === matchedGroup.title || matchedGroup.items.includes(post.category),
      );
    } else {
      filtered = localData.filter((post) => post.category === selectedBoard);
    }

    if (query?.trim()) {
      filtered = filtered.filter(p => p.title.includes(query) || p.content.includes(query));
    }
    setPosts(filtered);
  }, [selectedBoard]);

  // 화면 포커스 시 목록 갱신
  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [loadPosts]),
  );

  const renderItem = ({ item }: { item: AppCommunityPost }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('CommunityPostDetail', { post: item as any })}
        style={styles.post}
      >
        <View style={styles.rowTop}>
          <Text style={styles.board}>{item.boardLabel}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content} numberOfLines={1}>{item.excerpt}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaEye}>◉ 확인 {item.views}</Text>
          <Text style={[styles.metaLike, item.isLiked && { color: '#FF3B30' }]}>
            {item.isLiked ? '❤️' : '♡'} {item.likes}
          </Text>
          <Text style={styles.metaComment}>● {item.comments}</Text>
        </View>
        <View style={styles.divider} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image source={require('../../assets/home/icon_home.png')} style={styles.homeIcon} resizeMode="contain" />
          </TouchableOpacity>
          <View style={styles.headerRight}>

            <TouchableOpacity onPress={() => navigation.navigate('CommunityCategory')}>
              <Text style={styles.back}>{'‹'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchWrap}>
          <View style={styles.searchBox}>
            <TextInput
              placeholder="검색어를 입력해 주세요."
              placeholderTextColor="#7D7D7D"
              style={styles.input}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => loadPosts(searchQuery)}
            />
            <TouchableOpacity onPress={() => loadPosts(searchQuery)}>
              <Image source={require('../../assets/home/icon_look.png')} style={styles.searchIconImage} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.boardTitleWrap}>
          <Text style={styles.boardTitle}>{selectedBoard}</Text>
        </View>

        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>아직 등록된 글이 없습니다.</Text>
            </View>
          }
        />

        <TouchableOpacity style={styles.writeBtn} onPress={() => navigation.navigate('CommunityWrite', { board: selectedBoard })}>
          <Text style={styles.writeText}>✎ 작성하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BLUE },
  container: { flex: 1, backgroundColor: BG },
  header: { height: 98, backgroundColor: BLUE, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  homeIcon: { width: 28, height: 28 },
  bellIcon: { width: 35, height: 35, marginRight: 18 },
  back: { fontSize: 35, color: '#FFFFFF', fontWeight: '300', marginTop: -8 },
  searchWrap: { marginTop: -18, paddingHorizontal: 20 },
  searchBox: { height: 46, backgroundColor: '#F0F0F0', borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 7, elevation: 5 },
  input: { flex: 1, fontSize: 14, color: '#333333', fontWeight: '500' },
  searchIconImage: { width: 21, height: 21 },
  boardTitleWrap: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 2 },
  boardTitle: { fontSize: 15, color: '#666666', fontWeight: '800' },
  list: { paddingTop: 10, paddingHorizontal: 20, paddingBottom: 120 },
  post: { paddingTop: 16 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  board: { fontSize: 13, color: '#7D7D7D', marginRight: 6, fontWeight: '600' },
  time: { fontSize: 12, color: '#9A9A9A', fontWeight: '500' },
  title: { fontSize: 18, fontWeight: '800', marginTop: 4, color: '#202020' },
  content: { fontSize: 14, color: '#B1B1B1', marginTop: 4, fontWeight: '600' },
  metaRow: { flexDirection: 'row', marginTop: 10 },
  metaEye: { marginRight: 14, fontSize: 12, color: '#5B9BF7', fontWeight: '700' },
  metaLike: { marginRight: 14, fontSize: 12, color: '#F28B97', fontWeight: '700' },
  metaComment: { marginRight: 14, fontSize: 12, color: '#8C8C8C', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#E4E6EA', marginTop: 14 },
  emptyWrap: { paddingTop: 40, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 13, color: '#A0A0A0', fontWeight: '700' },
  writeBtn: { position: 'absolute', right: 18, bottom: 34, backgroundColor: '#E9EDF5', paddingHorizontal: 18, paddingVertical: 11, borderRadius: 18, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  writeText: { fontWeight: '700', color: '#5577A3', fontSize: 15 },
});