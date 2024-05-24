# Llama Dungeon

Llama Dungeon is an AI based text adventure. Currently it expects an ollama server to be running at http://localhost:11434, but this can be configured in [explore.ts](src/api/explore.ts).

## Getting Started
1. [Install ollama](https://ollama.com/download)
2. Start the ollama server if it's not already running
3. [Install node.js](https://nodejs.org/en)
4. Run `npm install` in this directory
5. Run `npm run dev` in this directory
6. Open the website (http://localhost:5173) in a browser of your choice.
7. Press the 'Start Dungeon' button
8. Enjoy!

## Customization
- You can customize the prompt in [prompts.ts](src/utils/prompts.ts)
  - Be careful with changing anything at or below the game state. Changing the initial state or the schema will probably break the rest of the application.