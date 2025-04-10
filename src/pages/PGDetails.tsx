
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  ArrowLeft, 
  Heart, 
  Bell, 
  Bed, 
  Calendar, 
  ExternalLink 
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { amenities as allAmenities, generatePackingList } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';

const PGDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { pgs, toggleFavorite, followedPGs, toggleFollowPG } = useApp();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const pg = pgs.find(pg => pg.id === id);
  
  useEffect(() => {
    if (!pg) {
      navigate('/');
    }
  }, [pg, navigate]);
  
  if (!pg) {
    return null;
  }
  
  const isFollowing = followedPGs.includes(pg.id);
  const packingList = generatePackingList(pg);
  
  const handleFollowToggle = () => {
    toggleFollowPG(pg.id);
    toast({
      title: isFollowing ? "Stopped following" : "Following PG",
      description: isFollowing 
        ? "You will no longer receive alerts about this PG" 
        : "You will be notified when a bed becomes available",
      duration: 3000,
    });
  };
  
  return (
    <Layout>
      <div className="gradient-bg-purple min-h-screen pb-16">
        <div className="relative">
          <div className="h-64 bg-gray-300">
            <img 
              src={pg.images[activeImageIndex]} 
              alt={pg.name} 
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <Button 
              variant="secondary" 
              size="icon"
              className="rounded-full bg-white bg-opacity-90"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="icon"
                className={`rounded-full ${pg.isFavorite ? 'bg-white bg-opacity-90 text-red-500' : 'bg-white bg-opacity-90'}`}
                onClick={() => toggleFavorite(pg.id)}
              >
                <Heart size={20} className={pg.isFavorite ? 'fill-red-500' : ''} />
              </Button>
              
              <Button 
                variant="secondary" 
                size="icon"
                className={`rounded-full ${isFollowing ? 'bg-appPurple text-white' : 'bg-white bg-opacity-90'}`}
                onClick={handleFollowToggle}
              >
                <Bell size={20} />
              </Button>
            </div>
          </div>
          
          <div className="absolute bottom-0 w-full transform translate-y-1/2 px-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h1 className="text-xl font-semibold">{pg.name}</h1>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <MapPin size={14} className="mr-1" />
                <span>{pg.address}</span>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-2">
                <div className="bg-appPurple-dark text-white text-sm px-2 py-1 rounded-md">
                  {pg.gender === 'male' ? 'Male Only' : pg.gender === 'female' ? 'Female Only' : 'Co-ed'}
                </div>
                <div className="bg-appBackground-purple text-appPurple text-sm px-2 py-1 rounded-md">
                  <span className="font-semibold">{pg.availableBeds}</span> beds available
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container px-4 pt-16 pb-4">
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="nearby">Nearby</TabsTrigger>
              <TabsTrigger value="checklist">Checklist</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="animate-fade-in">
              <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
                <h2 className="font-semibold text-lg mb-2">Description</h2>
                <p className="text-gray-700">{pg.description}</p>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {pg.rooms.map(room => (
                      <div key={room.id} className="bg-appBackground-gray rounded-lg p-3">
                        <div className="text-sm text-gray-600">{room.type} room</div>
                        <div className="text-lg font-semibold">₹{room.price}<span className="text-sm font-normal">/month</span></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Availability</h3>
                  {pg.rooms.map(room => (
                    <div key={room.id} className="border-b border-gray-100 py-2 last:border-0">
                      <div className="flex justify-between">
                        <div className="font-medium">{room.type} room</div>
                        <div className="text-gray-600">{room.beds.length} beds</div>
                      </div>
                      
                      <div className="mt-1">
                        {room.beds.map(bed => (
                          <div key={bed.id} className="flex items-center text-sm mt-1">
                            <Bed size={14} className="mr-1" />
                            {bed.isOccupied ? (
                              bed.availableFrom ? (
                                <div className="flex items-center text-orange-600">
                                  <span>Available from </span>
                                  <Calendar size={12} className="mx-1" />
                                  <span>{bed.availableFrom.toLocaleDateString()}</span>
                                </div>
                              ) : (
                                <span className="text-red-500">Occupied</span>
                              )
                            ) : (
                              <span className="text-green-600">Available now</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Amenities</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {pg.amenities.map(amenityId => {
                      const amenity = allAmenities.find(a => a.id === amenityId);
                      return amenity ? (
                        <div key={amenity.id} className="flex items-center">
                          <span className="mr-2 text-lg">{amenity.icon}</span>
                          <span>{amenity.name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="nearby" className="animate-fade-in">
              <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
                <h2 className="font-semibold text-lg mb-2">Nearby Places</h2>
                
                <div className="mb-4">
                  <div className="bg-appBackground-gray h-48 rounded-lg mb-2 flex items-center justify-center">
                    <p className="text-gray-500">Map preview not available</p>
                  </div>
                  <a 
                    href={`https://maps.google.com/?q=${pg.location.lat},${pg.location.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-appPurple text-sm flex items-center"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    Open in Google Maps
                  </a>
                </div>
                
                <div>
                  {['atm', 'canteen', 'gym', 'hospital', 'bus'].map(placeType => {
                    const places = pg.nearbyPlaces.filter(p => p.type === placeType);
                    const icon = placeType === 'atm' ? '🏧' : 
                                 placeType === 'canteen' ? '🍽️' : 
                                 placeType === 'gym' ? '💪' : 
                                 placeType === 'hospital' ? '🏥' : '🚌';
                    
                    return places.length > 0 ? (
                      <div key={placeType} className="mb-3 last:mb-0">
                        <h3 className="font-medium text-sm text-gray-600 mb-1 flex items-center">
                          <span className="mr-1">{icon}</span>
                          {placeType.charAt(0).toUpperCase() + placeType.slice(1)}
                        </h3>
                        
                        {places.map(place => (
                          <div key={place.id} className="flex justify-between border-b border-gray-100 py-2 last:border-0">
                            <div>{place.name}</div>
                            <div className="text-gray-600 text-sm">
                              {place.distance < 1000 
                                ? `${place.distance}m` 
                                : `${(place.distance / 1000).toFixed(1)}km`}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="checklist" className="animate-fade-in">
              <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
                <h2 className="font-semibold text-lg mb-2">Things You'll Need</h2>
                <p className="text-sm text-gray-600 mb-3">
                  AI-generated checklist based on this PG's amenities
                </p>
                
                <div className="space-y-2">
                  {packingList.map((item, index) => (
                    <div key={index} className="flex items-start p-2 border-b border-gray-100 last:border-0">
                      <div dangerouslySetInnerHTML={{ __html: item }} />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default PGDetails;
