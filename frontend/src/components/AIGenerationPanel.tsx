import React, { useState, useEffect } from 'react';
import { Bot, Check, RotateCw, Clock } from 'lucide-react';

interface GenerationStage {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending';
}

interface AIGenerationPanelProps {
  onNext: () => void;
  onBack: () => void;
}

const AIGenerationPanel: React.FC<AIGenerationPanelProps> = ({ onNext, onBack }) => {
  const [progress, setProgress] = useState(65);
  const [eta, setEta] = useState(45);
  
  const stages: GenerationStage[] = [
    { id: 'analyze', name: 'Analyzing source content', status: 'completed' },
    { id: 'guidelines', name: 'Applying generation guidelines', status: 'completed' },
    { id: 'creating', name: 'Creating questions', status: 'current' },
    { id: 'formatting', name: 'Formatting responses', status: 'pending' },
    { id: 'validating', name: 'Validating output', status: 'pending' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          // Auto-advance to next step when complete
          setTimeout(() => onNext(), 1000);
          return 100;
        }
        return prev + 1;
      });
      
      setEta(prev => Math.max(0, prev - 1));
    }, 500);

    return () => clearInterval(timer);
  }, [onNext]);

  const getStageIcon = (stage: GenerationStage) => {
    switch (stage.status) {
      case 'completed':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'current':
        return <RotateCw className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStageColor = (stage: GenerationStage) => {
    switch (stage.status) {
      case 'completed':
        return 'text-green-600';
      case 'current':
        return 'text-blue-600 font-medium';
      case 'pending':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Centered Content */}
        <div className="text-center">
          {/* Animated Robot Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full animate-pulse">
              <Bot className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          {/* Title and Subtitle */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Generating Your Questions...
          </h1>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            AI is analyzing your content and creating high-quality questions tailored to your specifications
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress: {progress}%</span>
              <span className="text-sm text-gray-600">ETA: {eta} seconds</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Stage Checklist */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-12 max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Generation Stages</h2>
            <div className="space-y-4">
              {stages.map((stage) => (
                <div key={stage.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getStageIcon(stage)}
                  </div>
                  <span className={`text-sm ${getStageColor(stage)}`}>
                    {stage.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cancel Button */}
          <button 
            onClick={onBack}
            className="bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-6 rounded-lg border border-red-200 transition-colors"
          >
            Cancel Generation
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIGenerationPanel;
