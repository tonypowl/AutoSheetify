import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

// Local imports
import SoundWave from "./ui/soundwave";
import MusicalNotes from "./ui/musicalnotes";

const HowItWorks = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(circle at ${x}px ${y}px, rgba(168, 85, 247, 0.15), transparent 40%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative py-24 bg-gradient-to-r from-indigo-950/40 to-purple-950/40 text-white backdrop-blur-sm overflow-hidden"
    >
      {/* Interactive Background Glow */}
      <motion.div className="absolute inset-0 z-0" style={{ background }} />

      {/* Section Title */}
      <h2 className="relative z-10 text-5xl font-bold text-center mb-24 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        How It Works
      </h2>

      {/* Animated Gradient Line */}
      <motion.div
        className="relative z-10 w-full max-w-3xl mx-auto h-[3px] mb-20 overflow-hidden rounded-full"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "100%", opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.42, 0, 0.58, 1] }}
      >
        <motion.div
          className="w-full h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 blur-sm"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        />
      </motion.div>

      {/* Steps & Connectors */}
      <div className="relative z-10 flex flex-col md:flex-row justify-center items-center max-w-7xl mx-auto px-6 gap-8 md:gap-4">
        {/* Step 1 */}
        <Step
          gif="/images/keyboard.gif"
          description="Record your performance, upload an audio file or use a YouTube link."
          borderColor="border-cyan-400"
        />

        {/* Connector 1 - Sound Wave */}
        <div className="relative hidden md:flex justify-center items-center w-[160px] min-w-[160px]">
          <div className="absolute left-0 right-0">
            <SoundWave />
          </div>
        </div>

        {/* Step 2 */}
        <Step
          gif="/images/ai.gif"
          description="AutoSheetify AI listens to your music and transcribes it automatically."
          borderColor="border-purple-400"
        />

        {/* Connector 2 - Musical Notes */}
        <div className="relative hidden md:flex justify-center items-center w-[80px] min-w-[80px] z-0">
          <div className="absolute pointer-events-none z-0">
            <MusicalNotes />
          </div>
        </div>

        {/* Step 3 */}
        <Step
          gif="/images/music.gif"
          description="Export your transcription as Sheet Music, MIDI, MusicXML or GuitarPro."
          borderColor="border-pink-500"
        />
      </div>
    </section>
  );
};

type StepProps = {
  gif: string;
  description: string;
  borderColor: string;
};

const Step = ({ gif, description, borderColor }: StepProps) => {
  return (
    <div className="flex flex-col items-center text-center group md:w-1/4">
      <motion.img
        src={gif}
        loading="lazy"
        alt={description}
        className={`w-full max-w-[280px] h-44 object-cover rounded-xl border-2 ${borderColor} shadow-lg z-10`}
        whileHover={{
          scale: 1.05,
          boxShadow: `0px 0px 30px rgba(${
            borderColor === "border-cyan-400"
              ? "56, 189, 248"
              : borderColor === "border-purple-400"
              ? "192, 132, 252"
              : "236, 72, 153"
          }, 0.5)`,
        }}
        transition={{ type: "spring", stiffness: 300 }}
      />
      <p className="text-slate-300 mt-5 max-w-xs text-lg">{description}</p>
    </div>
  );
};

export default HowItWorks;