
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { User, Phone, Mail, Edit, Save, LogOut } from 'lucide-react';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    display_name: '',
    phone: '',
  });
  
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);
  
  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setProfile(data);
        setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          display_name: data.display_name || '',
          phone: data.phone || '',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error fetching profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (!user) return;
      
      const updates = {
        id: user.id,
        first_name: form.first_name,
        last_name: form.last_name,
        display_name: form.display_name || user.email,
        phone: form.phone,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
      
      setEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  if (loading && !profile) {
    return (
      <Layout>
        <div className="gradient-bg-purple min-h-screen">
          <div className="container px-4 py-8">
            <div className="flex justify-center">
              <p>Loading profile...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="gradient-bg-purple min-h-screen">
        <div className="container px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">My Profile</CardTitle>
                {!editing ? (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        placeholder="Your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        placeholder="Your last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      name="display_name"
                      value={form.display_name}
                      onChange={handleChange}
                      placeholder="How you want to be known on the platform"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Your contact number"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" disabled={loading} className="bg-appPurple hover:bg-appPurple-dark">
                      <Save size={16} className="mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 py-2">
                    <User className="text-gray-500" size={20} />
                    <span className="font-medium">
                      {profile?.display_name || user?.email?.split('@')[0]}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 py-2">
                    <Mail className="text-gray-500" size={20} />
                    <span>{user?.email}</span>
                  </div>
                  
                  {profile?.phone && (
                    <div className="flex items-center gap-2 py-2">
                      <Phone className="text-gray-500" size={20} />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 py-2">
                    <span className="font-medium">Full name:</span>
                    <span>
                      {profile?.first_name || profile?.last_name
                        ? `${profile?.first_name || ''} ${profile?.last_name || ''}`
                        : 'Not provided'}
                    </span>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <Button variant="destructive" onClick={handleLogout}>
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
