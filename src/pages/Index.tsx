
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import Layout from '@/components/Layout';
import PGCard from '@/components/PGCard';
import PGFilters from '@/components/PGFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Search, Bookmark, Building, Plus, Loader2 } from 'lucide-react';
import { PGFilter } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { filteredPGs, favorites, toggleFavorite, filters, updateFilters } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pgListings, setPgListings] = useState([]);
  
  useEffect(() => {
    const fetchPGListings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('pg_listings')
          .select('*')
          .eq('status', 'published');
          
        if (error) {
          throw error;
        }
        
        setPgListings(data || []);
      } catch (error) {
        console.error('Error fetching PG listings:', error);
        toast({
          variant: "destructive",
          title: "Failed to load PG listings",
          description: "Please try again later",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPGListings();
  }, [toast]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredResults = searchQuery
    ? filteredPGs.filter(pg => 
        pg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pg.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredPGs;

  const handleApplyFilters = (newFilters: PGFilter) => {
    updateFilters(newFilters);
  };
  
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
            onClick={() => navigate(user ? '/pg-listing-form' : '/auth')}
          >
            {user ? (
              <>
                <Plus size={16} className="mr-2" />
                List PG
              </>
            ) : (
              <>
                <LogIn size={16} className="mr-2" />
                Login to List PG
              </>
            )}
          </Button>
        </div>
        
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search by name or location"
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <PGFilters 
          currentFilters={filters} 
          onApplyFilters={handleApplyFilters} 
        />
        
        <div className="bg-white p-4 rounded-xl shadow mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Recommended PGs</h2>
            {user && (
              <Button variant="outline" size="sm" className="flex items-center text-xs" onClick={() => navigate('/favorites')}>
                <Bookmark size={14} className="mr-1" />
                Saved ({favorites.length})
              </Button>
            )}
          </div>
          
          {isLoading ? (
            <div className="text-center py-10">
              <Loader2 size={40} className="text-gray-300 animate-spin mx-auto mb-2" />
              <h3 className="text-lg font-medium">Loading PGs</h3>
              <p className="text-gray-500">Please wait...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-10">
              <div className="flex justify-center mb-2">
                <Building size={40} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-medium">No PGs found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredResults.map(pg => (
                <PGCard 
                  key={pg.id} 
                  pg={pg} 
                  onToggleFavorite={() => user ? toggleFavorite(pg.id) : navigate('/auth')}
                  onView={() => user ? navigate(`/pg/${pg.id}`) : navigate('/auth')}
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
