import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import PGCard from '@/components/PGCard';
import PGFilters from '@/components/PGFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePG } from '@/context/PGContext';
import { Search, Bookmark, Building, Plus } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { listings, isLoadingListings, toggleFavorite } = usePG();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredResults = searchQuery && listings
    ? listings.filter(pg => 
        pg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pg.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : listings;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Find Your PG</h1>
            <p className="text-gray-600">Discover PGs that suit your needs</p>
          </div>
          <Button 
            className="bg-appPurple hover:bg-appPurple-dark"
            onClick={() => navigate('/pg-listing-form')}
          >
            <Plus size={16} className="mr-2" />
            List PG
          </Button>
        </div>
        
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search by name or location"
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <PGFilters />
        
        <div className="bg-white p-4 rounded-xl shadow mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Available PGs</h2>
            <Button variant="outline" size="sm" className="flex items-center text-xs">
              <Bookmark size={14} className="mr-1" />
              Saved
            </Button>
          </div>
          
          {isLoadingListings ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-appPurple mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading PGs...</p>
            </div>
          ) : filteredResults?.length === 0 ? (
            <div className="text-center py-10">
              <div className="flex justify-center mb-2">
                <Building size={40} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-medium">No PGs found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredResults?.map(pg => (
                <PGCard 
                  key={pg.id} 
                  pg={pg} 
                  onToggleFavorite={() => toggleFavorite(pg.id)}
                  onView={() => navigate(`/pg/${pg.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
