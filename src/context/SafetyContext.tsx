
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SafetyContextType {
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<void>;
  removeEmergencyContact: (id: string) => Promise<void>;
  toggleVoiceDetection: () => void;
  isVoiceDetectionActive: boolean;
  safeWord: string;
  updateSafeWord: (word: string) => void;
  triggerEmergencyProtocol: () => void;
  isProcessingEmergency: boolean;
}

type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isEmergencyContact: boolean;
};

const defaultSafeWord = "help me";

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [isVoiceDetectionActive, setIsVoiceDetectionActive] = useState(false);
  const [safeWord, setSafeWord] = useState(defaultSafeWord);
  const [isProcessingEmergency, setIsProcessingEmergency] = useState(false);
  
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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log('Detected speech:', transcript);
        
        if (transcript.includes(safeWord.toLowerCase())) {
          triggerEmergencyProtocol();
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
  
  // Start/stop voice recognition when active state changes
  useEffect(() => {
    if (isVoiceDetectionActive && recognitionRef.current) {
      try {
        recognitionRef.current.start();
        toast.success(`Voice detection active. Listening for "${safeWord}"`);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    } else if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Failed to stop speech recognition:', error);
      }
    }
  }, [isVoiceDetectionActive, safeWord]);
  
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
        setEmergencyContacts([...emergencyContacts, data[0]]);
        toast.success('Emergency contact added!');
      }
    } catch (error) {
      console.error('Error adding emergency contact:', error);
      toast.error('Failed to add emergency contact');
    }
  };
  
  const removeEmergencyContact = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
      toast.success('Emergency contact removed');
    } catch (error) {
      console.error('Error removing emergency contact:', error);
      toast.error('Failed to remove emergency contact');
    }
  };
  
  const toggleVoiceDetection = () => {
    const newState = !isVoiceDetectionActive;
    setIsVoiceDetectionActive(newState);
    
    if (newState) {
      requestMicrophonePermission();
    }
  };
  
  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      console.error('Microphone permission denied:', error);
      toast.error('Microphone access denied. Voice detection disabled.');
      setIsVoiceDetectionActive(false);
    }
  };
  
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
  
  const triggerEmergencyProtocol = () => {
    if (isProcessingEmergency) return;
    
    setIsProcessingEmergency(true);
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
    
    // In a real implementation, we would:
    // 1. Get actual user location
    // 2. Send messages to emergency contacts
    // 3. Start recording audio/video
    // 4. Upload evidence to secure storage
    
    // Clear emergency state after 10 seconds
    setTimeout(() => {
      setIsProcessingEmergency(false);
    }, 10000);
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
      triggerEmergencyProtocol,
      isProcessingEmergency
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
