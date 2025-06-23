import React, { useState } from 'react';
import { Music, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

type NavigationProps = {
  onInstrumentPick?: (instrument: 'piano' | 'guitar') => void;
};

const Navigation = ({ onInstrumentPick }: NavigationProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isInstrumentOpen, setIsInstrumentOpen] = useState(false);

  const getDisplayName = () => {
    if (user?.username) return user.username.length > 8 ? `${user.username.slice(0, 8)}...` : user.username;
    if (user?.email) {
      const name = user.email.split('@')[0];
      return name.length > 8 ? `${name.slice(0, 8)}...` : name;
    }
    return 'User';
  };

  const getFullName = () => user?.username || user?.email || 'User';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-lg shadow-md border-b border-slate-700">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        {/* Logo */}
       <a href="#home" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
  <Music className="h-8 w-8 text-cyan-400" />
  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
    AutoSheetify
  </h1>
</a>


        {/* Nav Links */}
        <div className="flex items-center space-x-6 text-slate-300">
          <a href="#home" className="hover:text-white transition font-medium">Home</a>
          <a href="#about" className="hover:text-white transition font-medium">About Us</a>

          {/* ✅ Improved Hover-fixed dropdown */}
<div className="relative group">
  <div className="cursor-pointer font-medium hover:text-white transition">
    Instrument ▾
  </div>

  <div
    className={`
      absolute left-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-50 
      invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 
      transition-all duration-200 ease-out transform -translate-y-2
    `}
  >
    <ul className="text-sm text-white py-1 text-left">
      <li>
        <button
          onClick={() => onInstrumentPick?.('piano')}
          className="w-full text-left px-4 py-2 hover:bg-slate-700 transition"
        >
          Piano
        </button>
      </li>
      <li>
        <button
          onClick={() => onInstrumentPick?.('guitar')}
          className="w-full text-left px-4 py-2 hover:bg-slate-700 transition"
        >
          Guitar
        </button>
      </li>
    </ul>
  </div>
</div>


          {/* Auth Logic */}
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
              <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-600 text-slate-200">
                <DropdownMenuItem disabled className="text-slate-300 cursor-default">
                  <User className="mr-2 h-4 w-4" />
                  {getFullName()}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={logout}
                  className="text-slate-300 hover:bg-slate-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <a href="/login">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
