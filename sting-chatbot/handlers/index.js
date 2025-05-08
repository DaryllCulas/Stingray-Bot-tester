import { handleMissionIntent } from './mission-handler.js';
import { handleGoalsIntent } from './goals-handler.js';

// Intent handler registry - map intent names to handler functions
export const intentHandlers = {
  'get_cvsu_mission': handleMissionIntent,
  'get_cvsu_goals': handleGoalsIntent,
  // Add more handlers here as you develop them
};

/**
 * Routes the intent to the appropriate handler
 */
export function handleIntent(intent, confidence, entities, traits) {
  const handler = intentHandlers[intent];
  if (handler) {
    return handler(intent, confidence, entities, traits);
  }
  return null;
}