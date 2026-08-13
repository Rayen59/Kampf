import React from 'react';
import { User, Post, REACTION_CONFIG } from '../types';
import {
  BarChart3,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Award,
  Sparkles,
  Flame,
} from 'lucide-react';

interface AnalyticsViewProps {
  currentUser: User;
  posts: Post[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ currentUser, posts }) => {
  const myPosts = posts.filter((p) => p.author.id === currentUser.id);

  const totalViews = myPosts.reduce((acc, p) => acc + p.stats.viewsCount, 0);
  const totalReactions = myPosts.reduce((acc, p) => acc + p.reactions.length, 0);
  const totalComments = myPosts.reduce((acc, p) => acc + p.comments.length, 0);
  const totalShares = myPosts.reduce((acc, p) => acc + p.stats.sharesCount, 0);

  const avgEngagement =
    totalViews > 0
      ? Number((((totalReactions + totalComments) / totalViews) * 100).toFixed(1))
      : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-white pb-12 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30 text-amber-300">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Creator Dashboard</h2>
            <p className="text-xs text-amber-200">
              Overview for @{currentUser.username} • Mein Kampf Social Analytics
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
          <Eye className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <p className="text-2xl font-black text-white">{totalViews}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Views</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
          <Heart className="w-5 h-5 text-pink-500 mx-auto mb-1" />
          <p className="text-2xl font-black text-white">{totalReactions}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Reactions Received</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
          <MessageCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <p className="text-2xl font-black text-white">{totalComments}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Comments</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
          <Share2 className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <p className="text-2xl font-black text-white">{totalShares}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Shares</p>
        </div>
      </div>

      {/* Average Engagement Gauge */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" /> Average Channel Engagement
          </span>
          <span className="text-lg font-black text-amber-400">{avgEngagement}%</span>
        </div>
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-amber-500 via-rose-500 to-red-500 h-full rounded-full"
            style={{ width: `${Math.min(100, avgEngagement * 3)}%` }}
          />
        </div>
      </div>

      {/* Top Performing Publications */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Award className="w-4 h-4 text-red-400" /> Publications Performance Breakdown
        </h3>

        {myPosts.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">
            You haven't published any posts yet.
          </p>
        ) : (
          <div className="space-y-3">
            {myPosts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-2xl flex items-center justify-between text-xs"
              >
                <div className="flex-1 pr-4 truncate">
                  <p className="font-semibold text-slate-200 truncate">
                    {post.content || '[Media Post]'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    {post.mediaType.toUpperCase()} • {post.reactions.length} reactions • {post.comments.length} comments
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-amber-400">
                    {post.stats.viewsCount} views
                  </span>
                  <p className="text-[10px] text-slate-400">{post.stats.engagementRate}% rate</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
