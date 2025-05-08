import { checkEntityOrTrait } from "../utils/entity-utils.js";
import { RESPONSES } from "../data/responses.js";
import { CONFIDENCE } from "../src/bot-config.js";

export function handleMissionIntent(intent, confidence, entities, traits) {
  // High confidence handling
  if (confidence > CONFIDENCE.HIGH) {
    // Check for specific mission parts
    if (checkEntityOrTrait(entities, traits, 'first_cvsu_mission') && 
        !checkEntityOrTrait(entities, traits, 'full_cvsu_mission') && 
        !checkEntityOrTrait(entities, traits, 'second_cvsu_mission')) {
      return RESPONSES.mission.first;
    } 
    else if (checkEntityOrTrait(entities, traits, 'second_cvsu_mission') && 
             !checkEntityOrTrait(entities, traits, 'full_cvsu_mission')) {
      return RESPONSES.mission.second;
    }
    else if (checkEntityOrTrait(entities, traits, 'full_cvsu_mission') ||
             (checkEntityOrTrait(entities, traits, 'first_cvsu_mission') && 
              checkEntityOrTrait(entities, traits, 'second_cvsu_mission'))) {
      return RESPONSES.mission.full;
    }
    else {
      // Default full mission when just the intent is recognized
      return RESPONSES.mission.full;
    }
  } 
  // Medium confidence handling
  else if (confidence > CONFIDENCE.MEDIUM) {
    return RESPONSES.mission.clarification;
  }
  
  return null;
}