
import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockPGs, mockRoommates, roommateQuestions } from '@/data/mockData';
import { PG, PGFilter, QuestionnaireAnswer, RoommateProfile, ChatMessage, RoommateMatch } from '@/types';

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
  chatMessages: ChatMessage[];
  roommateMatches: RoommateMatch[];
  // Functions
  toggleFavorite: (pgId: string) => void;
  toggleFollowPG: (pgId: string) => void;
  updateFilters: (newFilters: PGFilter) => void;
  addRoommateAnswer: (questionId: string, answer: string, isPublic?: boolean) => void;
  updateUserProfile: (profile: Partial<RoommateProfile>) => void;
  setLookingForOption: (option: 'room-and-roommate' | 'just-roommate' | 'pg-owner') => void;
  requestRoommateMatch: (roommateId: string) => void;
  respondToMatchRequest: (matchId: string, accept: boolean) => void;
  startChat: (roommateId: string) => void;
  sendChatMessage: (receiverId: string, message: string) => void;
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [roommateMatches, setRoommateMatches] = useState<RoommateMatch[]>([]);
  
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
  const addRoommateAnswer = (questionId: string, answer: string, isPublic: boolean = true) => {
    setRoommateAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === questionId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { questionId, answer, isPublic };
        return updated;
      } else {
        return [...prev, { questionId, answer, isPublic }];
      }
    });
  };
  
  // Update user roommate profile
  const updateUserProfile = (profile: Partial<RoommateProfile>) => {
    const userId = userRoommateProfile?.id || `user-${Date.now()}`;
    const updatedProfile = { ...userRoommateProfile, ...profile, id: userId };
    setUserRoommateProfile(updatedProfile);
    
    // Update compatibility scores for all roommates
    if (profile.answers) {
      const updatedRoommates = roommates.map(roommate => {
        const score = calculateCompatibilityScore(profile.answers || [], roommate.answers);
        const sharedTraits = getSharedTraits(profile.answers || [], roommate.answers);
        
        return {
          ...roommate,
          compatibilityScore: score,
          sharedTraits,
        };
      });
      
      setRoommates(updatedRoommates);
    }
  };
  
  // Calculate compatibility score between two users
  const calculateCompatibilityScore = (userAnswers: QuestionnaireAnswer[], roommateAnswers: QuestionnaireAnswer[]): number => {
    let matchedAnswers = 0;
    let totalQuestions = 0;
    
    userAnswers.forEach(userAnswer => {
      const roommateAnswer = roommateAnswers.find(a => a.questionId === userAnswer.questionId);
      if (roommateAnswer) {
        totalQuestions++;
        if (userAnswer.answer === roommateAnswer.answer) {
          matchedAnswers++;
        }
      }
    });
    
    return totalQuestions > 0 ? Math.round((matchedAnswers / totalQuestions) * 100) : 0;
  };
  
  // Get shared traits between two users
  const getSharedTraits = (userAnswers: QuestionnaireAnswer[], roommateAnswers: QuestionnaireAnswer[]): string[] => {
    const sharedTraits: string[] = [];
    
    userAnswers.forEach(userAnswer => {
      const roommateAnswer = roommateAnswers.find(a => a.questionId === userAnswer.questionId);
      if (roommateAnswer && userAnswer.answer === roommateAnswer.answer) {
        const question = roommateQuestions.find(q => q.id === userAnswer.questionId);
        const option = question?.options.find(o => o.value === userAnswer.answer);
        
        if (question && option) {
          const traitDescription = `${question.text.split('?')[0]} - ${option.label}`;
          sharedTraits.push(traitDescription);
        }
      }
    });
    
    return sharedTraits.slice(0, 3); // Return top 3 shared traits
  };
  
  // Set looking for option
  const setLookingForOption = (option: 'room-and-roommate' | 'just-roommate' | 'pg-owner') => {
    setLookingFor(option);
    if (option !== 'pg-owner') {
      updateUserProfile({ lookingFor: option as 'room-and-roommate' | 'just-roommate' });
    }
  };
  
  // Request a match with another roommate
  const requestRoommateMatch = (roommateId: string) => {
    if (!userRoommateProfile?.id) return;
    
    const newMatch: RoommateMatch = {
      userId: userRoommateProfile.id,
      matchedUserId: roommateId,
      status: 'pending',
      timestamp: new Date(),
    };
    
    setRoommateMatches(prev => [...prev, newMatch]);
    
    // Update the matched roommate's status in the UI
    setRoommates(prev => 
      prev.map(r => 
        r.id === roommateId 
          ? { ...r, hasMatched: true, matchStatus: 'pending' } 
          : r
      )
    );
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
    
    // Update the roommate's status in the UI
    if (accept && userRoommateProfile?.id) {
      const matchedRoommate = roommateMatches.find(m => m.userId === matchId);
      if (matchedRoommate) {
        setRoommates(prev => 
          prev.map(r => 
            r.id === matchedRoommate.matchedUserId 
              ? { ...r, hasMatched: true, matchStatus: 'accepted' } 
              : r
          )
        );
      }
    }
  };
  
  // Start a chat with a roommate
  const startChat = (roommateId: string) => {
    // In a real app, this would initialize a chat session
    // For now, we'll just log this action
    console.log(`Chat started with roommate ${roommateId}`);
  };
  
  // Send a chat message
  const sendChatMessage = (receiverId: string, message: string) => {
    if (!userRoommateProfile?.id) return;
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: userRoommateProfile.id,
      receiverId,
      message,
      timestamp: new Date(),
      isRead: false,
    };
    
    setChatMessages(prev => [...prev, newMessage]);
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
      chatMessages,
      roommateMatches,
      requestRoommateMatch,
      respondToMatchRequest,
      startChat,
      sendChatMessage,
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
