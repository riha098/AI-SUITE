
import React, { useState } from 'react';
import CampaignGenerator from './components/CampaignGenerator';
import ChatBot from './components/ChatBot';
import Header from './components/Header';
import Footer from './components/Footer';

type View = 'campaign' | 'chat';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('campaign');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveView('campaign')}
            className={`px-4 sm:px-6 py-3 text-base sm:text-lg font-medium transition-colors duration-300 focus:outline-none ${activeView === 'campaign' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-blue-300'}`}
          >
            Campaign Generator
          </button>
          <button
            onClick={() => setActiveView('chat')}
            className={`px-4 sm:px-6 py-3 text-base sm:text-lg font-medium transition-colors duration-300 focus:outline-none ${activeView === 'chat' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-blue-300'}`}
          >
            Chat Bot
          </button>
        </div>
        
        <div className="max-w-5xl mx-auto">
          {activeView === 'campaign' ? <CampaignGenerator /> : <ChatBot />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
