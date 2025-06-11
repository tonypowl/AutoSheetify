import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Music, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import LoginLoadingAnimation from './LoginLoadingAnimation';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: isLogin ? "Welcome back!" : "Account created!",
        description: `Successfully ${isLogin ? 'logged in' : 'signed up'}`,
      });
      
      // Navigate to main AutoSheetify page after successful login/signup
      navigate('/');
    }, 2500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (isLoading) {
    return <LoginLoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Floating musical notes background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {['♪', '♫', '♬', '♩'].map((note, index) => (
          <div
            key={index}
            className={`absolute text-slate-600/10 text-4xl animate-float-${index + 1}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${index * 0.8}s`,
              animationDuration: `${5 + Math.random() * 3}s`,
            }}
          >
            {note}
          </div>
        ))}
      </div>

      <Card className="w-full max-w-md bg-slate-800/80 border-slate-700/50 backdrop-blur-lg shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Music className="h-12 w-12 text-cyan-400 mr-3" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AutoSheetify
            </h1>
          </div>
          <CardTitle className="text-white text-xl">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <p className="text-slate-400 text-sm">
            {isLogin ? 'Sign in to access your music transcriptions' : 'Join the music transcription revolution'}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-400"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            {/* Remember Me */}
            {isLogin && (
              <div className="flex items-center space-x-2">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="rounded border-slate-600 bg-slate-700 text-cyan-400 focus:ring-cyan-400"
                />
                <Label htmlFor="rememberMe" className="text-slate-300 text-sm">
                  Remember me
                </Label>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Toggle between Login/Signup */}
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-cyan-400 hover:text-cyan-300 ml-1 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Forgot Password */}
          {isLogin && (
            <div className="text-center">
              <button className="text-slate-400 hover:text-cyan-400 text-sm">
                Forgot your password?
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
