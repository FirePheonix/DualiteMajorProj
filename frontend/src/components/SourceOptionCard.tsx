import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SourceOptionCardProps {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  selected: boolean;
  onSelect: (id: string) => void;
}

const SourceOptionCard: React.FC<SourceOptionCardProps> = ({
  id,
  icon: Icon,
  title,
  description,
  selected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`relative cursor-pointer rounded-lg p-6 text-center transition-all duration-200 ${
        selected
          ? 'bg-blue-50 border-2 border-blue-500 shadow-md'
          : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="flex flex-col items-center space-y-4">
        <div
          className={`p-4 rounded-lg ${
            selected ? 'bg-blue-100' : 'bg-gray-100'
          }`}
        >
          <Icon
            className={`w-8 h-8 ${
              selected ? 'text-blue-600' : 'text-gray-600'
            }`}
          />
        </div>
        
        <div>
          <h3
            className={`text-lg font-semibold mb-2 ${
              selected ? 'text-blue-900' : 'text-gray-900'
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-sm ${
              selected ? 'text-blue-700' : 'text-gray-600'
            }`}
          >
            {description}
          </p>
        </div>
      </div>

      {selected && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourceOptionCard;
