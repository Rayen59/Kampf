import React, { useState } from 'react';
import { User, Post } from '../types';
import { PostCard } from './PostCard';
import {
  Image as ImageIcon,
  Edit3,
  Check,
  Calendar,
  Users,
  Award,
  Sparkles,
  Camera,
  Heart,
  Search,
  Trash2,
  Clock,
  UserX,
  AlertTriangle,
} from 'lucide-react';

interface ProfileViewProps {
  currentUser: User | null;
  onUpdateProfile: (updated: User) => void;
  posts: Post[];
  onReact: (postId: string, type: any) => void;
  onAddComment: (postId: string, content: string, parentId?: string, audioAttachment?: any) => void;
  onDeletePost: (postId: string) => void;
  onEditPost?: (post: Post) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onClearSearchHistory?: () => void;
  onSelectSearchQuery?: (query: string) => void;
  onDeleteAccount?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUpdateProfile,
  posts,
  onReact,
  onAddComment,
  onDeletePost,
  onEditPost,
  onDeleteComment,
  onClearSearchHistory,
  onSelectSearchQuery,
  onDeleteAccount,
}) => {
  if (!currentUser) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-white my-8 shadow-2xl">
        <Sparkles className="w-12 h-12 text-red-500 mx-auto mb-3 animate-pulse" />
        <h2 className="text-2xl font-black mb-2">Welcome to Mein Kampf Social</h2>
        <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
          Please sign in or create an account to view and customize your creator profile, track your posts, and view search history.
        </p>
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const myPosts = posts.filter((p) => p.author.id === currentUser.id);

  const handleProfileImageGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image should be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
          onUpdateProfile({
            ...currentUser,
            avatarUrl: reader.result,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...currentUser,
      displayName: displayName.trim() || currentUser.displayName,
      bio: bio.trim(),
      avatarUrl,
    };
    onUpdateProfile(updated);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-white pb-12 animate-fadeIn">
      {/* Profile Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="h-32 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
          {/* Avatar with Gallery Upload Overlay */}
          <div className="relative group shrink-0">
            <img
              src={avatarUrl}
              alt={currentUser.displayName}
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-900 shadow-2xl bg-slate-800"
            />
            <label className="absolute bottom-0 right-0 p-2 bg-red-600 hover:bg-red-500 text-white rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageGalleryUpload}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold transition-all self-start sm:self-auto"
          >
            <Edit3 className="w-4 h-4 text-red-400" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Profile Info Details */}
        <div className="px-6 pb-6 space-y-4">
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-md"
              >
                <Check className="w-4 h-4" /> Save Changes
              </button>
            </form>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  {currentUser.displayName}
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h2>
                <p className="text-xs text-red-400 font-semibold">@{currentUser.username}</p>
              </div>

              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                {currentUser.bio || 'No bio provided yet.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-red-400" />
                  Joined {currentUser.joinedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-400" />
                  <strong className="text-white">{currentUser.followersCount}</strong> Followers
                </span>
                <span className="flex items-center gap-1.5">
                  <strong className="text-white">{currentUser.followingCount}</strong> Following
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* User's Search History Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-950/60 rounded-xl border border-red-800/60 text-red-400">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Recent Search History</span>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
              </h3>
              <p className="text-[11px] text-slate-400">Queries you searched across the social hub</p>
            </div>
          </div>

          {currentUser.searchHistory && currentUser.searchHistory.length > 0 && onClearSearchHistory && (
            <button
              type="button"
              onClick={onClearSearchHistory}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-700/80 hover:border-red-800/80 rounded-xl text-[11px] font-bold transition-all"
              title="Clear search history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {currentUser.searchHistory && currentUser.searchHistory.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {currentUser.searchHistory.map((query, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onSelectSearchQuery && onSelectSearchQuery(query)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-red-950/50 border border-slate-700/80 hover:border-red-700/60 rounded-xl text-xs text-slate-200 hover:text-rose-200 font-medium transition-all group shadow-sm"
              >
                <Search className="w-3 h-3 text-slate-400 group-hover:text-red-400 transition-colors" />
                <span>{query}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic bg-slate-950/50 p-3 rounded-2xl border border-slate-800/60">
            No search history recorded yet. Use the search bar in the top navigation bar to search posts, media, or creators!
          </p>
        )}
      </div>

      {/* User's Created Posts Feed */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span>My Publications ({myPosts.length})</span>
        </h3>

        {myPosts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
            <p className="text-sm font-semibold">You haven't posted anything yet.</p>
            <p className="text-xs text-slate-500 mt-1">Publish text, photos, video or audio to see them here.</p>
          </div>
        ) : (
          myPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onReact={onReact}
              onAddComment={onAddComment}
              onDeletePost={onDeletePost}
              onEditPost={onEditPost}
              onDeleteComment={onDeleteComment}
            />
          ))
        )}
      </div>

      {/* Account Danger Zone */}
      <div className="bg-red-950/20 border border-red-900/40 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserX className="w-5 h-5 text-red-500" />
            <div>
              <h4 className="text-sm font-bold text-red-300">Delete Account / Supprimer le compte</h4>
              <p className="text-[11px] text-slate-400">
                Permanently delete your profile and account credentials. You will be logged out and cannot log back in with this account.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-red-600/30 shrink-0"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Account Modal Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn text-white">
          <div className="bg-slate-900 border border-red-800/80 rounded-3xl p-6 text-center shadow-2xl max-w-sm w-full space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white mb-1">Delete Account Permanently?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-red-400">@{currentUser.username}</span>? This action is irreversible. You will be logged out immediately and will not be able to log back in.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  if (onDeleteAccount) onDeleteAccount();
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-red-600/40 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Permanently Delete My Account</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-semibold text-xs transition-colors"
              >
                Cancel / Keep Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
