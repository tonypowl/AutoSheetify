
import React, { useState } from 'react';
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
import { Calendar, Download, FileText, Music, Trash2, User, Mail, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user?.username || '');

  // Mock data for demonstrations
  const joinedDate = new Date('2024-01-15').toLocaleDateString();
  const downloads = [
    { id: 1, name: 'Beethoven Symphony No.9', format: 'PDF', date: '2024-06-20', size: '2.5 MB' },
    { id: 2, name: 'Jazz Improvisation', format: 'MIDI', date: '2024-06-18', size: '1.2 MB' },
    { id: 3, name: 'Classical Guitar Piece', format: 'PDF', date: '2024-06-15', size: '3.1 MB' },
  ];

  const recentConversions = [
    { id: 1, name: 'Audio to Sheet Music', input: 'MP3', output: 'PDF', date: '2024-06-22' },
    { id: 2, name: 'MIDI to Score', input: 'MIDI', output: 'PDF', date: '2024-06-21' },
    { id: 3, name: 'Audio Analysis', input: 'WAV', output: 'MIDI', date: '2024-06-19' },
  ];

  const handleSaveProfile = () => {
    // Here you would typically update the user profile
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Here you would typically delete the account
      logout();
      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully.",
        variant: "destructive",
      });
      navigate('/');
    }
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
                    <p className="text-slate-100 p-2 bg-slate-700 rounded">{user.username || 'Not set'}</p>
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
                  {downloads.map((download) => (
                    <TableRow key={download.id} className="border-slate-700">
                      <TableCell className="text-slate-100">{download.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {getFormatIcon(download.format)}
                          <span className="ml-1">{download.format}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">{download.date}</TableCell>
                      <TableCell className="text-slate-300">{download.size}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                  {recentConversions.map((conversion) => (
                    <TableRow key={conversion.id} className="border-slate-700">
                      <TableCell className="text-slate-100">{conversion.name}</TableCell>
                      <TableCell className="text-slate-300">
                        {conversion.input} → {conversion.output}
                      </TableCell>
                      <TableCell className="text-slate-300">{conversion.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-900/20">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                <Button 
                  onClick={handleDeleteAccount}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
