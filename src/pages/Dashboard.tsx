
import React from 'react';
import { Music, FileText, Download, Plus, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  // Mock data for demonstration
  const recentTranscriptions = [
    {
      id: 1,
      filename: "favorite_song.mp3",
      instrument: "Piano",
      createdAt: "2024-01-15",
      status: "completed"
    },
    {
      id: 2,
      filename: "guitar_riff.wav",
      instrument: "Guitar", 
      createdAt: "2024-01-14",
      status: "completed"
    },
    {
      id: 3,
      filename: "youtube_song.mp4",
      instrument: "Piano",
      createdAt: "2024-01-13",
      status: "processing"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Music className="h-8 w-8 text-cyan-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AutoSheetify Dashboard
            </h1>
          </div>
          <Button 
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back!</h2>
          <p className="text-slate-400">Ready to transcribe some music today?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-lg hover:bg-slate-800/80 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Plus className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">New Transcription</h3>
              <p className="text-slate-400 mb-4">Upload audio or video files</p>
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
                Start Now
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-lg">
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Recent Files</h3>
              <p className="text-slate-400 mb-4">{recentTranscriptions.length} transcriptions</p>
              <div className="text-2xl font-bold text-green-400">{recentTranscriptions.filter(t => t.status === 'completed').length}</div>
              <p className="text-sm text-slate-400">Completed</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-lg">
            <CardContent className="p-6 text-center">
              <Download className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Downloads</h3>
              <p className="text-slate-400 mb-4">Sheet music & MIDI files</p>
              <div className="text-2xl font-bold text-purple-400">{recentTranscriptions.length * 2}</div>
              <p className="text-sm text-slate-400">Files ready</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transcriptions */}
        <Card className="bg-slate-800/60 border-slate-700/50 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-cyan-400" />
              Recent Transcriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTranscriptions.map((transcription) => (
                <div 
                  key={transcription.id}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Music className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{transcription.filename}</h4>
                      <p className="text-slate-400 text-sm">
                        {transcription.instrument} • {transcription.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transcription.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {transcription.status}
                    </span>
                    {transcription.status === 'completed' && (
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
