import { Post, User, Comment, ReactionType, Reaction, AudioAttachment, FileAttachment } from '../types';

const STORAGE_KEYS = {
  USERS: 'mk_social_users_v1',
  CURRENT_USER: 'mk_social_current_user_v1',
  POSTS: 'mk_social_posts_v1',
};

// Initial Demo Users
export const DEMO_USERS: User[] = [
  {
    id: 'usr_1',
    email: 'rayen@mk.app',
    username: 'rayen_creator',
    displayName: 'Rayen Bouazizi',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Digital Creator & Tech Visionary 🚀 | Welcome to Mein Kampf App!',
    joinedDate: '2026-01-15',
    followersCount: 1420,
    followingCount: 380,
  },
  {
    id: 'usr_2',
    email: 'sarah.m@mk.app',
    username: 'sarah_design',
    displayName: 'Sarah Miller',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'UI/UX Designer & Mobile Enthusiast 📱🎨',
    joinedDate: '2026-02-01',
    followersCount: 890,
    followingCount: 210,
  },
  {
    id: 'usr_3',
    email: 'alex.vibe@mk.app',
    username: 'alex_sound',
    displayName: 'Alex Thorne',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Music producer & Voice note aficionado 🎧🎙️',
    joinedDate: '2026-02-10',
    followersCount: 2300,
    followingCount: 450,
  },
];

// Initial Seed Posts
const SEED_POSTS: Post[] = [
  {
    id: 'post_1',
    author: DEMO_USERS[0],
    content: 'Welcome to Mein Kampf Social App! 🎉 Experience instant updates, rich media sharing, voice posts, custom reactions, and creator analytics all in one place.',
    mediaType: 'image',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    reactions: [
      { userId: 'usr_2', userName: 'Sarah Miller', type: 'fire', createdAt: new Date().toISOString() },
      { userId: 'usr_3', userName: 'Alex Thorne', type: 'heart', createdAt: new Date().toISOString() },
      { userId: 'usr_1', userName: 'Rayen Bouazizi', type: 'party', createdAt: new Date().toISOString() },
    ],
    comments: [
      {
        id: 'c_1',
        postId: 'post_1',
        author: DEMO_USERS[1],
        content: 'This interface feels so smooth and responsive on mobile! Love the animation effects.',
        createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        reactions: [{ userId: 'usr_1', userName: 'Rayen', type: 'heart', createdAt: new Date().toISOString() }],
      },
    ],
    stats: {
      viewsCount: 342,
      sharesCount: 18,
      impressions: 520,
      engagementRate: 14.2,
      topReaction: 'fire',
    },
    tags: ['welcome', 'social', 'mobile'],
  },
  {
    id: 'post_2',
    author: DEMO_USERS[2],
    content: '🎙️ Quick audio update! Just finished recording a new beat. Listen to the voice preview below and leave your thoughts!',
    mediaType: 'audio',
    audioAttachment: {
      url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg',
      duration: 18,
      waveform: [20, 45, 80, 60, 95, 40, 70, 85, 30, 90, 100, 65, 40, 80, 50, 30],
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    reactions: [
      { userId: 'usr_1', userName: 'Rayen Bouazizi', type: 'fire', createdAt: new Date().toISOString() },
      { userId: 'usr_2', userName: 'Sarah Miller', type: 'wow', createdAt: new Date().toISOString() },
    ],
    comments: [],
    stats: {
      viewsCount: 189,
      sharesCount: 7,
      impressions: 290,
      engagementRate: 9.8,
      topReaction: 'fire',
    },
    tags: ['audio', 'music', 'voicenote'],
  },
];

let syncChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    syncChannel = new BroadcastChannel('mk_social_posts_channel');
  } catch (e) {
    // fallback
  }
}

// Local cache
let cachedPosts: Post[] = [];

export const getStoredUsers = (): User[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_USERS));
      return DEMO_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEMO_USERS;
  }
};

