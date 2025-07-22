import React, { useState, useRef, useEffect } from 'react';
import { Download, Play, FileText, Music, RotateCcw, Eye, Save, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';

// *******************************************************************
// IMPORTANT FIX: Add 'export' before interface TranscriptionData
// *******************************************************************
export interface TranscriptionData {
  status: string;
  sheet_url: string;
  midi_url: string;
  original_filename: string; // Added based on your backend logs
  // Uncomment and add types if your backend starts returning these
  // detected_notes?: string[];
  // tempo?: number;
  // time_signature?: string;
  // duration?: string;
  // video_link?: string; // Optional because your backend doesn't provide it yet
}
// *******************************************************************

interface ResultsSectionProps {
  instrument: 'piano' | 'guitar';
  fileName: string; // The original name of the uploaded file
  uploadedFile: File | null; // The actual File object for playing original audio
  transcriptionData: TranscriptionData | null; // The data returned from your backend
  onStartOver: () => void;
}

const ResultsSection = ({ instrument, fileName, uploadedFile, transcriptionData, onStartOver }: ResultsSectionProps) => {
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [isPlayingTranscribed, setIsPlayingTranscribed] = useState(false);
  const [savedToLibrary, setSavedToLibrary] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate(); // For potential future navigation to a library page

  // Use the transcriptionData from props
  const data = transcriptionData;

  // Effect to handle playing the original uploaded audio
  useEffect(() => {
    if (uploadedFile && audioRef.current) {
      const audioUrl = URL.createObjectURL(uploadedFile);
      audioRef.current.src = audioUrl;

      // Clean up the object URL when component unmounts or file changes
      return () => {
        URL.revokeObjectURL(audioUrl);
      };
    }
  }, [uploadedFile]);

  // Handle audio playback end for original audio
  const handleAudioEnded = () => {
    setIsPlayingOriginal(false);
  };

  const handleDownload = (type: 'sheet_url' | 'midi_url') => {
    if (!data) {
      toast({ title: 'Error', description: 'No transcription data available for download.' });
      return;
    }

    let url = '';
    let downloadFileName = '';

    if (type === 'sheet_url') {
      url = data.sheet_url;
      // Extract filename from URL or use a generic one if not available
      downloadFileName = url.substring(url.lastIndexOf('/') + 1) || `${data.original_filename || 'sheet_music'}.pdf`;
    } else if (type === 'midi_url') {
      url = data.midi_url;
      downloadFileName = url.substring(url.lastIndexOf('/') + 1) || `${data.original_filename || 'midi_file'}.mid`;
    }

    if (!url) {
      toast({ title: 'Error', description: `No URL available for ${type}.` });
      return;
    }

    // Programmatically create and click a link to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFileName; // Suggest a filename for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Download Started',
      description: `Downloading ${downloadFileName}`,
    });
  };

  const handlePreview = (type: 'sheet_url' | 'midi_url') => {
    if (!data) {
      toast({ title: 'Error', description: 'No transcription data available for preview.' });
      return;
    }
    const url = data[type];

    if (typeof url === 'string' && url) {
      window.open(url, '_blank'); // Open the URL in a new tab for preview
    } else {
      toast({ title: 'Error', description: 'Invalid preview URL or no URL available.' });
    }
  };

  const handlePlayOriginal = () => {
    if (!audioRef.current || !uploadedFile) {
      toast({
        title: "Audio not available",
        description: "No original audio file to play.",
        variant: "destructive"
      });
      return;
    }

    if (isPlayingOriginal) {
      audioRef.current.pause();
      setIsPlayingOriginal(false);
      toast({
        title: "Stopped Original Audio",
        description: "Original audio playback stopped.",
      });
    } else {
      audioRef.current.play();
      setIsPlayingOriginal(true);
      toast({
        title: "Playing Original Audio",
        description: "Playing the original uploaded audio.",
      });
    }
  };

  const handlePlayTranscribed = () => {
    // This is currently a simulated playback for MIDI as browser-based MIDI players
    // require additional libraries (e.g., Tone.js, Midi.js).
    setIsPlayingTranscribed(true);
    toast({
        title: 'Playing Transcribed Audio (Simulated)',
        description: 'Playback of transcribed MIDI is simulated. For actual playback, download the MIDI file.',
    });
    setTimeout(() => setIsPlayingTranscribed(false), 3000); // Simulate 3 seconds of playback
  };

  const handleSaveToLibrary = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save to your library.",
          variant: "destructive"
        });
        return;
      }

      if (!data) {
        toast({
          title: "Error saving",
          description: "No transcription data to save.",
          variant: "destructive"
        });
        return;
      }

      // Use actual links from backend response
      const pdfLink = data.sheet_url;
      const midiLink = data.midi_url;
      // videoLink is not provided by backend yet
      const videoLink = null; // Set to null as backend doesn't provide it

      const { error } = await supabase
        .from('transcriptions')
        .insert({
          user_id: user.id,
          filename: data.original_filename || fileName, // Use original_filename from backend if available
          instrument: instrument,
          // These fields are not returned by your current backend, set as null or default
          detected_notes: [], 
          tempo: null,
          time_signature: null,
          duration: null,
          pdf_link: pdfLink,
          midi_link: midiLink,
          video_link: videoLink
        });

      if (error) {
        console.error('Error saving to library:', error);
        toast({
          title: "Error saving to library",
          description: `There was an error saving your transcription: ${error.message}. Please try again.`,
          variant: "destructive"
        });
        return;
      }

      setSavedToLibrary(true);
      toast({
        title: "Saved to Library!",
        description: `${data.original_filename || fileName} transcription has been saved to your personal library.`,
      });
    } catch (error) {
      console.error('Error saving to library:', error);
      toast({
        title: "Error saving to library",
        description: "An unexpected error occurred while saving your transcription. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleGoBack = () => {
    // This goes back one step in browser history, which is useful after a successful transcription.
    window.history.back();
  };

  // Display a loading/error message if data isn't available yet
  if (!data || data.status !== 'success') {
    return <div className="text-center text-slate-300">No transcription data available or an error occurred.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hidden audio element for playing original file */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onPause={() => setIsPlayingOriginal(false)}
        className="hidden"
      />

      {/* Go Back Button */}
      <div className="flex justify-start mb-4">
        <Button
          onClick={handleGoBack}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">✓</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Transcription Complete!</h2>
        </div>
        <p className="text-slate-300">
          Successfully transcribed <span className="text-cyan-400 font-medium">{data.original_filename || fileName}</span> for {instrument}
        </p>
      </div>

      {/* Audio Playback Controls */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
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
            <h3 className="text-white font-medium mb-3">Transcribed Audio (Simulated)</h3>
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

      {/* Results Grid */}
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
            <div className="bg-slate-700/30 rounded-lg p-8 text-center">
              <FileText className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <p className="text-slate-300 text-sm">PDF & MusicXML Ready</p>
            </div>
            <div className="space-y-2">
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
            </div>
          </CardContent>
        </Card>

        {/* MIDI File */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Music className="mr-2 h-5 w-5 text-purple-400" />
              MIDI File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="bg-slate-700/30 rounded-lg p-8 text-center">
              <Music className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <p className="text-slate-300 text-sm">Playable in any DAW</p>
            </div>
            <div className="space-y-2">
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
            </div>
          </CardContent>
        </Card>

        {/* Play-Roll Video - Still disabled as backend doesn't support */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Play className="mr-2 h-5 w-5 text-cyan-400" />
              Play-Roll Video
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="bg-slate-700/30 rounded-lg p-8 text-center">
              <Play className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
              <p className="text-slate-300 text-sm">Animated Visualization (Future Feature)</p>
            </div>
            <div className="space-y-2">
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Musical Notes Display - Updated to reflect current backend limits */}
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