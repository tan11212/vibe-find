
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import RoommateCard from '@/components/RoommateCard';
import { useApp } from '@/context/AppContext';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

const RoommateFinder = () => {
  const { roommates, lookingFor, setLookingForOption } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredRoommates = searchQuery
    ? roommates.filter(
        roommate =>
          roommate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          roommate.occupation.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : roommates;
  
  return (
    <Layout>
      <div className="gradient-bg-pink min-h-screen">
        <div className="container px-4 py-4">
          <div className="text-left mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Find Your Roommate</h1>
            <p className="text-gray-600">Connect with compatible roommates</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
            <h2 className="font-medium text-lg mb-3">What are you looking for?</h2>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={lookingFor === 'just-roommate' ? 'default' : 'outline'}
                className={lookingFor === 'just-roommate' ? 'bg-appPurple hover:bg-appPurple-dark' : ''}
                onClick={() => setLookingForOption('just-roommate')}
              >
                I have a room, need roommate
              </Button>
              <Button
                variant={lookingFor === 'room-and-roommate' ? 'default' : 'outline'}
                className={lookingFor === 'room-and-roommate' ? 'bg-appPurple hover:bg-appPurple-dark' : ''}
                onClick={() => setLookingForOption('room-and-roommate')}
              >
                I need room & roommate
              </Button>
            </div>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search roommates"
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              {filteredRoommates.length} matches found
            </div>
            <Button variant="outline" size="sm" className="flex items-center">
              <Filter size={14} className="mr-1" />
              Filters
            </Button>
          </div>
          
          {lookingFor ? (
            <>
              <div className="mb-2">
                <Button 
                  className="w-full bg-appPurple hover:bg-appPurple-dark"
                  onClick={() => console.log('Take questionnaire')}
                >
                  {lookingFor === 'just-roommate' 
                    ? 'Create your listing & take questionnaire' 
                    : 'Take roommate compatibility questionnaire'}
                </Button>
              </div>
              
              {filteredRoommates.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">😕</div>
                  <h3 className="text-lg font-medium">No roommates found</h3>
                  <p className="text-gray-600">Try adjusting your search</p>
                </div>
              ) : (
                <div>
                  {filteredRoommates.map(roommate => (
                    <RoommateCard key={roommate.id} roommate={roommate} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 bg-white rounded-xl shadow-lg">
              <div className="text-4xl mb-2">👋</div>
              <h3 className="text-lg font-medium">Select an Option Above</h3>
              <p className="text-gray-600 px-4">
                Let us know whether you already have a room or need both a room and roommate
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RoommateFinder;
