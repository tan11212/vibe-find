
import React, { createContext, useState, useContext, useEffect } from 'react';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
}

interface SafeZone {
  id: string;
  name: string;
  address: string;
  isSafe: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface SafetySettings {
  safeWord: string;
  voiceRecognitionEnabled: boolean;
  locationSharingEnabled: boolean;
  autoRecordEnabled: boolean;
  stealthModeEnabled: boolean;
  offlineModeEnabled: boolean;
  communityModeEnabled: boolean;
}

interface DistressData {
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
  audioRecordingUrl?: string;
  photoUrls?: string[];
  isActive: boolean;
}

interface SafetyContextType {
  emergencyContacts: EmergencyContact[];
  safeZones: SafeZone[];
  settings: SafetySettings;
  distressData: DistressData | null;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeEmergencyContact: (id: string) => void;
  addSafeZone: (zone: Omit<SafeZone, 'id'>) => void;
  removeSafeZone: (id: string) => void;
  updateSettings: (newSettings: Partial<SafetySettings>) => void;
  triggerDistressSignal: () => void;
  cancelDistressSignal: () => void;
}

const defaultSettings: SafetySettings = {
  safeWord: "Help Me",
  voiceRecognitionEnabled: false,
  locationSharingEnabled: true,
  autoRecordEnabled: true,
  stealthModeEnabled: false,
  offlineModeEnabled: true,
  communityModeEnabled: false,
};

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [settings, setSettings] = useState<SafetySettings>(defaultSettings);
  const [distressData, setDistressData] = useState<DistressData | null>(null);
  
  // Load data from localStorage
  useEffect(() => {
    const savedContacts = localStorage.getItem('emergencyContacts');
    if (savedContacts) {
      setEmergencyContacts(JSON.parse(savedContacts));
    }
    
    const savedZones = localStorage.getItem('safeZones');
    if (savedZones) {
      setSafeZones(JSON.parse(savedZones));
    }
    
    const savedSettings = localStorage.getItem('safetySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);
  
  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
  }, [emergencyContacts]);
  
  useEffect(() => {
    localStorage.setItem('safeZones', JSON.stringify(safeZones));
  }, [safeZones]);
  
  useEffect(() => {
    localStorage.setItem('safetySettings', JSON.stringify(settings));
  }, [settings]);
  
  // Add emergency contact
  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact = {
      id: `contact-${Date.now()}`,
      ...contact
    };
    setEmergencyContacts(prev => [...prev, newContact]);
  };
  
  // Remove emergency contact
  const removeEmergencyContact = (id: string) => {
    setEmergencyContacts(prev => prev.filter(contact => contact.id !== id));
  };
  
  // Add safe zone
  const addSafeZone = (zone: Omit<SafeZone, 'id'>) => {
    const newZone = {
      id: `zone-${Date.now()}`,
      ...zone
    };
    setSafeZones(prev => [...prev, newZone]);
  };
  
  // Remove safe zone
  const removeSafeZone = (id: string) => {
    setSafeZones(prev => prev.filter(zone => zone.id !== id));
  };
  
  // Update settings
  const updateSettings = (newSettings: Partial<SafetySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  // Trigger distress signal
  const triggerDistressSignal = () => {
    // Create new distress data
    const newDistressData: DistressData = {
      timestamp: new Date(),
      isActive: true,
    };
    
    // Get current location if available and enabled
    if (settings.locationSharingEnabled && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const updatedData = {
            ...newDistressData,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }
          };
          setDistressData(updatedData);
          
          // In a real app, this would also send the distress signal to emergency contacts
          console.log("Distress signal sent with location", updatedData);
        },
        () => {
          // If geolocation fails, still set distress data without location
          setDistressData(newDistressData);
          console.log("Distress signal sent without location", newDistressData);
        }
      );
    } else {
      // If location sharing is disabled or not available
      setDistressData(newDistressData);
      console.log("Distress signal sent without location", newDistressData);
    }
    
    // In a real app, this would start recording audio, taking photos, etc.
  };
  
  // Cancel distress signal
  const cancelDistressSignal = () => {
    if (distressData) {
      setDistressData({
        ...distressData,
        isActive: false
      });
      console.log("Distress signal cancelled");
    }
  };
  
  return (
    <SafetyContext.Provider value={{
      emergencyContacts,
      safeZones,
      settings,
      distressData,
      addEmergencyContact,
      removeEmergencyContact,
      addSafeZone,
      removeSafeZone,
      updateSettings,
      triggerDistressSignal,
      cancelDistressSignal
    }}>
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
