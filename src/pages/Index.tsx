
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Layout from '@/components/Layout';
import PGCard from '@/components/PGCard';
import PGFilters from '@/components/PGFilters';
import { useApp } from '@/context/AppContext';
import { Input } from '@/components/ui/input';

const Index = () => {
  const { filteredPGs, toggleFavorite, filters, updateFilters } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  
  const displayedPGs = searchQuery 
    ? filteredPGs.filter(pg => 
        pg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pg.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredPGs;
  
  return (
    <Layout>
      <div className="gradient-bg-purple min-h-screen">
        <div className="container px-4 py-4">
          <div className="text-left mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Find Your PG</h1>
            <p className="text-gray-600">Discover the perfect paying guest accommodation</p>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search by name or location"
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <PGFilters 
            currentFilters={filters}
            onApplyFilters={updateFilters}
          />
          
          {displayedPGs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">😕</div>
              <h3 className="text-lg font-medium">No PGs found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-2">{displayedPGs.length} results found</p>
              {displayedPGs.map(pg => (
                <PGCard 
                  key={pg.id} 
                  pg={pg} 
                  onToggleFavorite={toggleFavorite}
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
