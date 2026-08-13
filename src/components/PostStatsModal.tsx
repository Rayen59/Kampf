import React from 'react';
import { Post, REACTION_CONFIG } from '../types';
import { Eye, Share2, MessageCircle, BarChart3, TrendingUp, Sparkles, Heart } from 'lucide-react';

interface PostStatsModalProps {
  post: Post;
  isOpen?: boolean;
  onClose: () => void;
}

export const PostStatsModal: React.FC<PostStatsModalProps> = ({ post, isOpen = true, onClose }) => {
  if (!isOpen) return null;

  // Calculate reaction breakdown
  const reactionCounts: Record<string, number> = {};
  post.reactions.forEach((r) => {
    reactionCounts[r.type] = (reactionCounts[r.type] || 0) + 1;
  });

  const totalReactions = post.reactions.length;
  const views = Math.max(1, post.stats.viewsCount);
  const engagement = Number((((totalReactions + post.comments.length) / views) * 100).toFixed(1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-white relative">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/10 rounded-xl border border-white/20">
              <BarChart3 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-none">Creator Post Analytics</h3>
              <p className="text-xs text-rose-100/90 mt-0.5">Private stats visible only to you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-all"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Key Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl flex flex-col items-center text-center">
              <Eye className="w-5 h-5 text-blue-400 mb-1" />
              <span className="text-xl font-black text-white">{post.stats.viewsCount}</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Views</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl flex flex-col items-center text-center">
              <Heart className="w-5 h-5 text-pink-500 mb-1" />
              <span className="text-xl font-black text-white">{totalReactions}</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Reactions</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl flex flex-col items-center text-center">
              <MessageCircle className="w-5 h-5 text-emerald-400 mb-1" />
              <span className="text-xl font-black text-white">{post.comments.length}</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Comments</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl flex flex-col items-center text-center">
              <Share2 className="w-5 h-5 text-purple-400 mb-1" />
              <span className="text-xl font-black text-white">{post.stats.sharesCount}</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Shares</span>
            </div>
          </div>

          {/* Engagement Rate Bar */}
          <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" /> Engagement Rate
              </span>
              <span className="text-sm font-black text-amber-400">{engagement}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 via-rose-500 to-red-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, engagement * 4)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Calculated based on total reactions, comments, and post view impressions.
            </p>
          </div>

          {/* Reaction Breakdown */}
          <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-red-400" /> Reaction Breakdown
            </h4>

            {totalReactions === 0 ? (
              <p className="text-xs text-slate-400 py-2 text-center italic">
                No reactions yet on this post.
              </p>
            ) : (
              <div className="space-y-2">
                {REACTION_CONFIG.map((config) => {
                  const count = reactionCounts[config.type] || 0;
                  if (count === 0) return null;
                  const pct = Math.round((count / totalReactions) * 100);

                  return (
                    <div key={config.type} className="flex items-center gap-3 text-xs">
                      <span className="text-lg w-6 text-center">{config.emoji}</span>
                      <span className="font-semibold text-slate-300 w-16">{config.label}</span>
                      <div className="flex-1 bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-red-500 h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-slate-400 font-mono w-10 text-right">
                        {count} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Post Snippet Preview */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-400">
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Target Post Preview:</p>
            <p className="text-slate-200 italic line-clamp-2">"{post.content}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};
