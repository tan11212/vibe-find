
import React, { createContext, useState, useContext } from 'react';
import { ChatMessage, RoommateMatch } from '@/types';

interface ChatContextType {
  chatMessages: ChatMessage[];
  roommateMatches: RoommateMatch[];
  requestRoommateMatch: (roommateId: string) => void;
  respondToMatchRequest: (matchId: string, accept: boolean) => void;
  startChat: (roommateId: string) => void;
  sendChatMessage: (receiverId: string, message: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ 
  children: React.ReactNode;
  userRoommateId: string | null | undefined;
}> = ({ children, userRoommateId }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [roommateMatches, setRoommateMatches] = useState<RoommateMatch[]>([]);
  
  // Request a match with another roommate
  const requestRoommateMatch = (roommateId: string) => {
    if (!userRoommateId) return;
    
    const newMatch: RoommateMatch = {
      userId: userRoommateId,
      matchedUserId: roommateId,
      status: 'pending',
      timestamp: new Date(),
    };
    
    setRoommateMatches(prev => [...prev, newMatch]);
  };
  
  // Respond to a match request
  const respondToMatchRequest = (matchId: string, accept: boolean) => {
    setRoommateMatches(prev => 
      prev.map(match => 
        match.userId === matchId 
          ? { ...match, status: accept ? 'accepted' : 'rejected' } 
          : match
      )
    );
  };
  
  // Start a chat with a roommate
  const startChat = (roommateId: string) => {
    // In a real app, this would initialize a chat session
    console.log(`Chat started with roommate ${roommateId}`);
  };
  
  // Send a chat message
  const sendChatMessage = (receiverId: string, message: string) => {
    if (!userRoommateId) return;
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: userRoommateId,
      receiverId,
      message,
      timestamp: new Date(),
      isRead: false,
    };
    
    setChatMessages(prev => [...prev, newMessage]);
  };
  
  return (
    <ChatContext.Provider value={{
      chatMessages,
      roommateMatches,
      requestRoommateMatch,
      respondToMatchRequest,
      startChat,
      sendChatMessage,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
