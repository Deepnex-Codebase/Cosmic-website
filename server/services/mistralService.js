const axios = require('axios');

class MistralService {
  constructor() {
    this.apiKey = process.env.MISTRAL_API_KEY;
    this.model = process.env.MISTRAL_MODEL || 'mistral-medium';
    this.baseURL = 'https://api.mistral.ai/v1';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Generate a chat completion using Mistral AI
   * @param {Array} messages - Array of message objects with role and content
   * @param {Object} options - Additional options for the API call
   * @returns {Promise} - The API response
   */
  async generateChatCompletion(messages, options = {}) {
    try {
      const defaultOptions = {
        model: this.model,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        stream: false
      };

      const requestOptions = { ...defaultOptions, ...options, messages };
      
      const response = await this.client.post('/chat/completions', requestOptions);
      return response.data;
    } catch (error) {
      console.error('Error generating chat completion:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Create a system prompt for the Solar Mitr chatbot
   * @param {Object} companyData - The company profile data
   * @returns {String} - The formatted system prompt
   */
  createSystemPrompt(companyData) {
    return `You are Solar Mitr, an AI assistant for ${companyData.company.name}. 

Your role is to act as a friendly, knowledgeable, and persuasive solar sales agent. Your goal is to educate potential customers about solar energy solutions, answer their questions, and guide them towards making a decision to switch to solar.

Company Information:
- Name: ${companyData.company.name}
- Tagline: ${companyData.company.tagline}
- Description: ${companyData.company.description}
- Founded: ${companyData.company.founded}
- Service Areas: ${companyData.company.serviceAreas.join(', ')}
- Certifications: ${companyData.company.certifications.join(', ')}

CRITICAL INSTRUCTION #1: Keep your responses EXTREMELY SHORT and HUMAN-LIKE. Use ONLY 1-2 short sentences. Talk like a friend would in a casual conversation. Be brief and to the point.

CRITICAL INSTRUCTION #2: You MUST ask ONLY ONE QUESTION at a time. NEVER ask multiple questions in a single response. This is the MOST IMPORTANT rule. After asking one question, you MUST wait for the user to respond before asking another question.

Examples of INCORRECT responses (STRICTLY AVOID THESE):
- "Are you a homeowner? What is your electricity bill? Where are you located?"
- "What is your name? Can I have your phone number?"
- "Aapki monthly bill kitni hai? Aapke paas kitni jagah hai?"
- Long paragraphs with excessive information

Examples of CORRECT responses (EXACTLY FOLLOW THESE):
- "Aap ghar ke liye solar chahte hain ya business ke liye?" (Just one question)
- "Aapki monthly electricity bill kitni aati hai?" (Just one question)
- "Namaste! Main Solar Mitr se baat kar raha hoon." (Short greeting)

Follow these conversation steps, asking ONLY ONE QUESTION at a time and WAITING for user's response before moving to next step:

1. Introduction: Just say "Namaste" or "Hello" with your name. ONE sentence only.
2. Qualification: 
   - First message: ONLY ask if they want solar for home or business
   - Wait for response
   - Next message: ONLY ask about electricity bill
   - Wait for response
   - Next message: ONLY ask about location
   - Wait for response
   - Next message: ONLY ask about rooftop space
3. Benefits: Give ONE benefit of solar based on their answers. ONE sentence only.
4. Objections: Address ONE concern at a time. ONE sentence only.
5. ROI: Give ONE simple savings estimate. ONE sentence only.
6. Call to Action: Ask if they want a site visit. ONE sentence only.
7. Lead Capture: Ask for ONE piece of information at a time (name, then phone, then city).

Talk like a friend chatting on WhatsApp. Be casual, brief and use simple language.

ABSOLUTELY CRITICAL RULES:
1. Keep ALL responses to 1-2 sentences MAXIMUM
2. Ask ONLY ONE QUESTION in each message
3. WAIT for user's response before asking next question
4. Use casual, friendly Hindi/English mixed language`;
  }

  /**
   * Process user message and generate a chatbot response
   * @param {String} userMessage - The user's message
   * @param {Array} conversationHistory - Previous messages in the conversation
   * @param {Object} companyData - The company profile data
   * @returns {Promise} - The chatbot response
   */
  async processChatMessage(userMessage, conversationHistory = [], companyData) {
    try {
      // If this is a new conversation, add the system prompt
      if (conversationHistory.length === 0) {
        const systemPrompt = this.createSystemPrompt(companyData);
        conversationHistory.push({ role: 'system', content: systemPrompt });
      }
      
      // Add the user message to the conversation history
      conversationHistory.push({ role: 'user', content: userMessage });
      
      // Generate a response
      const response = await this.generateChatCompletion(conversationHistory);
      
      // Add the assistant's response to the conversation history
      if (response.choices && response.choices.length > 0) {
        const assistantMessage = response.choices[0].message;
        conversationHistory.push(assistantMessage);
        
        return {
          message: assistantMessage.content,
          conversationHistory
        };
      }
      
      throw new Error('No response generated');
    } catch (error) {
      console.error('Error processing chat message:', error);
      throw error;
    }
  }

  /**
   * Estimate solar system size and savings based on user inputs
   * @param {Number} monthlyBill - User's monthly electricity bill
   * @param {String} state - User's state for subsidy calculation
   * @param {Object} companyData - The company profile data
   * @returns {Object} - Estimated system size, savings, and subsidy
   */
  calculateROI(monthlyBill, state, companyData) {
    try {
      // Find the appropriate system size based on monthly bill
      let recommendedSize = 2; // Default size
      let estimatedGeneration = 8; // Default generation in units per day
      
      const roiData = companyData.roiCalculator;
      const sizingData = roiData.systemSizing.averageMonthlyBill;
      
      // Find the appropriate bill range
      if (monthlyBill <= 5000) {
        recommendedSize = sizingData['2000-5000'].recommendedSize;
        estimatedGeneration = sizingData['2000-5000'].estimatedGeneration;
      } else if (monthlyBill <= 10000) {
        recommendedSize = sizingData['5001-10000'].recommendedSize;
        estimatedGeneration = sizingData['5001-10000'].estimatedGeneration;
      } else if (monthlyBill <= 15000) {
        recommendedSize = sizingData['10001-15000'].recommendedSize;
        estimatedGeneration = sizingData['10001-15000'].estimatedGeneration;
      } else if (monthlyBill <= 20000) {
        recommendedSize = sizingData['15001-20000'].recommendedSize;
        estimatedGeneration = sizingData['15001-20000'].estimatedGeneration;
      } else {
        recommendedSize = sizingData['20001+'].recommendedSize;
        estimatedGeneration = sizingData['20001+'].estimatedGeneration;
      }
      
      // Calculate monthly savings (assuming average electricity rate of Rs. 8 per unit)
      const electricityRate = 8;
      const monthlyGeneration = estimatedGeneration * 30; // monthly generation in units
      const monthlySavings = monthlyGeneration * electricityRate;
      const annualSavings = monthlySavings * 12;
      
      // Calculate system cost
      const perKwCost = companyData.offerings.residential.pricing.perKw;
      const systemCost = recommendedSize * perKwCost;
      
      // Calculate subsidy (if applicable)
      let subsidyAmount = 0;
      if (recommendedSize <= 3) {
        // 40% subsidy for 1-3 kW systems
        subsidyAmount = Math.min(systemCost * 0.4, 18000);
      } else if (recommendedSize <= 10) {
        // 20% subsidy for 3-10 kW systems
        subsidyAmount = Math.min(systemCost * 0.2, 18000);
      }
      
      // Calculate net cost after subsidy
      const netCost = systemCost - subsidyAmount;
      
      // Calculate payback period (in years)
      const paybackPeriod = netCost / annualSavings;
      
      return {
        systemSize: recommendedSize,
        estimatedGeneration: estimatedGeneration,
        monthlySavings: monthlySavings,
        annualSavings: annualSavings,
        systemCost: systemCost,
        subsidyAmount: subsidyAmount,
        netCost: netCost,
        paybackPeriod: paybackPeriod.toFixed(1),
        roi: ((annualSavings / netCost) * 100).toFixed(1)
      };
    } catch (error) {
      console.error('Error calculating ROI:', error);
      return {
        systemSize: 3,
        estimatedGeneration: 12,
        monthlySavings: 2880,
        annualSavings: 34560,
        systemCost: 135000,
        subsidyAmount: 18000,
        netCost: 117000,
        paybackPeriod: '3.4',
        roi: '29.5'
      };
    }
  }
}

module.exports = new MistralService();