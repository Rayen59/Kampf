import React, { useState } from 'react';
import { Post, User } from '../types';
import { X, Share2, Globe, Copy, Check, Send, Sparkles, FileText, Music, Video, Image as ImageIcon } from 'lucide-react';

interface ShareModalProps {
  post: Post | null;
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmShare: (postId: string, caption?: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  post,
  currentUser,
  isOpen,
  onClose,
  onConfirmShare,
}) => {
  const [caption, setCaption] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !post) return null;

  const rootPost = post.originalPost || post;

  const handleShareNow = () => {
    onConfirmShare(post.id, caption);
    setCaption('');
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn text-white">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-w-lg w-full relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-950/80 border border-red-500/30 rounded-xl text-red-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Partager la publication</h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>Visible par tous les membres du fil d'actualité</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info header if logged in */}
        {currentUser && (
          <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-10 h-10 rounded-full object-cover border border-red-500 shrink-0"
            />
            <div>
              <h4 className="text-xs font-bold text-white">{currentUser.displayName}</h4>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                @{currentUser.username} • Publique
              </span>
            </div>
          </div>
        )}

        {/* Custom Caption Input */}
        <div>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Dites quelque chose sur cette publication... (ex: Regardez ça ! 🚀)"
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
          />
        </div>

        {/* Embedded Post Preview Card (Facebook Style) */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 text-left">
          <div className="flex items-center gap-2">
            <img
              src={rootPost.author.avatarUrl}
              alt={rootPost.author.displayName}
              className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
            />
            <div>
              <h5 className="text-xs font-bold text-white">{rootPost.author.displayName}</h5>
              <p className="text-[10px] text-slate-400">@{rootPost.author.username}</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
            {rootPost.content}
          </p>

          {/* Media Indicators if any */}
          {rootPost.images && rootPost.images.length > 0 && (
            <div className="relative rounded-xl overflow-hidden border border-slate-800 max-h-36">
              <img
                src={rootPost.images[0]}
                alt="Preview"
                className="w-full h-36 object-cover"
              />
              {rootPost.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded-lg text-[10px] text-white font-bold">
                  +{rootPost.images.length - 1} photos
                </div>
              )}
            </div>
          )}

          {rootPost.videoUrl && (
            <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-rose-400">
              <Video className="w-4 h-4" />
              <span className="truncate">Vidéo jointe</span>
            </div>
          )}

          {rootPost.audioAttachment && (
            <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-amber-400">
              <Music className="w-4 h-4" />
              <span className="truncate">Message vocal ({rootPost.audioAttachment.duration}s)</span>
            </div>
          )}

          {rootPost.fileAttachment && (
            <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-sky-400">
              <FileText className="w-4 h-4" />
              <span className="truncate">{rootPost.fileAttachment.name}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={handleShareNow}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/30"
          >
            <Send className="w-4 h-4" />
            <span>Partager maintenant dans le fil public</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Lien copié dans le presse-papier !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copier le lien du post</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
