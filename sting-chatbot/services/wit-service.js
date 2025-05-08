import fetch from 'node-fetch';
import { WIT_AI_TOKEN, WIT_API_VERSION, API_TIMEOUT } from '../src/bot-config.js';

/**
 * Send message to Wit.ai API and get the response
 * @param {string} message - User input to analyze
 * @returns {Object} Response object with success status and data or error
 */
export async function getWitResponse(message) {
  try {
    const response = await fetch(
      `https://api.wit.ai/message?v=${WIT_API_VERSION}&q=${encodeURIComponent(message)}`,
      {
        headers: {
          Authorization: `Bearer ${WIT_AI_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: API_TIMEOUT
      }
    );

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