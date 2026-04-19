import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { deleteCommunityPost, getCommunityPostDetail, togglePostLike, createPostComment } from '../../api/community';
import {
  incrementPostViews,
  togglePostLikeLocally,
  addCommentToPost,
  addReplyToComment,
  toggleCommentLike,
  deleteComment,
  getPostById,
  loadPostsFromStorage
} from './communityStore';

type Props = NativeStackScreenProps<RootStackParamList, 'CommunityPostDetail'>;

const BLUE = '#5D9BEA';
const BG = '#F3F4F6';

export default function CommunityPostDetailScreen({ navigation, route }: Props) {
  const { post } = route.params;
  const [comment, setComment] = useState('');
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<any>(null); // ✅ 답글 대상 상태 추가

  const loadDetail = async () => {
    // ✅ 먼저 로컬 데이터 로드하여 즉각 반영
    const localPost = getPostById(String(post.id));
    if (localPost) {
      setDetailData(localPost);
      setComments(localPost.commentItems || []);
    }

    try {
      const data = await getCommunityPostDetail(post.id);
      // 서버 데이터가 있으면 병합 (로컬 댓글 등 보존)
      setDetailData(prev => ({ ...prev, ...data }));
      if (data.comments && Array.isArray(data.comments)) {
        setComments(prev => [...(localPost?.commentItems || []), ...data.comments]);
      }
    } catch (e) {
      // console.warn('Failed to fetch post detail', e);
    }
  };

  React.useEffect(() => {
    // ✅ 조회수 증가 (로컬)
    incrementPostViews(String(post.id));
    loadDetail();
  }, [post.id]);

  const handleToggleLike = async () => {
    // ✅ 로컬 낙관적 업데이트
    togglePostLikeLocally(String(post.id));
    loadDetail(); // UI 즉시 갱신

    try {
      await togglePostLike(post.id);
    } catch (e) {
      // 에러 시 무시 (이미 로컬에 저장됨)
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;

    // ✅ 로컬 낙관적 업데이트
    if (replyingTo) {
      addReplyToComment(String(post.id), replyingTo.id, comment);
    } else {
      addCommentToPost(String(post.id), comment);
    }

    setComment('');
    setReplyingTo(null);
    loadDetail(); // UI 즉시 갱신

    try {
      const formData = new FormData();
      formData.append('content', comment);
      if (replyingTo) {
        // API fallback (백엔드 대댓글 API 연동은 필요함)
      } else {
        await createPostComment(post.id, formData);
      }
    } catch (e) {
      // console.warn('Add comment failed', e);
    }
  };

  const handleToggleCommentLike = (commentId: string, replyId?: string) => {
    toggleCommentLike(String(post.id), commentId, replyId);
    loadDetail();
  };

  const handleRemoveComment = (commentId: string, replyId?: string) => {
    Alert.alert('댓글 삭제', '이 댓글을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제', style: 'destructive', onPress: () => {
          deleteComment(String(post.id), commentId, replyId);
          loadDetail();
        }
      }
    ]);
  };

  const displayPost = detailData || post;

  const handleDeletePost = async () => {
    setActionSheetVisible(false);
    Alert.alert('삭제 확인', '이 게시글을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCommunityPost(Number(post.id));
          } catch (e) { }
          navigation.goBack();
        },
      },
    ]);
  };

  const handleEditPost = () => {
    setActionSheetVisible(false);
    navigation.navigate('CommunityWrite', {
      board: post.boardLabel,
      editMode: true,
      editPostId: post.id,
      editTitle: post.title,
      editContent: post.content,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.leftBack}>{'‹'}</Text>
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
              <Image
                source={require('../../assets/home/icon_bell_red.png')}
                style={styles.bellIcon}
                resizeMode="contain"
              />
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

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.detailCard}>
            <View style={styles.topRow}>
              <Text style={styles.boardLabel}>{post.boardLabel}</Text>
              <Text style={styles.timeText}>방금</Text>
            </View>

            <View style={[styles.authorRow, { justifyContent: 'space-between' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('../../assets/home/mediq_mascot.png')}
                  style={styles.avatar}
                  resizeMode="contain"
                />
                <View>
                  <Text style={styles.authorName}>ssemun</Text>
                  <Text style={styles.authorDate}>2025.11.17 18:01</Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => setActionSheetVisible(true)} style={{ paddingHorizontal: 10 }}>
                <Text style={{ fontSize: 20, color: '#A0A0A0', fontWeight: 'bold', marginTop: -8 }}>⋮</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>{displayPost.title}</Text>
            <Text style={styles.bodyText}>
              {displayPost.content}
            </Text>

            <View style={styles.statRow}>
              <View style={styles.unifiedStatChip}>
                <Text style={[styles.statLabel, { color: '#5B9BEA' }]}>◉ 확인 {displayPost.views || 0}</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.5}
                onPress={handleToggleLike}
                style={[styles.unifiedStatChip, displayPost.isLiked ? styles.activeLikeChip : styles.inactiveLikeChip]}
              >
                <Text style={[styles.statLabel, displayPost.isLiked ? styles.activeLikeText : styles.inactiveLikeText]}>
                  {displayPost.isLiked ? '❤️' : '♡'} 공감 {displayPost.likes || 0}
                </Text>
              </TouchableOpacity>

              <View style={styles.unifiedStatChip}>
                <Text style={[styles.statLabel, { color: '#8E8E8E' }]}>💬 댓글 {displayPost.comments || (comments?.length || 0)}</Text>
              </View>
            </View>

            <View style={styles.hospitalCard}>
              <View style={styles.hospitalTextWrap}>
                <Text style={styles.hospitalName}>JM가정의학과{'\n'}센텀시티점</Text>
                <Text style={styles.doctorName}>정재민 대표원장</Text>
              </View>

              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400' }}
                style={styles.doctorImage}
              />
            </View>

            {comments.map((cmt: any, idx: number) => (
              <View key={cmt.id || idx} style={styles.commentBlock}>
                <View style={styles.commentHeader}>
                  <View>
                    <Text style={styles.commentAuthor}>{cmt.author || '익명'}</Text>
                    <Text style={styles.commentDate}>{cmt.time || '방금'}</Text>
                  </View>

                  <View style={styles.commentActionPill}>
                    <TouchableOpacity onPress={() => setReplyingTo(cmt)}>
                      <Text style={styles.commentActionIcon}>💬</Text>
                    </TouchableOpacity>
                    <Text style={styles.commentActionDivider}>|</Text>
                    <TouchableOpacity
                      style={[styles.commentLikeBtn, cmt.isLiked && styles.commentLikeBtnActive]}
                      onPress={() => handleToggleCommentLike(cmt.id)}
                    >
                      <Text style={[styles.commentLikeText, cmt.isLiked && styles.commentLikeTextActive]}>
                        {cmt.isLiked ? '❤️' : '♡'} {cmt.likes || ''}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.commentActionDivider}>|</Text>
                    <TouchableOpacity onPress={() => handleRemoveComment(cmt.id)}>
                      <Text style={styles.commentActionIcon}>⋮</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.commentText}>
                  {cmt.content || cmt.text}
                </Text>

                {/* ✅ 대댓글(답글) 렌더링 */}
                {cmt.replies?.map((reply: any, rIdx: number) => (
                  <View key={reply.id || rIdx} style={styles.replyWrap}>
                    <Text style={styles.replyArrow}>└</Text>
                    <View style={styles.replyBox}>
                      <View style={styles.replyHeader}>
                        <Text style={styles.replyAuthor}>{reply.author}</Text>
                        <Text style={styles.replyDate}>{reply.time}</Text>

                        <View style={styles.replyActionPill}>
                          <TouchableOpacity
                            style={[styles.commentLikeBtn, reply.isLiked && styles.commentLikeBtnActive]}
                            onPress={() => handleToggleCommentLike(cmt.id, reply.id)}
                          >
                            <Text style={[styles.commentLikeText, reply.isLiked && styles.commentLikeTextActive]}>
                              {reply.isLiked ? '❤️' : '♡'} {reply.likes || ''}
                            </Text>
                          </TouchableOpacity>
                          <Text style={styles.commentActionDivider}>|</Text>
                          <TouchableOpacity onPress={() => handleRemoveComment(cmt.id, reply.id)}>
                            <Text style={styles.commentActionIcon}>⋮</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Text style={styles.replyText}>{reply.content}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomInputWrap}>
          {replyingTo && (
            <View style={styles.replyNotice}>
              <Text style={styles.replyNoticeText}>@{replyingTo.author}님께 답글 남기는 중...</Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <Text style={styles.replyCancel}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder={replyingTo ? "답글을 입력하세요" : "댓글을 입력하세요"}
              placeholderTextColor="#9A9A9A"
              style={styles.bottomInput}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSubmitComment}>
              <Text style={styles.sendText}>등록</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal visible={actionSheetVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.actionSheet}>
              <TouchableOpacity style={styles.actionBtn} onPress={handleEditPost}>
                <Text style={styles.actionText}>수정하기</Text>
              </TouchableOpacity>

              <View style={styles.actionDivider} />

              <TouchableOpacity style={styles.actionBtn} onPress={handleDeletePost}>
                <Text style={[styles.actionText, { color: '#FF3B30' }]}>삭제하기</Text>
              </TouchableOpacity>

              <View style={styles.actionDivider} />

              <TouchableOpacity style={styles.actionBtnCancel} onPress={() => setActionSheetVisible(false)}>
                <Text style={styles.actionTextCancel}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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

  leftBack: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: '300',
    marginTop: -2,
  },

  bellIcon: {
    width: 35,
    height: 35,
    marginRight: 18,
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

  scroll: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },

  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  boardLabel: {
    fontSize: 13,
    color: '#7D7D7D',
    fontWeight: '600',
  },

  timeText: {
    fontSize: 12,
    color: '#9A9A9A',
  },

  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  avatar: {
    width: 38,
    height: 38,
    marginRight: 10,
  },

  authorName: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '800',
  },

  authorDate: {
    fontSize: 12,
    color: '#B0B0B0',
    fontWeight: '600',
  },

  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 14,
  },

  bodyText: {
    fontSize: 13,
    lineHeight: 22,
    color: '#B5B5B5',
    fontWeight: '700',
    marginBottom: 18,
  },

  hospitalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },

  hospitalTextWrap: {
    flex: 1,
    paddingRight: 12,
  },

  hospitalName: {
    fontSize: 16,
    color: '#57B6A9',
    fontWeight: '900',
    lineHeight: 22,
    marginBottom: 10,
  },

  doctorName: {
    fontSize: 14,
    color: '#202020',
    fontWeight: '900',
  },

  doctorImage: {
    width: 120,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },

  commentBlock: {
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    paddingTop: 16,
    marginTop: 6,
  },

  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  commentAuthor: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '800',
  },

  commentDate: {
    fontSize: 12,
    color: '#B0B0B0',
    fontWeight: '600',
    marginTop: 2,
  },

  commentActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  commentActionIcon: {
    fontSize: 11,
    color: '#8E8E8E',
  },

  commentActionDivider: {
    fontSize: 11,
    color: '#C2C2C2',
    marginHorizontal: 7,
  },

  commentText: {
    fontSize: 13,
    color: '#9E9E9E',
    fontWeight: '700',
    marginTop: 10,
    lineHeight: 20,
  },

  replyWrap: {
    flexDirection: 'row',
    marginTop: 12,
  },

  replyArrow: {
    fontSize: 14,
    color: '#A6A6A6',
    marginRight: 8,
    marginTop: 8,
  },

  replyBox: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
  },

  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  replyAuthor: {
    fontSize: 13,
    color: '#222222',
    fontWeight: '800',
    marginRight: 8,
  },

  replyDate: {
    fontSize: 12,
    color: '#C0C0C0',
    fontWeight: '600',
    flex: 1,
  },

  replyActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECECEC',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  replyText: {
    fontSize: 13,
    color: '#9E9E9E',
    fontWeight: '700',
    marginTop: 10,
  },

  bottomInputWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  replyNotice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E9F1FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  replyNoticeText: {
    fontSize: 12,
    color: '#4C78B5',
    fontWeight: '700',
  },
  replyCancel: {
    fontSize: 16,
    color: '#999',
    padding: 4,
  },

  bottomInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#333333',
  },

  sendBtn: {
    marginLeft: 8,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E9EDF5',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendText: {
    fontSize: 14,
    color: '#5577A3',
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 30,
  },
  actionBtn: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  actionDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  actionText: {
    fontSize: 17,
    color: '#333',
    fontWeight: '600',
  },
  actionBtnCancel: {
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderTopWidth: 8,
    borderTopColor: '#F0F0F0',
  },
  actionTextCancel: {
    fontSize: 17,
    color: '#999',
    fontWeight: '800',
  },
  statRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
    justifyContent: 'flex-start'
  },
  unifiedStatChip: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderWidth: 0,
  },
  statLabel: { fontSize: 11, fontWeight: '800' },
  inactiveLikeChip: { backgroundColor: '#F0F2F5' },
  activeLikeChip: { backgroundColor: '#FF3B30' },
  inactiveLikeText: { color: '#999' },
  activeLikeText: { color: '#FFFFFF' },
  commentLikeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  commentLikeBtnActive: {
    backgroundColor: '#FFF1F2',
  },
  commentLikeText: {
    fontSize: 11,
    color: '#8E8E8E',
    fontWeight: '800',
  },
  commentLikeTextActive: {
    color: '#FF3B30',
  },
});