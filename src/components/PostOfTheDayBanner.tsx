import React from 'react';
import { Post, User, ReactionType } from '../types';
import { Trophy, Flame, Sparkles, Heart, MessageCircle } from 'lucide-react';
import { ReactionPicker } from './ReactionPicker';

interface PostOfTheDayProps {
  post: Post | null;
  currentUser: User | null;
  onReact: (postId: string, type: ReactionType) => void;
  onViewComments: (postId: string) => void;
}

export const PostOfTheDayBanner: React.FC<PostOfTheDayProps> = ({
  post,
  currentUser,
  onReact,
  onViewComments,
}) => {
  const [showReactionPicker, setShowReactionPicker] = React.useState(false);

  if (!post) return null;

  const userReaction = currentUser
    ? post.reactions.find((r) => r.userId === currentUser.id)
    : null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/90 via-slate-900 to-red-950/90 border-2 border-amber-500/50 p-5 shadow-2xl my-4 text-white group">
      {/* Shining background accent */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Trophy Header */}
      <div className="flex items-center justify-between mb-3 border-b border-amber-500/30 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/40 text-amber-300 animate-bounce">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-amber-300 uppercase">
                Post of the Day
              </span>
              <span className="flex items-center gap-1 text-[10px] bg-red-600/30 text-rose-300 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                <Flame className="w-3 h-3 text-red-400 fill-red-400" /> Top Rated
              </span>
            </div>
            <p className="text-[11px] text-amber-100/70">
              Highest community engagement & reactions today!
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono bg-black/40 border border-amber-500/30 px-3 py-1 rounded-full text-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Daily Top
        </div>
      </div>

      {/* Post Content Snippet */}
      <div className="flex items-start gap-3 my-3">
        <img
          src={post.author.avatarUrl}
          alt={post.author.displayName}
          className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow-md shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white truncate">{post.author.displayName}</h4>
            <span className="text-xs text-amber-200/70">@{post.author.username}</span>
          </div>
          <p className="text-sm text-amber-50/90 font-medium mt-1 line-clamp-3 leading-relaxed">
            "{post.content}"
          </p>
        </div>
      </div>

      {/* Image Preview if applicable */}
      {post.images && post.images.length > 0 && (
        <div className="my-3 rounded-2xl overflow-hidden max-h-48 border border-amber-500/30">
          <img
            src={post.images[0]}
            alt="Post of the day"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-amber-500/20 text-xs">
        <div className="flex items-center gap-2">
          {/* Reaction Button */}
          <div className="relative">
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all ${
                userReaction
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                  : 'bg-black/40 text-amber-200 hover:bg-amber-500/20 border border-amber-500/30'
              }`}
            >
              <Heart className={`w-4 h-4 ${userReaction ? 'fill-slate-950' : ''}`} />
              <span>{post.reactions.length} Reactions</span>
            </button>
          </div>

          <button
            onClick={() => onViewComments(post.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium bg-black/30 hover:bg-black/50 text-amber-100 border border-amber-500/20 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-amber-300" />
            <span>{post.comments.length} Comments</span>
          </button>
        </div>

        <span className="text-[10px] text-amber-300/80 font-mono">
          🏆 #{post.id.slice(-4)} Winner
        </span>
      </div>
    </div>
  );
};
