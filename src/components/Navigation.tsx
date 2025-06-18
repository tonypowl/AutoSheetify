
import React from 'react';
import { Link } from 'react-router-dom';
import { Music, LogIn, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getDisplayName = () => {
    if (user?.username) {
      return user.username.length > 8 ? `${user.username.slice(0, 8)}...` : user.username;
    }
    if (user?.email) {
      const username = user.email.split('@')[0];
      return username.length > 8 ? `${username.slice(0, 8)}...` : username;
    }
    return 'User';
  };

  const getFullName = () => {
    return user?.username || user?.email || 'User';
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>👤 {getDisplayName()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-slate-800 border-slate-600 text-slate-200"
            >
              <DropdownMenuItem disabled className="text-slate-300 cursor-default">
                <User className="mr-2 h-4 w-4" />
                {getFullName()}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-slate-300 hover:bg-slate-700 focus:bg-slate-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
