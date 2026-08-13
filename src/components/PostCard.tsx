import React, { useState, useRef } from 'react';
import { Post, User, ReactionType, REACTION_CONFIG, Comment, AudioAttachment } from '../types';
import {
  Heart,
  MessageCircle,
  Share2,
  BarChart3,
  Trash2,
  Play,
  Pause,
  Download,
  FileText,
  Send,
  MoreVertical,
  Volume2,
  CheckCircle,
  CornerDownRight,
  Sparkles,
  Edit3,
  Mic,
  X,
  Search,
} from 'lucide-react';
import { ReactionPicker } from './ReactionPicker';
import { PostStatsModal } from './PostStatsModal';
import { VoiceRecorder } from './VoiceRecorder';
import { getStoredUsers } from '../utils/storage';

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  onReact: (postId: string, type: ReactionType) => void;
  onAddComment: (
    postId: string,
    content: string,
    parentCommentId?: string,
    audioAttachment?: AudioAttachment
  ) => void;
  onDeletePost: (postId: string) => void;
  onEditPost?: (post: Post) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onSharePost?: (postId: string) => void;
}

const CommentAudioPlayer: React.FC<{ audio: AudioAttachment }> = ({ audio }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audio.url);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="mt-1.5 bg-red-950/40 border border-red-800/40 rounded-xl p-2 flex items-center gap-2 max-w-xs">
      <button
        type="button"
        onClick={toggle}
        className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shrink-0 shadow-sm"
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>
      <div className="flex-1 flex items-center gap-1 h-4">
        {(audio.waveform || [30, 60, 90, 40, 80, 50, 70, 40]).map((h, idx) => (
          <div
            key={idx}
            className={`flex-1 rounded-full transition-all ${
              isPlaying ? 'bg-red-400 animate-pulse' : 'bg-slate-700'
            }`}
            style={{ height: `${Math.max(6, (h / 100) * 16)}px` }}
          />
        ))}
      </div>
      <span className="text-[10px] text-slate-300 font-mono font-medium">{audio.duration}s</span>
    </div>
  );
};

