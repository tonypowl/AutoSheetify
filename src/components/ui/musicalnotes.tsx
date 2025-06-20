// src/components/ui/musicalnotes.tsx
import React from "react";
import { motion, Variants } from "framer-motion";

const MusicNoteIcon = ({ fill, className }: { fill: string; className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={fill}
    className={className}
    strokeWidth="0"
  >
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
  </svg>
);

const AnimatedNote = ({ delay, fill, sizeClass }: { delay: number; fill: string; sizeClass: string }) => {
  const noteVariants: Variants = {
    initial: {
      x: "-20%", // Start off-screen to the left
      y: 0,
      opacity: 0,
    },
    animate: {
      x: "120%", // Move all the way across and off-screen to the right
      y: [0, -15, 15, 0], // Add a little vertical float
      opacity: [0, 1, 1, 0], // Fade in at the start, out at the end
      transition: {
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "linear",
        times: [0, 0.1, 0.9, 1], // Control fade in/out timing
      },
    },
  };

  return (
    <motion.div
      className="absolute"
      variants={noteVariants}
      initial="initial"
      animate="animate"
    >
      <MusicNoteIcon className={sizeClass} fill={fill} />
    </motion.div>
  );
};

const MusicalNotes = () => {
  return (
    <div className="relative w-full h-24 flex items-center">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="noteGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" /> {/* Pink */}
            <stop offset="100%" stopColor="#a855f7" /> {/* Purple */}
          </linearGradient>
          <linearGradient id="noteGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" /> {/* Stronger Pink */}
            <stop offset="100%" stopColor="#d8b4fe" /> {/* Light Purple */}
          </linearGradient>
        </defs>
      </svg>
      
      {/* Render multiple notes with different delays and sizes for a dynamic effect */}
      <AnimatedNote delay={0} fill="url(#noteGradient1)" sizeClass="w-9 h-9" />
      <AnimatedNote delay={1} fill="url(#noteGradient2)" sizeClass="w-7 h-7" />
      <AnimatedNote delay={2} fill="url(#noteGradient1)" sizeClass="w-8 h-8" />
    </div>
  );
};

export default MusicalNotes;