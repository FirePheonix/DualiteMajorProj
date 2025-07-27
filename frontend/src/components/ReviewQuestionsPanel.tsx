import React, { useState } from 'react';
import { Edit, X, Check, ChevronDown } from 'lucide-react';

interface Question {
  id: string;
  type: 'Single Choice' | 'Multiple Choice' | 'True/False';
  quality: number;
  question: string;
  options: string[];
  correctAnswers: number[];
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  accepted: boolean;
}

interface ReviewQuestionsPanelProps {
  onNext: () => void;
  onBack: () => void;
}

const ReviewQuestionsPanel: React.FC<ReviewQuestionsPanelProps> = ({ onNext, onBack }) => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      type: 'Single Choice',
      quality: 95,
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswers: [2],
      points: 1,
      difficulty: 'Easy',
      accepted: true,
    },
    {
      id: '2',
      type: 'True/False',
      quality: 88,
      question: 'The Earth orbits around the Sun.',
      options: ['True', 'False'],
      correctAnswers: [0],
      points: 1,
      difficulty: 'Easy',
      accepted: true,
    },
    {
      id: '3',
      type: 'Multiple Choice',
      quality: 76,
      question: 'Which of the following are primary colors? (Select all that apply)',
      options: ['Red', 'Blue', 'Green', 'Yellow'],
      correctAnswers: [0, 1, 3],
      points: 2,
      difficulty: 'Medium',
      accepted: true,
    },
  ]);

  const getQualityColor = (quality: number) => {
    if (quality >= 90) return 'border-green-500 bg-green-50';
    if (quality >= 80) return 'border-green-400 bg-green-50';
    if (quality >= 70) return 'border-yellow-400 bg-yellow-50';
    return 'border-red-400 bg-red-50';
  };

  const getQualityBadgeColor = (quality: number) => {
    if (quality >= 90) return 'bg-green-100 text-green-800';
    if (quality >= 80) return 'bg-green-100 text-green-700';
    if (quality >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const acceptedQuestions = questions.filter(q => q.accepted);
  const averageQuality = Math.round(
    acceptedQuestions.reduce((sum, q) => sum + q.quality, 0) / acceptedQuestions.length
  );

  const qualityBreakdown = {
    excellent: questions.filter(q => q.quality >= 90 && q.accepted).length,
    good: questions.filter(q => q.quality >= 80 && q.quality < 90 && q.accepted).length,
    fair: questions.filter(q => q.quality >= 70 && q.quality < 80 && q.accepted).length,
  };

  const handleAcceptAll = () => {
    setQuestions(prev => prev.map(q => ({ ...q, accepted: true })));
  };

  const handleRejectAll = () => {
    setQuestions(prev => prev.map(q => ({ ...q, accepted: false })));
  };

  const handleQuestionToggle = (id: string) => {
    setQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, accepted: !q.accepted } : q)
    );
  };

  const renderQuestionOptions = (question: Question) => {
    if (question.type === 'Multiple Choice') {
      return (
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={question.correctAnswers.includes(index)}
                readOnly
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className={`text-sm ${question.correctAnswers.includes(index) ? 'font-medium text-green-700' : 'text-gray-700'}`}>
                {option} {question.correctAnswers.includes(index) && '(Correct)'}
              </span>
            </div>
          ))}
        </div>
      );
    }

    if (question.type === 'True/False') {
      return (
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="radio"
                checked={question.correctAnswers.includes(index)}
                readOnly
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className={`text-sm ${question.correctAnswers.includes(index) ? 'font-medium text-green-700' : 'text-gray-700'}`}>
                {option} {question.correctAnswers.includes(index) && '(Correct)'}
              </span>
            </div>
          ))}
        </div>
      );
    }

    // Single Choice
    return (
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="radio"
              checked={question.correctAnswers.includes(index)}
              readOnly
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className={`text-sm ${question.correctAnswers.includes(index) ? 'font-medium text-green-700' : 'text-gray-700'}`}>
              {option} {question.correctAnswers.includes(index) && '(Correct)'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Review Generated Questions ({questions.length})
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={handleAcceptAll}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Accept All</span>
            </button>
            <button
              onClick={handleRejectAll}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Reject All</span>
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6 mb-8 max-h-[500px] overflow-y-auto pr-2">
          {questions.map((question) => (
            <div
              key={question.id}
              className={`border-2 rounded-lg p-6 transition-all duration-200 ${getQualityColor(question.quality)} ${
                question.accepted ? 'opacity-100' : 'opacity-60'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${question.type === 'Single Choice' ? 'bg-blue-500' : question.type === 'True/False' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <span className="font-medium text-gray-900">Question {question.id} - {question.type}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityBadgeColor(question.quality)}`}>
                    Quality: {question.quality}%
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => handleQuestionToggle(question.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    {question.accepted ? 'Reject' : 'Accept'}
                  </button>
                </div>
              </div>

              {/* Question Content */}
              <div className="mb-4">
                <p className="text-gray-900 font-medium mb-3">Q: {question.question}</p>
                {renderQuestionOptions(question)}
              </div>

              {/* Question Metadata */}
              <div className="flex items-center space-x-4 text-sm text-gray-600 border-t border-gray-200 pt-3">
                <span>Points: {question.points}</span>
                <span>|</span>
                <span>Difficulty: {question.difficulty}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Discard & Go Back
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onBack}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Accept & Go Back
            </button>
            <button
              onClick={onNext}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Accept & Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewQuestionsPanel;