const ReactorsModal: React.FC<{
  reactions: any[];
  onClose: () => void;
}> = ({ reactions, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const storedUsers = getStoredUsers();

  const filteredReactions = reactions.filter((r) => {
    if (selectedFilter !== 'all' && r.type !== selectedFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.userName.toLowerCase().includes(q) ||
      r.userId.toLowerCase().includes(q)
    );
  });

  const availableTypes = Array.from(new Set(reactions.map((r) => r.type)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-white flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-950/80 rounded-xl border border-red-800/80 text-red-400">
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Reactions & Likes</h3>
              <p className="text-[11px] text-slate-400">
                {reactions.length} {reactions.length === 1 ? 'person reacted' : 'people reacted'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full text-xs font-bold transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search input box */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people who reacted..."
              className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Reaction filter buttons */}
          {availableTypes.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-[11px]">
              <button
                type="button"
                onClick={() => setSelectedFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-red-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All ({reactions.length})
              </button>
              {availableTypes.map((type) => {
                const conf = REACTION_CONFIG.find((c) => c.type === type);
                const count = reactions.filter((r) => r.type === type).length;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedFilter(type)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all ${
                      selectedFilter === type
                        ? 'bg-red-600 text-white shadow'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{conf?.emoji || '❤️'}</span>
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Users list */}
        <div className="p-3 overflow-y-auto space-y-2 flex-1">
          {filteredReactions.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <p>No user found matching "{searchQuery}"</p>
            </div>
          ) : (
            filteredReactions.map((r, idx) => {
              const conf = REACTION_CONFIG.find((c) => c.type === r.type);
              const matchedUser = storedUsers.find(
                (u) => u.id === r.userId || u.displayName.toLowerCase() === r.userName.toLowerCase()
              );
              const avatar =
                matchedUser?.avatarUrl ||
                `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;
              const handle = matchedUser?.username ? `@${matchedUser.username}` : '@member';

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={avatar}
                        alt={r.userName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <span className="absolute -bottom-1 -right-1 text-xs bg-slate-900 rounded-full p-0.5 border border-slate-700 shadow-sm">
                        {conf?.emoji || '❤️'}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-100 flex items-center gap-1">
                        {r.userName}
                      </p>
                      <p className="text-[10px] text-slate-400">{handle}</p>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 font-medium px-2 py-1 bg-slate-800/80 border border-slate-700/80 rounded-lg">
                    {conf?.label || r.type}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onReact,
  onAddComment,
  onDeletePost,
  onEditPost,
  onDeleteComment,
  onSharePost,
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showReactorsModal, setShowReactorsModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [commentAudio, setCommentAudio] = useState<AudioAttachment | undefined>();
  const [showCommentRecorder, setShowCommentRecorder] = useState(false);
  const [replyToCommentId, setReplyToCommentId] = useState<string | undefined>();
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDeleteState, setConfirmDeleteState] = useState(false);

  const longPressTimerRef = useRef<any>(null);

  const handleTouchStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      setShowReactorsModal(true);
    }, 400);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  // Audio Playback State for Voice Note Posts
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isCreator = currentUser ? currentUser.id === post.author.id : false;
  const userReaction = currentUser ? post.reactions.find((r) => r.userId === currentUser.id) : undefined;

  const toggleAudio = () => {
    if (!post.audioAttachment?.url) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(post.audioAttachment.url);
      audioRef.current.onended = () => setIsPlayingAudio(false);
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleShare = () => {
    if (onSharePost) {
      onSharePost(post.id);
    } else {
      if (navigator.share) {
        navigator.share({
          title: `Post by ${post.author.displayName}`,
          text: post.content,
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Post link copied to clipboard!');
      }
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() && !commentAudio) return;
    onAddComment(post.id, commentInput.trim(), replyToCommentId, commentAudio);
    setCommentInput('');
    setCommentAudio(undefined);
    setShowCommentRecorder(false);
    setReplyToCommentId(undefined);
  };

  // Organize comments into parent and threaded replies
  const parentComments = post.comments.filter((c) => !c.parentCommentId);
  const getReplies = (parentId: string) => post.comments.filter((c) => c.parentCommentId === parentId);

  // Reaction Summary Emojis
  const reactionCounts: Record<string, number> = {};
  post.reactions.forEach((r) => {
    reactionCounts[r.type] = (reactionCounts[r.type] || 0) + 1;
  });
  const topReactionTypes = Object.keys(reactionCounts).slice(0, 3) as ReactionType[];

  const formatTimestamp = (isoDate: string) => {
    const diff = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(isoDate).toLocaleDateString();
  };

  return (
    <article className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl my-4 text-white relative transition-all hover:border-slate-700/80">
      {/* Shared Post Banner */}
      {post.sharedBy && (
        <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-800/80 text-xs text-red-400 font-bold bg-red-950/40 px-3 py-1.5 rounded-2xl border border-red-900/40">
          <Share2 className="w-3.5 h-3.5 shrink-0 text-red-400 animate-pulse" />
          <span>Partagé par {post.sharedBy.displayName} (@{post.sharedBy.username}) avec toute la communauté</span>
        </div>
      )}

      {/* Creator Analytics Modal */}
      <PostStatsModal
        post={post}
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
      />

      {/* Post Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatarUrl}
            alt={post.author.displayName}
            className="w-11 h-11 rounded-full object-cover border-2 border-red-500 shadow-sm shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-white">{post.author.displayName}</h3>
              {isCreator && (
                <span className="bg-red-600/30 text-rose-300 border border-red-500/30 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                  Creator
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>@{post.author.username}</span>
              <span>•</span>
              <span>{formatTimestamp(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Options / Delete Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-30 text-xs">
              {isCreator ? (
                <>
                  {onEditPost && (
                    <button
                      onClick={() => {
                        onEditPost(post);
                        setShowMenu(false);
                        setConfirmDeleteState(false);
                      }}
                      className="w-full text-left p-2 rounded-lg text-slate-200 hover:bg-slate-800 flex items-center gap-2 font-semibold transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-amber-400" /> Edit Post
                    </button>
                  )}

                  {!confirmDeleteState ? (
                    <button
                      onClick={() => setConfirmDeleteState(true)}
                      className="w-full text-left p-2 rounded-lg text-red-400 hover:bg-red-950/50 flex items-center gap-2 font-semibold transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Post
                    </button>
                  ) : (
                    <div className="p-2 bg-red-950/80 border border-red-800/80 rounded-lg space-y-1.5">
                      <p className="text-[11px] font-bold text-rose-200">Delete this post?</p>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            onDeletePost(post.id);
                            setShowMenu(false);
                            setConfirmDeleteState(false);
                          }}
                          className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded-md shadow transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteState(false)}
                          className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => {
                    alert('Post reported to moderators.');
                    setShowMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-lg text-slate-300 hover:bg-slate-800"
                >
                  Report Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content Text */}
      {post.content && (
        <p className="text-sm text-slate-100 font-normal leading-relaxed mb-3 whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      {/* Embedded Original Post (Facebook Style) */}
      {post.originalPost ? (
        <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4 my-3 text-left space-y-2 relative hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2.5 mb-2">
            <img
              src={post.originalPost.author.avatarUrl}
              alt={post.originalPost.author.displayName}
              className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white">{post.originalPost.author.displayName}</h4>
                <span className="text-[10px] text-slate-400">@{post.originalPost.author.username}</span>
              </div>
              <p className="text-[10px] text-slate-500">{formatTimestamp(post.originalPost.createdAt)}</p>
            </div>
          </div>

          {post.originalPost.content && (
            <p className="text-xs text-slate-200 font-normal leading-relaxed whitespace-pre-wrap">
              {post.originalPost.content}
            </p>
          )}

          {post.originalPost.images && post.originalPost.images.length > 0 && (
            <div className={`grid gap-1.5 mt-2 rounded-xl overflow-hidden border border-slate-800 ${post.originalPost.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {post.originalPost.images.map((img, idx) => (
                <img key={idx} src={img} alt="Shared attachment" className="w-full h-auto max-h-72 object-cover" />
              ))}
            </div>
          )}

          {post.originalPost.videoUrl && (
            <div className="mt-2 rounded-xl overflow-hidden border border-slate-800 bg-black">
              <video src={post.originalPost.videoUrl} controls className="w-full max-h-72" />
            </div>
          )}

          {post.originalPost.audioAttachment && (
            <div className="mt-2 p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3 text-xs text-amber-300 font-semibold">
              <Volume2 className="w-4 h-4 text-red-400 shrink-0" />
              <span>Message vocal ({post.originalPost.audioAttachment.duration}s)</span>
            </div>
          )}

          {post.originalPost.fileAttachment && (
            <div className="mt-2 p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs text-sky-300 font-semibold">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="truncate">{post.originalPost.fileAttachment.name}</span>
              </div>
              <span className="text-[10px] text-slate-400">{post.originalPost.fileAttachment.size}</span>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Media Type: Image Gallery */}
          {post.images && post.images.length > 0 && (
            <div
              className={`grid gap-2 mb-3 rounded-2xl overflow-hidden border border-slate-800 ${
                post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
              }`}
            >
              {post.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Post attachment"
                  className="w-full h-auto max-h-96 object-cover hover:scale-102 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
          )}

          {/* Media Type: Video */}
          {post.videoUrl && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-slate-800 bg-black">
              <video src={post.videoUrl} controls className="w-full max-h-96" />
            </div>
          )}

          {/* Media Type: Voice Note Audio Player */}
          {post.audioAttachment && (
            <div className="mb-3 bg-gradient-to-r from-red-950/60 via-slate-800 to-slate-900 border border-red-800/50 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-inner">
              <button
                onClick={toggleAudio}
                className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-600/30 transition-transform hover:scale-105"
              >
                {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-rose-200 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-red-400" /> Voice Recording
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {post.audioAttachment.duration}s
                  </span>
                </div>
                <div className="flex items-center gap-1 h-5">
                  {(
                    post.audioAttachment.waveform || [
                      20, 40, 60, 80, 50, 90, 30, 70, 85, 45, 95, 65, 35, 75,
                    ]
                  ).map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all ${
                        isPlayingAudio ? 'bg-red-500 animate-pulse' : 'bg-slate-700'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Media Type: Document File Attachment */}
          {post.fileAttachment && (
            <div className="mb-3 bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 truncate">
                <div className="p-2.5 bg-purple-600/20 rounded-xl border border-purple-500/30 text-purple-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="font-bold text-xs text-slate-200 truncate">{post.fileAttachment.name}</p>
                  <p className="text-[10px] text-slate-400">{post.fileAttachment.size}</p>
                </div>
              </div>
              <a
                href={post.fileAttachment.url}
                download={post.fileAttachment.name}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </a>
            </div>
          )}
        </>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((t, idx) => (
            <span
              key={idx}
              className="text-[10px] font-semibold text-red-400 bg-red-950/40 px-2 py-0.5 rounded-full border border-red-900/50"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Reactions Bar & Counter Row */}
      <div className="flex items-center justify-between text-xs text-slate-400 py-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => setShowReactorsModal(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group text-left"
          title="Click or press and hold to view users who liked / reacted"
        >
          {topReactionTypes.length > 0 && (
            <div className="flex -space-x-1">
              {topReactionTypes.map((t) => {
                const conf = REACTION_CONFIG.find((c) => c.type === t);
                return (
                  <span
                    key={t}
                    className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs group-hover:scale-110 transition-transform"
                  >
                    {conf?.emoji || '❤️'}
                  </span>
                );
              })}
            </div>
          )}
          <span className="font-bold text-slate-200 underline decoration-slate-700/80 underline-offset-2 group-hover:text-red-400 group-hover:decoration-red-400 transition-colors">
            {post.reactions.length}{' '}
            {post.reactions.length === 1 ? 'like / reaction' : 'likes / reactions'}
          </span>
        </button>

        <div className="flex items-center gap-3">
          <span>{post.comments.length} comments</span>
          <span>{post.stats.sharesCount} shares</span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 relative">
        {/* Reaction Button */}
        <div className="relative flex-1">
          {showReactionPicker && (
            <ReactionPicker
              onSelectReaction={(type) => onReact(post.id, type)}
              onClose={() => setShowReactionPicker(false)}
            />
          )}

          <button
            onClick={() => onReact(post.id, userReaction ? userReaction.type : 'heart')}
            onContextMenu={(e) => {
              e.preventDefault();
              setShowReactionPicker(!showReactionPicker);
            }}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              userReaction
                ? 'bg-red-950/60 text-red-400 border border-red-800/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${userReaction ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{userReaction ? userReaction.type.toUpperCase() : 'React'}</span>
          </button>
        </div>

        {/* Comment Toggle Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>

        {/* Creator-Only Analytics Button */}
        {isCreator && (
          <button
            onClick={() => setShowStatsModal(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 border border-amber-500/30 transition-colors shadow-sm"
            title="View private creator statistics"
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Stats</span>
          </button>
        )}
      </div>

      {/* Expandable Comment Section */}
      {showComments && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3 animate-fadeIn">
          {/* Voice Comment Recording Studio */}
          {showCommentRecorder && (
            <VoiceRecorder
              onAudioRecorded={(audio) => {
                setCommentAudio(audio);
                setShowCommentRecorder(false);
              }}
              onCancel={() => setShowCommentRecorder(false)}
            />
          )}

          {/* Comment Audio Preview */}
          {commentAudio && !showCommentRecorder && (
            <div className="bg-red-950/40 border border-red-800/60 p-2.5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-red-400" />
                <span className="text-xs font-semibold text-rose-200">
                  Voice comment attached ({commentAudio.duration}s)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCommentAudio(undefined)}
                className="text-slate-400 hover:text-red-400 p-1"
                title="Remove Voice Note"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Add Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2 items-center">
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.displayName || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-red-500 shrink-0"
            />
            <input
              type="text"
              placeholder={
                replyToCommentId
                  ? 'Replying to comment...'
                  : 'Write a comment...'
              }
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700/80 rounded-full px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />

            {/* Voice Comment Button */}
            <button
              type="button"
              onClick={() => setShowCommentRecorder(!showCommentRecorder)}
              className={`p-2 rounded-full transition-colors ${
                showCommentRecorder || commentAudio
                  ? 'bg-red-900/60 text-red-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Record Voice Comment"
            >
              <Mic className="w-3.5 h-3.5 text-red-400" />
            </button>

            {replyToCommentId && (
              <button
                type="button"
                onClick={() => setReplyToCommentId(undefined)}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Cancel Reply
              </button>
            )}
            <button
              type="submit"
              className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-full transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* List of Comments & Threaded Replies */}
          <div className="space-y-3 pt-2">
            {parentComments.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-2 italic">
                Be the first to comment on this post!
              </p>
            ) : (
              parentComments.map((comment) => {
                const replies = getReplies(comment.id);
                const isCommentAuthor = currentUser
                  ? currentUser.id === comment.author.id ||
                    (currentUser.username && currentUser.username === comment.author.username) ||
                    currentUser.id === post.author.id ||
                    (currentUser.username && currentUser.username === post.author.username)
                  : false;

                return (
                  <div key={comment.id} className="space-y-2">
                    {/* Parent Comment */}
                    <div className="flex gap-2 text-xs">
                      <img
                        src={comment.author.avatarUrl}
                        alt={comment.author.displayName}
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="flex-1 bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/60">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{comment.author.displayName}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500">
                              {formatTimestamp(comment.createdAt)}
                            </span>
                            {isCommentAuthor && onDeleteComment && (
                              <button
                                type="button"
                                onClick={() => onDeleteComment(post.id, comment.id)}
                                className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors"
                                title="Delete comment"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        {comment.content && <p className="text-slate-300 mt-1">{comment.content}</p>}
                        {comment.audioAttachment && (
                          <CommentAudioPlayer audio={comment.audioAttachment} />
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setReplyToCommentId(comment.id);
                            setCommentInput(`@${comment.author.displayName} `);
                          }}
                          className="text-[10px] text-red-400 font-bold mt-1.5 flex items-center gap-1 hover:underline"
                        >
                          <CornerDownRight className="w-3 h-3" /> Reply
                        </button>
                      </div>
                    </div>

                    {/* Threaded Replies */}
                    {replies.map((reply) => {
                      const isReplyAuthor = currentUser
                        ? currentUser.id === reply.author.id ||
                          (currentUser.username && currentUser.username === reply.author.username) ||
                          currentUser.id === post.author.id ||
                          (currentUser.username && currentUser.username === post.author.username)
                        : false;

                      return (
                        <div key={reply.id} className="flex gap-2 text-xs pl-8">
                          <img
                            src={reply.author.avatarUrl}
                            alt={reply.author.displayName}
                            className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                          />
                          <div className="flex-1 bg-slate-800/40 p-2 rounded-2xl border border-slate-700/40">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-rose-300">{reply.author.displayName}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500">
                                  {formatTimestamp(reply.createdAt)}
                                </span>
                                {isReplyAuthor && onDeleteComment && (
                                  <button
                                    type="button"
                                    onClick={() => onDeleteComment(post.id, reply.id)}
                                    className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors"
                                    title="Delete reply"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                            {reply.content && <p className="text-slate-300 mt-0.5">{reply.content}</p>}
                            {reply.audioAttachment && (
                              <CommentAudioPlayer audio={reply.audioAttachment} />
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setReplyToCommentId(comment.id);
                                setCommentInput(`@${reply.author.displayName} `);
                              }}
                              className="text-[10px] text-red-400 font-bold mt-1 flex items-center gap-1 hover:underline"
                            >
                              <CornerDownRight className="w-3 h-3" /> Reply
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {showStatsModal && (
        <PostStatsModal post={post} onClose={() => setShowStatsModal(false)} />
      )}

      {showReactorsModal && (
        <ReactorsModal
          reactions={post.reactions}
          onClose={() => setShowReactorsModal(false)}
        />
      )}
    </article>
  );
};
