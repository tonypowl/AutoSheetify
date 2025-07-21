import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Calendar, Download, FileText, Music, Trash2, User, Mail, Clock, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user?.user_metadata?.full_name || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const [transcriptions, setTranscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const joinedDate = new Date(user?.created_at || '2024-01-15').toLocaleDateString();

  // Fetch user's transcriptions from Supabase
  const fetchTranscriptions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('transcriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transcriptions:', error);
        toast({
          title: "Error loading data",
          description: "Failed to load your transcriptions. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setTranscriptions(data || []);
    } catch (error) {
      console.error('Error fetching transcriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTranscriptions();
  }, [user]);

  const handleSaveProfile = () => {
    // Here you would typically update the user profile
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    
    const { error } = await deleteAccount();
    
    if (error) {
      toast({
        title: "Failed to delete account",
        description: error,
        variant: "destructive",
      });
      setIsDeleting(false);
    } else {
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
        variant: "destructive",
      });
      navigate('/');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleDeleteTranscription = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transcriptions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting transcription:', error);
        toast({
          title: "Error deleting item",
          description: "Failed to delete the transcription. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setTranscriptions(prev => prev.filter(t => t.id !== id));
      
      toast({
        title: "Item deleted",
        description: "Transcription has been removed from your library.",
      });
    } catch (error) {
      console.error('Error deleting transcription:', error);
      toast({
        title: "Error deleting item",
        description: "Failed to delete the transcription. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadFile = (url: string, filename: string) => {
    // Create a download link
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: `${filename} download has started.`,
    });
  };

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'midi':
        return <Music className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getFileSize = (filename: string) => {
    // Mock file sizes based on format
    if (filename.includes('.pdf')) return '2.5 MB';
    if (filename.includes('.mid')) return '1.2 MB';
    if (filename.includes('.mp4')) return '15.3 MB';
    return '1.0 MB';
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-3 rounded-full">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-slate-100">Profile</CardTitle>
                    <CardDescription className="text-slate-400">
                      Manage your account settings and view your activity
                    </CardDescription>
                  </div>
                </div>
                <Button
                  onClick={handleBackToHome}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* User Information */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center">
                <User className="mr-2 h-5 w-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-300">Username</Label>
                  {isEditing ? (
                    <Input
                      id="username"
                      value={editedUsername}
                      onChange={(e) => setEditedUsername(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-slate-100"
                    />
                  ) : (
                    <p className="text-slate-100 p-2 bg-slate-700 rounded">{user.user_metadata?.full_name || 'Not set'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Label>
                  <p className="text-slate-100 p-2 bg-slate-700 rounded">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Joined Date
                  </Label>
                  <p className="text-slate-100 p-2 bg-slate-700 rounded">{joinedDate}</p>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                {isEditing ? (
                  <>
                    <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="border-slate-600 text-slate-300">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="bg-cyan-600 hover:bg-cyan-700">
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* My Downloads */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center">
                <Download className="mr-2 h-5 w-5" />
                My Downloads
              </CardTitle>
              <CardDescription className="text-slate-400">
                Your downloaded files and formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-slate-400">Loading...</div>
              ) : transcriptions.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  No downloads yet. Start by transcribing an audio file!
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">File Name</TableHead>
                      <TableHead className="text-slate-300">Format</TableHead>
                      <TableHead className="text-slate-300">Date</TableHead>
                      <TableHead className="text-slate-300">Size</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transcriptions.flatMap((transcription) => {
                      const files = [];
                      if (transcription.pdf_link) {
                        files.push({
                          id: `${transcription.id}-pdf`,
                          name: transcription.filename.replace(/\.[^/.]+$/, '') + '_sheet_music',
                          format: 'PDF',
                          date: new Date(transcription.created_at).toLocaleDateString(),
                          size: getFileSize('pdf'),
                          url: transcription.pdf_link,
                          transcriptionId: transcription.id
                        });
                      }
                      if (transcription.midi_link) {
                        files.push({
                          id: `${transcription.id}-midi`,
                          name: transcription.filename.replace(/\.[^/.]+$/, ''),
                          format: 'MIDI',
                          date: new Date(transcription.created_at).toLocaleDateString(),
                          size: getFileSize('midi'),
                          url: transcription.midi_link,
                          transcriptionId: transcription.id
                        });
                      }
                      return files;
                    }).map((file) => (
                      <TableRow key={file.id} className="border-slate-700">
                        <TableCell className="text-slate-100">{file.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {getFormatIcon(file.format)}
                            <span className="ml-1">{file.format}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{file.date}</TableCell>
                        <TableCell className="text-slate-300">{file.size}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                              onClick={() => handleDownloadFile(file.url, `${file.name}.${file.format.toLowerCase()}`)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-900/20">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-slate-800 border-slate-700">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-slate-100">Delete Download</AlertDialogTitle>
                                  <AlertDialogDescription className="text-slate-300">
                                    Are you sure you want to delete this transcription? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteTranscription(file.transcriptionId)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Recent Conversions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Recent Conversions
              </CardTitle>
              <CardDescription className="text-slate-400">
                History of your file conversions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-slate-400">Loading...</div>
              ) : transcriptions.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  No conversions yet. Start by transcribing an audio file!
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Conversion</TableHead>
                      <TableHead className="text-slate-300">Input → Output</TableHead>
                      <TableHead className="text-slate-300">Date</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transcriptions.map((transcription) => (
                      <TableRow key={transcription.id} className="border-slate-700">
                        <TableCell className="text-slate-100">{transcription.filename}</TableCell>
                        <TableCell className="text-slate-300">
                          {transcription.filename.split('.').pop()?.toUpperCase() || 'AUDIO'} → PDF
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {new Date(transcription.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {transcription.pdf_link && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                onClick={() => handleDownloadFile(transcription.pdf_link, `${transcription.filename.replace(/\.[^/.]+$/, '')}_sheet_music.pdf`)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-900/20">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-slate-800 border-slate-700">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-slate-100">Delete Conversion</AlertDialogTitle>
                                  <AlertDialogDescription className="text-slate-300">
                                    Are you sure you want to delete this conversion? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteTranscription(transcription.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Account Settings</CardTitle>
              <CardDescription className="text-slate-400">
                Manage your account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-slate-700/50 border-slate-600">
                <AlertDescription className="text-slate-300">
                  Password management and additional security features will be available soon.
                </AlertDescription>
              </Alert>
              
              <Separator className="bg-slate-600" />
              
              <div className="pt-4">
                <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
                <p className="text-slate-400 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-800 border-slate-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-slate-100">
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-300">
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data from our servers. You will need to create a new
                        account if you want to use our services again.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Yes, delete my account'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
