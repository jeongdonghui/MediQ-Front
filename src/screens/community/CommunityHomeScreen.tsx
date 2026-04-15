import React, { useCallback, useMemo, useState } from 'react';
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
import { getPosts, BOARD_GROUPS, type AppCommunityPost } from './communityStore';
import { getCommunityPosts } from '../../api/community';


type Props = NativeStackScreenProps<RootStackParamList, 'CommunityHome'>;

const BLUE = '#5D9BEA';
const BG = '#F3F4F6';

export default function CommunityHomeScreen({ navigation, route }: Props) {
  const selectedBoard = route.params?.selectedBoard ?? '자유게시판';
  const [posts, setPosts] = useState<AppCommunityPost[]>([]);

  const loadPosts = useCallback(async () => {
    let allPosts: AppCommunityPost[] = [];
    try {
      const data = await getCommunityPosts();
      if (data && data.length > 0) {
        allPosts = data as unknown as AppCommunityPost[];
      } else {
        allPosts = getPosts();
      }
    } catch (error) {
      console.warn('Community API fetch failed, fallback to mock data');
      allPosts = getPosts();
    }

    const matchedGroup = BOARD_GROUPS.find((group) => group.title === selectedBoard);

    let filtered: AppCommunityPost[] = [];

    if (selectedBoard === '자유게시판') {
      filtered = allPosts.filter((post) => post.category === '자유게시판');
    } else if (matchedGroup) {
      filtered = allPosts.filter(
        (post) =>
          post.category === matchedGroup.title ||
          matchedGroup.items.includes(post.category),
      );
    } else {
      filtered = allPosts.filter((post) => post.category === selectedBoard);
    }

    setPosts(filtered);
  }, [selectedBoard]);

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [loadPosts]),
  );

  const headerTitle = useMemo(() => selectedBoard, [selectedBoard]);

  const renderItem = ({ item }: { item: AppCommunityPost }) => {
    const isNew = item.time === '방금' || item.time === '20분전' || item.time === '30분전';

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('CommunityPostDetail', { post: item })}
        style={styles.post}
      >
        <View style={styles.rowTop}>
          <View style={styles.boardRow}>
            <Text style={styles.board}>{item.boardLabel}</Text>

            {isNew && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            )}
          </View>

          <Text style={styles.time}>{item.time}</Text>
        </View>

        <Text style={styles.title}>{item.title}</Text>

        <Text style={styles.content} numberOfLines={1}>
          {item.excerpt}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaEye}>◉ {item.views}</Text>
          <Text style={styles.metaLike}>♡ {item.likes}</Text>
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
            <Image
              source={require('../../assets/home/icon_home.png')}
              style={styles.homeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
              <Image
                source={require('../../assets/home/icon_bell_red.png')}
                style={styles.bellIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

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
            />

            <Image
              source={require('../../assets/home/icon_look.png')}
              style={styles.searchIconImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.boardTitleWrap}>
          <Text style={styles.boardTitle}>{headerTitle}</Text>
        </View>

        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>아직 등록된 글이 없습니다.</Text>
            </View>
          }
        />

        <TouchableOpacity
          style={styles.writeBtn}
          onPress={() =>
            navigation.navigate('CommunityWrite', {
              board: selectedBoard,
            })
          }
        >
          <Text style={styles.writeText}>✎ 작성하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BLUE,
  },

  container: {
    flex: 1,
    backgroundColor: BG,
  },

  header: {
    height: 98,
    backgroundColor: BLUE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  homeIcon: {
    width: 28,
    height: 28,
  },

  bellIcon: {
    width: 35,
    height: 35,
    marginRight: 18,
  },

  back: {
    fontSize: 35,
    color: '#FFFFFF',
    fontWeight: '300',
    marginTop: -8,
  },

  searchWrap: {
    marginTop: -18,
    paddingHorizontal: 20,
  },

  searchBox: {
    height: 46,
    backgroundColor: '#F0F0F0',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 7,
    elevation: 5,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },

  searchIconImage: {
    width: 21,
    height: 21,
  },

  boardTitleWrap: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 2,
  },

  boardTitle: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '800',
  },

  list: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  post: {
    paddingTop: 16,
  },

  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  boardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  board: {
    fontSize: 13,
    color: '#7D7D7D',
    marginRight: 6,
    fontWeight: '600',
  },

  badge: {
    backgroundColor: '#F3B4B8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  badgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  time: {
    fontSize: 12,
    color: '#9A9A9A',
    fontWeight: '500',
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
    color: '#202020',
  },

  content: {
    fontSize: 14,
    color: '#B1B1B1',
    marginTop: 4,
    fontWeight: '600',
  },

  metaRow: {
    flexDirection: 'row',
    marginTop: 10,
  },

  metaEye: {
    marginRight: 14,
    fontSize: 12,
    color: '#5B9BF7',
    fontWeight: '700',
  },

  metaLike: {
    marginRight: 14,
    fontSize: 12,
    color: '#F28B97',
    fontWeight: '700',
  },

  metaComment: {
    marginRight: 14,
    fontSize: 12,
    color: '#8C8C8C',
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#E4E6EA',
    marginTop: 14,
  },

  emptyWrap: {
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 13,
    color: '#A0A0A0',
    fontWeight: '700',
  },

  writeBtn: {
    position: 'absolute',
    right: 18,
    bottom: 34,
    backgroundColor: '#E9EDF5',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  writeText: {
    fontWeight: '700',
    color: '#5577A3',
    fontSize: 15,
  },
});