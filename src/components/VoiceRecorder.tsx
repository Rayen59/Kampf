import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Check, RefreshCw } from 'lucide-react';
import { AudioAttachment } from '../types';

interface VoiceRecorderProps {
  onAudioRecorded: (audio: AudioAttachment) => void;
  onCancel: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onAudioRecorded, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    setErrorMessage(null);
    audioChunksRef.current = [];
    setRecordingTime(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Stop media tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access error:', err);
      setErrorMessage('Could not access microphone. Please allow microphone permissions in your browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const togglePlayback = () => {
    if (!audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleConfirm = () => {
    if (!audioUrl) return;
    // Generate realistic random waveform bars
    const waveform = Array.from({ length: 16 }, () => Math.floor(Math.random() * 70) + 20);
    onAudioRecorded({
      url: audioUrl,
      duration: recordingTime || 5,
      waveform,
    });
  };

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 text-white shadow-xl max-w-md w-full mx-auto my-2">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-red-500 animate-pulse" />
          <span className="font-semibold text-sm text-slate-200">Voice Note Studio</span>
        </div>
        <span className="text-xs font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
          {formatTime(recordingTime)}
        </span>
      </div>

      {errorMessage && (
        <div className="text-xs text-red-400 bg-red-950/50 p-2.5 rounded-lg mb-3 border border-red-800">
          {errorMessage}
        </div>
      )}

      {!audioUrl ? (
        <div className="flex flex-col items-center justify-center py-4">
          {isRecording ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-1.5 h-12">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-red-500 rounded-full animate-bounce"
                    style={{
                      height: `${Math.floor(Math.random() * 32) + 8}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-400">Recording live audio...</p>
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium text-sm transition-all shadow-lg shadow-red-600/30"
              >
                <Square className="w-4 h-4 fill-white" /> Stop Recording
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <p className="text-xs text-slate-400 text-center">
                Tap the microphone button to record a voice note for your post.
              </p>
              <button
                onClick={startRecording}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-semibold text-sm transition-all shadow-lg shadow-red-600/30 hover:scale-105"
              >
                <Mic className="w-5 h-5" /> Start Voice Recording
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-800/80 p-3 rounded-xl flex items-center justify-between border border-slate-700">
            <button
              onClick={togglePlayback}
              className="p-2.5 bg-red-600 hover:bg-red-500 rounded-full text-white transition-all shadow-md"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div className="flex-1 mx-3 flex items-center gap-1 h-8">
              {[30, 60, 45, 90, 70, 40, 80, 50, 95, 60, 30, 75, 40, 85, 55, 65].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all ${
                    isPlaying ? 'bg-red-500 animate-pulse' : 'bg-slate-600'
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <span className="text-xs text-slate-400 font-mono">{formatTime(recordingTime)}</span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={resetRecording}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-record
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onCancel}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
              >
                <Check className="w-4 h-4" /> Attach Voice Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
