export type ReactionType = 'heart' | 'haha' | 'wow' | 'sad' | 'angry' | 'fire' | 'like' | 'party';

export interface ReactionEmojiMap {
  type: ReactionType;
  emoji: string;
  label: string;
  color: string;
}

export const REACTION_CONFIG: ReactionEmojiMap[] = [
  { type: 'heart', emoji: '❤️', label: 'Love', color: 'text-pink-500' },
  { type: 'like', emoji: '👍', label: 'Like', color: 'text-blue-500' },
  { type: 'fire', emoji: '🔥', label: 'Fire', color: 'text-amber-500' },
  { type: 'haha', emoji: '😂', label: 'Haha', color: 'text-yellow-500' },
  { type: 'party', emoji: '🎉', label: 'Party', color: 'text-purple-500' },
  { type: 'wow', emoji: '😮', label: 'Wow', color: 'text-amber-400' },
  { type: 'sad', emoji: '😢', label: 'Sad', color: 'text-blue-400' },
  { type: 'angry', emoji: '😡', label: 'Angry', color: 'text-red-500' },
];

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  joinedDate: string;
  followersCount: number;
  followingCount: number;
  searchHistory?: string[];
}

export interface Reaction {
  userId: string;
  userName: string;
  type: ReactionType;
  createdAt: string;
}

export interface FileAttachment {
  name: string;
  url: string;
  size: string;
  type: string;
}

export interface AudioAttachment {
  url: string;
  duration: number; // in seconds
  waveform?: number[];
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  audioAttachment?: AudioAttachment;
  parentCommentId?: string; // for threaded replies
  createdAt: string;
  reactions: Reaction[];
}

export interface PostStats {
  viewsCount: number;
  sharesCount: number;
  impressions: number;
  engagementRate: number; // percentage
  topReaction: ReactionType;
}

export interface Post {
  id: string;
  author: User;
  sharedBy?: User;
  originalPost?: Post;
  content: string;
  mediaType: 'text' | 'image' | 'video' | 'audio' | 'file' | 'mixed';
  images?: string[];
  videoUrl?: string;
  fileAttachment?: FileAttachment;
  audioAttachment?: AudioAttachment;
  createdAt: string;
  reactions: Reaction[];
  comments: Comment[];
  stats: PostStats;
  tags?: string[];
}

export type ActiveTab = 'feed' | 'post-of-the-day' | 'explore' | 'chat-zone' | 'profile' | 'analytics';
