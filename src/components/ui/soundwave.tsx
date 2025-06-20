// src/components/ui/soundwave.tsx
import React from "react";
import { motion } from "framer-motion";

const SoundWave = () => {
  return (
    <motion.svg
      width="100%"
      height="120" // Further increased height for maximum presence
      viewBox="0 0 200 120" // Updated viewBox to match new height
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="w-full h-auto"
    >
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" /> {/* Cyan */}
          <stop offset="100%" stopColor="#c084fc" /> {/* Purple */}
        </linearGradient>
      </defs>

      {/* Solid Wave - Path adjusted to span the full new height (0 to 120) */}
      <motion.path
        d="M 0 60 Q 25 0, 50 60 T 100 60 T 150 60 T 200 60"
        fill="none"
        stroke="url(#waveGradient)"
        strokeWidth="3" // Made line slightly thicker
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
              pathLength: { delay: 0.2, type: "spring", duration: 2, bounce: 0 },
              opacity: { delay: 0.2, duration: 0.1 },
            },
          },
        }}
      />
      
      {/* Dashed Wave - Path adjusted to span the full new height */}
      <motion.path
        d="M 0 60 Q 25 120, 50 60 T 100 60 T 150 60 T 200 60"
        fill="none"
        stroke="url(#waveGradient)"
        strokeWidth="2.5"
        strokeDasharray="4 6"
        animate={{
          strokeDashoffset: [0, 20],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.svg>
  );
};

export default SoundWave;