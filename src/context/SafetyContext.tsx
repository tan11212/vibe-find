
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

interface DistressData {
  isActive: boolean;
  activatedAt?: Date;
  location?: LocationData;
  audioRecording?: string;
  images?: string[];
  contacts?: EmergencyContact[];
}

interface SafetyContextType {
  distressData: DistressData | null;
  emergencyContacts: EmergencyContact[];
  isSafeMode: boolean;
  safeZones: { id: string; name: string; coordinates: [number, number]; radius: number }[];
  triggerDistressSignal: () => void;
  cancelDistressSignal: () => void;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeEmergencyContact: (id: string) => void;
  toggleSafeMode: () => void;
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [distressData, setDistressData] = useState<DistressData | null>({
    isActive: false
  });
  
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [isSafeMode, setIsSafeMode] = useState<boolean>(false);
  const [safeZones, setSafeZones] = useState<{ id: string; name: string; coordinates: [number, number]; radius: number }[]>([]);
  
  // Load emergency contacts when user is authenticated
  useEffect(() => {
    const loadEmergencyContacts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // In a real app, we would fetch emergency contacts from Supabase
      // For now, we'll use dummy data
      setEmergencyContacts([
        { id: '1', name: 'John Doe', phone: '+1234567890', relationship: 'Family' },
        { id: '2', name: 'Jane Smith', phone: '+0987654321', relationship: 'Friend' }
      ]);
    };
    
    loadEmergencyContacts();
  }, []);
  
  const triggerDistressSignal = () => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date()
        };
        
        setDistressData({
          isActive: true,
          activatedAt: new Date(),
          location: locationData,
          contacts: emergencyContacts
        });
        
        // In a real implementation, we would:
        // 1. Send notifications to emergency contacts
        // 2. Start recording audio/video
        // 3. Upload data to secure storage
        console.log('Emergency mode activated', locationData, emergencyContacts);
      });
    } else {
      // Fallback if geolocation is not available
      setDistressData({
        isActive: true,
        activatedAt: new Date(),
        contacts: emergencyContacts
      });
    }
  };
  
  const cancelDistressSignal = () => {
    setDistressData({
      isActive: false
    });
    console.log('Emergency mode deactivated');
  };
  
  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: `contact-${Date.now()}`
    };
    
    setEmergencyContacts([...emergencyContacts, newContact]);
  };
  
  const removeEmergencyContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
  };
  
  const toggleSafeMode = () => {
    setIsSafeMode(!isSafeMode);
  };
  
  return (
    <SafetyContext.Provider
      value={{
        distressData,
        emergencyContacts,
        isSafeMode,
        safeZones,
        triggerDistressSignal,
        cancelDistressSignal,
        addEmergencyContact,
        removeEmergencyContact,
        toggleSafeMode
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (context === undefined) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};
