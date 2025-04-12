import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockPGs, mockRoommates, roommateQuestions } from '@/data/mockData';
import { PG, PGFilter, QuestionnaireAnswer, RoommateProfile, ChatMessage, RoommateMatch, PGListing, CompatibilityConfig } from '@/types';

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
  pgListings: PGListing[];
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
  createPGListing: (listing: Partial<PGListing>) => void;
  updatePGListing: (listingId: string, updates: Partial<PGListing>) => void;
}

const defaultFilters: PGFilter = {
  price: { min: 5000, max: 20000 },
  gender: null,
  amenities: [],
  availability: null,
};

// Smart compatibility configuration
const compatibilityConfig: CompatibilityConfig = {
  importanceWeights: {
    high: 3,    // High importance questions count 3x
    medium: 2,  // Medium importance questions count 2x
    low: 1      // Low importance questions count 1x
  },
  dealBreakerPenalty: 30,  // Reduce score by 30% for each deal breaker
  incompatibleLifestylePenalty: 15, // Reduce score by 15% for major lifestyle incompatibilities
  minimumCompatibilityScore: 15  // Below this score, show as incompatible
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
  const [pgListings, setPgListings] = useState<PGListing[]>([]);
  
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
        const { score, sharedTraits, hasDealBreakers } = calculateSmartCompatibility(profile.answers || [], roommate.answers, profile.dealBreakers || []);
        
        return {
          ...roommate,
          compatibilityScore: score,
          sharedTraits,
          // Add a flag to indicate deal breakers for UI purposes
          hasDealBreakers: hasDealBreakers
        };
      });
      
      setRoommates(updatedRoommates);
    }
  };
  
  // Smart compatibility calculation
  const calculateSmartCompatibility = (
    userAnswers: QuestionnaireAnswer[], 
    roommateAnswers: QuestionnaireAnswer[],
    userDealBreakers: string[]
  ): { score: number; sharedTraits: string[]; hasDealBreakers: boolean } => {
    let totalWeight = 0;
    let weightedMatches = 0;
    let hasDealBreakers = false;
    let majorIncompatibilities = 0;
    const sharedTraits: string[] = [];
    
    // Check for potential deal breakers
    const dealBreakerFound = checkForDealBreakers(userDealBreakers, roommateAnswers);
    if (dealBreakerFound) {
      hasDealBreakers = true;
    }
    
    // Check hard incompatibilities (smoking, alcohol, sleep schedule, noise)
    const hardIncompatibilitiesCount = checkHardIncompatibilities(userAnswers, roommateAnswers);
    majorIncompatibilities = hardIncompatibilitiesCount;
    
    // For each user answer, find corresponding roommate answer
    userAnswers.forEach(userAnswer => {
      const question = roommateQuestions.find(q => q.id === userAnswer.questionId);
      if (!question) return;
      
      const roommateAnswer = roommateAnswers.find(a => a.questionId === userAnswer.questionId);
      if (!roommateAnswer) return;
      
      // Get importance weight for this question
      const importanceWeight = question.importanceLevel 
        ? compatibilityConfig.importanceWeights[question.importanceLevel] 
        : compatibilityConfig.importanceWeights.medium; // Default to medium
      
      totalWeight += importanceWeight;
      
      // Check answer compatibility
      const compatibility = calculateAnswerCompatibility(userAnswer.answer, roommateAnswer.answer, question);
      
      // Add weighted compatibility
      weightedMatches += compatibility * importanceWeight;
      
      // Add to shared traits if good match
      if (compatibility > 0.7) {
        const option = question.options.find(o => o.value === userAnswer.answer);
        if (question && option) {
          const traitDescription = `${question.text.split('?')[0]} - ${option.label}`;
          sharedTraits.push(traitDescription);
        }
      }
    });
    
    // Calculate base score (0-100)
    let score = totalWeight > 0 
      ? Math.round((weightedMatches / totalWeight) * 100) 
      : 0;
    
    // Apply penalties for dealbreakers and major incompatibilities
    if (hasDealBreakers) {
      score = Math.max(0, score - compatibilityConfig.dealBreakerPenalty);
    }
    
    // Apply penalties for each major incompatibility
    score = Math.max(0, score - (majorIncompatibilities * compatibilityConfig.incompatibleLifestylePenalty));
    
    // Ensure minimum compatibility score
    if (score < compatibilityConfig.minimumCompatibilityScore) {
      score = compatibilityConfig.minimumCompatibilityScore;
    }
    
    return { 
      score, 
      sharedTraits: sharedTraits.slice(0, 3), // Top 3 shared traits
      hasDealBreakers
    };
  };
  
  // Calculate how compatible two answers are (0.0 to 1.0)
  const calculateAnswerCompatibility = (
    userAnswer: string, 
    roommateAnswer: string, 
    question: Question
  ): number => {
    // Direct match
    if (userAnswer === roommateAnswer) {
      return 1.0;
    }
    
    // Special compatibility logic based on question type
    switch (question.id) {
      // Sleep/wake schedule compatibility
      case 'wake-time':
      case 'sleep-time': {
        // Get numeric indices for time-related answers
        const options = question.options;
        const userIdx = options.findIndex(o => o.value === userAnswer);
        const roommateIdx = options.findIndex(o => o.value === roommateAnswer);
        
        // Calculate how close the schedules are (closer = more compatible)
        const diff = Math.abs(userIdx - roommateIdx);
        return diff === 0 ? 1.0 : diff === 1 ? 0.7 : diff === 2 ? 0.3 : 0.0;
      }
      
      // Noise tolerance compatibility
      case 'noise-tolerance':
      case 'music-habits':
      case 'study-style': {
        // Someone who prefers quiet environment (index 0) won't match well with someone who likes noise (index 2)
        const options = question.options;
        const userIdx = options.findIndex(o => o.value === userAnswer);
        const roommateIdx = options.findIndex(o => o.value === roommateAnswer);
        
        const diff = Math.abs(userIdx - roommateIdx);
        return diff === 0 ? 1.0 : diff === 1 ? 0.5 : 0.0; // More strict on noise compatibility
      }
      
      // Cleaning habits - people with different cleaning styles often conflict
      case 'cleaning-preferences': {
        const options = question.options;
        const userIdx = options.findIndex(o => o.value === userAnswer);
        const roommateIdx = options.findIndex(o => o.value === roommateAnswer);
        
        // If one person is very clean and other isn't, compatibility is low
        if ((userIdx === 0 && roommateIdx === 2) || (userIdx === 2 && roommateIdx === 0)) {
          return 0.1; // Very incompatible
        }
        
        const diff = Math.abs(userIdx - roommateIdx);
        return diff === 0 ? 1.0 : diff === 1 ? 0.6 : 0.2;
      }
      
      // For sharing things, social habits, guests, etc. - default compatibility
      default: {
        const options = question.options;
        const userIdx = options.findIndex(o => o.value === userAnswer);
        const roommateIdx = options.findIndex(o => o.value === roommateAnswer);
        
        if (userIdx === -1 || roommateIdx === -1) return 0.5; // Default if can't find
        
        const diff = Math.abs(userIdx - roommateIdx);
        const maxDiff = options.length - 1;
        
        return maxDiff > 0 ? 1 - (diff / maxDiff) : 1.0;
      }
    }
  };
  
  // Check hard incompatibilities (zero-tolerance issues)
  const checkHardIncompatibilities = (
    userAnswers: QuestionnaireAnswer[],
    roommateAnswers: QuestionnaireAnswer[]
  ): number => {
    let incompatibilities = 0;
    
    // Smoking incompatibility (non-smoker with smoker)
    const userSmokingAnswer = userAnswers.find(a => a.questionId === 'smoking-habits');
    const roommateSmokingAnswer = roommateAnswers.find(a => a.questionId === 'smoking-habits');
    
    if (userSmokingAnswer && roommateSmokingAnswer) {
      // Non-smoker with smoker is incompatible
      if (userSmokingAnswer.answer === 'no' && roommateSmokingAnswer.answer === 'yes') {
        incompatibilities++;
      }
    }
    
    // Sleep schedule severe mismatch
    const userWakeAnswer = userAnswers.find(a => a.questionId === 'wake-time');
    const roommateWakeAnswer = roommateAnswers.find(a => a.questionId === 'wake-time');
    
    if (userWakeAnswer && roommateWakeAnswer) {
      // Early riser vs. night owl
      if ((userWakeAnswer.answer === 'before-7am' && roommateWakeAnswer.answer === 'after-11am') ||
          (userWakeAnswer.answer === 'after-11am' && roommateWakeAnswer.answer === 'before-7am')) {
        incompatibilities++;
      }
    }
    
    // Alcohol hard mismatch
    const userAlcoholAnswer = userAnswers.find(a => a.questionId === 'alcohol-habits');
    const roommateAlcoholAnswer = roommateAnswers.find(a => a.questionId === 'alcohol-habits');
    
    if (userAlcoholAnswer && roommateAlcoholAnswer) {
      // Non-drinker with frequent drinker
      if (userAlcoholAnswer.answer === 'no' && roommateAlcoholAnswer.answer === 'frequently') {
        incompatibilities++;
      }
    }
    
    // Noise sensitivity hard mismatch
    const userNoiseAnswer = userAnswers.find(a => a.questionId === 'noise-tolerance');
    const roommateNoiseAnswer = roommateAnswers.find(a => a.questionId === 'noise-tolerance');
    
    if (userNoiseAnswer && roommateNoiseAnswer) {
      // Very sensitive with not bothered
      if ((userNoiseAnswer.answer === 'very-sensitive' && roommateNoiseAnswer.answer === 'not-bothered') ||
          (userNoiseAnswer.answer === 'not-bothered' && roommateNoiseAnswer.answer === 'very-sensitive')) {
        incompatibilities++;
      }
    }
    
    return incompatibilities;
  };
  
  // Check if there are dealbreaker issues (based on explicit deal breakers)
  const checkForDealBreakers = (dealBreakers: string[], roommateAnswers: QuestionnaireAnswer[]): boolean => {
    if (!dealBreakers.length) return false;
    
    // This is a more robust implementation than before
    for (const dealBreaker of dealBreakers) {
      const lowerDealBreaker = dealBreaker.toLowerCase();
      
      // Check for common dealbreakers based on answers
      for (const answer of roommateAnswers) {
        const question = roommateQuestions.find(q => q.id === answer.questionId);
        if (!question) continue;
        
        // Check smoking
        if ((lowerDealBreaker.includes('smok') || lowerDealBreaker.includes('cigarette')) && 
            question.id === 'smoking-habits' && 
            answer.answer !== 'no') {
          return true;
        }
        
        // Check noise/loud music
        if ((lowerDealBreaker.includes('noise') || lowerDealBreaker.includes('loud') || lowerDealBreaker.includes('quiet')) && 
            (question.id === 'noise-tolerance' || question.id === 'music-habits') && 
            (answer.answer.includes('loud') || answer.answer === 'not-bothered')) {
          return true;
        }
        
        // Check cleanliness
        if ((lowerDealBreaker.includes('clean') || lowerDealBreaker.includes('tidy') || lowerDealBreaker.includes('mess')) && 
            question.id === 'cleaning-preferences' && 
            answer.answer === 'not-into-cleaning') {
          return true;
        }
        
        // Check guests
        if ((lowerDealBreaker.includes('guest') || lowerDealBreaker.includes('visit')) && 
            question.id === 'guests-policy' && 
            answer.answer === 'frequent-visits') {
          return true;
        }
        
        // Check alcohol
        if ((lowerDealBreaker.includes('alcohol') || lowerDealBreaker.includes('drink')) && 
            question.id === 'alcohol-habits' && 
            answer.answer !== 'no') {
          return true;
        }
        
        // Check wake/sleep times
        if ((lowerDealBreaker.includes('early') || lowerDealBreaker.includes('morning')) && 
            question.id === 'wake-time' && 
            answer.answer === 'after-11am') {
          return true;
        }
        
        if ((lowerDealBreaker.includes('night') || lowerDealBreaker.includes('late')) && 
            question.id === 'bedtime' && 
            answer.answer === 'before-10pm') {
          return true;
        }
      }
    }
    
    return false;
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
  
  // Create a new PG listing
  const createPGListing = (listing: Partial<PGListing>) => {
    const newListing: PGListing = {
      id: `pg-${Date.now()}`,
      name: listing.name || 'Untitled PG',
      address: listing.address || '',
      gender: listing.gender || 'co-ed',
      description: listing.description || '',
      totalBeds: listing.totalBeds || 0,
      availableBeds: listing.availableBeds || 0,
      price: listing.price || 0,
      amenities: listing.amenities || [],
      ownerId: 'current-user', // In a real app, this would be the current user's ID
      createdAt: new Date(),
      location: listing.location,
      images: listing.images || [],
      status: listing.status || 'draft',
    };
    
    setPgListings(prev => [...prev, newListing]);
  };
  
  // Update an existing PG listing
  const updatePGListing = (listingId: string, updates: Partial<PGListing>) => {
    setPgListings(prev => 
      prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, ...updates } 
          : listing
      )
    );
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
      pgListings,
      createPGListing,
      updatePGListing,
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
