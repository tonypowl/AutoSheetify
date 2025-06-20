
import React from 'react';
import { Music } from 'lucide-react';

const LoginLoadingAnimation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Animated Musical Equalizer */}
        <div className="flex items-end justify-center space-x-2 h-24">
          {[...Array(7)].map((_, index) => (
            <div
              key={index}
              className="bg-gradient-to-t from-cyan-400 to-purple-400 rounded-t-md animate-bounce"
              style={{
                width: '8px',
                height: `${20 + Math.random() * 40}px`,
                animationDelay: `${index * 0.1}s`,
                animationDuration: `${0.6 + Math.random() * 0.4}s`,
              }}
            />
          ))}
        </div>

        {/* Rotating Musical Note */}
        <div className="relative">
          <div className="animate-spin">
            <Music className="h-16 w-16 text-cyan-400 mx-auto" />
          </div>
          <div className="absolute inset-0 animate-ping">
            <Music className="h-16 w-16 text-cyan-400/30 mx-auto" />
          </div>
        </div>

        {/* Loading Text with Animated Dots */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Tuning In</h2>
          <div className="flex items-center justify-center space-x-2 text-slate-300">
            <span>Authenticating</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>

        {/* Animated Progress Steps */}
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center space-x-3 text-green-400">
            <div className="w-4 h-4 bg-green-400 rounded-full flex-shrink-0"></div>
            <span className="text-sm">Verifying credentials</span>
          </div>
          <div className="flex items-center space-x-3 text-cyan-400">
            <div className="w-4 h-4 bg-cyan-400 rounded-full flex-shrink-0 animate-pulse"></div>
            <span className="text-sm">Setting up your workspace...</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-500">
            <div className="w-4 h-4 border-2 border-slate-500 rounded-full flex-shrink-0"></div>
            <span className="text-sm">Loading dashboard</span>
          </div>
        </div>

        {/* Musical Wave Animation */}
        <div className="flex justify-center items-center space-x-1 mt-8">
          {[...Array(20)].map((_, index) => (
            <div
              key={index}
              className="w-1 bg-gradient-to-t from-cyan-400/60 to-purple-400/60 rounded-full animate-pulse"
              style={{
                height: `${10 + Math.sin(index * 0.5) * 15}px`,
                animationDelay: `${index * 0.05}s`,
                animationDuration: '1.5s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginLoadingAnimation;
