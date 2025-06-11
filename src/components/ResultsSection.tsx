
import React from 'react';
import { Download, Play, FileText, Music, RotateCcw, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ResultsSectionProps {
  instrument: 'piano' | 'guitar';
  fileName: string;
  onStartOver: () => void;
}

const ResultsSection = ({ instrument, fileName, onStartOver }: ResultsSectionProps) => {
  const handleDownload = (type: string) => {
    toast({
      title: `Downloading ${type}...`,
      description: `Your ${type} file will be downloaded shortly.`,
    });
  };

  const handlePreview = (type: string) => {
    toast({
      title: `Opening ${type} preview`,
      description: `Loading ${type} preview window...`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
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
                onClick={() => handleDownload('Sheet Music PDF')}
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
                onClick={() => handleDownload('MIDI File')}
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
                onClick={() => handleDownload('Play-Roll Video')}
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
                <p>C4, E4, G4, C5 (C Major Chord)</p>
                <p>F4, A4, C5 (F Major Chord)</p>
                <p>G4, B4, D5 (G Major Chord)</p>
              </div>
              <div>
                <h4 className="text-purple-400 font-semibold mb-2">Timing:</h4>
                <p>Tempo: 120 BPM</p>
                <p>Time Signature: 4/4</p>
                <p>Duration: 0:32</p>
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
          onClick={() => toast({ title: "Feature coming soon!", description: "Save to library will be available in the next update." })}
          size="lg"
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
        >
          Save to Library
        </Button>
      </div>
    </div>
  );
};

export default ResultsSection;
