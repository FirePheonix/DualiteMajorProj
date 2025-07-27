import React, { useState } from 'react';
import { 
  Circle, 
  CheckSquare, 
  ToggleLeft, 
  BarChart3, 
  Star, 
  Edit3 
} from 'lucide-react';
import QuestionTypeCard from './QuestionTypeCard';

interface QuestionType {
  id: string;
  title: string;
  icon: any;
  quantity: number;
}

interface QuestionSelectionPanelProps {
  onNext: () => void;
}

const QuestionSelectionPanel: React.FC<QuestionSelectionPanelProps> = ({ onNext }) => {
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([
    { id: 'single-choice', title: 'Single Choice', icon: Circle, quantity: 1 },
    { id: 'multiple-choice', title: 'Multiple Choice', icon: CheckSquare, quantity: 1 },
    { id: 'true-false', title: 'True/False', icon: ToggleLeft, quantity: 1 },
    { id: 'ranking', title: 'Ranking', icon: BarChart3, quantity: 0 },
    { id: 'rating', title: 'Rating', icon: Star, quantity: 0 },
    { id: 'fill-blank', title: 'Fill in Blank', icon: Edit3, quantity: 0 },
  ]);

  const updateQuantity = (id: string, quantity: number) => {
    setQuestionTypes(prev =>
      prev.map(type =>
        type.id === id ? { ...type, quantity } : type
      )
    );
  };

  const totalQuestions = questionTypes.reduce((sum, type) => sum + type.quantity, 0);
  const estimatedCost = totalQuestions * 3; // 3 credits per question

  const handleNext = () => {
    if (totalQuestions > 0) {
      onNext();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Select Question Types and Quantities
        </h1>

        {/* Question Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {questionTypes.map((type) => (
            <QuestionTypeCard
              key={type.id}
              icon={type.icon}
              title={type.title}
              quantity={type.quantity}
              onQuantityChange={(quantity) => updateQuantity(type.id, quantity)}
            />
          ))}
        </div>

        {/* Summary Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Total Questions Selected:</span>
              <span className="ml-2 text-lg font-bold text-gray-900">{totalQuestions}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Estimated Cost:</span>
              <span className="ml-2 text-lg font-bold text-blue-600">{estimatedCost} Credits</span>
            </div>
          </div>
        </div>

        {/* Next Step Button */}
        <div className="flex justify-end">
          <button 
            onClick={handleNext}
            disabled={totalQuestions === 0}
            className={`font-medium py-2 px-6 rounded-lg transition-colors ${
              totalQuestions > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionSelectionPanel;
