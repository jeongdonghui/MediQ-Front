import React, { useState, useEffect } from 'react';
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
import {
  deleteCommunityPost,
  getCommunityPostDetail,
  togglePostLike,
  createPostComment,
  deletePostComment
} from '../../api/community'; // 실제 원본 API 함수들
import {
  incrementPostViews,
  togglePostLikeLocally,
  addCommentToPost,
  deleteComment,
  getPostById,
} from './communityStore';

type Props = NativeStackScreenProps<RootStackParamList, 'CommunityPostDetail'>;

export default function CommunityPostDetailScreen({ navigation, route }: Props) {
  const { post } = route.params;
  const [comment, setComment] = useState('');
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);

  // 1. 상세 페이지 정보 로드 (서버 API 연동)
  const loadDetail = async () => {
    // 로컬 스토어 백업 바인딩 시 commentsList 에러 방지
    const localPost = getPostById(post.id) as any;
    if (localPost) {
      setDetailData(localPost);
      // 로컬 스토어의 필드명이 다를 수 있으므로 두 가지 형태 모두 안전하게 대응합니다.
      setComments(localPost.commentsList || localPost.comments || []);
    }

    try {
      const data = await getCommunityPostDetail(Number(post.id)) as any;
      setDetailData((prev: any) => ({ ...(prev || {}), ...data }));

      // 백엔드가 주는 실제 댓글 배열 바인딩
      if (data && data.comments && Array.isArray(data.comments)) {
        setComments(data.comments);
      } else if (data && data.commentsList && Array.isArray(data.commentsList)) {
        setComments(data.commentsList);
      }
    } catch (e) {
      console.warn('상세 정보를 서버에서 불러오지 못했습니다.', e);
    }
  };

  useEffect(() => {
    incrementPostViews(post.id);
    loadDetail();
  }, [post.id]);

  // 2. 좋아요 토글 연동
  const handleToggleLike = async () => {
    togglePostLikeLocally(post.id);
    setDetailData((prev: any) =>
      prev ? { ...prev, isLiked: !prev.isLiked, likes: (Number(prev.likes) || 0) + (prev.isLiked ? -1 : 1) } : null
    );
    try {
      await togglePostLike(Number(post.id));
    } catch (e) {
      console.warn('좋아요 서버 반영 실패', e);
    }
  };

  // 3. 댓글 등록 연동 (FormData 규격 준수)
  const handleSubmitComment = async () => {
    if (!comment.trim()) return;

    // UI에 즉시 반영
    addCommentToPost(post.id, comment.trim());
    const tempComment = comment.trim();
    setComment('');

    try {
      const formData = new FormData();
      formData.append('commentCreateRequest', JSON.stringify({ content: tempComment }));

      await createPostComment(Number(post.id), formData);
      loadDetail(); // 최신 댓글 목록 동기화
    } catch (e) {
      console.warn('댓글 등록 실패', e);
    }
  };

  // 4. 댓글 삭제 연동 (commentId 타입 에러 우회 및 이중 패싱 적용)
  const handleRemoveComment = (commentId: any) => {
    Alert.alert('댓글 삭제', '이 댓글을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제', style: 'destructive', onPress: async () => {
          deleteComment(post.id, commentId);
          setComments(prev => prev.filter(c => String(cmtId(c)) !== String(commentId)));
          try {
            await deletePostComment(Number(post.id), Number(commentId));
          } catch (e) {
            console.warn('댓글 서버 삭제 실패', e);
          }
        }
      }
    ]);
  };

  // 5. 게시글 삭제 연동
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
            navigation.goBack();
          } catch (e) {
            console.warn('게시글 삭제 실패', e);
          }
        },
      },
    ]);
  };

  // 서버에 따라 commentId 혹은 id로 내려오는 고유값을 안전하게 가져오는 유틸리티성 로직
  const cmtId = (cmt: any) => {
    if (!cmt) return '';
    return cmt.commentId !== undefined ? cmt.commentId : cmt.id;
  };

  const displayPost = detailData || post;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.leftBack}>{'‹'}</Text>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
              <Image source={require('../../assets/home/icon_bell_red.png')} style={styles.bellIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.detailCard}>
            <View style={styles.topRow}>
              <Text style={styles.boardLabel}>{post.boardLabel || '게시판'}</Text>
              <Text style={styles.timeText}>{displayPost.time || '방금'}</Text>
            </View>

            <View style={[styles.authorRow, { justifyContent: 'space-between' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../../assets/home/mediq_mascot.png')} style={styles.avatar} resizeMode="contain" />
                <View>
                  <Text style={styles.authorName}>{displayPost.author || '익명'}</Text>
                  <Text style={styles.authorDate}>{displayPost.time || '방금'}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setActionSheetVisible(true)} style={{ paddingHorizontal: 10 }}>
                <Text style={{ fontSize: 20, color: '#A0A0A0', fontWeight: 'bold' }}>⋮</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>{displayPost.title}</Text>
            <Text style={styles.bodyText}>{displayPost.content}</Text>

            <View style={styles.statRow}>
              <View style={styles.unifiedStatChip}>
                <Text style={[styles.statLabel, { color: '#5D9BEA' }]}>◉ 확인 {displayPost.views || 0}</Text>
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
                <Text style={[styles.statLabel, { color: '#8E8E8E' }]}>💬 댓글 {comments.length}</Text>
              </View>
            </View>

            {comments.map((cmt: any, idx: number) => (
              <View key={String(cmtId(cmt)) || `cmt_${idx}`} style={styles.commentBlock}>
                <View style={styles.commentHeader}>
                  <View>
                    <Text style={styles.commentAuthor}>{cmt?.author || '익명'}</Text>
                    <Text style={styles.commentDate}>{cmt?.time || '방금'}</Text>
                  </View>
                  <View style={styles.commentActionPill}>
                    <TouchableOpacity onPress={() => handleRemoveComment(cmtId(cmt))}>
                      <Text style={styles.commentActionIcon}>삭제</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.commentText}>{cmt?.content || ''}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomInputWrap}>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="댓글을 입력하세요"
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

const BLUE = '#5D9BEA';
const BG = '#F3F4F6';
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BLUE },
  container: { flex: 1, backgroundColor: BG },
  header: { height: 98, backgroundColor: BLUE, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  leftBack: { fontSize: 30, color: '#FFFFFF', fontWeight: '300' },
  bellIcon: { width: 35, height: 35 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 120 },
  detailCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  boardLabel: { fontSize: 13, color: '#7D7D7D', fontWeight: '600' },
  timeText: { fontSize: 12, color: '#9A9A9A' },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  avatar: { width: 38, height: 38, marginRight: 10 },
  authorName: { fontSize: 14, color: '#222222', fontWeight: '800' },
  authorDate: { fontSize: 12, color: '#B0B0B0', fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '900', color: '#202020', marginBottom: 14 },
  bodyText: { fontSize: 13, lineHeight: 22, color: '#666', fontWeight: '500', marginBottom: 18 },
  commentBlock: { borderTopWidth: 1, borderTopColor: '#ECECEC', paddingTop: 16, marginTop: 6 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  commentAuthor: { fontSize: 14, color: '#222222', fontWeight: '800' },
  commentDate: { fontSize: 12, color: '#B0B0B0', fontWeight: '600' },
  commentActionPill: { backgroundColor: '#F3F3F3', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  commentActionIcon: { fontSize: 12, color: '#FF3B30', fontWeight: '700' },
  commentText: { fontSize: 13, color: '#333', marginTop: 10 },
  bottomInputWrap: { position: 'absolute', left: 16, right: 16, bottom: 12 },
  bottomInput: { flex: 1, height: 44, backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 14, fontSize: 14, color: '#333333', borderWidth: 1, borderColor: '#DDD' },
  sendBtn: { marginLeft: 8, height: 44, borderRadius: 14, backgroundColor: '#E9EDF5', paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  sendText: { fontSize: 14, color: '#5577A3', fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  actionSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 18, borderTopRightRadius: 18, paddingBottom: 30 },
  actionBtn: { paddingVertical: 18, alignItems: 'center' },
  actionDivider: { height: 1, backgroundColor: '#F0F0F0' },
  actionText: { fontSize: 17, color: '#333', fontWeight: '600' },
  actionBtnCancel: { paddingVertical: 18, alignItems: 'center', backgroundColor: '#F8F8F8', borderTopWidth: 8, borderTopColor: '#F0F0F0' },
  actionTextCancel: { fontSize: 17, color: '#999', fontWeight: '800' },
  statRow: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  unifiedStatChip: { height: 32, paddingHorizontal: 12, borderRadius: 16, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F2F5' },
  statLabel: { fontSize: 11, fontWeight: '800' },
  activeLikeChip: { backgroundColor: '#FF3B30' },
  inactiveLikeChip: { backgroundColor: '#F0F2F5' },
  activeLikeText: { color: '#FFF' },
  inactiveLikeText: { color: '#999' },
});