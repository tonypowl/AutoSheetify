import React, { useState } from "react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  return (
    <section className="relative py-24 bg-black text-white overflow-hidden">
      <h2 className="text-4xl font-bold text-center mb-20">How It Works</h2>

      {/* Animated Line */}
      <motion.div
        className="hidden md:block absolute top-[172px] left-[15%] right-[15%] h-1 z-0"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "70%", opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.42, 0, 0.58, 1] }}
      >
        <div className="w-full h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-sm shadow-lg" />
      </motion.div>

      {/* Moving Glowing Dot */}
      <motion.div
        className="hidden md:block absolute top-[170px] left-[15%] w-[70%] h-1 z-10"
      >
        <motion.div
          className="w-4 h-4 bg-white rounded-full shadow-xl"
          animate={{ x: ["0%", "100%"] }}
          transition={{ duration: 3.5, ease: "linear", repeat: Infinity }}
        />
      </motion.div>

      {/* Steps */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center max-w-6xl mx-auto px-6 gap-20 md:gap-0">
        <Step
          still="/images/piano-still.png"
          gif="/images/piano.gif"
          title="1. Upload your Music"
          description="Record your performance, upload an audio file or use a YouTube link."
          borderColor="border-cyan-400"
        />
        <Step
          still="/images/brain-still.png"
          gif="/images/brain.gif"
          title="2. AI Magic ✨"
          description="AutoSheetify AI listens to your music and transcribes it automatically."
          borderColor="border-purple-400"
        />
        <Step
          still="/images/sheet-still.png"
          gif="/images/sheet.gif"
          title="3. View, Edit and Download"
          description="Export your transcription as Sheet Music, MIDI, MusicXML or GuitarPro."
          borderColor="border-pink-500"
        />
      </div>
    </section>
  );
};

type StepProps = {
  still: string;
  gif: string;
  title: string;
  description: string;
  borderColor: string;
};

const Step = ({ still, gif, title, description, borderColor }: StepProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex-1 flex flex-col items-center text-center group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={hovered ? gif : still}
        alt={title}
        loading="lazy"
        className={`w-64 h-40 object-cover rounded-xl border-2 ${borderColor} shadow-lg transition-transform duration-300 group-hover:scale-105`}
      />
      <h3 className="text-xl font-bold mt-6">{title}</h3>
      <p className="text-slate-400 mt-2 max-w-xs">{description}</p>
    </div>
  );
};

export default HowItWorks;