export const fetchUsersFromServer = async (): Promise<User[]> => {
  try {
    const res = await fetch('/api/users');
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    // quiet catch
  }
  return getStoredUsers();
};

export const getCurrentUser = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // fallback
  }
  return null;
};

export const setCurrentUser = (user: User) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  }).catch(() => {});
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const deleteAccount = (userId: string): boolean => {
  try {
    const users = getStoredUsers();
    const updatedUsers = users.filter((u) => u.id !== userId);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

    fetch(`/api/users/${userId}`, { method: 'DELETE' }).catch(() => {});

    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      logoutUser();
    }
    return true;
  } catch (e) {
    console.error('Error deleting account:', e);
    return false;
  }
};

export const addSearchToHistory = (userId: string, query: string): User | null => {
  const clean = query.trim();
  if (!clean || clean.length < 2) return null;

  const users = getStoredUsers();
  let updatedUser: User | null = null;
  const updatedUsers = users.map((u) => {
    if (u.id !== userId) return u;
    const existing = u.searchHistory || [];
    const filtered = existing.filter((item) => item.toLowerCase() !== clean.toLowerCase());
    const newHistory = [clean, ...filtered].slice(0, 10);
    updatedUser = { ...u, searchHistory: newHistory };
    return updatedUser;
  });

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
  if (updatedUser) {
    setCurrentUser(updatedUser);
  }
  return updatedUser;
};

export const clearSearchHistory = (userId: string): User | null => {
  const users = getStoredUsers();
  let updatedUser: User | null = null;
  const updatedUsers = users.map((u) => {
    if (u.id !== userId) return u;
    updatedUser = { ...u, searchHistory: [] };
    return updatedUser;
  });

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
  if (updatedUser) {
    setCurrentUser(updatedUser);
  }
  return updatedUser;
};

