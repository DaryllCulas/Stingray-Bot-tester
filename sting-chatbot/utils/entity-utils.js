/**
 * Check if a specific entity or trait exists in the Wit.ai response
 * Handles multiple entity formats used by Wit.ai
 */
export function checkEntityOrTrait(entities, traits, key) {
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
 * Debug utility to print all entities and traits
 */
export function debugEntities(entities, traits) {
  console.debug('=== ENTITIES ===');
  for (const key in entities) {
    console.debug(`${key}: ${JSON.stringify(entities[key])}`);
  }
  console.debug('=== TRAITS ===');
  for (const key in traits) {
    console.debug(`${key}: ${JSON.stringify(traits[key])}`);
  }
}