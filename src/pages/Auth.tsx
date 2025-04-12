
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import Layout from '@/components/Layout';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();
    
    // Setup listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate('/');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Account created!',
        description: 'Please check your email for verification.',
      });
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred during signup',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      // Navigation will be handled by the auth state change listener
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Invalid login credentials',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="gradient-bg-purple min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome to PG Finder</h1>
          
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Login</TabsTrigger>
              <TabsTrigger value="signup">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="email-login" className="flex items-center">
                    <Mail size={16} className="mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password-login" className="flex items-center">
                    <Lock size={16} className="mr-2" />
                    Password
                  </Label>
                  <Input
                    id="password-login"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-appPurple hover:bg-appPurple-dark"
                  disabled={loading}
                >
                  <LogIn size={16} className="mr-2" />
                  {loading ? 'Logging in...' : 'Log In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="email-signup" className="flex items-center">
                    <Mail size={16} className="mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password-signup" className="flex items-center">
                    <Lock size={16} className="mr-2" />
                    Password
                  </Label>
                  <Input
                    id="password-signup"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-appPurple hover:bg-appPurple-dark"
                  disabled={loading}
                >
                  <UserPlus size={16} className="mr-2" />
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
