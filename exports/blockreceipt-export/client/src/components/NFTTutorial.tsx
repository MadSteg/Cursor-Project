import React, { useState } from 'react';

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const NFTTutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  
  const steps: TutorialStep[] = [
    {
      title: 'Upload Your Receipt',
      description: 'Take a photo of your paper receipt or upload a digital receipt. Our OCR technology will extract the important details.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    {
      title: 'Mint NFT Receipt',
      description: 'Your receipt data is encrypted and stored on the blockchain as an NFT. This creates a permanent, verifiable record of your purchase.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 118 0v7m-9 5h9a2 2 0 002-2v-6a2 2 0 00-2-2h-9a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Earn Bulldog NFTs',
      description: 'Based on your receipt data, you will be rewarded with exclusive Bulldog Character NFTs matching your spending patterns and merchant categories.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Complete Collections',
      description: 'Collect different Bulldog NFTs by shopping at various merchants and categories. Complete collections to unlock special rewards and features!',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
    }
  };
  
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-30 bg-card shadow-lg rounded-full p-4 flex items-center justify-center hover:shadow-xl transition-shadow"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="ml-2 font-medium">How to Earn NFTs</span>
      </button>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-card rounded-lg shadow-xl max-w-lg w-full overflow-hidden animate-slide-up">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold brand-gradient-text">How to Earn Bulldog NFTs</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-muted rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="stepper-container mb-6">
            {steps.map((_, index) => (
              <React.Fragment key={index}>
                <div className="stepper-step">
                  <div 
                    className={`stepper-circle ${
                      index < currentStep ? 'completed' : index === currentStep ? 'active' : ''
                    }`}
                  >
                    {index < currentStep ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className={`stepper-label ${index === currentStep ? 'active' : ''}`}>
                    Step {index + 1}
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="stepper-line">
                    <div 
                      className="stepper-line-progress" 
                      style={{ width: index < currentStep ? '100%' : '0%' }}
                    ></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="text-center mb-8">
            {steps[currentStep].icon}
            <h3 className="text-lg font-semibold mt-4 mb-2">{steps[currentStep].title}</h3>
            <p className="text-muted-foreground">{steps[currentStep].description}</p>
          </div>
          
          {/* NFT Earning Rules */}
          {currentStep === 2 && (
            <div className="bg-muted p-4 rounded-lg mb-6">
              <h4 className="font-medium mb-2">How to Earn Specific Bulldogs:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span><strong>Cowboy Bulldog:</strong> Fashion purchases over $50</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span><strong>Angel Bulldog:</strong> Charitable donations over $100</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span><strong>Social Bulldog:</strong> Dining purchases over $30</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span><strong>Soccer Bulldog:</strong> Sports purchases over $40</span>
                </li>
              </ul>
            </div>
          )}
          
          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              className={`px-4 py-2 border border-border rounded-md text-sm font-medium ${
                currentStep > 0 ? 'hover:bg-muted' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 brand-gradient-bg text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Got it!'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTTutorial;