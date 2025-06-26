import React from "react";
import { motion, Variants } from "framer-motion";

const MusicNoteIcon = ({
  fill,
  className,
}: {
  fill: string;
  className: string;
}) => (
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

const AnimatedNote = ({
  delay,
  fill,
  sizeClass,
  initialX,
  initialY,
}: {
  delay: number;
  fill: string;
  sizeClass: string;
  initialX: number;
  initialY: number;
}) => {
  const noteVariants: Variants = {
    initial: {
      x: initialX,
      y: initialY,
      opacity: 0,
    },
    animate: {
      x: initialX + 120,
      y: [initialY, initialY - 15, initialY + 10, initialY],
      opacity: [0, 1, 1, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        delay,
        ease: "linear",
        times: [0, 0.2, 0.8, 1],
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
    <div className="relative w-full h-28 overflow-visible z-0 pointer-events-none">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="noteGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="noteGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#d8b4fe" />
          </linearGradient>
        </defs>
      </svg>

      {[
        { x: -60, y: 10, delay: 0, fill: "url(#noteGradient1)", size: "w-6 h-6" },
        { x: -30, y: 20, delay: 0.4, fill: "url(#noteGradient2)", size: "w-7 h-7" },
        { x: 0, y: 0, delay: 0.8, fill: "url(#noteGradient1)", size: "w-8 h-8" },
        { x: 30, y: 15, delay: 1.2, fill: "url(#noteGradient2)", size: "w-6 h-6" },
        { x: 60, y: 5, delay: 1.6, fill: "url(#noteGradient1)", size: "w-7 h-7" },
      ].map((note, i) => (
        <AnimatedNote
          key={i}
          delay={note.delay}
          fill={note.fill}
          sizeClass={note.size}
          initialX={note.x}
          initialY={note.y}
        />
      ))}
    </div>
  );
};

export default MusicalNotes;