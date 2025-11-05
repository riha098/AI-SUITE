
export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export interface CampaignData {
  subjectLines: string[];
  body: string;
}
