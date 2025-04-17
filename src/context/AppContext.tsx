
import React, { useState } from 'react';
import { PGProvider, usePG } from './PGContext';
import { RoommateProvider, useRoommate } from './RoommateContext';
import { ChatProvider, useChat } from './ChatContext';

// Create a combined context
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // We need to share the user profile ID with the ChatProvider
  const [userId, setUserId] = useState<string | null>(null);
  
  // Listen for user profile creation/updates to set the userId
  const handleUserIdChange = (newUserId: string) => {
    setUserId(newUserId);
  };
  
  return (
    <PGProvider>
      <RoommateProvider>
        {(context) => {
          // This is a render prop pattern to get the user ID from the Roommate context
          const userRoommateId = context?.userRoommateProfile?.id;
          
          // If the ID changes, update our state
          if (userRoommateId && userRoommateId !== userId) {
            handleUserIdChange(userRoommateId);
          }
          
          return (
            <ChatProvider userRoommateId={userRoommateId}>
              {children}
            </ChatProvider>
          );
        }}
      </RoommateProvider>
    </PGProvider>
  );
};

// Create a hook that provides access to all contexts
export const useApp = () => {
  const pgContext = usePG();
  const roommateContext = useRoommate();
  const chatContext = useChat();
  
  // Combine all contexts into one
  return {
    ...pgContext,
    ...roommateContext,
    ...chatContext,
  };
};

