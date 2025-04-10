
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, User, Bell, MapPin, LogOut, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  
  const handleClearData = () => {
    toast({
      title: "Data cleared",
      description: "Your saved data has been cleared successfully",
    });
  };
  
  return (
    <Layout>
      <div className="gradient-bg-gray min-h-screen">
        <div className="container px-4 py-4">
          <div className="text-left mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <SettingsIcon size={24} className="mr-2" />
              Settings
            </h1>
            <p className="text-gray-600">Manage your app preferences</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-lg mb-4">Account</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User size={18} className="mr-2 text-gray-500" />
                    <span>Edit Profile</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell size={18} className="mr-2 text-gray-500" />
                    <span>Notification Preferences</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Manage
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin size={18} className="mr-2 text-gray-500" />
                    <span>Location Settings</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-lg mb-4">Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="cursor-pointer">Enable Push Notifications</Label>
                  <Switch id="notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="location" className="cursor-pointer">Allow Location Access</Label>
                  <Switch id="location" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="anonymous" className="cursor-pointer">Anonymous Roommate Search</Label>
                  <Switch id="anonymous" />
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-4">Data & Privacy</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Clear Saved Data</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearData}
                  >
                    Clear
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Privacy Policy</span>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Terms of Service</span>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button 
              variant="outline" 
              className="flex-1 flex items-center justify-center"
            >
              <HelpCircle size={16} className="mr-1" />
              Help & Support
            </Button>
            
            <Button 
              variant="destructive" 
              className="flex-1 flex items-center justify-center"
            >
              <LogOut size={16} className="mr-1" />
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
