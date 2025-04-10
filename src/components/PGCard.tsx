
import React from 'react';
import { Heart, MapPin } from 'lucide-react';
import { PG } from '@/types';
import { useNavigate } from 'react-router-dom';
import { amenities as allAmenities } from '@/data/mockData';

interface PGCardProps {
  pg: PG;
  onToggleFavorite: (id: string) => void;
}

const PGCard: React.FC<PGCardProps> = ({ pg, onToggleFavorite }) => {
  const navigate = useNavigate();
  
  const availableBedsText = pg.availableBeds > 0 
    ? `${pg.availableBeds} beds available now`
    : 'No beds available now';
    
  const soonAvailableBeds = pg.rooms
    .flatMap(room => room.beds)
    .filter(bed => bed.isOccupied && bed.availableFrom)
    .sort((a, b) => {
      const dateA = a.availableFrom as Date;
      const dateB = b.availableFrom as Date;
      return dateA.getTime() - dateB.getTime();
    });
    
  const displayedAmenities = pg.amenities.slice(0, 4).map(amenityId => {
    const foundAmenity = allAmenities.find(a => a.id === amenityId);
    return foundAmenity ? foundAmenity : null;
  }).filter(Boolean);

  return (
    <div 
      className="rounded-xl overflow-hidden bg-white shadow-lg mb-4 animate-scale-in card-shadow"
      onClick={() => navigate(`/pg/${pg.id}`)}
    >
      <div className="relative">
        <img 
          src={pg.images[0]} 
          alt={pg.name} 
          className="h-40 w-full object-cover"
        />
        <button 
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(pg.id);
          }}
        >
          <Heart 
            size={20} 
            className={pg.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'} 
          />
        </button>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
          {pg.gender === 'male' ? 'Male Only' : pg.gender === 'female' ? 'Female Only' : 'Co-ed'}
        </div>
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{pg.name}</h3>
          <div className="bg-appPurple text-white px-2 py-0.5 rounded text-sm">
            ₹{pg.rooms[0].price}+
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm mt-1">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{pg.address}</span>
        </div>
        
        <div className="mt-2">
          <div className="text-sm font-medium text-green-600">
            {availableBedsText}
          </div>
          {soonAvailableBeds.length > 0 && (
            <div className="text-xs text-gray-600">
              {soonAvailableBeds.length} bed(s) available soon
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {displayedAmenities.map((amenity) => (
            amenity && (
              <div key={amenity.id} className="amenity-icon">
                <span>{amenity.icon}</span>
                <span>{amenity.name}</span>
              </div>
            )
          ))}
          {pg.amenities.length > 4 && (
            <div className="amenity-icon">
              <span>+{pg.amenities.length - 4}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-2 text-sm">
          <div className="flex items-center">
            <span className="text-appPurple font-medium">{pg.rating}</span>
            <span className="text-gray-500 ml-1">({pg.reviews} reviews)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PGCard;
