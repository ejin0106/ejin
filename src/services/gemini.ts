import { GoogleGenAI, Type } from '@google/genai';
import { Word } from '../types';
import { v4 as uuidv4 } from 'uuid';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generatePackData(text: string): Promise<Word[]> {
  const prompt = `Parse the following text into a list of Chinese words/characters.
For each, provide:
- text: the word or character itself
- type: 'character' if it's a single character, 'word' if it's multiple characters
- pinyin: the pinyin with tone marks
- radical: the radical (偏旁部首) if it's a single character, otherwise omit or empty string
- relatedWords: an array of up to 5 related words (组词)
- sentence: a simple sentence using the word/character (造句)

Text:
${text}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['character', 'word'] },
            pinyin: { type: Type.STRING },
            radical: { type: Type.STRING },
            relatedWords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            sentence: { type: Type.STRING },
          },
          required: ['text', 'type', 'pinyin', 'relatedWords', 'sentence'],
        },
      },
    },
  });

  const jsonStr = response.text?.trim() || '[]';
  try {
    const data = JSON.parse(jsonStr) as Omit<Word, 'id'>[];
    return data.map((item) => ({
      ...item,
      id: uuidv4(),
    }));
  } catch (e) {
    console.error('Failed to parse Gemini response', e);
    return [];
  }
}
