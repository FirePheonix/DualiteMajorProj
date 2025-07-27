import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Circle, 
  CheckSquare, 
  ToggleLeft, 
  BarChart3, 
  Star, 
  Edit3,
  Edit,
  Image,
  FileText,
  Info,
  Bot,
  RotateCw,
  Clock,
  X,
  AlertTriangle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

// TypeScript Interfaces
interface QuestionType {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  quantity: number;
}

interface SourceOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  selected: boolean;
}

interface GenerationStage {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending';
}

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

interface WizardStep {
  id: number;
  name: string;
  status: 'active' | 'completed' | 'pending';
}

interface UsageMeter {
  name: string;
  current: number;
  total: number;
  color: string;
  highlighted?: boolean;
}

interface AIQuestionWizardProps {
  onComplete?: (data: any) => void;
  onCancel?: () => void;
  className?: string;
}

const AIQuestionWizard: React.FC<AIQuestionWizardProps> = ({ 
  onComplete, 
  onCancel,
  className = '' 
}) => {
  // State Management
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Step 1: Question Selection State
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([
    { id: 'single-choice', title: 'Single Choice', icon: Circle, quantity: 1 },
    { id: 'multiple-choice', title: 'Multiple Choice', icon: CheckSquare, quantity: 1 },
    { id: 'true-false', title: 'True/False', icon: ToggleLeft, quantity: 1 },
    { id: 'ranking', title: 'Ranking', icon: BarChart3, quantity: 0 },
    { id: 'rating', title: 'Rating', icon: Star, quantity: 0 },
    { id: 'fill-blank', title: 'Fill in Blank', icon: Edit3, quantity: 0 },
  ]);

  // Step 2: Source Selection State
  const [selectedSource, setSelectedSource] = useState<string>('text-prompt');
  const [promptText, setPromptText] = useState<string>('Create engaging questions about machine learning fundamentals, covering topics like supervised learning, neural networks, and data preprocessing. Target intermediate level understanding.');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('technical');

  // Step 4: Generation State
  const [progress, setProgress] = useState(65);
  const [eta, setEta] = useState(45);
  const [generationStages] = useState<GenerationStage[]>([
    { id: 'analyze', name: 'Analyzing source content', status: 'completed' },
    { id: 'guidelines', name: 'Applying generation guidelines', status: 'completed' },
    { id: 'creating', name: 'Creating questions', status: 'current' },
    { id: 'formatting', name: 'Formatting responses', status: 'pending' },
    { id: 'validating', name: 'Validating output', status: 'pending' },
  ]);

  // Step 5: Review State
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

  // Computed Values
  const totalQuestions = questionTypes.reduce((sum, type) => sum + type.quantity, 0);
  const estimatedCost = totalQuestions * 3;
  const acceptedQuestions = questions.filter(q => q.accepted);
  const averageQuality = acceptedQuestions.length > 0 
    ? Math.round(acceptedQuestions.reduce((sum, q) => sum + q.quality, 0) / acceptedQuestions.length)
    : 0;

  const qualityBreakdown = {
    excellent: questions.filter(q => q.quality >= 90 && q.accepted).length,
    good: questions.filter(q => q.quality >= 80 && q.quality < 90 && q.accepted).length,
    fair: questions.filter(q => q.quality >= 70 && q.quality < 80 && q.accepted).length,
  };

  // Wizard Steps
  const steps: WizardStep[] = [
    { id: 1, name: 'Question Types', status: currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'pending' },
    { id: 2, name: 'Source Selection', status: currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : 'pending' },
    { id: 3, name: 'Guidelines', status: currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : 'pending' },
    { id: 4, name: 'Generation', status: currentStep === 4 ? 'active' : currentStep > 4 ? 'completed' : 'pending' },
    { id: 5, name: 'Review', status: currentStep === 5 ? 'active' : currentStep > 5 ? 'completed' : 'pending' },
    { id: 6, name: 'Summary', status: currentStep === 6 ? 'active' : currentStep > 6 ? 'completed' : 'pending' },
  ];

  // Usage Meters for Sidebar
  const usageMeters: UsageMeter[] = [
    { 
      name: 'Text Generation', 
      current: 45, 
      total: 50, 
      color: 'bg-green-500',
      highlighted: currentStep === 2
    },
    { name: 'Image Generation', current: 12, total: 20, color: 'bg-yellow-500' },
    { name: 'PDF Generation', current: 3, total: 10, color: 'bg-blue-500' },
  ];

  // Auto-progression for Step 4
  useEffect(() => {
    if (currentStep === 4) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => setCurrentStep(5), 1000);
            return 100;
          }
          return prev + 1;
        });
        
        setEta(prev => Math.max(0, prev - 1));
      }, 500);

      return () => clearInterval(timer);
    }
  }, [currentStep]);

  // Navigation Functions
  const handleNextStep = () => {
    if (canProceed() && currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep || stepNumber === currentStep + 1) {
      setCurrentStep(stepNumber);
    }
  };

  // Validation Functions
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return totalQuestions > 0;
      case 2:
        return selectedSource === 'text-prompt' ? promptText.trim().length > 0 : true;
      case 3:
        return true;
      case 4:
        return progress >= 100;
      case 5:
        return acceptedQuestions.length > 0;
      default:
        return true;
    }
  };

  // Question Type Handlers
  const updateQuestionQuantity = (id: string, quantity: number) => {
    setQuestionTypes(prev =>
      prev.map(type =>
        type.id === id ? { ...type, quantity } : type
      )
    );
  };

  // Source Selection Handlers
  const handleSourceSelect = (sourceId: string) => {
    setSelectedSource(sourceId);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptText(e.target.value);
  };

  // Question Review Handlers
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

  // Utility Functions
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

  // Component Renderers
  const renderNavigationSidebar = () => (
    <div className="bg-white border-r border-gray-200 h-full p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-8">Navigation</h2>
      <nav className="space-y-4">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`flex items-center space-x-3 ${
              (step.status === 'completed' || step.status === 'active')
                ? 'cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded-lg transition-colors'
                : ''
            }`}
            onClick={() => handleStepClick(step.id)}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step.status === 'active'
                  ? 'bg-blue-600 text-white'
                  : step.status === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step.status === 'completed' ? (
                <Check className="w-5 h-5" />
              ) : (
                step.id
              )}
            </div>
            <span
              className={`text-sm font-medium transition-colors ${
                step.status === 'active'
                  ? 'text-blue-600'
                  : step.status === 'completed'
                  ? 'text-green-600'
                  : 'text-gray-500'
              }`}
            >
              {step.name}
            </span>
          </div>
        ))}
      </nav>
    </div>
  );

  const renderBalanceSidebar = () => {
    const currentBalance = 847;
    const totalBalance = 1000;
    const balancePercentage = (currentBalance / totalBalance) * 100;
    const balanceAfterGeneration = 838;

    return (
      <div className="bg-white border-l border-gray-200 h-full p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {currentStep === 4 ? 'Processing Status' : 
           currentStep === 5 ? 'Generation Summary' : 'AI Balance & Usage'}
        </h2>
        
        {/* Generation Summary - Step 5 */}
        {currentStep === 5 && (
          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Questions Generated:</span>
                <span className="text-lg font-bold text-gray-900">{questions.length}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Currently Accepted:</span>
                <span className="text-lg font-bold text-gray-900">{acceptedQuestions.length}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Avg Quality Score:</span>
                <span className="text-lg font-bold text-gray-900">{averageQuality}%</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Credits Consumed:</span>
                <span className="text-lg font-bold text-gray-900">{estimatedCost}</span>
              </div>
            </div>
            
            {/* Quality Breakdown */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Quality Breakdown</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Excellent (90%+)</span>
                    <span className="text-xs font-medium text-gray-900">{qualityBreakdown.excellent}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(qualityBreakdown.excellent / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Good (80-89%)</span>
                    <span className="text-xs font-medium text-gray-900">{qualityBreakdown.good}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(qualityBreakdown.good / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Fair (70-79%)</span>
                    <span className="text-xs font-medium text-gray-900">{qualityBreakdown.fair}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(qualityBreakdown.fair / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Processing Status - Step 4 */}
        {currentStep === 4 && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Info className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Processing {totalQuestions} questions
                  </p>
                  <p className="text-sm text-blue-700">
                    Cost: {estimatedCost} credits
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Current Balance</span>
                <span className="text-sm font-bold text-gray-900">{currentBalance}/{totalBalance}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${balancePercentage}%` }}
                ></div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-600">Credits After Generation</span>
                  <span className="text-xs font-bold text-gray-800">{balanceAfterGeneration}/{totalBalance}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(balanceAfterGeneration / totalBalance) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Generation Details</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="text-gray-900 font-medium">GPT-4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Started:</span>
                  <span className="text-gray-900">2:34 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Session ID:</span>
                  <span className="text-gray-900 font-mono">af7d3c</span>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Cost Warning - Step 2 */}
        {currentStep === 2 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Text generation will cost {estimatedCost} credits
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Regular Balance & Usage - Steps 1, 2, 3 */}
        {(currentStep === 1 || currentStep === 2 || currentStep === 3) && (
          <>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Current Balance</span>
                <span className="text-sm font-bold text-gray-900">{currentBalance}/{totalBalance}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${balancePercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Usage Meters</h3>
              <div className="space-y-4">
                {usageMeters.map((meter, index) => {
                  const percentage = (meter.current / meter.total) * 100;
                  const isDisabled = currentStep === 2 && !meter.highlighted;
                  
                  return (
                    <div key={index} className={isDisabled ? 'opacity-50' : ''}>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-xs ${meter.highlighted ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                          {meter.name}
                        </span>
                        <span className={`text-xs font-medium ${meter.highlighted ? 'text-gray-900' : 'text-gray-900'}`}>
                          {meter.current}/{meter.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`${meter.highlighted ? meter.color : 'bg-gray-300'} h-1.5 rounded-full transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs text-gray-600">Text Gen</span>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs text-gray-600">PDF Gen</span>
                  <span className="text-xs text-gray-500">1d ago</span>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="text-xs text-gray-500 mt-auto">
          Period: Dec 1-31, 2024
        </div>
      </div>
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

  const renderMainContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">
                Select Question Types and Quantities
              </h1>

              {/* Question Type Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {questionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div key={type.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <h3 className="text-sm font-medium text-gray-900">{type.title}</h3>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Quantity:
                        </label>
                        <select
                          value={type.quantity}
                          onChange={(e) => updateQuestionQuantity(type.id, Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value={0}>0</option>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
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
                  onClick={handleNextStep}
                  disabled={!canProceed()}
                  className={`font-medium py-2 px-6 rounded-lg transition-colors flex items-center space-x-2 ${
                    canProceed()
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        const sourceOptions: SourceOption[] = [
          {
            id: 'text-prompt',
            title: 'Text Prompt',
            description: 'Generate from custom text prompt',
            icon: Edit3,
            selected: selectedSource === 'text-prompt',
          },
          {
            id: 'image-upload',
            title: 'Image Upload',
            description: 'Generate from uploaded image',
            icon: Image,
            selected: selectedSource === 'image-upload',
          },
          {
            id: 'pdf-upload',
            title: 'PDF Upload',
            description: 'Generate from PDF content',
            icon: FileText,
            selected: selectedSource === 'pdf-upload',
          },
        ];

        const characterCount = promptText.length;
        const maxCharacters = 1000;

        return (
          <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">
                Choose Your Content Source
              </h1>

              {/* Source Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {sourceOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSourceSelect(option.id)}
                      className={`relative cursor-pointer rounded-lg p-6 text-center transition-all duration-200 ${
                        option.selected
                          ? 'bg-blue-50 border-2 border-blue-500 shadow-md'
                          : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-4">
                        <div
                          className={`p-4 rounded-lg ${
                            option.selected ? 'bg-blue-100' : 'bg-gray-100'
                          }`}
                        >
                          <Icon
                            className={`w-8 h-8 ${
                              option.selected ? 'text-blue-600' : 'text-gray-600'
                            }`}
                          />
                        </div>
                        
                        <div>
                          <h3
                            className={`text-lg font-semibold mb-2 ${
                              option.selected ? 'text-blue-900' : 'text-gray-900'
                            }`}
                          >
                            {option.title}
                          </h3>
                          <p
                            className={`text-sm ${
                              option.selected ? 'text-blue-700' : 'text-gray-600'
                            }`}
                          >
                            {option.description}
                          </p>
                        </div>
                      </div>

                      {option.selected && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Text Prompt Configuration */}
              {selectedSource === 'text-prompt' && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Text Prompt Configuration
                  </h2>
                  
                  <div className="mb-4">
                    <textarea
                      value={promptText}
                      onChange={handlePromptChange}
                      placeholder="Enter your prompt here. Describe the topic, difficulty level, and any specific requirements for your questions..."
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      maxLength={maxCharacters}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Template</option>
                        <option value="academic">Academic</option>
                        <option value="business">Business</option>
                        <option value="general">General Knowledge</option>
                        <option value="technical">Technical</option>
                      </select>
                      
                      <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                        <Info className="w-4 h-4" />
                        <span>Prompt Tips</span>
                      </button>
                    </div>

                    <div className="text-sm text-gray-500">
                      <span className={characterCount > maxCharacters * 0.9 ? 'text-red-500' : ''}>
                        {characterCount}
                      </span>
                      /{maxCharacters} characters
                    </div>
                  </div>
                </div>
              )}

              {/* Other Source Configurations */}
              {selectedSource === 'image-upload' && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Image Upload Configuration
                  </h2>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag and drop your image here, or click to browse</p>
                    <p className="text-sm text-gray-500">Supports JPG, PNG, GIF up to 10MB</p>
                    <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      Choose File
                    </button>
                  </div>
                </div>
              )}

              {selectedSource === 'pdf-upload' && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    PDF Upload Configuration
                  </h2>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag and drop your PDF here, or click to browse</p>
                    <p className="text-sm text-gray-500">Supports PDF up to 25MB</p>
                    <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      Choose File
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button 
                  onClick={handlePreviousStep}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button 
                  onClick={handleNextStep}
                  disabled={!canProceed()}
                  className={`font-medium py-2 px-6 rounded-lg transition-colors flex items-center space-x-2 ${
                    canProceed()
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Guidelines & Settings</h1>
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-6">Step 3 content will be implemented here.</p>
                <div className="flex justify-between">
                  <button 
                    onClick={handlePreviousStep}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button 
                    onClick={handleNextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
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
                    {generationStages.map((stage) => (
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
                  onClick={handlePreviousStep}
                  className="bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-6 rounded-lg border border-red-200 transition-colors"
                >
                  Cancel Generation
                </button>
              </div>
            </div>
          </div>
        );

      case 5:
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
                  onClick={handlePreviousStep}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Discard & Go Back</span>
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={handlePreviousStep}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Accept & Go Back</span>
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!canProceed()}
                    className={`font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2 ${
                      canProceed()
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Accept & Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Summary & Completion</h1>
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Questions Generated Successfully!
                </h2>
                <p className="text-gray-600 mb-8">
                  You have successfully generated {acceptedQuestions.length} questions with an average quality of {averageQuality}%.
                </p>
                <div className="flex justify-between">
                  <button 
                    onClick={handlePreviousStep}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button 
                    onClick={() => onComplete?.({
                      questionTypes,
                      selectedSource,
                      promptText,
                      questions: acceptedQuestions,
                      totalCost: estimatedCost
                    })}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Complete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 font-inter ${className}`}>
      <div className="grid grid-cols-12 min-h-screen">
        {/* Navigation Sidebar - 2 columns */}
        <div className="col-span-12 lg:col-span-2">
          {renderNavigationSidebar()}
        </div>

        {/* Main Content - 7 columns */}
        <div className="col-span-12 lg:col-span-7">
          {renderMainContent()}
        </div>

        {/* Balance Sidebar - 3 columns */}
        <div className="col-span-12 lg:col-span-3">
          {renderBalanceSidebar()}
        </div>
      </div>
    </div>
  );
};

export default AIQuestionWizard;
