import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockPGs, mockRoommates, roommateQuestions } from '@/data/mockData';
import { PG, PGFilter, QuestionnaireAnswer, RoommateProfile } from '@/types';

interface AppContextType {
  // PG state
  pgs: PG[];
  filteredPGs: PG[];
  filters: PGFilter;
  favorites: string[];
  followedPGs: string[];
  // Roommate state
  roommates: RoommateProfile[];
  roommateAnswers: QuestionnaireAnswer[];
  userRoommateProfile: Partial<RoommateProfile> | null;
  lookingFor: 'room-and-roommate' | 'just-roommate' | 'pg-owner' | null;
  // Functions
  toggleFavorite: (pgId: string) => void;
  toggleFollowPG: (pgId: string) => void;
  updateFilters: (newFilters: PGFilter) => void;
  addRoommateAnswer: (questionId: string, answer: string) => void;
  updateUserProfile: (profile: Partial<RoommateProfile>) => void;
  setLookingForOption: (option: 'room-and-roommate' | 'just-roommate' | 'pg-owner') => void;
}

const defaultFilters: PGFilter = {
  price: { min: 5000, max: 20000 },
  gender: null,
  amenities: [],
  availability: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // PG state
  const [pgs, setPgs] = useState<PG[]>(mockPGs);
  const [filteredPGs, setFilteredPGs] = useState<PG[]>(mockPGs);
  const [filters, setFilters] = useState<PGFilter>(defaultFilters);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [followedPGs, setFollowedPGs] = useState<string[]>([]);
  
  // Roommate state
  const [roommates, setRoommates] = useState<RoommateProfile[]>(mockRoommates);
  const [roommateAnswers, setRoommateAnswers] = useState<QuestionnaireAnswer[]>([]);
  const [userRoommateProfile, setUserRoommateProfile] = useState<Partial<RoommateProfile> | null>(null);
  const [lookingFor, setLookingFor] = useState<'room-and-roommate' | 'just-roommate' | 'pg-owner' | null>(null);
  
  // Update filtered PGs when filters change
  useEffect(() => {
    let result = [...pgs];
    
    // Filter by price
    result = result.filter(pg => {
      const cheapestRoom = pg.rooms.reduce((min, room) => 
        room.price < min ? room.price : min, 
        pg.rooms[0].price
      );
      return cheapestRoom >= filters.price.min && cheapestRoom <= filters.price.max;
    });
    
    // Filter by gender
    if (filters.gender) {
      result = result.filter(pg => pg.gender === filters.gender);
    }
    
    // Filter by amenities
    if (filters.amenities.length > 0) {
      result = result.filter(pg => 
        filters.amenities.every(amenity => pg.amenities.includes(amenity))
      );
    }
    
    // Filter by availability
    if (filters.availability) {
      if (filters.availability === 'available-now') {
        result = result.filter(pg => pg.availableBeds > 0);
      } else if (filters.availability === 'available-soon') {
        result = result.filter(pg => 
          pg.rooms.some(room => 
            room.beds.some(bed => bed.isOccupied && bed.availableFrom)
          )
        );
      }
    }
    
    setFilteredPGs(result);
  }, [filters, pgs]);
  
  // Initialize favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('pgFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    const savedFollowed = localStorage.getItem('followedPGs');
    if (savedFollowed) {
      setFollowedPGs(JSON.parse(savedFollowed));
    }
    
    // Update PGs with favorite status
    setPgs(prevPgs => 
      prevPgs.map(pg => ({
        ...pg, 
        isFavorite: favorites.includes(pg.id)
      }))
    );
  }, []);
  
  // Update PGs when favorites change
  useEffect(() => {
    localStorage.setItem('pgFavorites', JSON.stringify(favorites));
    
    setPgs(prevPgs => 
      prevPgs.map(pg => ({
        ...pg, 
        isFavorite: favorites.includes(pg.id)
      }))
    );
  }, [favorites]);
  
  // Save followed PGs to localStorage
  useEffect(() => {
    localStorage.setItem('followedPGs', JSON.stringify(followedPGs));
  }, [followedPGs]);
  
  // Toggle favorite status of a PG
  const toggleFavorite = (pgId: string) => {
    setFavorites(prev => {
      if (prev.includes(pgId)) {
        return prev.filter(id => id !== pgId);
      } else {
        return [...prev, pgId];
      }
    });
  };
  
  // Toggle follow status of a PG
  const toggleFollowPG = (pgId: string) => {
    setFollowedPGs(prev => {
      if (prev.includes(pgId)) {
        return prev.filter(id => id !== pgId);
      } else {
        return [...prev, pgId];
      }
    });
  };
  
  // Update filters
  const updateFilters = (newFilters: PGFilter) => {
    setFilters(newFilters);
  };
  
  // Add or update a roommate answer
  const addRoommateAnswer = (questionId: string, answer: string) => {
    setRoommateAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === questionId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { questionId, answer };
        return updated;
      } else {
        return [...prev, { questionId, answer }];
      }
    });
  };
  
  // Update user roommate profile
  const updateUserProfile = (profile: Partial<RoommateProfile>) => {
    setUserRoommateProfile(prev => ({ ...prev, ...profile }));
  };
  
  // Set looking for option
  const setLookingForOption = (option: 'room-and-roommate' | 'just-roommate' | 'pg-owner') => {
    setLookingFor(option);
    if (option !== 'pg-owner') {
      updateUserProfile({ lookingFor: option as 'room-and-roommate' | 'just-roommate' });
    }
  };
  
  return (
    <AppContext.Provider value={{
      pgs,
      filteredPGs,
      filters,
      favorites,
      followedPGs,
      toggleFavorite,
      toggleFollowPG,
      updateFilters,
      roommates,
      roommateAnswers,
      addRoommateAnswer,
      userRoommateProfile,
      updateUserProfile,
      lookingFor,
      setLookingForOption,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
