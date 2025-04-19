import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message, language } = await req.json();

    // TODO: Replace with your actual AI API endpoint
    // For now, we'll return a mock response
    const mockResponses = {
      en: [
        "I understand your question. Let me help you with that.",
        "That's an interesting topic. Here's what I know about it.",
        "I can guide you through this learning process.",
        "Let me explain this concept in detail.",
        "Here's a step-by-step approach to solve this.",
      ],
      es: [
        "Entiendo tu pregunta. Déjame ayudarte con eso.",
        "Es un tema interesante. Esto es lo que sé al respecto.",
        "Puedo guiarte a través de este proceso de aprendizaje.",
        "Permíteme explicarte este concepto en detalle.",
        "Aquí hay un enfoque paso a paso para resolver esto.",
      ],
    };

    const responses = mockResponses[language] || mockResponses.en;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      message: randomResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
} 