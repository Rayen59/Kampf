import React from 'react';
import { User } from '../types';
import { Image as ImageIcon, Video, Mic, FileText, Send } from 'lucide-react';

interface CreatePostCardProps {
  currentUser: User | null;
  onOpenModal: () => void;
}

export const CreatePostCard: React.FC<CreatePostCardProps> = ({ currentUser, onOpenModal }) => {
  const avatar = currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const name = currentUser ? currentUser.displayName.split(' ')[0] : 'there';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl mb-6 text-white">
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt={currentUser?.displayName || 'User'}
          className="w-10 h-10 rounded-full object-cover border-2 border-red-500 shrink-0"
        />
        <button
          onClick={onOpenModal}
          className="flex-1 bg-slate-800/80 hover:bg-slate-800 text-left px-4 py-3 rounded-full text-xs font-medium text-slate-400 border border-slate-700/60 transition-all hover:border-slate-600"
        >
          What's on your mind, {name}? Share text, voice or media...
        </button>
      </div>

      <div className="flex items-center justify-around border-t border-slate-800/80 mt-3 pt-2.5">
        <button
          onClick={onOpenModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-emerald-400 text-xs font-semibold transition-colors"
        >
          <ImageIcon className="w-4 h-4 text-emerald-400" />
          <span>Photo</span>
        </button>

        <button
          onClick={onOpenModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-blue-400 text-xs font-semibold transition-colors"
        >
          <Video className="w-4 h-4 text-blue-400" />
          <span>Video</span>
        </button>

        <button
          onClick={onOpenModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-red-400 text-xs font-semibold transition-colors"
        >
          <Mic className="w-4 h-4 text-red-400 animate-pulse" />
          <span>Voice</span>
        </button>

        <button
          onClick={onOpenModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-purple-400 text-xs font-semibold transition-colors"
        >
          <FileText className="w-4 h-4 text-purple-400" />
          <span>Document</span>
        </button>
      </div>
    </div>
  );
};
