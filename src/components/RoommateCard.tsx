
import React from 'react';
import { User, MapPin, Calendar, Briefcase, Lock } from 'lucide-react';
import { RoommateProfile } from '@/types';
import { useNavigate } from 'react-router-dom';

interface RoommateCardProps {
  roommate: RoommateProfile;
}

const RoommateCard: React.FC<RoommateCardProps> = ({ roommate }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="rounded-xl overflow-hidden bg-white shadow-lg mb-4 animate-scale-in card-shadow"
      onClick={() => navigate(`/roommate/${roommate.id}`)}
    >
      <div className="relative flex p-4 gap-3">
        <div className="flex-shrink-0">
          {roommate.image ? (
            <img 
              src={roommate.image} 
              alt={roommate.name} 
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-appPurple-dark flex items-center justify-center text-white">
              <User size={30} />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{roommate.name}</h3>
            <div className="bg-appPurple text-white px-2 py-0.5 rounded text-sm">
              {roommate.gender}
            </div>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm mt-1">
            <Calendar size={14} className="mr-1" />
            <span>{roommate.age} years old</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm mt-1">
            <Briefcase size={14} className="mr-1" />
            <span>{roommate.occupation}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm mt-1">
            <MapPin size={14} className="mr-1" />
            <span>
              {roommate.lookingFor === 'room-and-roommate' 
                ? 'Looking for room & roommate' 
                : 'Has room, needs roommate'}
            </span>
          </div>
        </div>
      </div>
      
      {roommate.compatibilityScore !== undefined && (
        <div className="px-4 py-3 bg-appBackground-purple border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">
              Compatibility Score
            </div>
            <div className="font-bold text-appPurple">
              {roommate.compatibilityScore}%
            </div>
          </div>
          
          {!roommate.hasMatched && (
            <div className="text-xs text-gray-600 mt-1 flex items-center">
              <Lock size={12} className="mr-1" />
              Match to see shared traits
            </div>
          )}
          
          {roommate.hasMatched && roommate.sharedTraits && roommate.sharedTraits.length > 0 && (
            <div className="text-xs text-gray-600 mt-1">
              Shared traits: {roommate.sharedTraits.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoommateCard;