export const registerUser = (
  email: string,
  displayName: string,
  username: string,
  avatarUrl?: string,
  bio?: string
): { user?: User; error?: string } => {
  const users = getStoredUsers();
  const trimmedEmail = email.trim().toLowerCase();

  const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
  if (existing) {
    return {
      error: `The email "${email}" is already registered. Please sign in instead.`,
    };
  }

  const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: trimmedEmail,
    displayName: displayName.trim() || 'New Member',
    username: cleanUsername.trim() || `user_${Math.floor(Math.random() * 8999 + 1000)}`,
    avatarUrl:
      avatarUrl ||
      `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    bio: bio?.trim() || 'Excited to be on Mein Kampf App! ✨',
    joinedDate: new Date().toISOString().split('T')[0],
    followersCount: 0,
    followingCount: 0,
  };

  const updatedUsers = [newUser, ...users];
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
  setCurrentUser(newUser);

  return { user: newUser };
};

export const loginUser = (email: string): { user?: User; error?: string } => {
  const users = getStoredUsers();
  const trimmedEmail = email.trim().toLowerCase();
  const user = users.find((u) => u.email.toLowerCase() === trimmedEmail);

  if (!user) {
    return {
      error: `No account found with email "${email}". Please register first!`,
    };
  }

  setCurrentUser(user);
  return { user };
};

export const getStoredPosts = (): Post[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(SEED_POSTS));
      return SEED_POSTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return SEED_POSTS;
  }
};

export const fetchPostsFromServer = async (): Promise<Post[]> => {
  try {
    const res = await fetch('/api/posts');
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(data));
      cachedPosts = data;
      return data;
    }
  } catch (err) {
    // quiet catch fallback to local
  }
  return getStoredPosts();
};

export const savePosts = (posts: Post[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mk_posts_updated', { detail: posts }));
      if (syncChannel) {
        syncChannel.postMessage({ type: 'POSTS_UPDATED', posts });
      }
    }
  } catch (e) {
    console.error('Failed to save posts to localStorage', e);
  }
};

export const createPost = (
  author: User,
  content: string,
  mediaType: Post['mediaType'],
  images?: string[],
  videoUrl?: string,
  audioAttachment?: AudioAttachment,
  fileAttachment?: FileAttachment,
  tags?: string[]
): Post => {
  const posts = getStoredPosts();
  const newPost: Post = {
    id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    author,
    content,
    mediaType,
    images: images && images.length > 0 ? images : undefined,
    videoUrl: videoUrl?.trim() || undefined,
    audioAttachment,
    fileAttachment,
    createdAt: new Date().toISOString(),
    reactions: [],
    comments: [],
    stats: {
      viewsCount: 1,
      sharesCount: 0,
      impressions: 1,
      engagementRate: 0,
      topReaction: 'heart',
    },
    tags: tags || [],
  };

  const updated = [newPost, ...posts];
  savePosts(updated);

  // Sync with Express backend server immediately
  fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost),
  }).catch(() => {});

  return newPost;
};

export const editPost = (
  postId: string,
  userId: string,
  updatedData: {
    content: string;
    mediaType: Post['mediaType'];
    images?: string[];
    videoUrl?: string;
    audioAttachment?: AudioAttachment;
    fileAttachment?: FileAttachment;
    tags?: string[];
  }
): Post | null => {
  const posts = getStoredPosts();
  const targetIndex = posts.findIndex((p) => p.id === postId);
  if (targetIndex === -1) return null;

  const target = posts[targetIndex];
  if (target.author.id !== userId) {
    alert('Permission denied: You can only edit your own posts.');
    return null;
  }

  const updatedPost: Post = {
    ...target,
    content: updatedData.content,
    mediaType: updatedData.mediaType,
    images: updatedData.images && updatedData.images.length > 0 ? updatedData.images : undefined,
    videoUrl: updatedData.videoUrl?.trim() || undefined,
    audioAttachment: updatedData.audioAttachment,
    fileAttachment: updatedData.fileAttachment,
    tags: updatedData.tags || [],
  };

  const newPosts = [...posts];
  newPosts[targetIndex] = updatedPost;
  savePosts(newPosts);

  fetch(`/api/posts/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedPost),
  }).catch(() => {});

  return updatedPost;
};

export const deletePost = (postId: string, userId: string): boolean => {
  const posts = getStoredPosts();
  const target = posts.find((p) => p.id === postId);
  if (!target) return false;

  const currentUser = getCurrentUser();
  const isOwner =
    target.author.id === userId ||
    (currentUser && target.author.id === currentUser.id) ||
    (currentUser && currentUser.username && target.author.username === currentUser.username);

  if (!isOwner) {
    alert('Permission denied: You can only delete your own posts.');
    return false;
  }

  const filtered = posts.filter((p) => p.id !== postId);
  savePosts(filtered);

  fetch(`/api/posts/${postId}`, { method: 'DELETE' }).catch(() => {});

  return true;
};

export const toggleReaction = (
  postId: string,
  userId: string,
  userName: string,
  type: ReactionType
): Post[] => {
  const posts = getStoredPosts();
  const updated = posts.map((p) => {
    if (p.id !== postId) return p;

    const existingIdx = p.reactions.findIndex((r) => r.userId === userId);
    let newReactions = [...p.reactions];

    if (existingIdx >= 0) {
      if (newReactions[existingIdx].type === type) {
        newReactions.splice(existingIdx, 1);
      } else {
        newReactions[existingIdx] = {
          userId,
          userName,
          type,
          createdAt: new Date().toISOString(),
        };
      }
    } else {
      newReactions.push({
        userId,
        userName,
        type,
        createdAt: new Date().toISOString(),
      });
    }

    return {
      ...p,
      reactions: newReactions,
    };
  });

  savePosts(updated);

  fetch(`/api/posts/${postId}/react`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, userName, type }),
  }).catch(() => {});

  return updated;
};

