import React from 'react';
import AIQuestionWizard from './components/AIQuestionWizard';

function App() {
  const handleWizardComplete = (data: any) => {
    console.log('Wizard completed with data:', data);
    // Handle the completion data here
    // You could send it to an API, store it in state, etc.
  };

  const handleWizardCancel = () => {
    console.log('Wizard cancelled');
    // Handle cancellation
  };

  return (
    <div className="min-h-screen">
      <AIQuestionWizard 
        onComplete={handleWizardComplete}
        onCancel={handleWizardCancel}
      />
    </div>
  );
}

export default App;
