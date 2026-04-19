import { apiClient } from './client';

export interface Board {
  id: number;
  name: string;
}

export interface BoardGroup {
  categoryGroup: string;
  boards: Board[];
}

export interface PostResponse {
  id: string | number;
  title: string;
  content: string;
  category: string;
  author: string;
  time: string;
  views: number;
  likes: number;
  comments: number;
  images?: string[];
  vote?: any;
}

/**
 * 게시판 목록 조회
 */
export const getCommunityBoards = async (): Promise<BoardGroup[]> => {
  const response = await apiClient.get('/api/community/boards');
  return response.data;
};

/**
 * 게시글 목록 조회
 */
export const getCommunityPosts = async (params?: {
  boardId?: number;
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
}): Promise<PostResponse[]> => {
  const response = await apiClient.get('/api/community/posts', { params });
  return response.data || [];
};

/**
 * 게시글 상세 조회
 */
export const getCommunityPostDetail = async (postId: string | number) => {
  const response = await apiClient.get(`/api/community/posts/${postId}`);
  return response.data;
};

/**
 * 게시글 작성 (multipart/form-data)
 */
export const createCommunityPost = async (formData: FormData) => {
  const response = await apiClient.post('/api/community/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * 게시글 좋아요 토글
 */
export const togglePostLike = async (postId: string | number) => {
  const response = await apiClient.post(`/api/community/posts/${postId}/like`);
  return response.data;
};

/**
 * 댓글 작성 (multipart/form-data)
 */
export const createPostComment = async (postId: string | number, formData: FormData) => {
  const response = await apiClient.post(`/api/community/posts/${postId}/comments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const votePoll = async (postId: string | number, optionIds: number[]) => {
  const response = await apiClient.post(`/api/community/posts/${postId}/polls/vote`, { optionIds });
  return response.data;
};

/**
 * 게시글 수정 (작성자/관리자)
 */
export const updateCommunityPost = async (postId: string | number, data: { title: string; content: string }) => {
  const response = await apiClient.put(`/api/community/posts/${postId}`, data);
  return response.data;
};

/**
 * 게시글 삭제 (작성자/관리자)
 */
export const deleteCommunityPost = async (postId: string | number) => {
  const response = await apiClient.delete(`/api/community/posts/${postId}`);
  return response.data;
};

/**
 * 댓글 수정 (작성자/관리자)
 */
export const updatePostComment = async (postId: string | number, commentId: string | number, formData: FormData) => {
  const response = await apiClient.put(`/api/community/posts/${postId}/comments/${commentId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * 댓글 삭제 (작성자/관리자)
 */
export const deletePostComment = async (postId: string | number, commentId: string | number) => {
  const response = await apiClient.delete(`/api/community/posts/${postId}/comments/${commentId}`);
  return response.data;
};

/**
 * 투표 설정 변경
 */
export const updatePoll = async (postId: string | number, data: { resultVisibility: string; autoCloseType: string }) => {
  const response = await apiClient.put(`/api/community/posts/${postId}/polls`, data);
  return response.data;
};

/**
 * 게시글 내 투표 삭제
 */
export const deletePoll = async (postId: string | number) => {
  const response = await apiClient.delete(`/api/community/posts/${postId}/polls`);
  return response.data;
};
