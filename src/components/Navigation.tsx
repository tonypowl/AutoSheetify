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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-lg shadow-md border-b border-slate-700">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Music className="h-8 w-8 text-cyan-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            AutoSheetify
          </h1>
        </div>

        {/* Navigation links + Profile */}
        <div className="flex items-center space-x-6 text-slate-300">
          <a href="#home" className="hover:text-white transition font-medium">Home</a>
          <a href="#about" className="hover:text-white transition font-medium">About Us</a>

          {/* Instrument Dropdown */}
          <div className="relative group">
            <button className="font-medium hover:text-white transition">
              Instrument ▾
            </button>
            <div className="absolute hidden group-hover:block bg-slate-800 border border-slate-700 rounded-md mt-2 w-40 shadow-lg z-50">
              <ul className="text-sm text-white py-1">
                <li><a href="#" className="block px-4 py-2 hover:bg-slate-700">Keyboard</a></li>
                <li><a href="#" className="block px-4 py-2 hover:bg-slate-700">Guitar</a></li>
                <li><a href="#" className="block px-4 py-2 hover:bg-slate-700">Vocals</a></li>
              </ul>
            </div>
          </div>

          {/* Profile / Login Button */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>{getDisplayName()}</span>
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
      </div>
    </nav>
  );
};

export default Navigation;
