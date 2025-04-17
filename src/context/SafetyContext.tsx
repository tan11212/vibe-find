
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isEmergencyContact: boolean;
}

interface DistressData {
  isActive: boolean;
}

interface SafetyContextType {
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<void>;
  removeEmergencyContact: (id: string) => Promise<void>;
  toggleVoiceDetection: () => void;
  isVoiceDetectionActive: boolean;
  safeWord: string;
  updateSafeWord: (word: string) => void;
  triggerDistressSignal: () => void;
  cancelDistressSignal: () => void;
  distressData: DistressData;
}

const defaultSafeWord = "help me";

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [isVoiceDetectionActive, setIsVoiceDetectionActive] = useState(false);
  const [safeWord, setSafeWord] = useState(defaultSafeWord);
  const [distressData, setDistressData] = useState<DistressData>({ isActive: false });
  
  const recognitionRef = useRef<any>(null);
  
  // Load emergency contacts when user changes
  useEffect(() => {
    if (user) {
      fetchEmergencyContacts();
    } else {
      setEmergencyContacts([]);
    }
  }, [user]);
  
  // Initialize voice recognition
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log('Detected speech:', transcript);
        
        if (transcript.includes(safeWord.toLowerCase())) {
          triggerDistressSignal();
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Voice detection disabled.');
          setIsVoiceDetectionActive(false);
        }
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [safeWord]);
  
  // Fetch emergency contacts
  const fetchEmergencyContacts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setEmergencyContacts(data || []);
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
    }
  };
  
  // Add emergency contact
  const addEmergencyContact = async (contact: Omit<EmergencyContact, 'id'>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert({
          user_id: user.id,
          name: contact.name,
          phone: contact.phone,
          relationship: contact.relationship,
          is_emergency_contact: contact.isEmergencyContact
        })
        .select();
        
      if (error) throw error;
      
      if (data) {
        setEmergencyContacts(prev => [...prev, data[0] as EmergencyContact]);
        toast.success('Emergency contact added!');
      }
    } catch (error) {
      console.error('Error adding emergency contact:', error);
      toast.error('Failed to add emergency contact');
    }
  };
  
  // Remove emergency contact
  const removeEmergencyContact = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setEmergencyContacts(prev => prev.filter(contact => contact.id !== id));
      toast.success('Emergency contact removed');
    } catch (error) {
      console.error('Error removing emergency contact:', error);
      toast.error('Failed to remove emergency contact');
    }
  };
  
  // Voice detection toggle
  const toggleVoiceDetection = () => {
    const newState = !isVoiceDetectionActive;
    setIsVoiceDetectionActive(newState);
    
    if (newState) {
      requestMicrophonePermission();
    }
  };
  
  // Request microphone permission
  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      console.error('Microphone permission denied:', error);
      toast.error('Microphone access denied. Voice detection disabled.');
      setIsVoiceDetectionActive(false);
    }
  };
  
  // Update safe word
  const updateSafeWord = (word: string) => {
    if (word && word.trim()) {
      setSafeWord(word.trim());
      
      // Restart recognition with new safe word if active
      if (isVoiceDetectionActive && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            if (recognitionRef.current && isVoiceDetectionActive) {
              recognitionRef.current.start();
              toast.success(`Voice detection updated. Now listening for "${word.trim()}"`);
            }
          }, 100);
        } catch (error) {
          console.error('Error restarting speech recognition:', error);
        }
      }
    }
  };
  
  // Trigger distress signal
  const triggerDistressSignal = () => {
    setDistressData({ isActive: true });
    toast.error('EMERGENCY PROTOCOL ACTIVATED', {
      duration: 10000,
    });
    
    // Simulate sharing location
    const fakeLocation = {
      latitude: 28.6139,
      longitude: 77.2090,
    };
    
    console.log('Emergency protocol activated');
    console.log('Location shared:', fakeLocation);
    console.log('Contacting emergency contacts:', emergencyContacts);
  };
  
  // Cancel distress signal
  const cancelDistressSignal = () => {
    setDistressData({ isActive: false });
    toast.success('Emergency mode cancelled');
  };
  
  return (
    <SafetyContext.Provider value={{
      emergencyContacts,
      addEmergencyContact,
      removeEmergencyContact,
      toggleVoiceDetection,
      isVoiceDetectionActive,
      safeWord,
      updateSafeWord,
      triggerDistressSignal,
      cancelDistressSignal,
      distressData
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
