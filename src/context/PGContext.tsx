
import React, { createContext, useContext } from 'react';
import { usePGListings } from '@/hooks/usePGListings';

const PGContext = createContext<ReturnType<typeof usePGListings> | undefined>(undefined);

export const PGProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pgListings = usePGListings();
  
  return (
    <PGContext.Provider value={pgListings}>
      {children}
    </PGContext.Provider>
  );
};

export const usePG = () => {
  const context = useContext(PGContext);
  if (context === undefined) {
    throw new Error('usePG must be used within a PGProvider');
  }
  return context;
};
