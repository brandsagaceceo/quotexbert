import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // For now, provide rule-based enhancement
    // TODO: Integrate with OpenAI API when OPENAI_API_KEY is available
    const enhanced = enhanceMessage(message, context);

    return NextResponse.json({ 
      original: message,
      enhanced: enhanced,
      suggestions: generateSuggestions(message)
    });

  } catch (error) {
    console.error("Error enhancing message:", error);
    return NextResponse.json(
      { error: "Failed to enhance message" },
      { status: 500 }
    );
  }
}

function enhanceMessage(message: string, context?: string): string {
  let enhanced = message.trim();
  
  // Capitalize first letter
  enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
  
  // Add proper punctuation
  if (!/[.!?]$/.test(enhanced)) {
    enhanced += '.';
  }
  
  // Replace informal words with professional alternatives
  const replacements: Record<string, string> = {
    'yeah': 'Yes',
    'yep': 'Yes',
    'nope': 'No',
    'gonna': 'going to',
    'wanna': 'want to',
    'gotta': 'have to',
    'kinda': 'kind of',
    'sorta': 'sort of',
    'dunno': "don't know",
    'lemme': 'let me',
    'gimme': 'give me',
    'u': 'you',
    'ur': 'your',
    'r': 'are',
    'thx': 'thank you',
    'thanks': 'Thank you',
    'hey': 'Hello',
    'hi': 'Hello',
    'ok': 'Okay',
    'asap': 'as soon as possible',
  };
  
  // Apply replacements (case-insensitive)
  Object.keys(replacements).forEach(informal => {
    const regex = new RegExp(`\\b${informal}\\b`, 'gi');
    enhanced = enhanced.replace(regex, (match: string): string => {
      // Preserve original casing for the replacement
      const replacement = replacements[informal.toLowerCase()];
      if (!replacement) return match;
      
      if (match === match.toUpperCase() && match.length > 0) {
        return replacement.toUpperCase();
      } else if (match.length > 0 && match[0] === match[0].toUpperCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  });
  
  // Add professional courtesy phrases if message is short
  if (enhanced.split(' ').length < 5) {
    if (enhanced.toLowerCase().includes('yes') || enhanced.toLowerCase().includes('okay')) {
      enhanced = `${enhanced} I'll take care of that right away.`;
    }
  }
  
  // Add greeting if appropriate
  if (!enhanced.toLowerCase().includes('hello') && !enhanced.toLowerCase().includes('hi') && enhanced.split(' ').length < 10) {
    const greetings = ['Good day.', 'Hope you\'re doing well.', 'Thank you for reaching out.'];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    enhanced = `${randomGreeting} ${enhanced}`;
  }
  
  return enhanced;
}

function generateSuggestions(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  
  // Context-aware suggestions
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('quote')) {
    return [
      "I'd be happy to provide a detailed quote. Could you share more details about your project requirements?",
      "Thank you for your interest. I can offer competitive pricing. When would be a good time to discuss the specifics?",
      "I appreciate you reaching out. Based on your project description, I can work within your budget. Let's schedule a call to finalize the details."
    ];
  }
  
  if (lowerMessage.includes('when') || lowerMessage.includes('schedule') || lowerMessage.includes('time')) {
    return [
      "I'm flexible with scheduling. Would you prefer to meet this week or next?",
      "I can start as early as next Monday. Does that timeline work for you?",
      "My schedule is open. What dates work best for your project timeline?"
    ];
  }
  
  if (lowerMessage.includes('experience') || lowerMessage.includes('portfolio') || lowerMessage.includes('work')) {
    return [
      "I have over [X] years of experience in this field. I'd be happy to share my portfolio and references with you.",
      "Absolutely! I've completed many similar projects. Please check my profile for examples of my work.",
      "Great question! I specialize in this type of work and have numerous satisfied clients. Would you like to see some examples?"
    ];
  }
  
  if (lowerMessage.includes('thank') || lowerMessage.includes('great') || lowerMessage.includes('perfect')) {
    return [
      "Thank you! I'm excited to work with you on this project. What are the next steps?",
      "I appreciate your confidence in my services. I'm committed to delivering excellent results.",
      "Wonderful! I look forward to bringing your vision to life. When can we get started?"
    ];
  }
  
  // Default professional suggestions
  return [
    "Thank you for considering me for this project. I'm confident I can deliver excellent results that meet your expectations.",
    "I appreciate the opportunity to work with you. Could we schedule a brief call to discuss the project details?",
    "I'm very interested in this project. My experience and expertise make me a great fit. When would be a good time to connect?"
  ];
}
