import React, { useState, useRef } from 'react';
import { Upload, Youtube, Music, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import UploadSection from '@/components/UploadSection';
import InstrumentSelector, {
  InstrumentSelectorHandles
} from '@/components/InstrumentSelector';
import ResultsSection from '@/components/ResultsSection';
import LoadingAnimation from '@/components/LoadingAnimation';
import FloatingNotes from '@/components/FloatingNotes';
import Navigation from '@/components/Navigation';
import HowItWorks from '@/components/HowItWorks';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { config } from '@/lib/config';

// Import the TranscriptionData type/interface from ResultsSection to type transcriptionResults
import type { TranscriptionData } from '@/components/ResultsSection';

const Index = () => {
  const [selectedInstrument, setSelectedInstrument] = useState<'piano' | 'guitar'>('piano');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showResults, setShowResults] = useState(false);
  // Use the imported TranscriptionData interface for better type safety
  const [transcriptionResults, setTranscriptionResults] = useState<TranscriptionData | null>(null);

  const selectorRef = useRef<InstrumentSelectorHandles>(null);
  const instrumentScrollRef = useRef<HTMLDivElement>(null);

  const { session, isAuthenticated, loading } = useAuth();

  const handleFileUpload = (file: File | null) => {
    setUploadedFile(file);
    if (file) {
      setYoutubeUrl(''); // Clear YouTube URL if file is uploaded
      toast({
        title: "File uploaded successfully!",
        description: `${file.name} is ready for transcription.`,
      });
    } else {
      toast({
        title: "File removed",
        description: "Upload a new file to continue.",
      });
    }
  };

  const handleYoutubeSubmit = (url: string) => {
    setYoutubeUrl(url);
    if (url) {
      setUploadedFile(null); // Clear uploaded file if YouTube URL is provided
      toast({
        title: "YouTube link added!",
        description: "Ready to extract audio and transcribe. (Note: Backend YouTube support is pending)",
      });
    } else {
      toast({
        title: "YouTube link removed",
        description: "Add a new YouTube link to continue.",
      });
    }
  };

  const scrollToInstrumentSelector = () => {
    instrumentScrollRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const handleInstrumentPickFromNavbar = (instrument: 'piano' | 'guitar') => {
    setSelectedInstrument(instrument);
    selectorRef.current?.selectInstrument(instrument);
    scrollToInstrumentSelector();
  };

  const handleTranscribe = async () => {
    // Determine input type
    let inputType: 'file' | 'youtube' | null = null;
    if (uploadedFile) {
      inputType = 'file';
    } else if (youtubeUrl) {
      inputType = 'youtube';
    }

    if (!inputType) {
      toast({
        title: "No input provided",
        description: "Please upload an audio/video file or provide a YouTube link.",
        variant: "destructive",
      });
      return;
    }

    if (loading) {
      toast({
        title: "Please wait",
        description: "Checking authentication status...",
        variant: "default",
      });
      return;
    }

    if (!isAuthenticated || !session?.access_token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to transcribe files.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setShowResults(false);
    setTranscriptionResults(null); // Clear previous results when starting a new transcription

    const formData = new FormData();
    if (inputType === 'file' && uploadedFile) {
      formData.append('file', uploadedFile);
    } else if (inputType === 'youtube' && youtubeUrl) {
      formData.append('youtube_url', youtubeUrl); // Ensure backend supports 'youtube_url'
    }
    formData.append('instrument', selectedInstrument);

    try {
      const response = await axios.post(`${config.apiUrl}/transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${session.access_token}`
        },
      });

      console.log("Transcription successful! Response data:", response.data); // Debugging line
      setTranscriptionResults(response.data); // This sets the state
      setIsProcessing(false);
      setShowResults(true);
      toast({
        title: "Transcription complete!",
        description: "Your sheet music and MIDI files are ready.",
      });

    } catch (error: any) {
      setIsProcessing(false);
      setShowResults(false);
      console.error('Transcription failed:', error.response?.data || error.message);
      toast({
        title: "Transcription failed!",
        description: error.response?.data?.detail || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isProcessing) return <LoadingAnimation />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <FloatingNotes />

      <Navigation onInstrumentPick={handleInstrumentPickFromNavbar} />

      {/* Hero Section */}
      <div id="home" className="relative z-10 pt-32 pb-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Music className="h-16 w-16 text-cyan-400 mr-4" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AutoSheetify
            </h1>
          </div>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Transform any audio or video into beautiful sheet music, MIDI files, and animated play-rolls.
            Perfect for musicians, educators, and music lovers.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center text-slate-300">
              <Upload className="h-5 w-5 mr-2 text-cyan-400" />
              Upload Audio/Video
            </div>
            <div className="flex items-center text-slate-300">
              <Youtube className="h-5 w-5 mr-2 text-red-400" />
              YouTube Links (Coming Soon!)
            </div>
            <div className="flex items-center text-slate-300">
              <FileText className="h-5 w-5 mr-2 text-green-400" />
              Sheet Music
            </div>
            <div className="flex items-center text-slate-300">
              <Download className="h-5 w-5 mr-2 text-yellow-400" />
              MIDI Download
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mb-20">
        <HowItWorks />
      </div>

      {/* Main Upload + Instrument + Transcribe Section */}
      <div className="relative z-10 container mx-auto px-4 pb-20">
        {!showResults ? (
          <div className="max-w-4xl mx-auto">
            {/* Upload Section */}
            <UploadSection
              onFileUpload={handleFileUpload}
              onYoutubeSubmit={handleYoutubeSubmit}
              uploadedFile={uploadedFile}
              youtubeUrl={youtubeUrl}
            />

            {/* Instrument Selector with scroll ref */}
            <div ref={instrumentScrollRef}>
              <InstrumentSelector
                ref={selectorRef}
                selectedInstrument={selectedInstrument}
                onInstrumentChange={setSelectedInstrument}
              />
            </div>

            {/* Transcribe Button */}
            <div className="text-center mt-8">
              <Button
                onClick={handleTranscribe}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                disabled={(!uploadedFile && !youtubeUrl) || isProcessing || loading} // Disable if no input or processing/loading
              >
                <Music className="mr-2 h-6 w-6" />
                Transcribe to Sheet Music
              </Button>
            </div>
          </div>
        ) : (
          <ResultsSection
            instrument={selectedInstrument}
            fileName={uploadedFile?.name || 'YouTube Audio'}
            uploadedFile={uploadedFile}
            transcriptionData={transcriptionResults} // <--- This is the crucial fix
            onStartOver={() => {
              setShowResults(false);
              setUploadedFile(null);
              setYoutubeUrl('');
              setTranscriptionResults(null); // Ensure results are cleared when starting over
            }}
          />
        )}
      </div>

      {/* About Section */}
      <section
        id="about"
        className="relative z-10 w-full px-4 bg-slate-900 py-16 flex flex-col justify-between items-center text-center text-slate-300"
      >
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-bold text-white">About Us</h2>
          <p className="text-lg">
            AutoSheetify uses AI to convert audio and video into sheet music and MIDI files.
            Built for musicians, learners, and creators to explore and play music with ease and clarity.
          </p>
        </div>

        <div className="mt-12 text-sm text-slate-500">
          © 2025 AutoSheetify. All rights reserved.
        </div>
      </section>
    </div>
  );
};

export default Index;