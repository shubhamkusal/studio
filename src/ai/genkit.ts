
import {genkit, type GenkitPlugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const pluginsToUse: GenkitPlugin[] = [];
let defaultModel: string | undefined = undefined;

if (process.env.GOOGLE_API_KEY) {
  pluginsToUse.push(googleAI());
  defaultModel = 'googleai/gemini-2.0-flash';
} else {
  // This console.warn will appear in your Next.js server logs
  console.warn(
    `\n🔴 WARNING: GOOGLE_API_KEY is not set in your .env file.
    Google AI features will be severely limited or non-functional.
    To enable AI capabilities, please add your GOOGLE_API_KEY to the .env file in the root of your project.
    Example .env content:
    GOOGLE_API_KEY=your_actual_api_key_here\n`
  );
  // The app will start, but Genkit flows requiring a Google model will likely fail at runtime.
}

export const ai = genkit({
  plugins: pluginsToUse,
  model: defaultModel, // Set default model only if the googleAI plugin is configured
});
