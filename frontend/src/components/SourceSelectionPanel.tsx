import React, { useState } from 'react';
import { Edit3, Image, FileText, Info } from 'lucide-react';
import SourceOptionCard from './SourceOptionCard';

interface SourceOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  selected: boolean;
}

interface SourceSelectionPanelProps {
  onNext: () => void;
  onBack: () => void;
}

const SourceSelectionPanel: React.FC<SourceSelectionPanelProps> = ({ onNext, onBack }) => {
  const [selectedSource, setSelectedSource] = useState<string>('text-prompt');
  const [promptText, setPromptText] = useState<string>('Create engaging questions about machine learning fundamentals, covering topics like supervised learning, neural networks, and data preprocessing. Target intermediate level understanding.');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('technical');

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

  const handleSourceSelect = (sourceId: string) => {
    setSelectedSource(sourceId);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptText(e.target.value);
  };

  const characterCount = promptText.length;
  const maxCharacters = 1000;

  const canProceed = selectedSource === 'text-prompt' ? promptText.trim().length > 0 : true;

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Choose Your Content Source
        </h1>

        {/* Source Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {sourceOptions.map((option) => (
            <SourceOptionCard
              key={option.id}
              id={option.id}
              icon={option.icon}
              title={option.title}
              description={option.description}
              selected={option.selected}
              onSelect={handleSourceSelect}
            />
          ))}
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
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Back
          </button>
          <button 
            onClick={onNext}
            disabled={!canProceed}
            className={`font-medium py-2 px-6 rounded-lg transition-colors ${
              canProceed
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

export default SourceSelectionPanel;
