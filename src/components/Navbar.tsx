import React, { useState } from 'react';
import { User, ActiveTab } from '../types';
import {
  Sparkles,
  MessageSquareCode,
  Trophy,
  User as UserIcon,
  Search,
  ExternalLink,
  LogIn,
  LogOut,
  Flame,
  Home,
  BarChart3,
  PlusCircle,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuth: () => void;
  onOpenCreatePost: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenCreatePost,
  searchQuery,
  setSearchQuery,
  onLogout,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-5xl mx-auto px-4">
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo */}
          <button
            onClick={() => setActiveTab('feed')}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30 border border-white/20">
              <Sparkles className="w-6 h-6 text-amber-200 animate-pulse" />
            </div>
            <div className="text-left hidden sm:block">
              <h1 className="font-black text-xl tracking-tight text-white leading-none">
                Mein Kampf
              </h1>
              <span className="text-[10px] font-bold text-red-400 tracking-wider uppercase">
                Social Hub
              </span>
            </div>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search posts, media, or creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Create Post Quick Button */}
            <button
              onClick={onOpenCreatePost}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-full text-xs font-bold shadow-lg shadow-red-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post</span>
            </button>

            {/* Chat Zone Link Button */}
            <a
              href="https://chat100.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold transition-all shadow-sm group"
              title="Open Chat Zone on Chat100"
            >
              <MessageSquareCode className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Chat Zone</span>
              <ExternalLink className="w-3 h-3 text-blue-400/70" />
            </a>

            {/* User Avatar & Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-800 transition-colors border border-slate-800"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.displayName}
                    className="w-8 h-8 rounded-full object-cover border border-red-500"
                  />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-scaleUp">
                    <div className="p-2 border-b border-slate-800">
                      <p className="font-bold text-white text-sm line-clamp-1">
                        {currentUser.displayName}
                      </p>
                      <p className="text-red-400 text-[11px]">@{currentUser.username}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-slate-200 mt-1"
                    >
                      <UserIcon className="w-4 h-4 text-red-400" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('analytics');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-slate-200"
                    >
                      <BarChart3 className="w-4 h-4 text-amber-400" />
                      <span>Creator Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        onLogout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-red-950/50 flex items-center gap-2 text-red-400 font-semibold mt-1 border-t border-slate-800/80"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-bold shadow-md transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Mobile/Tablet Nav Bar Tabs */}
        <div className="flex items-center justify-around border-t border-slate-800/80 py-2">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'feed'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('post-of-the-day')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'post-of-the-day'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-amber-400 hover:text-amber-300 hover:bg-slate-900'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Post of Day</span>
          </button>

          <button
            onClick={() => setActiveTab('chat-zone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'chat-zone'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MessageSquareCode className="w-4 h-4 text-blue-400" />
            <span>Chat Zone</span>
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'explore'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Flame className="w-4 h-4 text-purple-400" />
            <span>Trending</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};
