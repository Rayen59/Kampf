import React from 'react';
import { ReactionType, REACTION_CONFIG } from '../types';

interface ReactionPickerProps {
  onSelectReaction: (type: ReactionType) => void;
  onClose: () => void;
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({ onSelectReaction, onClose }) => {
  return (
    <div
      className="absolute bottom-full left-0 mb-2 bg-slate-900/95 border border-slate-700/80 rounded-full p-1.5 shadow-2xl flex items-center gap-1 z-40 backdrop-blur-md animate-scaleUp origin-bottom-left"
      onMouseLeave={onClose}
    >
      {REACTION_CONFIG.map((item) => (
        <button
          key={item.type}
          onClick={(e) => {
            e.stopPropagation();
            onSelectReaction(item.type);
            onClose();
          }}
          className="p-1.5 hover:bg-slate-800 rounded-full transition-all transform hover:scale-130 active:scale-95 group relative"
          title={item.label}
        >
          <span className="text-xl block group-hover:animate-bounce">{item.emoji}</span>
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-800">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};
