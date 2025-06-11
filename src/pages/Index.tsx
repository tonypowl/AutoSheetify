
import React, { useState } from 'react';
import { Upload, Youtube, Music, Download, Play, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import UploadSection from '@/components/UploadSection';
import InstrumentSelector from '@/components/InstrumentSelector';
import ResultsSection from '@/components/ResultsSection';
import LoadingAnimation from '@/components/LoadingAnimation';
import FloatingNotes from '@/components/FloatingNotes';

const Index = () => {
  const [selectedInstrument, setSelectedInstrument] = useState<'piano' | 'guitar'>('piano');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    toast({
      title: "File uploaded successfully!",
      description: `${file.name} is ready for transcription.`,
    });
  };

  const handleYoutubeSubmit = (url: string) => {
    setYoutubeUrl(url);
    toast({
      title: "YouTube link added!",
      description: "Ready to extract audio and transcribe.",
    });
  };

  const handleTranscribe = () => {
    if (!uploadedFile && !youtubeUrl) {
      toast({
        title: "No input provided",
        description: "Please upload a file or provide a YouTube link.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setShowResults(true);
      toast({
        title: "Transcription complete!",
        description: "Your sheet music and MIDI files are ready.",
      });
    }, 3000);
  };

  if (isProcessing) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <FloatingNotes />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-12">
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
              YouTube Links
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

      {/* Main Content */}
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

            {/* Instrument Selection */}
            <InstrumentSelector
              selectedInstrument={selectedInstrument}
              onInstrumentChange={setSelectedInstrument}
            />

            {/* Transcribe Button */}
            <div className="text-center mt-8">
              <Button
                onClick={handleTranscribe}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
            onStartOver={() => {
              setShowResults(false);
              setUploadedFile(null);
              setYoutubeUrl('');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
