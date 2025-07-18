import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Download, Play, FileText, Music, RotateCcw, Eye, Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

// Updated interface to reflect what your current backend returns
interface TranscriptionData {
  status: string;
  sheet_url: string;
  midi_url: string;
  // If your backend starts returning these, uncomment them and their types
  // notes?: string[];
  // chords?: string[];
  // tempo?: number;
  // time_signature?: string;
  // duration?: string;
  // video_url?: string; // Optional because your backend doesn't provide it yet
}

interface ResultsSectionProps {
  instrument: 'piano' | 'guitar';
  fileName: string;
  transcriptionData: TranscriptionData | null; // Use the updated interface
  onStartOver: () => void;
}

const ResultsSection = ({ instrument, fileName, transcriptionData, onStartOver }: ResultsSectionProps) => {
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [isPlayingTranscribed, setIsPlayingTranscribed] = useState(false);
  const [savedToLibrary, setSavedToLibrary] = useState(false);

  const data = transcriptionData;

  const handleDownload = (type: 'sheet_url' | 'midi_url') => { // Removed 'video_url'
    if (!data) return;

    let url = '';
    let filename = '';

    if (type === 'sheet_url') {
      url = data.sheet_url;
      // Extract filename from URL or use a generic one if not available
      filename = url.substring(url.lastIndexOf('/') + 1) || `${fileName}_sheet_music.pdf`;
    } else if (type === 'midi_url') {
      url = data.midi_url;
      filename = url.substring(url.lastIndexOf('/') + 1) || `${fileName}.mid`;
    }
    // Removed video_url handling as it's not in the type

    if (!url) {
      toast({ title: 'Error', description: `No URL available for ${type}.` });
      return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Download Started',
      description: `Downloading ${filename}`
    });
  };

  const handlePreview = (type: 'sheet_url' | 'midi_url') => { // Removed 'video_url'
    if (!data) return;
    const url = data[type];

    if (typeof url === 'string' && url) {
      window.open(url, '_blank');
    } else {
      toast({ title: 'Error', description: 'Invalid preview URL or no URL available.' });
    }
  };

  const handlePlayOriginal = () => {
    setIsPlayingOriginal(true);
    toast({
      title: 'Playing Original Audio',
      description: 'Simulated audio playback started.',
    });
    setTimeout(() => setIsPlayingOriginal(false), 5000);
  };

  const handlePlayTranscribed = () => {
    setIsPlayingTranscribed(true);
    toast({
        title: 'Playing Transcribed Audio',
        description: 'Simulated transcribed audio playback started.',
    });
    setTimeout(() => setIsPlayingTranscribed(false), 3000);
  };

  const handleSaveToLibrary = () => {
    setSavedToLibrary(true);
    toast({
      title: 'Saved!',
      description: 'Transcription saved to your library.'
    });
  };

  if (!data || data.status !== 'success') {
    return <div className="text-center text-slate-300">No transcription data available. Please try again.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">✓</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Transcription Complete!</h2>
        </div>
        <p className="text-slate-300">
          Successfully transcribed <span className="text-cyan-400 font-medium">{fileName}</span> for {instrument}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-lg">
          <CardContent className="p-4 text-center">
            <h3 className="text-white font-medium mb-3">Original Audio</h3>
            <Button
              onClick={handlePlayOriginal}
              variant="outline"
              className={`border-blue-400 text-blue-400 hover:bg-blue-400/10 ${isPlayingOriginal ? 'animate-pulse' : ''}`}
            >
              <Play className="mr-2 h-4 w-4" />
              {isPlayingOriginal ? 'Playing...' : 'Play Original'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-lg">
          <CardContent className="p-4 text-center">
            <h3 className="text-white font-medium mb-3">Transcribed Audio</h3>
            <Button
              onClick={handlePlayTranscribed}
              variant="outline"
              className={`border-purple-400 text-purple-400 hover:bg-purple-400/10 ${isPlayingTranscribed ? 'animate-pulse' : ''}`}
            >
              <Play className="mr-2 h-4 w-4" />
              {isPlayingTranscribed ? 'Playing...' : 'Play Transcription'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Sheet Music */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="mr-2 h-5 w-5 text-green-400" />
              Sheet Music
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-slate-300 text-sm">PDF & MusicXML Ready</p>
            <Button
              onClick={() => handlePreview('sheet_url')}
              variant="outline"
              className="w-full border-green-400 text-green-400 hover:bg-green-400/10"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button
              onClick={() => handleDownload('sheet_url')}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </CardContent>
        </Card>

        {/* MIDI */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Music className="mr-2 h-5 w-5 text-purple-400" />
              MIDI File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-slate-300 text-sm">Playable in any DAW</p>
            <Button
              onClick={() => handlePreview('midi_url')}
              variant="outline"
              className="w-full border-purple-400 text-purple-400 hover:bg-purple-400/10"
            >
              <Play className="mr-2 h-4 w-4" />
              Play Preview
            </Button>
            <Button
              onClick={() => handleDownload('midi_url')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download MIDI
            </Button>
          </CardContent>
        </Card>

        {/* Piano Roll - Disabled as backend doesn't support */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Play className="mr-2 h-5 w-5 text-cyan-400" />
              Play-Roll Video
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-slate-300 text-sm">Animated Visualization (Future Feature)</p>
            <Button
              onClick={() => toast({ title: 'Coming Soon!', description: 'Piano roll video generation is a future feature.' })}
              variant="outline"
              className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
              disabled
            >
              <Play className="mr-2 h-4 w-4" />
              Watch Animation
            </Button>
            <Button
              onClick={() => toast({ title: 'Coming Soon!', description: 'Piano roll video download is a future feature.' })}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              disabled
            >
              <Download className="mr-2 h-4 w-4" />
              Download Video
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Notes & Timing - Updated to reflect current backend limits */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white">Musical Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 font-mono text-sm">
            <div>
              <h4 className="text-cyan-400 font-semibold mb-2">Detected Notes & Chords:</h4>
              <p>Advanced musical analysis (notes, chords, tempo, etc.) is a future enhancement.</p>
              <p>Currently, the backend provides the transcribed MIDI and PDF.</p>
            </div>
            <div>
              <h4 className="text-purple-400 font-semibold mb-2">Timing Information:</h4>
              <p>Tempo: N/A</p>
              <p>Time Signature: N/A</p>
              <p>Duration: N/A</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          onClick={onStartOver}
          variant="outline"
          size="lg"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Transcribe Another File
        </Button>

        <Button
          onClick={handleSaveToLibrary}
          size="lg"
          disabled={savedToLibrary}
          className={`${
            savedToLibrary
              ? 'bg-green-600 hover:bg-green-600'
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
          } text-white`}
        >
          <Save className="mr-2 h-5 w-5" />
          {savedToLibrary ? 'Saved to Library ✓' : 'Save to Library'}
        </Button>
      </div>
    </div>
  );
};

export default ResultsSection;