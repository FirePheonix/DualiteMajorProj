import React from 'react';
import { LucideIcon } from 'lucide-react';

interface QuestionTypeCardProps {
  icon: LucideIcon;
  title: string;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const QuestionTypeCard: React.FC<QuestionTypeCardProps> = ({
  icon: Icon,
  title,
  quantity,
  onQuantityChange,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        </div>
      </div>
      
      <div className="mt-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Quantity:
        </label>
        <select
          value={quantity}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
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
};

export default QuestionTypeCard;
