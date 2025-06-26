
import React from 'react';
import { Music } from 'lucide-react';

const LoadingAnimation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Animated Musical Note */}
        <div className="relative">
          <div className="animate-spin">
            <Music className="h-16 w-16 text-cyan-400 mx-auto" />
          </div>
          <div className="absolute inset-0 animate-ping">
            <Music className="h-16 w-16 text-cyan-400/30 mx-auto" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Processing Your Music</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2 text-slate-300">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
            <p className="text-slate-400">Analyzing audio, detecting notes, and generating sheet music...</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center space-x-3 text-green-400">
            <div className="w-4 h-4 bg-green-400 rounded-full flex-shrink-0"></div>
            <span className="text-sm">Audio extraction complete</span>
          </div>
          <div className="flex items-center space-x-3 text-cyan-400">
            <div className="w-4 h-4 bg-cyan-400 rounded-full flex-shrink-0 animate-pulse"></div>
            <span className="text-sm">Detecting pitch and tempo...</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-500">
            <div className="w-4 h-4 border-2 border-slate-500 rounded-full flex-shrink-0"></div>
            <span className="text-sm">Generating sheet music</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-500">
            <div className="w-4 h-4 border-2 border-slate-500 rounded-full flex-shrink-0"></div>
            <span className="text-sm">Creating MIDI file</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
