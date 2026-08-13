import React from 'react';
import { MessageSquareCode, ExternalLink, Sparkles, Shield, Zap, Globe } from 'lucide-react';

export const ChatZoneView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 text-white pb-12 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-500/30 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-400/30 text-blue-300">
            <MessageSquareCode className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Chat Zone Hub</h2>
            <p className="text-xs text-blue-200">
              Live Messaging & Community Chat powered by Chat100
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-xl mb-4">
          Connect with friends, start private rooms, and engage in instant conversation on our official Chat Zone partner link.
        </p>

        <a
          href="https://chat100.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
        >
          <Globe className="w-4 h-4" />
          <span>Open Chat Zone (chat100.onrender.com)</span>
          <ExternalLink className="w-4 h-4 ml-1" />
        </a>
      </div>

      {/* Embedded Iframe Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-2 h-[550px] flex flex-col">
        <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-300">Chat100 Live Room Preview</span>
          </div>
          <a
            href="https://chat100.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 font-semibold"
          >
            Launch in Full Tab <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <iframe
          src="https://chat100.onrender.com"
          title="Chat Zone"
          className="w-full flex-1 border-0 rounded-b-2xl bg-slate-950"
          allow="microphone; camera; clipboard-write;"
        />
      </div>
    </div>
  );
};
