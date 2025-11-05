
import React, { useState, useCallback } from 'react';
import { generateCampaignContent, generateCampaignImage } from '../services/geminiService';
import type { CampaignData } from '../types';
import LoadingSpinner from './LoadingSpinner';

const CampaignGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateCampaign = useCallback(async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt for your campaign.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setCampaignData(null);
        setImageUrl(null);

        try {
            const [content, image] = await Promise.all([
                generateCampaignContent(prompt),
                generateCampaignImage(prompt),
            ]);

            setCampaignData(content);
            setImageUrl(image);
        } catch (err) {
            console.error(err);
            setError('Failed to generate campaign. Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    }, [prompt]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-200">1. Describe Your Campaign</h2>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A 25% off flash sale on all summer clothing for our fashion brand."
                    className="w-full h-28 p-4 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 resize-none"
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerateCampaign}
                    disabled={isLoading}
                    className="mt-4 w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner size="5" className="mr-2" />
                            Generating...
                        </>
                    ) : (
                        'Generate Campaign'
                    )}
                </button>
                {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>

            {isLoading && (
                 <div className="flex flex-col items-center justify-center bg-gray-800 p-8 rounded-xl shadow-lg">
                     <LoadingSpinner size="12" />
                     <p className="mt-4 text-lg text-gray-300">Generating your campaign, please wait...</p>
                 </div>
            )}
            
            {campaignData && imageUrl && !isLoading && (
                <div className="space-y-8 animate-fade-in">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-200">2. Generated Visual</h2>
                        <div className="overflow-hidden rounded-lg">
                            <img src={imageUrl} alt="Generated Campaign Visual" className="w-full h-auto object-cover" />
                        </div>
                    </div>
                    
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-200">3. Subject Lines</h2>
                        <ul className="space-y-2">
                            {campaignData.subjectLines.map((line, index) => (
                                <li key={index} className="bg-gray-900 p-3 rounded-md text-gray-300 flex items-center">
                                    <span className="text-blue-400 mr-2">◆</span>
                                    {line}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-200">4. Email Body</h2>
                        <div className="bg-gray-900 p-4 rounded-md w-full max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-gray-300 text-sm sm:text-base leading-relaxed">{campaignData.body}</pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampaignGenerator;
