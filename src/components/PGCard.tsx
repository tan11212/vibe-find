
import React from 'react';
import { PG } from '@/types';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Heart, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PGCardProps {
  pg: PG;
  onToggleFavorite: () => void;
  onView: () => void;
}

const PGCard: React.FC<PGCardProps> = ({ pg, onToggleFavorite, onView }) => {
  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-1/3">
          <AspectRatio ratio={4/3} className="bg-gray-100">
            {pg.images && pg.images.length > 0 ? (
              <img
                src={pg.images[0]}
                alt={pg.name}
                className="object-cover w-full h-full rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-400">
                No Image
              </div>
            )}
          </AspectRatio>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md"
          >
            <Heart
              size={18}
              fill={pg.isFavorite ? "#ff6b6b" : "transparent"}
              stroke={pg.isFavorite ? "#ff6b6b" : "currentColor"}
            />
          </button>
        </div>
        
        <div className="p-4 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold truncate">{pg.name}</h3>
              <p className="text-gray-500 text-sm flex items-center mt-1">
                <MapPin size={14} className="mr-1" />
                {pg.address}
              </p>
            </div>
            <div className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
              {pg.availableBeds} beds available
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {pg.amenities.slice(0, 3).map((amenityId, index) => (
              <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                {amenityId}
              </span>
            ))}
            {pg.amenities.length > 3 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                +{pg.amenities.length - 3} more
              </span>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <Users size={16} className="text-gray-400 mr-1" />
              <span className="text-sm text-gray-600">{pg.gender}</span>
            </div>
            <Button 
              onClick={onView}
              className="bg-appPurple hover:bg-appPurple-dark text-white"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PGCard;
