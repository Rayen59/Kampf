import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// File path for server database persistence across all users and devices
const DB_FILE = path.join(process.cwd(), 'server_db.json');

interface User {
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

interface Reaction {
  userId: string;
  userName: string;
  type: string;
  createdAt: string;
}

interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
  parentCommentId?: string;
  reactions?: Reaction[];
  audioAttachment?: any;
}

interface Post {
  id: string;
  author: User;
  sharedBy?: User;
  originalPost?: Post;
  content: string;
  mediaType: string;
  images?: string[];
  videoUrl?: string;
  audioAttachment?: any;
  fileAttachment?: any;
  createdAt: string;
  reactions: Reaction[];
  comments: Comment[];
  stats: {
    viewsCount: number;
    sharesCount: number;
    impressions: number;
    engagementRate: number;
    topReaction: string;
  };
  tags?: string[];
}

interface DBData {
  users: User[];
  posts: Post[];
}

// Initial Demo Seed Data
const INITIAL_USERS: User[] = [
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

const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    author: INITIAL_USERS[0],
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
        author: INITIAL_USERS[1],
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
    author: INITIAL_USERS[2],
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

// Helper to read DB
function readDB(): DBData {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(raw);
      return {
        users: Array.isArray(data.users) ? data.users : INITIAL_USERS,
        posts: Array.isArray(data.posts) ? data.posts : INITIAL_POSTS,
      };
    }
  } catch (err) {
    console.error('Error reading DB_FILE:', err);
  }
  const initData = { users: INITIAL_USERS, posts: INITIAL_POSTS };
  writeDB(initData);
  return initData;
}

// Helper to write DB
function writeDB(data: DBData) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB_FILE:', err);
  }
}

// API Routes
app.get('/api/posts', (req, res) => {
  const db = readDB();
  res.json(db.posts);
});

app.post('/api/posts', (req, res) => {
  const db = readDB();
  const newPost: Post = req.body;
  if (!newPost.id) {
    newPost.id = `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  }
  db.posts.unshift(newPost);
  writeDB(db);
  res.json(db.posts);
});

app.put('/api/posts/:id', (req, res) => {
  const db = readDB();
  const postId = req.params.id;
  const updatedData = req.body;
  db.posts = db.posts.map((p) => (p.id === postId ? { ...p, ...updatedData } : p));
  writeDB(db);
  res.json(db.posts);
});

app.delete('/api/posts/:id', (req, res) => {
  const db = readDB();
  const postId = req.params.id;
  db.posts = db.posts.filter((p) => p.id !== postId);
  writeDB(db);
  res.json(db.posts);
});

// React endpoint
app.post('/api/posts/:id/react', (req, res) => {
  const db = readDB();
  const postId = req.params.id;
  const { userId, userName, type } = req.body;

  db.posts = db.posts.map((p) => {
    if (p.id === postId) {
      const existingIdx = p.reactions.findIndex((r) => r.userId === userId);
      let updatedReactions = [...p.reactions];
      if (existingIdx >= 0) {
        if (updatedReactions[existingIdx].type === type) {
          updatedReactions.splice(existingIdx, 1);
        } else {
          updatedReactions[existingIdx] = { userId, userName, type, createdAt: new Date().toISOString() };
        }
      } else {
        updatedReactions.push({ userId, userName, type, createdAt: new Date().toISOString() });
      }
      return { ...p, reactions: updatedReactions };
    }
    return p;
  });

  writeDB(db);
  res.json(db.posts);
});

// Comment endpoint
app.post('/api/posts/:id/comment', (req, res) => {
  const db = readDB();
  const postId = req.params.id;
  const { author, content, parentCommentId, audioAttachment } = req.body;

  db.posts = db.posts.map((p) => {
    if (p.id === postId) {
      const newComment: Comment = {
        id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        postId,
        author,
        content: content || '',
        createdAt: new Date().toISOString(),
        parentCommentId,
        audioAttachment,
        reactions: [],
      };
      return {
        ...p,
        comments: [...p.comments, newComment],
      };
    }
    return p;
  });

  writeDB(db);
  res.json(db.posts);
});

// Delete comment endpoint
app.delete('/api/posts/:postId/comments/:commentId', (req, res) => {
  const db = readDB();
  const { postId, commentId } = req.params;

  db.posts = db.posts.map((p) => {
    if (p.id === postId) {
      return {
        ...p,
        comments: p.comments.filter((c) => c.id !== commentId && c.parentCommentId !== commentId),
      };
    }
    return p;
  });

  writeDB(db);
  res.json(db.posts);
});

// Share endpoint (Facebook Style)
app.post('/api/posts/:id/share', (req, res) => {
  const db = readDB();
  const postId = req.params.id;
  const { user, caption } = req.body;

  const targetPost = db.posts.find((p) => p.id === postId);
  if (!targetPost) {
    return res.json(db.posts);
  }

  const rootOriginalPost = targetPost.originalPost || targetPost;

  // Update share count on target & root posts
  db.posts = db.posts.map((p) => {
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

  // Create shared post item
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

  db.posts.unshift(newSharedPost);
  writeDB(db);
  res.json(db.posts);
});

// Users Endpoints
app.get('/api/users', (req, res) => {
  const db = readDB();
  res.json(db.users);
});

app.post('/api/users', (req, res) => {
  const db = readDB();
  const user: User = req.body;
  const existingIdx = db.users.findIndex((u) => u.id === user.id || u.username === user.username);
  if (existingIdx >= 0) {
    db.users[existingIdx] = { ...db.users[existingIdx], ...user };
  } else {
    db.users.push(user);
  }
  writeDB(db);
  res.json(db.users);
});

app.delete('/api/users/:id', (req, res) => {
  const db = readDB();
  const userId = req.params.id;
  db.users = db.users.filter((u) => u.id !== userId);
  writeDB(db);
  res.json({ success: true, users: db.users });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Fullstack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
