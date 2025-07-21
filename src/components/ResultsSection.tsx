import React, { useState, useRef, useEffect } from 'react';
import { Download, Play, FileText, Music, RotateCcw, Eye, Save, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface ResultsSectionProps {
  instrument: 'piano' | 'guitar';
  fileName: string;
  uploadedFile: File | null;
  onStartOver: () => void;
}

const ResultsSection = ({ instrument, fileName, uploadedFile, onStartOver }: ResultsSectionProps) => {
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [isPlayingTranscribed, setIsPlayingTranscribed] = useState(false);
  const [savedToLibrary, setSavedToLibrary] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();

  // Mock transcription data - in a real app this would come from the actual transcription process
  const transcriptionData = {
    detectedNotes: ['C4', 'E4', 'G4', 'C5', 'F4', 'A4', 'G4', 'B4', 'D5'],
    tempo: 120,
    timeSignature: '4/4',
    duration: '0:32'
  };

  // Create audio URL from uploaded file
  useEffect(() => {
    if (uploadedFile && audioRef.current) {
      const audioUrl = URL.createObjectURL(uploadedFile);
      audioRef.current.src = audioUrl;
      
      return () => {
        URL.revokeObjectURL(audioUrl);
      };
    }
  }, [uploadedFile]);

  const createDownloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = (type: string) => {
    const baseFileName = fileName.split('.')[0];
    
    switch (type) {
      case 'Sheet Music PDF':
        // Create a mock PDF content
        const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>
endobj
xref
0 4
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000100 00000 n 
trailer
<< /Size 4 /Root 1 0 R >>
startxref
149
%%EOF`;
        createDownloadFile(pdfContent, `${baseFileName}_sheet_music.pdf`, 'application/pdf');
        break;
        
      case 'MIDI File':
        // Create a mock MIDI file header
        const midiContent = 'MThd\x00\x00\x00\x06\x00\x00\x00\x01\x00\x60MTrk\x00\x00\x00\x1C\x00\xFF\x58\x04\x04\x02\x18\x08\x00\xFF\x59\x02\x00\x00\x00\xFF\x51\x03\x07\xA1\x20\x00\xFF\x2F\x00';
        createDownloadFile(midiContent, `${baseFileName}.mid`, 'audio/midi');
        break;
        
      case 'Play-Roll Video':
        // Create a mock video file
        const videoContent = 'Mock MP4 video content for piano roll animation';
        createDownloadFile(videoContent, `${baseFileName}_piano_roll.mp4`, 'video/mp4');
        break;
        
      default:
        break;
    }

    toast({
      title: `${type} Downloaded!`,
      description: `${type} has been saved to your downloads folder.`,
    });
  };

  const handlePreview = (type: string) => {
    switch (type) {
      case 'Sheet Music':
        // Open a new window with sheet music preview
        const sheetWindow = window.open('', '_blank', 'width=800,height=600');
        if (sheetWindow) {
          sheetWindow.document.write(`
            <html>
              <head><title>Sheet Music Preview</title></head>
              <body style="background: #f0f0f0; padding: 20px; text-align: center;">
                <h2>${fileName} - ${instrument} Sheet Music</h2>
                <div style="background: white; padding: 40px; margin: 20px auto; max-width: 600px; border: 1px solid #ccc;">
                  <p>♪ ♫ ♬ Sheet Music Preview ♩ ♪ ♫</p>
                  <p>C Major Scale: C - D - E - F - G - A - B - C</p>
                  <p>Notes detected in transcription</p>
                </div>
              </body>
            </html>
          `);
        }
        break;
        
      case 'MIDI':
        setIsPlayingTranscribed(!isPlayingTranscribed);
        setTimeout(() => setIsPlayingTranscribed(false), 3000);
        break;
        
      case 'Play-Roll Animation':
        // Open piano roll animation preview
        const rollWindow = window.open('', '_blank', 'width=800,height=400');
        if (rollWindow) {
          rollWindow.document.write(`
            <html>
              <head><title>Piano Roll Animation</title></head>
              <body style="background: #000; color: white; padding: 20px; text-align: center;">
                <h2>Piano Roll Animation Preview</h2>
                <div style="background: #333; height: 200px; margin: 20px auto; max-width: 600px; position: relative; overflow: hidden;">
                  <div style="position: absolute; top: 50%; left: -100px; animation: slide 3s linear infinite; color: cyan;">♪ ♫ ♬ ♩</div>
                </div>
                <style>
                  @keyframes slide { 0% { left: -100px; } 100% { left: 600px; } }
                </style>
              </body>
            </html>
          `);
        }
        break;
    }

    toast({
      title: `${type} Preview Opened`,
      description: `${type} preview is now available in a new window.`,
    });
  };

  const handlePlayOriginal = () => {
    if (!audioRef.current) {
      toast({
        title: "Audio not available",
        description: "No audio file to play.",
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

      // Create mock file links (in a real app these would be actual file URLs)
      const baseFileName = fileName.split('.')[0];
      const pdfLink = `https://example.com/files/${baseFileName}_sheet_music.pdf`;
      const midiLink = `https://example.com/files/${baseFileName}.mid`;
      const videoLink = `https://example.com/files/${baseFileName}_piano_roll.mp4`;

      const { error } = await supabase
        .from('transcriptions')
        .insert({
          user_id: user.id,
          filename: fileName,
          instrument: instrument,
          detected_notes: transcriptionData.detectedNotes,
          tempo: transcriptionData.tempo,
          time_signature: transcriptionData.timeSignature,
          duration: transcriptionData.duration,
          pdf_link: pdfLink,
          midi_link: midiLink,
          video_link: videoLink
        });

      if (error) {
        console.error('Error saving to library:', error);
        toast({
          title: "Error saving to library",
          description: "There was an error saving your transcription. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setSavedToLibrary(true);
      toast({
        title: "Saved to Library!",
        description: `${fileName} transcription has been saved to your personal library. Visit your profile to manage your saved files.`,
      });
    } catch (error) {
      console.error('Error saving to library:', error);
      toast({
        title: "Error saving to library",
        description: "There was an error saving your transcription. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  // Handle audio events
  const handleAudioEnded = () => {
    setIsPlayingOriginal(false);
  };

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
          Successfully transcribed <span className="text-cyan-400 font-medium">{fileName}</span> for {instrument}
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
            <h3 className="text-white font-medium mb-3">Transcribed Audio</h3>
            <Button
              onClick={() => {
                setIsPlayingTranscribed(!isPlayingTranscribed);
                setTimeout(() => setIsPlayingTranscribed(false), 3000);
              }}
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
          <CardContent className="space-y-4">
            <div className="bg-slate-700/30 rounded-lg p-8 text-center">
              <FileText className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <p className="text-slate-300 text-sm">PDF & MusicXML Ready</p>
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => handlePreview('Sheet Music')}
                variant="outline"
                className="w-full border-green-400 text-green-400 hover:bg-green-400/10"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button
                onClick={() => {
                  handleDownload('Sheet Music PDF');
                  window.open('https://example.com/files/sheet_music_preview.pdf', '_blank');
                }}
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
          <CardContent className="space-y-4">
            <div className="bg-slate-700/30 rounded-lg p-8 text-center">
              <Music className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <p className="text-slate-300 text-sm">Playable in any DAW</p>
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => handlePreview('MIDI')}
                variant="outline"
                className="w-full border-purple-400 text-purple-400 hover:bg-purple-400/10"
              >
                <Play className="mr-2 h-4 w-4" />
                Play Preview
              </Button>
              <Button
                onClick={() => {
                  handleDownload('MIDI File');
                  window.open('https://example.com/files/midi_preview.mid', '_blank');
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download MIDI
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Play-Roll Video */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Play className="mr-2 h-5 w-5 text-cyan-400" />
              Play-Roll Video
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-700/30 rounded-lg p-8 text-center">
              <Play className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
              <p className="text-slate-300 text-sm">Animated visualization</p>
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => handlePreview('Play-Roll Animation')}
                variant="outline"
                className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Animation
              </Button>
              <Button
                onClick={() => {
                  handleDownload('Play-Roll Video');
                  window.open('https://example.com/files/piano_roll_video.mp4', '_blank');
                }}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Video
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Musical Notes Display */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white">Musical Notes Detected</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-900/50 rounded-lg p-6 font-mono text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2">Detected Notes:</h4>
                <p>{transcriptionData.detectedNotes.join(', ')}</p>
                <p>Musical patterns automatically detected</p>
                <p>Chord progressions identified</p>
              </div>
              <div>
                <h4 className="text-purple-400 font-semibold mb-2">Timing:</h4>
                <p>Tempo: {transcriptionData.tempo} BPM</p>
                <p>Time Signature: {transcriptionData.timeSignature}</p>
                <p>Duration: {transcriptionData.duration}</p>
              </div>
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
