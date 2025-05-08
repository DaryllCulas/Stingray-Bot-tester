import { RESPONSES } from '../data/responses.js';
import { CONFIDENCE } from '../src/bot-config.js';

export function handleGoalsIntent(intent, confidence, entities, traits) {
  if (confidence > CONFIDENCE.HIGH) {
    return RESPONSES.goals.full;
  } 
  else if (confidence > CONFIDENCE.MEDIUM) {
    return RESPONSES.goals.clarification;
  }
  
  return null;
}