import fetch from 'node-fetch';
import readLineSync from 'readline-sync';

// const fetch = require('node-fetch');
// const readLineSync = require('readline-sync');

const WIT_AI_TOKEN = 'QHQILCCIV6JUA4E7RNAEW3LBHAFMAHU6';


async function getWithResponse(message) {
    const response = await fetch(`https://api.wit.ai//message?v=20241104&q=${encodeURIComponent(message)}`, {
        headers: {
            Authorization: `Bearer ${WIT_AI_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    return data;
}

async function main() {
    console.log('Welcome to the Sting Chatbot!');

    while(true) {
        const userInput = readLineSync.question('You: ');
        if(userInput.toLowerCase() === 'exit') {
            console.log('Goodbye!');
            break;
        }
        const withResponse = await getWithResponse(userInput);
        console.log('Bot: ', JSON.stringify(withResponse, null, 2));
    }
}

main().catch(console.error);