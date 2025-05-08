export const RESPONSES = {
    welcome: 'Welcome to the Sting Chatbot!',
    goodbye: 'Goodbye!',
    error: 'Bot: Something went wrong. Please try again.',
    apiError: 'Bot: Sorry, I\'m having trouble connecting to my brain right now. Please try again later.',
    
    // Mission responses
    mission: {
      first: 'Bot: Cavite State University shall provide excellent, equitable and relevant educational opportunities in the arts, sciences and technology through quality instruction and responsive research and development activities.',
      second: 'Bot: It shall produce professional, skilled and morally upright individuals for global competitiveness.',
      full: 'Bot: Cavite State University shall provide excellent, equitable and relevant educational opportunities in the arts, sciences and technology through quality instruction and responsive research and development activities.\nIt shall produce professional, skilled and morally upright individuals for global competitiveness.',
      clarification: 'Bot: Are you asking about CVSU\'s mission? I can tell you about the first part, second part, or the complete mission statement.'
    },
    
    // Goals responses
    goals: {
      full: 'Bot: The goals of Cavite State University are to:\n1. provide quality and affordable education which promotes intellectual growth, academic excellence and moral integrity;\n2. prepare students to meet the demands of the global market and respond to the society\'s needs;\n3. develop innovative and scholarly researchers who have the ability to create new understanding in quest for quality research through inquiry, analysis and problem solving; and\n4. produce globally competitive graduates with full competence in their fields of study.',
      clarification: 'Bot: Are you asking about CVSU\'s goals? I can tell you about the university\'s goals and objectives.'
    },
    
    // You can add more response categories here
    
    // Dynamic fallback response (gets populated with capabilities)
    getFallback(capabilities) {
      return `Bot: Sorry, I'm not sure how to respond to that. You can ask me about ${capabilities.join(', ')}.`;
    }
  };