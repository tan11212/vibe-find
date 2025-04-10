
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Calendar, Briefcase, CheckCircle2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { roommateQuestions } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const RoommateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { roommates } = useApp();
  
  const roommate = roommates.find(r => r.id === id);
  
  if (!roommate) {
    navigate('/roommate-finder');
    return null;
  }
  
  const handleContactRequest = () => {
    toast({
      title: "Contact request sent",
      description: `${roommate.name} will be notified of your interest`,
    });
  };
  
  return (
    <Layout>
      <div className="gradient-bg-pink min-h-screen">
        <div className="container px-4 py-4">
          <Button 
            variant="outline" 
            size="sm"
            className="mb-4"
            onClick={() => navigate('/roommate-finder')}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </Button>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
            <div className="bg-appPurple p-4 text-white">
              <div className="flex items-center">
                {roommate.image ? (
                  <img 
                    src={roommate.image} 
                    alt={roommate.name} 
                    className="h-20 w-20 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-appPurple-dark flex items-center justify-center text-white border-2 border-white">
                    <User size={30} />
                  </div>
                )}
                
                <div className="ml-4">
                  <h1 className="text-xl font-semibold">{roommate.name}</h1>
                  <div className="flex items-center text-white text-opacity-90 text-sm mt-1">
                    <Briefcase size={14} className="mr-1" />
                    <span>{roommate.occupation}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="bg-white bg-opacity-20 text-sm px-2 py-1 rounded-md">
                  <span className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {roommate.age} years old
                  </span>
                </div>
                <div className="bg-white bg-opacity-20 text-sm px-2 py-1 rounded-md">
                  <span>{roommate.gender}</span>
                </div>
                <div className="bg-white bg-opacity-20 text-sm px-2 py-1 rounded-md">
                  <span className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {roommate.lookingFor === 'room-and-roommate' 
                      ? 'Needs room & roommate' 
                      : 'Has room, needs roommate'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-2">About</h2>
              <p className="text-gray-700 mb-4">{roommate.bio}</p>
              
              {roommate.compatibilityScore !== undefined && (
                <div className="mb-4 bg-appBackground-purple p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Compatibility Score</h3>
                    <div className="text-xl font-bold text-appPurple">{roommate.compatibilityScore}%</div>
                  </div>
                  
                  {roommate.sharedTraits && roommate.sharedTraits.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Shared traits:</p>
                      <div className="flex flex-wrap gap-1">
                        {roommate.sharedTraits.map((trait, index) => (
                          <div 
                            key={index} 
                            className="bg-appPurple bg-opacity-10 text-appPurple text-xs px-2 py-1 rounded-md flex items-center"
                          >
                            <CheckCircle2 size={12} className="mr-1" />
                            {trait}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <h2 className="font-semibold text-lg mb-2">Lifestyle Preferences</h2>
              <div className="space-y-3">
                {roommate.answers.map(answer => {
                  const question = roommateQuestions.find(q => q.id === answer.questionId);
                  const selectedOption = question?.options.find(opt => opt.value === answer.answer);
                  
                  return question && selectedOption ? (
                    <div key={question.id} className="border-b border-gray-100 pb-3 last:border-0">
                      <div className="flex items-center mb-1">
                        <span className="text-lg mr-2">{question.icon}</span>
                        <p className="font-medium">{question.text}</p>
                      </div>
                      <div className="bg-appBackground-gray inline-block px-3 py-1 rounded-full text-sm">
                        {selectedOption.label}
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full bg-appPurple hover:bg-appPurple-dark" 
            onClick={handleContactRequest}
          >
            Request Contact Information
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default RoommateDetail;
