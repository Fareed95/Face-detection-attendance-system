import { LANGUAGE_VERSIONS } from "@/constants/constants";

const BASE_URL = "https://emkc.org/api/v2/piston";

export const executeCode = async (language, sourceCode) => {
  try {
    const response = await fetch(`${BASE_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: language,
        version: LANGUAGE_VERSIONS[language],
        files: [
          {
            content: sourceCode,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to execute code');
    }

    return await response.json();
  } catch (error) {
    console.error('Error executing code:', error);
    throw error;
  }
};