
// PG and Room Types
export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface Bed {
  id: string;
  isOccupied: boolean;
  availableFrom?: Date;
}

export interface Room {
  id: string;
  type: 'single' | 'double' | 'triple' | 'other';
  beds: Bed[];
  price: number;
  amenities: string[];
}

export interface NearbyPlace {
  id: string;
  name: string;
  type: 'atm' | 'canteen' | 'gym' | 'hospital' | 'bus';
  distance: number; // in meters
  location: {
    lat: number;
    lng: number;
  };
}

export interface PG {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  gender: 'male' | 'female' | 'co-ed';
  rooms: Room[];
  totalBeds: number;
  availableBeds: number;
  amenities: string[];
  nearbyPlaces: NearbyPlace[];
  images: string[];
  description: string;
  rating: number;
  reviews: number;
  isFavorite: boolean;
}

// Filter Types
export interface PGFilter {
  price: {
    min: number;
    max: number;
  };
  location?: string;
  gender?: 'male' | 'female' | 'co-ed' | null;
  amenities: string[];
  availability?: 'available-now' | 'available-soon' | null;
}

// Roommate Types
export type QuestionOption = {
  value: string;
  label: string;
};

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  icon: string;
}

export interface QuestionnaireAnswer {
  questionId: string;
  answer: string;
  isPublic: boolean; // Required field for privacy setting
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export interface RoommateMatch {
  userId: string;
  matchedUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: Date;
}

export interface RoommateProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  occupation: string;
  lookingFor: 'room-and-roommate' | 'just-roommate';
  answers: QuestionnaireAnswer[];
  dealBreakers: string[]; // New field for deal breakers
  bio: string;
  compatibilityScore?: number;
  sharedTraits?: string[];
  image?: string;
  hasMatched?: boolean;
  matchStatus?: 'pending' | 'accepted' | 'rejected';
}

// For PG Owner Listing
export interface PGListing {
  id: string;
  name: string;
  address: string;
  gender: 'male' | 'female' | 'co-ed';
  description: string;
  totalBeds: number;
  availableBeds: number;
  price: number;
  amenities: string[];
  ownerId: string;
  createdAt: Date;
}

// Emergency Safety Feature
export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isEmergencyContact: boolean;
}
