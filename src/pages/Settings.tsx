
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useSafety } from '@/context/SafetyContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, Bell, User, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import needed LogIn component
import { LogIn } from 'lucide-react';

const Settings = () => {
  const { user, profile, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
    emergencyContacts,
    addEmergencyContact,
    removeEmergencyContact,
    isVoiceDetectionActive,
    toggleVoiceDetection,
    safeWord,
    updateSafeWord
  } = useSafety();
  
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [customSafeWord, setCustomSafeWord] = useState(safeWord);
  
  // New emergency contact form state
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelationship, setNewContactRelationship] = useState('');
  
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    try {
      // Update profile data
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Upload avatar if changed
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const filePath = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatar);
          
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        if (urlData) {
          await supabase
            .from('profiles')
            .update({ avatar_url: urlData.publicUrl })
            .eq('id', user.id);
        }
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating your profile",
      });
    }
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };
  
  const handleAddEmergencyContact = async () => {
    if (!newContactName || !newContactPhone) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide a name and phone number",
      });
      return;
    }
    
    await addEmergencyContact({
      name: newContactName,
      phone: newContactPhone,
      relationship: newContactRelationship,
      isEmergencyContact: true,
    });
    
    // Reset form fields
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRelationship('');
  };
  
  const handleUpdateSafeWord = () => {
    if (customSafeWord && customSafeWord.trim()) {
      updateSafeWord(customSafeWord);
      toast({
        title: "Safe word updated",
        description: `Your safe word has been updated to "${customSafeWord}"`,
      });
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-appPurple"></div>
        </div>
      </Layout>
    );
  }
  
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Shield className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Account Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to access your settings and safety features
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-appPurple hover:bg-appPurple-dark"
            >
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="gradient-bg-purple min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex mb-6">
              <TabsTrigger value="profile" className="flex items-center">
                <User size={16} className="mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="safety" className="flex items-center">
                <Shield size={16} className="mr-2" />
                Safety
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage 
                          src={profile?.avatar_url || ''} 
                          alt={`${firstName} ${lastName}`} 
                        />
                        <AvatarFallback className="text-lg">
                          {firstName && lastName 
                            ? `${firstName[0]}${lastName[0]}`.toUpperCase()
                            : user.email?.substring(0, 2).toUpperCase() || 'U'
                          }
                        </AvatarFallback>
                      </Avatar>
                      <Label 
                        htmlFor="avatar" 
                        className="cursor-pointer text-sm text-purple-600 hover:text-purple-800"
                      >
                        Change picture
                      </Label>
                      <Input 
                        id="avatar" 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleAvatarChange}
                      />
                    </div>
                    
                    <div className="w-full space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          value={user.email || ''}
                          readOnly
                          disabled
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleUpdateProfile}
                      className="bg-appPurple hover:bg-appPurple-dark"
                    >
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="safety">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Voice-Activated Safety</CardTitle>
                    <CardDescription>
                      Configure voice detection settings to alert your trusted contacts in case of emergency
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Voice Detection</h4>
                        <p className="text-sm text-gray-500">
                          Automatically detect distress phrases and activate emergency protocol
                        </p>
                      </div>
                      <Switch 
                        checked={isVoiceDetectionActive}
                        onCheckedChange={toggleVoiceDetection}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="safeWord">Safe Word/Phrase</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="safeWord" 
                          value={customSafeWord}
                          onChange={(e) => setCustomSafeWord(e.target.value)}
                          placeholder="e.g., Help Me"
                        />
                        <Button 
                          variant="outline"
                          onClick={handleUpdateSafeWord}
                        >
                          Update
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        This is the phrase that will trigger the emergency protocol when detected
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Contacts</CardTitle>
                    <CardDescription>
                      Add trusted contacts who will be notified in case of emergency
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {emergencyContacts.length === 0 ? (
                        <div className="text-center py-4 bg-gray-50 rounded-md">
                          <Bell className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                          <p className="text-gray-600">No emergency contacts added yet</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {emergencyContacts.map(contact => (
                            <div 
                              key={contact.id} 
                              className="flex items-center justify-between p-3 border rounded-md"
                            >
                              <div>
                                <p className="font-medium">{contact.name}</p>
                                <p className="text-sm text-gray-500">{contact.phone}</p>
                                {contact.relationship && (
                                  <p className="text-xs text-gray-400">{contact.relationship}</p>
                                )}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeEmergencyContact(contact.id)}
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Add New Contact</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="contactName">Name</Label>
                          <Input 
                            id="contactName" 
                            value={newContactName}
                            onChange={(e) => setNewContactName(e.target.value)}
                            placeholder="Contact name"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="contactPhone">Phone Number</Label>
                          <Input 
                            id="contactPhone" 
                            value={newContactPhone}
                            onChange={(e) => setNewContactPhone(e.target.value)}
                            placeholder="+91 9876543210"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="contactRelationship">Relationship (Optional)</Label>
                          <Input 
                            id="contactRelationship" 
                            value={newContactRelationship}
                            onChange={(e) => setNewContactRelationship(e.target.value)}
                            placeholder="E.g., Family, Friend, Roommate"
                          />
                        </div>
                        
                        <Button 
                          onClick={handleAddEmergencyContact}
                          className="w-full"
                        >
                          <Plus size={16} className="mr-2" />
                          Add Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
