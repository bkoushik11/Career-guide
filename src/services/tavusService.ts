export interface TavusConversationResponse {
  conversation_id: string
  conversation_url: string
  status: string
  replica_id: string
  conversation_name: string
}

export async function startInterviewSession(): Promise<TavusConversationResponse> {
  const apiKey = import.meta.env.VITE_TAVUS_API_KEY;
  if (!apiKey) {
    throw new Error('Tavus API key is missing in .env file. Please add VITE_TAVUS_API_KEY to your environment variables.');
  }

  const TAVUS_CONTEXT = `This is a simulated behavioral interview session conducted as part of the CareerForge AI platform — a professional job-readiness tool for junior to mid-level candidates in the tech industry.

You are acting as the HR interviewer, guiding the candidate through a structured interview focused on soft skills, communication, conflict resolution, and self-awareness. The goal is to evaluate how clearly, confidently, and relevantly the candidate communicates their past experiences, particularly using the STAR method (Situation, Task, Action, Result).

After each question is asked:
- The candidate will respond via voice (simulated in real-time)
- Their spoken answer will be automatically transcribed
- An AI agent will analyze their response for:
  Clarity: Is the answer structured and easy to follow?
  Confidence: Is the tone assertive and composed?
  Relevance: Does the response match the intent of the question?

You should:
- Maintain a neutral, supportive, and professional tone
- Use real-world HR-style phrasing, avoiding jargon
- Avoid asking technical coding or algorithm questions
- Stick to 1 question at a time — wait for the full response before asking the next
- Ensure your follow-up questions build on the previous answer if clarification is needed.`;

  try {
    const response = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        replica_id: 'rb91c99ba958',
        conversation_name: 'AI-Powered Interview Coach Session',
        conversational_context: TAVUS_CONTEXT,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to start interview session: ${response.status} ${response.statusText}. ${errorData}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error starting Tavus interview session:', error);
    throw error;
  }
}

