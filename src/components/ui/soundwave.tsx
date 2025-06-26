// src/components/ui/soundwave.tsx
import React from "react";
import { motion, Easing } from "framer-motion";

const SoundWave = () => {
  const wavePath1 = [
    "M 0 60 Q 25 0, 50 60 T 100 60 T 150 60 T 200 60",
    "M 0 60 Q 25 30, 50 60 T 100 60 T 150 60 T 200 60",
    "M 0 60 Q 25 0, 50 60 T 100 60 T 150 60 T 200 60",
  ];

  const wavePath2 = [
    "M 0 60 Q 25 120, 50 60 T 100 60 T 150 60 T 200 60",
    "M 0 60 Q 25 90, 50 60 T 100 60 T 150 60 T 200 60",
    "M 0 60 Q 25 120, 50 60 T 100 60 T 150 60 T 200 60",
  ];

  const breathingTransition = {
    d: {
      duration: 3,
      ease: "easeInOut" as Easing,
      repeat: Infinity,
    },
  };

  return (
    <motion.svg
      width="100%"
      height="120"
      viewBox="0 0 200 120"
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
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        </filter>
      </defs>

      {/* Glowing Background Wave (Corrected) */}
      <motion.path
        fill="none"
        stroke="url(#waveGradient)"
        strokeWidth="4"
        filter="url(#glow)"
        opacity="0.6"
        animate={{ d: wavePath1 }}
        transition={breathingTransition}
      />

      {/* Bolder Solid Wave (Corrected) */}
      <motion.path
        fill="none"
        stroke="url(#waveGradient)"
        strokeWidth="4" // Bolder
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
        animate={{ d: wavePath1 }} // Use keyframes for the 'd' attribute
        transition={breathingTransition} // Apply the transition settings
      />

      {/* Bolder Dashed Wave (Corrected) */}
      <motion.path
        fill="none"
        stroke="url(#waveGradient)"
        strokeWidth="3" // Bolder
        strokeDasharray="4 8"
        animate={{
          d: wavePath2, // Keyframes for path shape
          strokeDashoffset: [0, 28], // Keyframes for dash offset
        }}
        transition={{
          d: { // Transition for path shape
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          },
          strokeDashoffset: { // Transition for dash offset
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      />
    </motion.svg>
  );
};

export default SoundWave;