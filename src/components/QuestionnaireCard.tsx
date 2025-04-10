
import React from 'react';
import { Question } from '@/types';
import { Button } from '@/components/ui/button';

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
    <div className="bg-white rounded-xl shadow-lg p-4 mb-4 animate-fade-in">
      <div className="flex items-center mb-3">
        <span className="text-2xl mr-2">{question.icon}</span>
        <h3 className="font-medium text-lg">{question.text}</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {question.options.map((option) => (
          <Button
            key={option.value}
            variant={currentAnswer === option.value ? 'default' : 'outline'}
            className={`justify-start h-auto py-2 ${
              currentAnswer === option.value ? 'bg-appPurple hover:bg-appPurple-dark' : ''
            }`}
            onClick={() => onAnswerSelected(question.id, option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuestionnaireCard;
