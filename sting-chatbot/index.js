import readLineSync from 'readline-sync';
import { getWitResponse } from './services/wit-service.js';
import { handleIntent } from './handlers/index.js';
import { RESPONSES } from './data/responses.js';
import { CAPABILITIES } from './src/bot-config.js';

/**
 * Main function to handle the chat loop
 */
async function main() {
  console.log(RESPONSES.welcome);
  
  // Track conversation context (can be expanded for more advanced features)
  const conversationContext = {
    lastIntent: null,
    turnCount: 0
  };

  while (true) {
    try {
      const userInput = readLineSync.question('You: ');
      if (userInput.toLowerCase() === 'exit') {
        console.log(RESPONSES.goodbye);
        break;
      }

      const result = await getWitResponse(userInput);
      
      if (!result.success) {
        console.log(RESPONSES.apiError);
        continue;
      }

      const withResponse = result.data;
      let intent = withResponse.intents?.[0]?.name;
      let confidence = withResponse.intents?.[0]?.confidence || 0;
      
      // Get the role/entity information
      const entities = withResponse.entities || {};
      const traits = withResponse.traits || {};
      
      // Intent correction logic based on keywords
      const userInputLower = userInput.toLowerCase();
      
      // Override mission/goals classification based on keywords
      if (userInputLower.includes('mission') && !userInputLower.includes('goal')) {
        console.debug(`Intent override: ${intent} → get_cvsu_mission`);
        intent = 'get_cvsu_mission';
        confidence = Math.max(confidence, 0.75); // Set confidence high enough
        
        // Add appropriate entity based on keywords
        if (userInputLower.includes('first')) {
          entities['first_cvsu_mission'] = [{ value: 'first_cvsu_mission', confidence: 0.95 }];
        } else if (userInputLower.includes('second')) {
          entities['second_cvsu_mission'] = [{ value: 'second_cvsu_mission', confidence: 0.95 }];
        } else if (userInputLower.includes('complete') || userInputLower.includes('full')) {
          entities['full_cvsu_mission'] = [{ value: 'full_cvsu_mission', confidence: 0.95 }];
        }
      } else if (userInputLower.includes('goal') && !userInputLower.includes('mission')) {
        console.debug(`Intent override: ${intent} → get_cvsu_goals`);
        intent = 'get_cvsu_goals';
        confidence = Math.max(confidence, 0.75);
        entities['full_cvsu_goals'] = [{ value: 'full_cvsu_goals', confidence: 0.95 }];
      }
      
      // Update conversation context
      conversationContext.turnCount++;
      conversationContext.lastIntent = intent;
      
      // Log for debugging (optional)
      console.debug(`Intent: ${intent}, Confidence: ${confidence}`);
      
      // Handle the intent
      const response = intent ? handleIntent(intent, confidence, entities, traits) : null;
      
      if (response) {
        console.log(response);
      } else {
        // Dynamic fallback message
        console.log(RESPONSES.getFallback(CAPABILITIES));
      }
    } catch (error) {
      console.error(error);
      console.log(RESPONSES.error);
    }
  }
}

// Start the application
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});