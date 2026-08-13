import React, { useState, useEffect } from 'react';
import { Post, User, ActiveTab, ReactionType, AudioAttachment } from './types';
import {
  getCurrentUser,
  setCurrentUser,
  logoutUser,
  deleteAccount,
  getStoredPosts,
  createPost,
  editPost,
  deletePost,
  toggleReaction,
  addComment,
  deleteComment,
  sharePostToFeed,
  incrementPostView,
  getPostOfTheDay,
  addSearchToHistory,
  clearSearchHistory,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { CreatePostCard } from './components/CreatePostCard';
import { CreatePostModal } from './components/CreatePostModal';
import { EditPostModal } from './components/EditPostModal';
import { PostCard } from './components/PostCard';
import { PostOfTheDayBanner } from './components/PostOfTheDayBanner';
import { AuthModal } from './components/AuthModal';
import { ProfileView } from './components/ProfileView';
import { ChatZoneView } from './components/ChatZoneView';
import { AnalyticsView } from './components/AnalyticsView';
import { Sparkles, Flame, Plus, Layers, Image as ImageIcon, Mic, FileText, Video, Shuffle, Globe, Clock, Radio } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUserParams] = useState<User | null>(getCurrentUser());
  const [posts, setPosts] = useState<Post[]>(getStoredPosts());
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedFilter, setFeedFilter] = useState<'all' | 'image' | 'video' | 'audio' | 'file'>('all');
  const [feedSortMode, setFeedSortMode] = useState<'facebook' | 'latest' | 'random'>('facebook');
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Instant real-time live synchronization across tabs and users
  useEffect(() => {
    // Initial view increments
    posts.slice(0, 3).forEach((p) => {
      incrementPostView(p.id);
    });

    const refreshPosts = () => {
      const fresh = getStoredPosts();
      setPosts(fresh);
    };

    window.addEventListener('mk_posts_updated', refreshPosts);
    window.addEventListener('storage', (e) => {
      if (e.key === 'mk_social_posts_v1') {
        refreshPosts();
      }
    });

    let syncChannel: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      try {
        syncChannel = new BroadcastChannel('mk_social_posts_channel');
        syncChannel.onmessage = (msg) => {
          if (msg.data?.type === 'POSTS_UPDATED') {
            refreshPosts();
          }
        };
      } catch (e) {
        // fallback
      }
    }

    // Interval fallback to guarantee instant (<1s) post updates across screens
    const timer = setInterval(() => {
      const latest = getStoredPosts();
      setPosts((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(latest)) {
          return latest;
        }
        return prev;
      });
    }, 1000);

    return () => {
      window.removeEventListener('mk_posts_updated', refreshPosts);
      window.removeEventListener('storage', refreshPosts);
      if (syncChannel) syncChannel.close();
      clearInterval(timer);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateUser = (user: User) => {
    setCurrentUserParams(user);
    setCurrentUser(user);
    showToast('Profile updated successfully!');
  };

  const handleCreatePostSubmit = (
    content: string,
    mediaType: Post['mediaType'],
    images?: string[],
    videoUrl?: string,
    audioAttachment?: any,
    fileAttachment?: any,
    tags?: string[]
  ) => {
    if (!currentUser) return;
    const newP = createPost(
      currentUser,
      content,
      mediaType,
      images,
      videoUrl,
      audioAttachment,
      fileAttachment,
      tags
    );
    setPosts(getStoredPosts());
    showToast('Published instantly for all users!');
  };

  const handleOpenEditPost = (post: Post) => {
    setEditingPost(post);
    setIsEditPostOpen(true);
  };

  const handleEditPostSubmit = (
    postId: string,
    content: string,
    mediaType: Post['mediaType'],
    images?: string[],
    videoUrl?: string,
    audioAttachment?: any,
    fileAttachment?: any,
    tags?: string[]
  ) => {
    if (!currentUser) return;
    const updated = editPost(postId, currentUser.id, {
      content,
      mediaType,
      images,
      videoUrl,
      audioAttachment,
      fileAttachment,
      tags,
    });

    if (updated) {
      setPosts(getStoredPosts());
      showToast('Post updated instantly for all users!');
    }
  };

  const handleDeletePost = (postId: string) => {
    if (!currentUser) return;
    const ok = deletePost(postId, currentUser.id);
    if (ok) {
      setPosts(getStoredPosts());
      showToast('Post deleted for all users.');
    }
  };

  const handleReact = (postId: string, type: ReactionType) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      showToast('Please sign in or create an account to react to posts!');
      return;
    }
    const updated = toggleReaction(postId, currentUser.id, currentUser.displayName, type);
    setPosts(updated);
  };

  const handleAddComment = (
    postId: string,
    content: string,
    parentCommentId?: string,
    audioAttachment?: AudioAttachment
  ) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      showToast('Please sign in or create an account to comment!');
      return;
    }
    const updated = addComment(postId, currentUser, content, parentCommentId, audioAttachment);
    setPosts(updated);
    showToast('Comment added!');
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    if (!currentUser) return;
    const updated = deleteComment(postId, commentId, currentUser.id);
    setPosts(updated);
    showToast('Comment deleted.');
  };

  const handleSharePost = (postId: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      showToast('Please sign in or create an account to share posts!');
      return;
    }
    const updated = sharePostToFeed(postId, currentUser);
    setPosts(updated);
    showToast('Publication partagée dans le fil public avec tous les utilisateurs ! 🎉');
  };

  const handleDeleteAccount = () => {
    if (!currentUser) return;
    const userId = currentUser.id;
    deleteAccount(userId);
    setCurrentUserParams(null);
    showToast('Votre compte a été supprimé définitivement.');
    setActiveTab('feed');
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q.trim().length >= 2 && currentUser) {
      const updated = addSearchToHistory(currentUser.id, q);
      if (updated) {
        setCurrentUserParams(updated);
      }
    }
  };

  const handleClearSearchHistory = () => {
    if (!currentUser) return;
    const updated = clearSearchHistory(currentUser.id);
    if (updated) {
      setCurrentUserParams(updated);
      showToast('Search history cleared.');
    }
  };

  const handleSelectSearchQuery = (q: string) => {
    setSearchQuery(q);
    setActiveTab('feed');
    showToast(`Filtering feed for "${q}"`);
  };

  const handleShuffleFeed = () => {
    setShuffleSeed((prev) => prev + 1);
    setFeedSortMode('random');
    showToast('Feed shuffled randomly like Facebook!');
  };

  const postOfTheDay = getPostOfTheDay(posts);

  // Filter, Search & Facebook Algorithmic/Randomized Feed Sorting
  const getOrderedPosts = (postList: Post[]) => {
    const filtered = postList.filter((p) => {
      if (feedFilter !== 'all' && p.mediaType !== feedFilter) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchContent = p.content.toLowerCase().includes(q);
      const matchAuthor =
        p.author.displayName.toLowerCase().includes(q) ||
        p.author.username.toLowerCase().includes(q);
      const matchTag = p.tags?.some((t) => t.toLowerCase().includes(q));
      return matchContent || matchAuthor || matchTag;
    });

    if (feedSortMode === 'latest') {
      return [...filtered].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    if (feedSortMode === 'random') {
      return [...filtered].sort((a, b) => {
        const hashA =
          (a.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + shuffleSeed * 31) %
          100;
        const hashB =
          (b.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + shuffleSeed * 31) %
          100;
        return hashA - hashB;
      });
    }

    // Default 'facebook' dynamic algorithmic feed
    const now = Date.now();
    return [...filtered].sort((a, b) => {
      const ageA = now - new Date(a.createdAt).getTime();
      const ageB = now - new Date(b.createdAt).getTime();

      // Posts under 15 minutes old get instant priority at top
      const freshBoostA = ageA < 15 * 60 * 1000 ? 500 : 0;
      const freshBoostB = ageB < 15 * 60 * 1000 ? 500 : 0;

      const scoreA =
        freshBoostA +
        a.reactions.length * 3 +
        a.comments.length * 4 +
        a.stats.sharesCount * 5 +
        a.stats.viewsCount * 0.1;
      const scoreB =
        freshBoostB +
        b.reactions.length * 3 +
        b.comments.length * 4 +
        b.stats.sharesCount * 5 +
        b.stats.viewsCount * 0.1;

      return scoreB - scoreA;
    });
  };

  const filteredPosts = getOrderedPosts(posts);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Navigation Top Header */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCreatePost={() => {
          if (!currentUser) {
            setIsAuthOpen(true);
            showToast('Please sign in or create an account to publish a post.');
            return;
          }
          setIsCreatePostOpen(true);
        }}
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        onLogout={() => {
          setIsAuthOpen(true);
          showToast('Signed out. Please sign in or create an account.');
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-red-500/80 text-white px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <div className="space-y-4">
            {/* Inline Composer Card */}
            <CreatePostCard
              currentUser={currentUser}
              onOpenModal={() => {
                if (!currentUser) {
                  setIsAuthOpen(true);
                  showToast('Please sign in or create an account to publish a post.');
                  return;
                }
                setIsCreatePostOpen(true);
              }}
            />

            {/* Post of the Day Highlight Banner */}
            <PostOfTheDayBanner
              post={postOfTheDay}
              currentUser={currentUser}
              onReact={handleReact}
              onViewComments={(postId) => {
                setActiveTab('feed');
              }}
            />

            {/* Facebook Feed Algorithm & Shuffle Selector Bar */}
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setFeedSortMode('facebook')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    feedSortMode === 'facebook'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-blue-300" />
                  <span>Facebook Feed</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFeedSortMode('latest')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    feedSortMode === 'latest'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-rose-300" />
                  <span>Latest First</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleShuffleFeed}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-md transition-transform hover:scale-105 active:scale-95 ml-auto"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Shuffle Feed 🎲</span>
              </button>
            </div>

            {/* Media Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
              <button
                onClick={() => setFeedFilter('all')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 ${
                  feedFilter === 'all'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> All Feed
              </button>

              <button
                onClick={() => setFeedFilter('image')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 ${
                  feedFilter === 'image'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Photos
              </button>

              <button
                onClick={() => setFeedFilter('video')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 ${
                  feedFilter === 'video'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Video className="w-3.5 h-3.5" /> Videos
              </button>

              <button
                onClick={() => setFeedFilter('audio')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 ${
                  feedFilter === 'audio'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Mic className="w-3.5 h-3.5" /> Voice Notes
              </button>

              <button
                onClick={() => setFeedFilter('file')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 ${
                  feedFilter === 'file'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Files
              </button>
            </div>

            {/* Posts List */}
            {filteredPosts.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 my-6">
                <p className="text-base font-bold text-slate-300">No posts found</p>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search query or publish a new post!
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onReact={handleReact}
                  onAddComment={handleAddComment}
                  onDeletePost={handleDeletePost}
                  onEditPost={handleOpenEditPost}
                  onDeleteComment={handleDeleteComment}
                  onSharePost={handleSharePost}
                />
              ))
            )}
          </div>
        )}

        {/* POST OF THE DAY TAB */}
        {activeTab === 'post-of-the-day' && (
          <div className="space-y-6">
            <div className="text-center py-4 border-b border-slate-800">
              <h2 className="text-2xl font-black text-amber-400 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6" /> Post of the Day Hall of Fame
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Selected dynamically based on community reactions, shares, and comments
              </p>
            </div>

            <PostOfTheDayBanner
              post={postOfTheDay}
              currentUser={currentUser}
              onReact={handleReact}
              onViewComments={() => setActiveTab('feed')}
            />

            {postOfTheDay && (
              <PostCard
                post={postOfTheDay}
                currentUser={currentUser}
                onReact={handleReact}
                onAddComment={handleAddComment}
                onDeletePost={handleDeletePost}
                onEditPost={handleOpenEditPost}
                onDeleteComment={handleDeleteComment}
                onSharePost={handleSharePost}
              />
            )}
          </div>
        )}

        {/* EXPLORE / TRENDING TAB */}
        {activeTab === 'explore' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/50 p-6 rounded-3xl shadow-xl">
              <h2 className="text-xl font-black text-purple-200 flex items-center gap-2">
                <Flame className="w-6 h-6 text-purple-400 fill-purple-400" /> Trending Topics & Media
              </h2>
              <p className="text-xs text-purple-300/80 mt-1">
                Discover popular media posts from creators around the world
              </p>
            </div>

            {posts
              .filter((p) => p.reactions.length > 0 || p.mediaType !== 'text')
              .map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onReact={handleReact}
                  onAddComment={handleAddComment}
                  onDeletePost={handleDeletePost}
                  onEditPost={handleOpenEditPost}
                  onDeleteComment={handleDeleteComment}
                  onSharePost={handleSharePost}
                />
              ))}
          </div>
        )}

        {/* CHAT ZONE TAB */}
        {activeTab === 'chat-zone' && <ChatZoneView />}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            onUpdateProfile={handleUpdateUser}
            posts={posts}
            onReact={handleReact}
            onAddComment={handleAddComment}
            onDeletePost={handleDeletePost}
            onEditPost={handleOpenEditPost}
            onDeleteComment={handleDeleteComment}
            onClearSearchHistory={handleClearSearchHistory}
            onSelectSearchQuery={handleSelectSearchQuery}
            onDeleteAccount={handleDeleteAccount}
          />
        )}

        {/* CREATOR ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <AnalyticsView currentUser={currentUser} posts={posts} />
        )}
      </main>

      {/* Floating Plus Button for Mobile */}
      <button
        onClick={() => {
          if (!currentUser) {
            setIsAuthOpen(true);
            showToast('Please sign in or create an account to publish a post.');
            return;
          }
          setIsCreatePostOpen(true);
        }}
        className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-gradient-to-tr from-red-600 to-rose-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-600/50 z-40 hover:scale-110 active:scale-95 transition-transform"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Create Post Modal */}
      <CreatePostModal
        currentUser={currentUser}
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSubmitPost={handleCreatePostSubmit}
      />

      {/* Edit Post Modal */}
      <EditPostModal
        post={editingPost}
        currentUser={currentUser}
        isOpen={isEditPostOpen}
        onClose={() => {
          setIsEditPostOpen(false);
          setEditingPost(null);
        }}
        onSubmitEdit={handleEditPostSubmit}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUserParams(user);
          setCurrentUser(user);
          showToast(`Welcome, ${user.displayName}!`);
        }}
      />
    </div>
  );
}
