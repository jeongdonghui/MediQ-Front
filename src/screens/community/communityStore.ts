import type { CommunityPost } from '../../navigation/AppNavigator';

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
  },
];

export function getPosts(): AppCommunityPost[] {
  return [...posts];
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
  };

  posts = [newPost, ...posts];
  return newPost;
}