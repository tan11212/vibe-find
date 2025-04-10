
import React from 'react';
import { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface QuestionnaireCardProps {
  question: Question;
  currentAnswer: string | null;
  onAnswerSelected: (questionId: string, answer: string) => void;
}

const QuestionnaireCard: React.FC<QuestionnaireCardProps> = ({
  question,
  currentAnswer,
  onAnswerSelected,
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
      </CardContent>
    </Card>
  );
};

export default QuestionnaireCard;
