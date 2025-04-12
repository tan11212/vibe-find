
import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockPGs } from '@/data/mockData';
import { PG, PGFilter, PGListing } from '@/types';

interface PGContextType {
  pgs: PG[];
  filteredPGs: PG[];
  filters: PGFilter;
  favorites: string[];
  followedPGs: string[];
  pgListings: PGListing[];
  toggleFavorite: (pgId: string) => void;
  toggleFollowPG: (pgId: string) => void;
  updateFilters: (newFilters: PGFilter) => void;
  createPGListing: (listing: Partial<PGListing>) => void;
  updatePGListing: (listingId: string, updates: Partial<PGListing>) => void;
}

const defaultFilters: PGFilter = {
  price: { min: 5000, max: 20000 },
  gender: null,
  amenities: [],
  availability: null,
};

const PGContext = createContext<PGContextType | undefined>(undefined);

export const PGProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // PG state
  const [pgs, setPgs] = useState<PG[]>(mockPGs);
  const [filteredPGs, setFilteredPGs] = useState<PG[]>(mockPGs);
  const [filters, setFilters] = useState<PGFilter>(defaultFilters);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [followedPGs, setFollowedPGs] = useState<string[]>([]);
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
      status: listing.status as 'draft' | 'published' | 'archived' || 'draft',
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
    <PGContext.Provider value={{
      pgs,
      filteredPGs,
      filters,
      favorites,
      followedPGs,
      pgListings,
      toggleFavorite,
      toggleFollowPG,
      updateFilters,
      createPGListing,
      updatePGListing,
    }}>
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
