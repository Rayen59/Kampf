import React, { useState } from 'react';
import { User, LogIn, UserPlus, Image as ImageIcon, Sparkles, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { registerUser, loginUser, getStoredUsers } from '../utils/storage';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserType) => void;
  canClose?: boolean;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  canClose = true,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0]);
  const [bio, setBio] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Profile image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
          setSuccessMessage('Profile photo selected from gallery!');
          setTimeout(() => setSuccessMessage(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (mode === 'register') {
      if (!displayName.trim()) {
        setErrorMessage('Please enter your full name');
        return;
      }
      if (!username.trim()) {
        setErrorMessage('Please enter a unique username');
        return;
      }

      const result = registerUser(email, displayName, username, avatarUrl, bio);
      if (result.error) {
        setErrorMessage(result.error);
        return;
      }

      if (result.user) {
        setSuccessMessage('Account created successfully!');
        setTimeout(() => {
          onAuthSuccess(result.user!);
          if (canClose) onClose();
        }, 500);
      }
    } else {
      const result = loginUser(email);
      if (result.error) {
        setErrorMessage(result.error);
        return;
      }

      if (result.user) {
        setSuccessMessage('Welcome back!');
        setTimeout(() => {
          onAuthSuccess(result.user!);
          if (canClose) onClose();
        }, 500);
      }
    }
  };

  const handleSelectAccountEmail = (accountEmail: string) => {
    setEmail(accountEmail);
    setMode('login');
    setErrorMessage(null);
    setSuccessMessage(`Selected email: ${accountEmail}. Click Sign In to enter.`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const storedUsers = getStoredUsers();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-white relative flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-6 text-white text-center relative">
          {canClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-all"
            >
              ✕
            </button>
          )}

          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl border border-white/20 mb-3 shadow-inner">
            <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight drop-shadow-md">Mein Kampf</h2>
          <p className="text-xs text-rose-100/90 font-medium mt-1">
            {!canClose ? 'Authentication Required to Enter App' : 'Android Mobile Social Community'}
          </p>
        </div>

        {/* Mode Toggle Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1">
          <button
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Sign Up
          </button>
          <button
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-200">
          {errorMessage && (
            <div className="p-3 bg-red-950/80 border border-red-700/80 rounded-xl text-xs text-red-300 flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">Authentication Error</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-700/80 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <p>{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                {/* Profile Photo Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Profile Photo (Select from Gallery or Presets)
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarUrl}
                      alt="Avatar Preview"
                      className="w-14 h-14 rounded-full object-cover border-2 border-red-500 shadow-md shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <label className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 cursor-pointer transition-colors shadow-sm">
                        <ImageIcon className="w-4 h-4 text-red-400" />
                        <span>Choose from Gallery</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleGalleryImageUpload}
                          className="hidden"
                        />
                      </label>
                      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                        {PRESET_AVATARS.map((url, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setAvatarUrl(url)}
                            className={`w-7 h-7 rounded-full overflow-hidden border transition-all ${
                              avatarUrl === url
                                ? 'border-red-500 scale-110 ring-2 ring-red-500/30'
                                : 'border-slate-700 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={url} alt="preset" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rayen Bouazizi"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-500 text-sm font-semibold">
                      @
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address <span className="text-red-400 font-bold">*Unique</span>
              </label>
              <input
                type="email"
                required
                placeholder="your.email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
              />
              {mode === 'register' && (
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-red-400" />
                  Each email can only be registered once on Mein Kampf.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bio (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Share a quick story or status..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-600/30 transition-all transform active:scale-98"
            >
              {mode === 'register' ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Professional Registered Account Email Selector */}
          <div className="pt-4 border-t border-slate-800/80">
            <p className="text-[11px] font-medium text-slate-400 mb-2 text-center">
              Registered Accounts (Click to autofill email for Sign In):
            </p>
            <div className="grid grid-cols-3 gap-2">
              {storedUsers.slice(0, 3).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectAccountEmail(u.email)}
                  className="p-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-left flex flex-col items-center text-center transition-all group hover:border-red-500/50"
                  title={`Select ${u.email}`}
                >
                  <img
                    src={u.avatarUrl}
                    alt={u.displayName}
                    className="w-8 h-8 rounded-full object-cover mb-1 group-hover:scale-105 transition-transform border border-slate-700"
                  />
                  <span className="text-[10px] font-bold text-slate-200 line-clamp-1">
                    {u.displayName}
                  </span>
                  <span className="text-[9px] text-red-400">@{u.username}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
