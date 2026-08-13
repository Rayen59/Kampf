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
    content: 'Welcome to Mein Kampf Social App! 🎉 Experience instant updates, rich media sharing, voice posts, custom reactions, and creator analytics all in one place. Try clicking or long-pressing the heart button below!',
    mediaType: 'image',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 min ago
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
      {
        id: 'c_2',
        postId: 'post_1',
        author: DEMO_USERS[2],
        content: 'The voice note feature is awesome! Testing reply threads here.',
        parentCommentId: 'c_1',
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        reactions: [],
      }
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
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hrs ago
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
  {
    id: 'post_3',
    author: DEMO_USERS[1],
    content: '📎 Here is the official Mobile UI Design Guide & Asset Pack for everyone building on Mein Kampf. Feel free to download the PDF below!',
    mediaType: 'file',
    fileAttachment: {
      name: 'MeinKampf_Mobile_UI_Guide_2026.pdf',
      url: '#',
      size: '4.8 MB',
      type: 'application/pdf',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    reactions: [
      { userId: 'usr_1', userName: 'Rayen Bouazizi', type: 'like', createdAt: new Date().toISOString() },
    ],
    comments: [],
    stats: {
      viewsCount: 145,
      sharesCount: 12,
      impressions: 210,
      engagementRate: 11.0,
      topReaction: 'like',
    },
    tags: ['design', 'pdf', 'resources'],
  }
];

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
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const addSearchToHistory = (userId: string, query: string): User | null => {
  const clean = query.trim();
  if (!clean || clean.length < 2) return null;

  const users = getStoredUsers();
  let updatedUser: User | null = null;
  const updatedUsers = users.map((u) => {
    if (u.id !== userId) return u;
    const history = u.searchHistory || [];
    const filtered = history.filter((q) => q.toLowerCase() !== clean.toLowerCase());
    const newHistory = [clean, ...filtered].slice(0, 15);
    updatedUser = { ...u, searchHistory: newHistory };
    return updatedUser;
  });

  if (updatedUser) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(updatedUser);
    }
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

  if (updatedUser) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(updatedUser);
    }
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

  // UNIQUE EMAIL CHECK
  const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);
  if (existing) {
    return {
      error: `The email "${email}" is already registered. Each email can only be used once! Please sign in instead.`,
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

let syncChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    syncChannel = new BroadcastChannel('mk_social_posts_channel');
  } catch (e) {
    // fallback
  }
}

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
  return updatedPost;
};

export const deletePost = (postId: string, userId: string): boolean => {
  const posts = getStoredPosts();
  const target = posts.find((p) => p.id === postId);
  if (!target) return false;

  const currentUser = getCurrentUser();
  const isOwner =
    target.author.id === userId ||
    target.author.id === currentUser.id ||
    (currentUser.username && target.author.username === currentUser.username) ||
    (currentUser.email && target.author.email === currentUser.email);

  if (!isOwner) {
    alert('Permission denied: You can only delete your own posts.');
    return false;
  }

  const filtered = posts.filter((p) => p.id !== postId);
  savePosts(filtered);
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
        // Toggle off
        newReactions.splice(existingIdx, 1);
      } else {
        // Switch reaction type
        newReactions[existingIdx] = {
          userId,
          userName,
          type,
          createdAt: new Date().toISOString(),
        };
      }
    } else {
      // Add reaction
      newReactions.push({
        userId,
        userName,
        type,
        createdAt: new Date().toISOString(),
      });
    }

    // Recalculate top reaction
    const counts: Record<string, number> = {};
    newReactions.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    let topR: ReactionType = 'heart';
    let maxC = 0;
    Object.entries(counts).forEach(([t, c]) => {
      if (c > maxC) {
        maxC = c;
        topR = t as ReactionType;
      }
    });

    const views = Math.max(1, p.stats.viewsCount);
    const totalEngagements = newReactions.length + p.comments.length;
    const engagementRate = Number(((totalEngagements / views) * 100).toFixed(1));

    return {
      ...p,
      reactions: newReactions,
      stats: {
        ...p.stats,
        topReaction: topR,
        engagementRate,
      },
    };
  });

  savePosts(updated);
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
  const updated = posts.map((p) => {
    if (p.id !== postId) return p;

    const newComment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      postId,
      author,
      content,
      parentCommentId,
      audioAttachment,
      createdAt: new Date().toISOString(),
      reactions: [],
    };

    const newComments = [...p.comments, newComment];
    const views = Math.max(1, p.stats.viewsCount);
    const totalEngagements = p.reactions.length + newComments.length;
    const engagementRate = Number(((totalEngagements / views) * 100).toFixed(1));

    return {
      ...p,
      comments: newComments,
      stats: {
        ...p.stats,
        engagementRate,
      },
    };
  });

  savePosts(updated);
  return updated;
};

export const deleteComment = (
  postId: string,
  commentId: string,
  userId: string
): Post[] => {
  const posts = getStoredPosts();
  const currentUser = getCurrentUser();
  const updated = posts.map((p) => {
    if (p.id !== postId) return p;

    const newComments = p.comments.filter((c) => {
      if (c.id === commentId) {
        const isCommentAuthor =
          c.author.id === userId ||
          c.author.id === currentUser.id ||
          (currentUser.username && c.author.username === currentUser.username) ||
          (currentUser.email && c.author.email === currentUser.email);
        const isPostAuthor =
          p.author.id === userId ||
          p.author.id === currentUser.id ||
          (currentUser.username && p.author.username === currentUser.username) ||
          (currentUser.email && p.author.email === currentUser.email);

        if (!isCommentAuthor && !isPostAuthor) {
          alert('Permission denied: You can only delete your own comments.');
          return true;
        }
        return false;
      }
      return true;
    });

    const views = Math.max(1, p.stats.viewsCount);
    const totalEngagements = p.reactions.length + newComments.length;
    const engagementRate = Number(((totalEngagements / views) * 100).toFixed(1));

    return {
      ...p,
      comments: newComments,
      stats: {
        ...p.stats,
        engagementRate,
      },
    };
  });

  savePosts(updated);
  return updated;
};

export const incrementPostView = (postId: string): Post[] => {
  const posts = getStoredPosts();
  const updated = posts.map((p) => {
    if (p.id !== postId) return p;
    const newViews = p.stats.viewsCount + 1;
    const newImpressions = p.stats.impressions + 1;
    const totalEngagements = p.reactions.length + p.comments.length;
    const engagementRate = Number(((totalEngagements / newViews) * 100).toFixed(1));

    return {
      ...p,
      stats: {
        ...p.stats,
        viewsCount: newViews,
        impressions: newImpressions,
        engagementRate,
      },
    };
  });
  savePosts(updated);
  return updated;
};

export const getPostOfTheDay = (posts: Post[]): Post | null => {
  if (!posts || posts.length === 0) return null;
  // Calculate top post by total reactions + comments count
  const sorted = [...posts].sort((a, b) => {
    const scoreA = a.reactions.length * 2 + a.comments.length * 3 + a.stats.sharesCount * 4;
    const scoreB = b.reactions.length * 2 + b.comments.length * 3 + b.stats.sharesCount * 4;
    return scoreB - scoreA;
  });
  return sorted[0] || null;
};
