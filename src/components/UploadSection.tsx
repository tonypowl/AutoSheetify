
import React, { useRef, useState } from 'react';
import { Upload, Youtube, FileAudio, FileVideo, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UploadSectionProps {
  onFileUpload: (file: File) => void;
  onYoutubeSubmit: (url: string) => void;
  uploadedFile: File | null;
  youtubeUrl: string;
}

const UploadSection = ({ onFileUpload, onYoutubeSubmit, uploadedFile, youtubeUrl }: UploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [tempYoutubeUrl, setTempYoutubeUrl] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = ['audio/wav', 'video/mp4', 'audio/mpeg', 'audio/mp3'];
    if (validTypes.includes(file.type)) {
      onFileUpload(file);
    } else {
      alert('Please upload a valid audio (WAV, MP3) or video (MP4) file.');
    }
  };

  const handleYoutubeSubmit = () => {
    if (tempYoutubeUrl.includes('youtube.com') || tempYoutubeUrl.includes('youtu.be')) {
      onYoutubeSubmit(tempYoutubeUrl);
      setTempYoutubeUrl('');
    } else {
      alert('Please enter a valid YouTube URL.');
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* File Upload */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Upload className="mr-2 h-5 w-5 text-cyan-400" />
            Upload Audio/Video
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-cyan-400 bg-cyan-400/10' 
                : 'border-slate-600 hover:border-slate-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploadedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center text-green-400">
                  {uploadedFile.type.startsWith('audio') ? (
                    <FileAudio className="h-12 w-12" />
                  ) : (
                    <FileVideo className="h-12 w-12" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{uploadedFile.name}</p>
                  <p className="text-slate-400 text-sm">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFileUpload(null as any)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                <div>
                  <p className="text-white mb-2">Drop your files here, or click to browse</p>
                  <p className="text-slate-400 text-sm">Supports WAV, MP3, MP4 files</p>
                </div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                >
                  Choose File
                </Button>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/mp4"
            onChange={handleChange}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* YouTube URL */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Youtube className="mr-2 h-5 w-5 text-red-400" />
            YouTube Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {youtubeUrl ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center text-red-400">
                  <Youtube className="h-12 w-12" />
                </div>
                <div>
                  <p className="text-white font-medium">YouTube link added</p>
                  <p className="text-slate-400 text-sm break-all">{youtubeUrl}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onYoutubeSubmit('')}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Youtube className="h-12 w-12 text-slate-400 mx-auto" />
                <div>
                  <p className="text-white mb-2">Paste YouTube URL</p>
                  <p className="text-slate-400 text-sm">We'll extract the audio automatically</p>
                </div>
                <div className="space-y-2">
                  <Input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={tempYoutubeUrl}
                    onChange={(e) => setTempYoutubeUrl(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                  />
                  <Button
                    onClick={handleYoutubeSubmit}
                    disabled={!tempYoutubeUrl}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    Add YouTube Link
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadSection;
