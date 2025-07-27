import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface UsageMeter {
  name: string;
  current: number;
  total: number;
  color: string;
  highlighted?: boolean;
}

interface RecentActivity {
  name: string;
  time: string;
}

interface QualityBreakdown {
  excellent: number;
  good: number;
  fair: number;
}

interface BalanceSidebarProps {
  highlightTextGeneration?: boolean;
  showCostWarning?: boolean;
  showProcessingStatus?: boolean;
  showGenerationSummary?: boolean;
}

const BalanceSidebar: React.FC<BalanceSidebarProps> = ({ 
  highlightTextGeneration = false, 
  showCostWarning = false,
  showProcessingStatus = false,
  showGenerationSummary = false
}) => {
  const currentBalance = 847;
  const totalBalance = 1000;
  const balancePercentage = (currentBalance / totalBalance) * 100;
  const balanceAfterGeneration = 838;

  const usageMeters: UsageMeter[] = [
    { 
      name: 'Text Generation', 
      current: 45, 
      total: 50, 
      color: 'bg-green-500',
      highlighted: highlightTextGeneration
    },
    { 
      name: 'Image Generation', 
      current: 12, 
      total: 20, 
      color: 'bg-yellow-500'
    },
    { 
      name: 'PDF Generation', 
      current: 3, 
      total: 10, 
      color: 'bg-blue-500'
    },
  ];

  const recentActivity: RecentActivity[] = [
    { name: 'Text Gen', time: '2h ago' },
    { name: 'PDF Gen', time: '1d ago' },
  ];

  // Generation Summary Data
  const generationData = {
    questionsGenerated: 3,
    questionsAccepted: 3,
    averageQuality: 86,
    creditsConsumed: 9,
    qualityBreakdown: {
      excellent: 1,
      good: 1,
      fair: 1
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 h-full p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        {showProcessingStatus ? 'Processing Status' : showGenerationSummary ? 'Generation Summary' : 'AI Balance & Usage'}
      </h2>
      
      {/* Generation Summary */}
      {showGenerationSummary && (
        <div className="space-y-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Questions Generated:</span>
              <span className="text-lg font-bold text-gray-900">{generationData.questionsGenerated}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Currently Accepted:</span>
              <span className="text-lg font-bold text-gray-900">{generationData.questionsAccepted}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Avg Quality Score:</span>
              <span className="text-lg font-bold text-gray-900">{generationData.averageQuality}%</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Credits Consumed:</span>
              <span className="text-lg font-bold text-gray-900">{generationData.creditsConsumed}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quality Breakdown */}
      {showGenerationSummary && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Quality Breakdown</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">Excellent (90%+)</span>
                <span className="text-xs font-medium text-gray-900">{generationData.qualityBreakdown.excellent}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(generationData.qualityBreakdown.excellent / generationData.questionsGenerated) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">Good (80-89%)</span>
                <span className="text-xs font-medium text-gray-900">{generationData.qualityBreakdown.good}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(generationData.qualityBreakdown.good / generationData.questionsGenerated) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">Fair (70-79%)</span>
                <span className="text-xs font-medium text-gray-900">{generationData.qualityBreakdown.fair}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(generationData.qualityBreakdown.fair / generationData.questionsGenerated) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Processing Status Box */}
      {showProcessingStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Info className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                Processing 3 questions
              </p>
              <p className="text-sm text-blue-700">
                Cost: 9 credits
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Cost Warning */}
      {showCostWarning && !showProcessingStatus && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Text generation will cost 9 credits
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Current Balance - only show if not showing generation summary */}
      {!showGenerationSummary && (
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
          
          {/* Balance After Generation Preview */}
          {showProcessingStatus && (
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
          )}
        </div>
      )}

      {/* Usage Meters - only show if not showing generation summary */}
      {!showGenerationSummary && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Usage Meters</h3>
          <div className="space-y-4">
            {usageMeters.map((meter, index) => {
              const percentage = (meter.current / meter.total) * 100;
              const isDisabled = highlightTextGeneration && !meter.highlighted;
              
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
      )}

      {/* Generation Details */}
      {showProcessingStatus && (
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
      )}

      {/* Recent Activity - only show if not showing generation summary or processing status */}
      {!showGenerationSummary && !showProcessingStatus && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex justify-between items-center py-1">
                <span className="text-xs text-gray-600">{activity.name}</span>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Period */}
      <div className="text-xs text-gray-500 mt-auto">
        Period: Dec 1-31, 2024
      </div>
    </div>
  );
};

export default BalanceSidebar;
