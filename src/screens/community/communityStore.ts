import type { CommunityPost } from '../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type VoteInfo = {
  title: string;
  options: string[];
  multi: boolean;
  anonymous: boolean;
};

export type AppCommunityPost = CommunityPost & {
  category: string;
  images?: string[];
  vote?: VoteInfo | null;
  isLiked?: boolean;
  commentItems?: any[];
};

export type BoardGroup = {
  id: string;
  title: string;
  items: string[];
};

export const BOARD_GROUPS: BoardGroup[] = [
  { id: 'free', title: '자유게시판', items: ['자유게시판'] },
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

export const POSTS_STORAGE_KEY = '@community_posts';

let posts: AppCommunityPost[] = [
  {
    id: '1',
    category: '자유게시판',
    boardLabel: '자유게시판',
    title: '모호한 단어',
    excerpt: '제가 어느병원에 가야할지 모르겠어서 AI이용해서 ...',
    content:
      '요 며칠 발목이 후끈후끈하게 아파서 정형외과를 가야 하는지 재활의학과를 가야 하는지 너무 헷갈렸어요.',
    author: '아포용가리',
    time: '방금',
    views: 32,
    likes: 2,
    comments: 4,
    images: [],
    vote: null,
    isLiked: false,
    commentItems: [],
  },
  {
    id: '2',
    category: '목 앞',
    boardLabel: '목 앞',
    title: '목 앞이 뻐근해요',
    excerpt: '목 앞쪽이 당기고 불편한데 어느 과를 가야 하나요?',
    content: '목 앞쪽이 당기고 불편한데 어느 과를 가야 할지 고민입니다.',
    author: '목유저',
    time: '20분전',
    views: 12,
    likes: 1,
    comments: 2,
    images: [],
    vote: null,
    isLiked: false,
    commentItems: [],
  },
  {
    id: '3',
    category: '명치 중앙',
    boardLabel: '명치 중앙',
    title: '명치가 콕콕 쑤셔요',
    excerpt: '식후에 명치 중앙이 불편합니다.',
    content: '식후에 명치 중앙이 콕콕 쑤셔서 걱정입니다.',
    author: '속불편',
    time: '1시간전',
    views: 14,
    likes: 2,
    comments: 1,
    images: [],
    vote: null,
    isLiked: false,
    commentItems: [],
  },
];

export function getPosts(): AppCommunityPost[] {
  return [...posts];
}

// ✅ 특정 게시글 찾기 전용
export function getPostById(postId: string): AppCommunityPost | undefined {
    return posts.find(p => p.id === postId);
}

// ✅ 조회수 증가
export function incrementPostViews(postId: string) {
    const idx = posts.findIndex(p => p.id === postId);
    if (idx !== -1) {
        posts[idx].views += 1;
        savePostsToStorage(posts);
    }
}

// ✅ 좋아요(공감) 토글
export function togglePostLikeLocally(postId: string) {
    const idx = posts.findIndex(p => p.id === postId);
    if (idx !== -1) {
        const post = posts[idx];
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;
        savePostsToStorage(posts);
    }
}

// ✅ 댓글 추가
export function addCommentToPost(postId: string, content: string) {
    const idx = posts.findIndex(p => p.id === postId);
    if (idx !== -1) {
        const post = posts[idx];
        if (!post.commentItems) post.commentItems = [];
        const newComment = {
            id: `local_cmt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            author: '나(사용자)',
            content: content,
            time: '방금',
            likes: 0,
            isLiked: false,
            replies: [],
        };
        post.commentItems = [newComment, ...(post.commentItems || [])];
        post.comments = (Number(post.comments) || 0) + 1;
        savePostsToStorage(posts);
    }
}

// ✅ 로컬 저장소에서 데이터 불러오기
export async function loadPostsFromStorage(): Promise<AppCommunityPost[]> {
  try {
    const stored = await AsyncStorage.getItem(POSTS_STORAGE_KEY);
    if (stored) {
      posts = JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load community posts from storage', e);
  }
  return [...posts];
}

// ✅ 로컬 저장소에 데이터 저장하기
export async function savePostsToStorage(updatedPosts: AppCommunityPost[]) {
  try {
    await AsyncStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(updatedPosts));
  } catch (e) {
    console.warn('Failed to save community posts to storage', e);
  }
}

export function addPost(input: {
  category: string;
  title: string;
  content: string;
  images?: string[];
  vote?: VoteInfo | null;
}): AppCommunityPost {
  const excerpt =
    input.content.replace(/\n/g, ' ').slice(0, 35) +
    (input.content.length > 35 ? '...' : '');

  const newPost: AppCommunityPost = {
    id: String(Date.now()),
    category: input.category,
    boardLabel: input.category,
    title: input.title,
    excerpt,
    content: input.content,
    author: '홍길동',
    time: '방금',
    views: 0,
    likes: 0,
    comments: 0,
    images: input.images ?? [],
    vote: input.vote ?? null,
    isLiked: false,
    commentItems: [],
  };

  posts = [newPost, ...posts];
  savePostsToStorage(posts); // ✅ 비동기로 저장
  return newPost;
}

// ✅ 특정 댓글에 답글(대댓글) 추가
export function addReplyToComment(postId: string, commentId: string, content: string) {
    const postIdx = posts.findIndex(p => p.id === postId);
    if (postIdx !== -1) {
        const post = posts[postIdx];
        const commentIdx = post.commentItems?.findIndex(c => c.id === commentId);
        if (commentIdx !== undefined && commentIdx !== -1) {
            const comment = post.commentItems![commentIdx];
            if (!comment.replies) comment.replies = [];
            const newReply = {
                id: `local_reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                author: '나(사용자)',
                content: content,
                time: '방금',
                likes: 0,
                isLiked: false,
            };
            comment.replies = [...(comment.replies || []), newReply];
            post.comments = (Number(post.comments) || 0) + 1;
            savePostsToStorage(posts);
        }
    }
}

// ✅ 댓글 좋아요 토글
export function toggleCommentLike(postId: string, commentId: string, replyId?: string) {
    const postIdx = posts.findIndex(p => p.id === postId);
    if (postIdx !== -1) {
        const post = posts[postIdx];
        const commentIdx = post.commentItems?.findIndex(c => c.id === commentId);
        if (commentIdx !== undefined && commentIdx !== -1) {
            let target = post.commentItems![commentIdx];
            if (replyId) {
                target = target.replies?.find((r: any) => r.id === replyId);
            }
            if (target) {
                target.isLiked = !target.isLiked;
                const currentLikes = Number(target.likes) || 0;
                target.likes = target.isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);
                savePostsToStorage(posts);
            }
        }
    }
}

// ✅ 댓글/답글 삭제
export function deleteComment(postId: string, commentId: string, replyId?: string) {
    const postIdx = posts.findIndex(p => p.id === postId);
    if (postIdx !== -1) {
        const post = posts[postIdx];
        if (replyId) {
            const commentIdx = post.commentItems?.findIndex(c => c.id === commentId);
            if (commentIdx !== undefined && commentIdx !== -1) {
                const comment = post.commentItems![commentIdx];
                comment.replies = comment.replies?.filter((r: any) => r.id !== replyId);
                post.comments -= 1;
            }
        } else {
            post.commentItems = post.commentItems?.filter(c => c.id !== commentId);
            post.comments -= 1;
        }
        savePostsToStorage(posts);
    }
}