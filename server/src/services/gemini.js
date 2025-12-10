import fetch from 'node-fetch';

const MODEL = "gemini-2.0-flash-exp";
const API_KEY = process.env.GEMINI_API_KEY;

export async function callGemini(prompt, temperature = 0.7) {
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  
  return text;
}

export function parseJSON(text) {
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}
