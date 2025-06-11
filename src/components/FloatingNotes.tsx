
import React from 'react';

const FloatingNotes = () => {
  const notes = ['♪', '♫', '♬', '♩', '♭', '♯'];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {notes.map((note, index) => (
        <div
          key={index}
          className={`absolute text-slate-600/20 text-2xl animate-float-${index + 1}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${4 + Math.random() * 2}s`,
          }}
        >
          {note}
        </div>
      ))}
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default FloatingNotes;
