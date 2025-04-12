
import React from 'react';
import Layout from '@/components/Layout';
import PGCard from '@/components/PGCard';
import { useApp } from '@/context/AppContext';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { pgs, toggleFavorite, followedPGs } = useApp();
  const navigate = useNavigate();
  
  const favoritePGs = pgs.filter(pg => pg.isFavorite);
  const followedPGsList = pgs.filter(pg => followedPGs.includes(pg.id));
  
  return (
    <Layout>
      <div className="gradient-bg-blue min-h-screen">
        <div className="container px-4 py-4">
          <div className="text-left mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Saved PGs</h1>
            <p className="text-gray-600">Your saved and followed PG accommodations</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Heart size={18} className="mr-1 text-red-500 fill-red-500" />
              Favorites
            </h2>
            
            {favoritePGs.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-xl shadow-lg">
                <div className="text-4xl mb-2">💭</div>
                <h3 className="text-lg font-medium">No favorites yet</h3>
                <p className="text-gray-600 px-4">
                  Save your favorite PGs by tapping the heart icon
                </p>
              </div>
            ) : (
              <div>
                {favoritePGs.map(pg => (
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
          
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Heart size={18} className="mr-1 text-appPurple" />
              Following for Alerts
            </h2>
            
            {followedPGsList.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-xl shadow-lg">
                <div className="text-4xl mb-2">🔔</div>
                <h3 className="text-lg font-medium">Not following any PGs</h3>
                <p className="text-gray-600 px-4">
                  Follow PGs to get alerts when beds become available
                </p>
              </div>
            ) : (
              <div>
                {followedPGsList.map(pg => (
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
      </div>
    </Layout>
  );
};

export default Favorites;
