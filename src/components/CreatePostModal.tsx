import React, { useState } from 'react';
import { User, AudioAttachment, FileAttachment, Post } from '../types';
import {
  Image as ImageIcon,
  Video,
  Mic,
  FileText,
  X,
  Send,
  Paperclip,
  Sparkles,
} from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';

interface CreatePostModalProps {
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (
    content: string,
    mediaType: Post['mediaType'],
    images?: string[],
    videoUrl?: string,
    audioAttachment?: AudioAttachment,
    fileAttachment?: FileAttachment,
    tags?: string[]
  ) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onSubmitPost,
}) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [fileAttachment, setFileAttachment] = useState<FileAttachment | undefined>();
  const [audioAttachment, setAudioAttachment] = useState<AudioAttachment | undefined>();
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [tagsText, setTagsText] = useState('');

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    files.forEach((file: File) => {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const fileObj: FileAttachment = {
        name: file.name,
        url: URL.createObjectURL(file),
        size: `${sizeMb} MB`,
        type: file.type || 'Document',
      };
      setFileAttachment(fileObj);
    }
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoUrl(URL.createObjectURL(file));
      setShowVideoInput(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0 && !videoUrl && !audioAttachment && !fileAttachment) {
      alert('Please add some text or media to your post!');
      return;
    }

    let mediaType: Post['mediaType'] = 'text';
    if (images.length > 0) mediaType = 'image';
    else if (videoUrl) mediaType = 'video';
    else if (audioAttachment) mediaType = 'audio';
    else if (fileAttachment) mediaType = 'file';

    const parsedTags = tagsText
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    onSubmitPost(
      content.trim(),
      mediaType,
      images.length > 0 ? images : undefined,
      videoUrl || undefined,
      audioAttachment,
      fileAttachment,
      parsedTags
    );

    // Reset Form
    setContent('');
    setImages([]);
    setVideoUrl('');
    setFileAttachment(undefined);
    setAudioAttachment(undefined);
    setShowVoiceRecorder(false);
    setTagsText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl text-white relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 p-4 px-5 text-white flex items-center justify-between border-b border-red-500/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <h3 className="font-bold text-base">Create New Post</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Author Badge */}
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-10 h-10 rounded-full object-cover border-2 border-red-500"
            />
            <div>
              <p className="font-bold text-sm text-white">{currentUser.displayName}</p>
              <p className="text-xs text-red-400 font-medium">@{currentUser.username}</p>
            </div>
          </div>

          {/* Main Text Content */}
          <textarea
            rows={4}
            placeholder="What's on your mind? Share text, images, video, voice notes or files..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
          />

          {/* Voice Recorder Studio Overlay */}
          {showVoiceRecorder && (
            <VoiceRecorder
              onAudioRecorded={(audio) => {
                setAudioAttachment(audio);
                setShowVoiceRecorder(false);
              }}
              onCancel={() => setShowVoiceRecorder(false)}
            />
          )}

          {/* Audio Preview if attached */}
          {audioAttachment && !showVoiceRecorder && (
            <div className="bg-red-950/40 border border-red-800/60 p-3 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-red-400" />
                <span className="text-xs font-semibold text-rose-200">
                  Voice Note Attached ({audioAttachment.duration}s)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAudioAttachment(undefined)}
                className="text-slate-400 hover:text-red-400 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden h-24 border border-slate-700">
                  <img src={img} alt="upload preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-black/70 hover:bg-black rounded-full p-1 text-white text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Video URL or File Input */}
          {showVideoInput && (
            <div className="space-y-2 bg-slate-800/50 p-3 rounded-2xl border border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Video Attachment</span>
                <button
                  type="button"
                  onClick={() => {
                    setVideoUrl('');
                    setShowVideoInput(false);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Paste video URL (MP4 / YouTube URL)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          )}

          {/* File Attachment Preview */}
          {fileAttachment && (
            <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <Paperclip className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="font-semibold text-slate-200 truncate">{fileAttachment.name}</span>
                <span className="text-slate-400 text-[10px]">({fileAttachment.size})</span>
              </div>
              <button
                type="button"
                onClick={() => setFileAttachment(undefined)}
                className="text-slate-400 hover:text-red-400 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Tags */}
          <div>
            <input
              type="text"
              placeholder="Tags (separated by commas e.g. news, viral, tech)"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Media Attach Options Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1">
              <label
                className="p-2.5 hover:bg-slate-800 text-emerald-400 rounded-xl cursor-pointer transition-colors"
                title="Add Photos"
              >
                <ImageIcon className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <label
                className="p-2.5 hover:bg-slate-800 text-blue-400 rounded-xl cursor-pointer transition-colors"
                title="Add Video File"
              >
                <Video className="w-5 h-5" />
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
                className={`p-2.5 hover:bg-slate-800 rounded-xl transition-colors ${
                  showVoiceRecorder ? 'bg-red-900/50 text-red-400' : 'text-red-400'
                }`}
                title="Record Voice Note"
              >
                <Mic className="w-5 h-5" />
              </button>

              <label
                className="p-2.5 hover:bg-slate-800 text-purple-400 rounded-xl cursor-pointer transition-colors"
                title="Attach Document / File"
              >
                <FileText className="w-5 h-5" />
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-full font-bold text-xs shadow-lg shadow-red-600/30 transition-all transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Publish Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
