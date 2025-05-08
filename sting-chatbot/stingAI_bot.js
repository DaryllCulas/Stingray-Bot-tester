import fetch from 'node-fetch';
import readLineSync from 'readline-sync';

const WIT_AI_TOKEN = '7EJHHH4T5OIUH27GMOQP3XSXKTH6R44F';

/**
 * Send message to Wit.ai API and get the response
 * @param {string} message - User input to analyze
 * @returns {Object} Response object with success status and data or error
 */
async function getWithResponse(message) {
    try {
        const response = await fetch(`https://api.wit.ai/message?v=20250507&q=${encodeURIComponent(message)}`, {
            headers: {
                Authorization: `Bearer ${WIT_AI_TOKEN}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 second timeout
        });

        if (!response.ok) {
            throw new Error(`API response error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('API connection error:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Check if a specific entity or trait exists in the Wit.ai response
 * Handles multiple entity formats used by Wit.ai
 */
function checkEntityOrTrait(entities, traits, key) {
    // Check direct match in entities
    if (entities[key] && entities[key].length > 0) {
        return true;
    }
    
    // Check in traits
    if (traits[key] && traits[key].length > 0) {
        return true;
    }
    
    // Check for entity in format "key:key" which is how Wit.ai often returns entities
    const compoundKey = `${key}:${key}`;
    if (entities[compoundKey] && entities[compoundKey].length > 0) {
        return true;
    }
    
    // Check all entity keys for partial matches 
    // This handles cases where entity formatting may vary
    for (const entityKey in entities) {
        if (entityKey.includes(key)) {
            return true;
        }
    }
    
    return false;
}

/**
 * Main function to handle the chat loop
 */
async function main() {
    console.log('Welcome to the Sting Chatbot!');

    while(true) {
        try {
            const userInput = readLineSync.question('You: ');
            if(userInput.toLowerCase() === 'exit') {
                console.log('Goodbye!');
                break;
            }

            const result = await getWithResponse(userInput);
            
            if (!result.success) {
                console.log('Bot: Sorry, I\'m having trouble connecting to my brain right now. Please try again later.');
                continue;
            }

            const withResponse = result.data;
            const intent = withResponse.intents?.[0]?.name;
            const confidence = withResponse.intents?.[0]?.confidence || 0;
            
            // Get the role/entity information
            const entities = withResponse.entities || {};
            const traits = withResponse.traits || {};
            
            // Check for mission-related queries with sufficient confidence
            if (intent === 'get_cvsu_mission' && confidence > 0.7) {
                // Check for specific mission type entities/roles
                if (checkEntityOrTrait(entities, traits, 'first_cvsu_mission') && 
                    !checkEntityOrTrait(entities, traits, 'full_cvsu_mission') && 
                    !checkEntityOrTrait(entities, traits, 'second_cvsu_mission')) {
                    console.log('Bot: Cavite State University shall provide excellent, equitable and relevant educational opportunities in the arts, sciences and technology through quality instruction and responsive research and development activities.');
                } 
                else if (checkEntityOrTrait(entities, traits, 'second_cvsu_mission') && 
                         !checkEntityOrTrait(entities, traits, 'full_cvsu_mission')) {
                    console.log('Bot: It shall produce professional, skilled and morally upright individuals for global competitiveness.');
                }
                else if (checkEntityOrTrait(entities, traits, 'full_cvsu_mission') ||
                         (checkEntityOrTrait(entities, traits, 'first_cvsu_mission') && 
                          checkEntityOrTrait(entities, traits, 'second_cvsu_mission'))) {
                    console.log('Bot: Cavite State University shall provide excellent, equitable and relevant educational opportunities in the arts, sciences and technology through quality instruction and responsive research and development activities.\nIt shall produce professional, skilled and morally upright individuals for global competitiveness.');
                }
                else {
                    // Default full mission when just the intent is recognized without specific entity
                    console.log('Bot: Cavite State University shall provide excellent, equitable and relevant educational opportunities in the arts, sciences and technology through quality instruction and responsive research and development activities.\nIt shall produce professional, skilled and morally upright individuals for global competitiveness.');
                }
            } else if (intent === 'get_cvsu_mission' && confidence > 0.4) {
                // Medium confidence response
                console.log('Bot: Are you asking about CVSU\'s mission? I can tell you about the first part, second part, or the complete mission statement.');
            } else {
                // Fallback response
                console.log('Bot: Sorry, I\'m not sure how to respond to that. You can ask me about CVSU\'s mission.');
            }
        } catch (error) {
            console.log('Bot: Something went wrong. Please try again.');
        }
    }
}

// Start the chat application
main().catch(error => {
    process.exit(1);
});