
import React from 'react';
import { Link } from 'react-router-dom';
import { Music, LogIn, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getDisplayName = () => {
    if (user?.username) {
      return user.username;
    }
    if (user?.email) {
      return user.email.split('@')[0]; // Use part before @ as username
    }
    return null;
  };

  return (
    <nav className="relative z-10 p-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Music className="h-8 w-8 text-cyan-400 mr-3" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            AutoSheetify
          </h1>
        </div>
        
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-slate-300">
              <User className="mr-2 h-4 w-4" />
              {getDisplayName() ? (
                <span>Logged in as {getDisplayName()}</span>
              ) : (
                <span>Logged in</span>
              )}
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        ) : (
          <Link to="/login">
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
