
import { GoogleGenAI, Type, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const textModel = 'gemini-2.5-flash';
const imageModel = 'imagen-4.0-generate-001';

let chat: Chat | null = null;

const getChat = () => {
    if (!chat) {
        chat = ai.chats.create({
            model: textModel,
            history: [],
        });
    }
    return chat;
};

export const generateCampaignContent = async (prompt: string): Promise<any> => {
    const fullPrompt = `Generate a marketing email campaign based on the following topic: "${prompt}". Provide 5 compelling subject lines and a detailed email body. The body should be formatted in markdown.`;
    
    const response = await ai.models.generateContent({
        model: textModel,
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    subjectLines: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: 'A list of 5 compelling subject line options.'
                    },
                    body: {
                        type: Type.STRING,
                        description: 'The full email body copy, formatted in markdown.'
                    }
                },
                required: ['subjectLines', 'body']
            }
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};

export const generateCampaignImage = async (prompt: string): Promise<string> => {
    const imagePrompt = `A visually stunning, high-resolution marketing image for: ${prompt}. The image should be clean, professional, and eye-catching.`;
    
    const response = await ai.models.generateImages({
        model: imageModel,
        prompt: imagePrompt,
        config: {
            numberOfImages: 1,
            aspectRatio: '16:9',
        }
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    }
    throw new Error('Image generation failed.');
};

export const sendMessageToChat = async (message: string): Promise<string> => {
    const chatInstance = getChat();
    const response = await chatInstance.sendMessage({ message });
    return response.text;
};
