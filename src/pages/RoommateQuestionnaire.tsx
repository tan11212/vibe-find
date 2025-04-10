
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import QuestionnaireCard from '@/components/QuestionnaireCard';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { roommateQuestions } from '@/data/mockData';
import { ArrowLeft, ArrowRight, Check, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';

const RoommateQuestionnaire = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { lookingFor, roommateAnswers, addRoommateAnswer, updateUserProfile } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [userDetail, setUserDetail] = useState({
    name: '',
    age: '',
    gender: 'male',
    occupation: '',
    bio: '',
  });
  
  if (!lookingFor) {
    navigate('/roommate-finder');
    return null;
  }
  
  const totalSteps = roommateQuestions.length + 1; // +1 for personal details
  
  const handleAnswerSelected = (questionId: string, answer: string) => {
    // Find existing answer to preserve privacy setting
    const existingAnswer = roommateAnswers.find(a => a.questionId === questionId);
    const isPublic = existingAnswer?.isPublic ?? true; // Default to public if no existing answer
    
    addRoommateAnswer(questionId, answer, isPublic);
  };
  
  const handlePrivacyToggle = (questionId: string, isPublic: boolean) => {
    // Find existing answer to preserve the selected answer
    const existingAnswer = roommateAnswers.find(a => a.questionId === questionId);
    if (existingAnswer) {
      addRoommateAnswer(questionId, existingAnswer.answer, isPublic);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserDetail(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNext = () => {
    if (currentStep === 0) {
      // Validate personal details
      if (!userDetail.name || !userDetail.age || !userDetail.occupation || !userDetail.bio) {
        toast({
          title: "Required fields missing",
          description: "Please fill in all the fields",
          variant: "destructive",
        });
        return;
      }
    } else {
      // Validate questionnaire answer
      const currentQuestion = roommateQuestions[currentStep - 1];
      const answer = roommateAnswers.find(a => a.questionId === currentQuestion.id);
      if (!answer) {
        toast({
          title: "Please select an answer",
          description: "Select one of the options to continue",
          variant: "destructive",
        });
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  };
  
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  const handleSubmit = () => {
    // Validate the last question is answered
    if (currentStep > 0) {
      const currentQuestion = roommateQuestions[currentStep - 1];
      const answer = roommateAnswers.find(a => a.questionId === currentQuestion.id);
      if (!answer) {
        toast({
          title: "Please select an answer",
          description: "Select one of the options to continue",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Update user profile
    updateUserProfile({
      name: userDetail.name,
      age: parseInt(userDetail.age),
      gender: userDetail.gender as 'male' | 'female' | 'other',
      occupation: userDetail.occupation,
      bio: userDetail.bio,
      answers: roommateAnswers,
    });
    
    toast({
      title: "Profile submitted successfully",
      description: "Your roommate profile is now visible to others",
    });
    
    navigate('/roommate-finder');
  };
  
  return (
    <Layout>
      <div className="gradient-bg-purple min-h-screen">
        <div className="container px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/roommate-finder')}
            >
              <ArrowLeft size={16} className="mr-1" />
              Back
            </Button>
            <div className="text-sm">
              Step {currentStep + 1} of {totalSteps}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 h-1 rounded-full mb-4">
            <div 
              className="bg-appPurple h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            ></div>
          </div>
          
          {currentStep === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-4 mb-4 animate-fade-in">
              <h2 className="font-semibold text-lg mb-4">Tell us about yourself</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={userDetail.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={userDetail.age}
                    onChange={handleInputChange}
                    placeholder="Enter your age"
                  />
                </div>
                
                <div>
                  <Label>Gender</Label>
                  <RadioGroup 
                    value={userDetail.gender}
                    onValueChange={(value) => setUserDetail(prev => ({ ...prev, gender: value }))}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={userDetail.occupation}
                    onChange={handleInputChange}
                    placeholder="Student, Professional, etc."
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio">Brief Bio</Label>
                  <Input
                    id="bio"
                    name="bio"
                    value={userDetail.bio}
                    onChange={handleInputChange}
                    placeholder="Tell potential roommates a bit about yourself"
                  />
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg text-sm flex items-start">
                  <Info size={18} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-700">
                    In the next steps, you'll answer questions about your lifestyle. You can choose which answers to make public on your profile. All answers will be used for compatibility matching even if not public.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <QuestionnaireCard
              question={roommateQuestions[currentStep - 1]}
              currentAnswer={
                roommateAnswers.find(
                  a => a.questionId === roommateQuestions[currentStep - 1].id
                )?.answer || null
              }
              isPublic={
                roommateAnswers.find(
                  a => a.questionId === roommateQuestions[currentStep - 1].id
                )?.isPublic ?? true
              }
              onAnswerSelected={handleAnswerSelected}
              onPrivacyToggle={handlePrivacyToggle}
            />
          )}
          
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft size={16} className="mr-1" />
              Back
            </Button>
            
            {currentStep < totalSteps - 1 ? (
              <Button
                className="bg-appPurple hover:bg-appPurple-dark"
                onClick={handleNext}
              >
                Next
                <ArrowRight size={16} className="ml-1" />
              </Button>
            ) : (
              <Button
                className="bg-appPurple hover:bg-appPurple-dark"
                onClick={handleSubmit}
              >
                Submit
                <Check size={16} className="ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoommateQuestionnaire;