export const addComment = (
  postId: string,
  author: User,
  content: string,
  parentCommentId?: string,
  audioAttachment?: AudioAttachment
): Post[] => {
  const posts = getStoredPosts();
  const newComment: Comment = {
    id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    postId,
    author,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    parentCommentId,
    reactions: [],
    audioAttachment,
  };

  const updated = posts.map((p) => {
    if (p.id !== postId) return p;
    return {
      ...p,
      comments: [...p.comments, newComment],
    };
  });

  savePosts(updated);

  fetch(`/api/posts/${postId}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author, content, parentCommentId, audioAttachment }),
  }).catch(() => {});

  return updated;
};

export const deleteComment = (postId: string, commentId: string): Post[] => {
  const posts = getStoredPosts();
  const updated = posts.map((p) => {
    if (p.id !== postId) return p;
    return {
      ...p,
      comments: p.comments.filter((c) => c.id !== commentId && c.parentCommentId !== commentId),
    };
  });

  savePosts(updated);

  fetch(`/api/posts/${postId}/comments/${commentId}`, { method: 'DELETE' }).catch(() => {});

  return updated;
};

export const incrementPostView = (postId: string): void => {
  const posts = getStoredPosts();
  const updated = posts.map((p) => {
    if (p.id !== postId) return p;
    return {
      ...p,
      stats: {
        ...p.stats,
        viewsCount: p.stats.viewsCount + 1,
        impressions: p.stats.impressions + 1,
      },
    };
  });
  savePosts(updated);
};

export const getPostOfTheDay = (posts: Post[]): Post | null => {
  if (!posts || posts.length === 0) return null;

  const sorted = [...posts].sort((a, b) => {
    const scoreA = (a.reactions?.length || 0) * 3 + (a.comments?.length || 0) * 2 + (a.stats?.sharesCount || 0) * 4;
    const scoreB = (b.reactions?.length || 0) * 3 + (b.comments?.length || 0) * 2 + (b.stats?.sharesCount || 0) * 4;
    return scoreB - scoreA;
  });
  return sorted[0] || null;
};

export const sharePostToFeed = (postId: string, user: User, caption?: string): Post[] => {
  const posts = getStoredPosts();
  const targetPost = posts.find((p) => p.id === postId);
  if (!targetPost) return posts;

  const rootOriginalPost = targetPost.originalPost || targetPost;

  const updatedPosts = posts.map((p) => {
    if (p.id === postId || p.id === rootOriginalPost.id) {
      return {
        ...p,
        stats: {
          ...p.stats,
          sharesCount: (p.stats?.sharesCount || 0) + 1,
        },
      };
    }
    return p;
  });

  const newSharedPost: Post = {
    id: `post_share_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    author: user,
    sharedBy: user,
    originalPost: rootOriginalPost,
    content: caption?.trim() || '',
    mediaType: rootOriginalPost.mediaType,
    images: rootOriginalPost.images,
    videoUrl: rootOriginalPost.videoUrl,
    audioAttachment: rootOriginalPost.audioAttachment,
    fileAttachment: rootOriginalPost.fileAttachment,
    createdAt: new Date().toISOString(),
    reactions: [],
    comments: [],
    stats: {
      viewsCount: 1,
      sharesCount: 0,
      impressions: 1,
      engagementRate: 0,
      topReaction: 'heart',
    },
    tags: rootOriginalPost.tags ? Array.from(new Set(['shared', ...rootOriginalPost.tags])) : ['shared'],
  };

  const finalPosts = [newSharedPost, ...updatedPosts];
  savePosts(finalPosts);

  // Sync shared post to server DB immediately
  fetch(`/api/posts/${postId}/share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, caption }),
  })
    .then((res) => res.json())
    .then((serverPosts) => {
      if (Array.isArray(serverPosts) && serverPosts.length > 0) {
        savePosts(serverPosts);
      }
    })
    .catch(() => {});

  return finalPosts;
};
