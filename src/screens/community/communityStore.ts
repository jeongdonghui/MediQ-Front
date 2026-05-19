import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. 내부 게시판 카테고리 고유 타입 정의
export interface BoardGroup {
  id: string;
  title: string;
  items: string[];
}

// 2. 하이브리드 댓글 구조 정의 (서버 명세와 로컬 구조 완벽 호환)
export interface AppComment {
  id: number;
  commentId?: number; // 서버 필드 대응용
  author: string;
  content: string;
  time: string;
}

// 3. 앱 내 전체 커뮤니티 포스트 통합 인터페이스 정의
export interface AppCommunityPost {
  id: number;
  category: string;
  boardLabel: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  time: string;
  views: number;
  likes: number;
  comments: number;
  images: string[];
  vote: any | null;
  isLiked: boolean;
  commentsList?: AppComment[]; // 내부 상태 및 Fallback 데이터 바인딩용
}

// 기존 앱 고유의 카테고리 데이터 그룹 (100% 동일하게 유지)
export const BOARD_GROUPS: BoardGroup[] = [
  {
    id: 'g1',
    title: '전체 게시판',
    items: ['자유게시판', '병원 소식', '건강 상담', '복약 후기'],
  },
  {
    id: 'g2',
    title: '의학 정보 게시판',
    items: ['내과 정보', '외과 정보', '소아과 정보', '안과 정보'],
  },
];

// 초기 기본 더미 데이터 (서버 지연 시 로컬 UI가 멈추지 않도록 방어하는 초기값)
const INITIAL_POSTS: AppCommunityPost[] = [
  {
    id: 1,
    category: '자유게시판',
    boardLabel: '자유게시판',
    title: '오늘 날씨가 정말 좋네요.',
    excerpt: '점심 산책 다녀왔는데 바람도 선선하고... 날씨가 너무 좋아서 기분이 상쾌해집니다 다들 좋은 하루 보내세요!',
    content: '점심 산책 다녀왔는데 바람도 선선하고... 날씨가 너무 좋아서 기분이 상쾌해집니다 다들 좋은 하루 보내세요!',
    author: '홍길동',
    time: '5분 전',
    views: 12,
    likes: 4,
    comments: 2,
    images: [],
    vote: null,
    isLiked: false,
    commentsList: [
      { id: 101, commentId: 101, author: '김철수', content: '공감합니다! 날씨 최고네요.', time: '3분 전' },
      { id: 102, commentId: 102, author: '이영희', content: '저도 산책 가야겠어요.', time: '2분 전' },
    ],
  },
  {
    id: 2,
    category: '병원 소식',
    boardLabel: '병원 소식',
    title: '신규 의료 장비 도입 안내',
    excerpt: '더 정확한 진단을 위해 최첨단 MRI 장비를... 이번에 새롭게 도입하여 가동을 시작했습니다. 많은 관심 부탁드립니다.',
    content: '더 정확한 진단을 위해 최첨단 MRI 장비를... 이번에 새롭게 도입하여 가동을 시작했습니다. 많은 관심 부탁드립니다.',
    author: '병원 관리자',
    time: '1시간 전',
    views: 89,
    likes: 15,
    comments: 0,
    images: [],
    vote: null,
    isLiked: false,
    commentsList: [],
  },
];

const STORAGE_KEY = '@mediq_community_posts_v1';
let _memoryPosts: AppCommunityPost[] = [];

// [기능 1] 로컬 스토리지로부터 데이터 동기화 및 로드
export async function loadPostsFromStorage(): Promise<AppCommunityPost[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      _memoryPosts = [...INITIAL_POSTS];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(_memoryPosts));
      return _memoryPosts;
    }
    _memoryPosts = JSON.parse(raw);
    return _memoryPosts;
  } catch (error) {
    console.warn('로컬 스토리지 로드 실패:', error);
    return _memoryPosts.length > 0 ? _memoryPosts : [...INITIAL_POSTS];
  }
}

// [기능 2] 메모리 및 스토리지에 변경 데이터 최종 영속화
export async function savePostsToStorage(posts: AppCommunityPost[]): Promise<void> {
  try {
    _memoryPosts = posts;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.warn('로컬 스토리지 저장 실패:', error);
  }
}

// [기능 3] ID를 통한 단일 게시글 동적 조회 핸들러
export function getPostById(id: number | string): AppCommunityPost | undefined {
  return _memoryPosts.find((p) => String(p.id) === String(id));
}

// [기능 4] 조회수 로컬 카운트 선반영 트래커
export async function incrementPostViews(id: number | string): Promise<void> {
  const updated = _memoryPosts.map((p) => {
    if (String(p.id) === String(id)) {
      return { ...p, views: (p.views || 0) + 1 };
    }
    return p;
  });
  await savePostsToStorage(updated);
}

// [기능 5] 좋아요 상태 토글 로컬 캐시 처리기
export async function togglePostLikeLocally(id: number | string): Promise<void> {
  const updated = _memoryPosts.map((p) => {
    if (String(p.id) === String(id)) {
      const nextIsLiked = !p.isLiked;
      const currentLikes = Number(p.likes) || 0;
      return {
        ...p,
        isLiked: nextIsLiked,
        likes: nextIsLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1),
      };
    }
    return p;
  });
  await savePostsToStorage(updated);
}

// [기능 6] 새 댓글 추가 로컬 홀더
export async function addCommentToPost(postId: number | string, content: string): Promise<void> {
  const updated = _memoryPosts.map((p) => {
    if (String(p.id) === String(postId)) {
      const list = p.commentsList || [];
      const newId = Date.now();
      const newCmt: AppComment = {
        id: newId,
        commentId: newId,
        author: '익명',
        content,
        time: '방금',
      };
      return {
        ...p,
        comments: (p.comments || 0) + 1,
        commentsList: [newCmt, ...list],
      };
    }
    return p;
  });
  await savePostsToStorage(updated);
}

// [기능 7] 댓글 삭제 로컬 캐시 처리기
export async function deleteComment(postId: number | string, commentId: number | string): Promise<void> {
  const updated = _memoryPosts.map((p) => {
    if (String(p.id) === String(postId)) {
      const list = p.commentsList || [];
      const filtered = list.filter((c) => {
        const cId = c.commentId !== undefined ? c.commentId : c.id;
        return String(cId) !== String(commentId);
      });
      return {
        ...p,
        comments: Math.max(0, (p.comments || 1) - 1),
        commentsList: filtered,
      };
    }
    return p;
  });
  await savePostsToStorage(updated);
}

// [기능 8] 새 게시글 로컬 스토리지 적재 파이프라인 (글쓰기 화면 연동용)
export async function addNewPostLocally(postData: {
  title: string;
  content: string;
  category: string;
  images?: string[];
}): Promise<AppCommunityPost> {
  const newPost: AppCommunityPost = {
    id: Date.now(), // 고유 임시 ID 발행
    category: postData.category,
    boardLabel: postData.category,
    title: postData.title,
    excerpt: postData.content.replace(/\n/g, ' ').slice(0, 35) + (postData.content.length > 35 ? '...' : ''),
    content: postData.content,
    author: '익명',
    time: '방금',
    views: 0,
    likes: 0,
    comments: 0,
    images: postData.images || [],
    vote: null,
    isLiked: false,
    commentsList: [],
  };

  const currentList = await loadPostsFromStorage();
  await savePostsToStorage([newPost, ...currentList]);
  return newPost;
}