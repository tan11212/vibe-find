
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Calendar, Briefcase, CheckCircle2, MessageCircle, Lock, AlertTriangle, Shield } from 'lucide-react';
import Layout from '@/components/Layout';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { roommateQuestions } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const RoommateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { roommates, requestRoommateMatch, userRoommateProfile, startChat } = useApp();
  
  const roommate = roommates.find(r => r.id === id);
  
  if (!roommate) {
    navigate('/roommate-finder');
    return null;
  }
  
  const handleMatchRequest = () => {
    if (userRoommateProfile) {
      requestRoommateMatch(roommate.id);
      toast({
        title: "Match request sent",
        description: `${roommate.name} will be notified of your interest`,
      });
    } else {
      toast({
        title: "Profile required",
        description: "Please create your profile first",
        variant: "destructive",
      });
      navigate('/roommate-questionnaire');
    }
  };
  
  const handleStartChat = () => {
    if (roommate.hasMatched && roommate.matchStatus === 'accepted') {
      startChat(roommate.id);
      toast({
        title: "Chat started",
        description: `You can now chat with ${roommate.name}`,
      });
      // In a real app, this would navigate to a chat screen
      // For now, we'll just show a toast
    }
  };
  
  // Filter answers to only show public ones if not matched
  const visibleAnswers = roommate.hasMatched 
    ? roommate.answers 
    : roommate.answers.filter(answer => answer.isPublic);
  
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
                    <div className={`text-xl font-bold ${
                      roommate.compatibilityScore > 70 ? 'text-green-600' : 
                      roommate.compatibilityScore > 40 ? 'text-appPurple' : 'text-amber-600'
                    }`}>
                      {roommate.compatibilityScore}%
                    </div>
                  </div>
                  
                  {!roommate.hasMatched && (
                    <div className="flex items-center justify-center mt-3 p-2 bg-gray-100 rounded-lg">
                      <Lock size={16} className="text-gray-500 mr-2" />
                      <p className="text-gray-500">Match with this person to view shared traits</p>
                    </div>
                  )}
                  
                  {/* Smart compatibility indicator */}
                  {roommate.compatibilityScore < 40 && (
                    <div className="mt-2 flex items-start bg-amber-50 p-2 rounded text-amber-800 text-sm">
                      <Shield size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        Some lifestyle preferences may not be compatible. We recommend checking the dealbreakers section before matching.
                      </div>
                    </div>
                  )}
                  
                  {roommate.hasMatched && roommate.sharedTraits && roommate.sharedTraits.length > 0 && (
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
              
              {roommate.hasMatched && roommate.dealBreakers && roommate.dealBreakers.length > 0 && (
                <div className="mb-4 bg-amber-50 p-3 rounded-lg">
                  <h3 className="font-medium flex items-center text-amber-800">
                    <AlertTriangle size={16} className="mr-2" />
                    Deal Breakers
                  </h3>
                  <p className="text-sm text-amber-700 mt-1 mb-2">
                    These are issues that {roommate.name} considers incompatible:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {roommate.dealBreakers.map((dealBreaker, index) => (
                      <div 
                        key={index} 
                        className="bg-white text-amber-800 text-xs px-2 py-1 rounded-md"
                      >
                        {dealBreaker}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <h2 className="font-semibold text-lg mb-2">Lifestyle Preferences</h2>
              {visibleAnswers.length === 0 ? (
                <div className="text-center py-6 bg-gray-100 rounded-lg mb-4">
                  <Lock size={24} className="text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-500">This user has set all preferences to private</p>
                  <p className="text-gray-500 text-sm">Match to see more details</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleAnswers.map(answer => {
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
                  
                  {!roommate.hasMatched && visibleAnswers.length < roommate.answers.length && (
                    <div className="flex items-center mt-3 p-2 bg-gray-100 rounded-lg">
                      <Lock size={16} className="text-gray-500 mr-2" />
                      <p className="text-gray-500">
                        {roommate.answers.length - visibleAnswers.length} more preferences are private. Match to see all.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {roommate.hasMatched && roommate.matchStatus === 'accepted' ? (
            <Button 
              className="w-full bg-green-500 hover:bg-green-600 mb-2" 
              onClick={handleStartChat}
            >
              <MessageCircle size={16} className="mr-2" />
              Chat with {roommate.name}
            </Button>
          ) : roommate.hasMatched && roommate.matchStatus === 'pending' ? (
            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600" 
              disabled
            >
              Match request pending
            </Button>
          ) : (
            <Button 
              className="w-full bg-appPurple hover:bg-appPurple-dark" 
              onClick={handleMatchRequest}
            >
              Request to Match
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RoommateDetail;
