
import React from 'react';
import { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface QuestionnaireCardProps {
  question: Question;
  currentAnswer: string | null;
  isPublic: boolean;
  onAnswerSelected: (questionId: string, answer: string) => void;
  onPrivacyToggle: (questionId: string, isPublic: boolean) => void;
}

const QuestionnaireCard: React.FC<QuestionnaireCardProps> = ({
  question,
  currentAnswer,
  isPublic,
  onAnswerSelected,
  onPrivacyToggle,
}) => {
  return (
    <Card className="animate-fade-in overflow-hidden">
      <div className="bg-appPurple p-4 text-white">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{question.icon}</span>
          <h3 className="font-medium text-lg">{question.text}</h3>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option) => (
            <Button
              key={option.value}
              variant={currentAnswer === option.value ? 'default' : 'outline'}
              className={`justify-start h-auto py-3 text-left transition-all ${
                currentAnswer === option.value 
                  ? 'bg-appPurple hover:bg-appPurple-dark scale-105' 
                  : 'hover:scale-102'
              }`}
              onClick={() => onAnswerSelected(question.id, option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <Label htmlFor={`privacy-${question.id}`} className="text-sm text-gray-600">
              Make this answer public on your profile
            </Label>
            <Switch
              id={`privacy-${question.id}`}
              checked={isPublic}
              onCheckedChange={(checked) => onPrivacyToggle(question.id, checked)}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isPublic 
              ? "This will be visible to everyone viewing your profile" 
              : "This will only be used for compatibility matching, but not shown publicly"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionnaireCard;
