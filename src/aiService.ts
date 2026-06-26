import { GoogleGenAI, Type } from '@google/genai';

// Define the schema once here, keeping it hidden from the extension lifecycle
const ThemeSchema = {
    type: Type.OBJECT,
    properties: {
        background: { type: Type.STRING, description: "Dark hex color code for code editor background" },
        foreground: { type: Type.STRING, description: "Bright hex color code for readable text" },
        sidebar: { type: Type.STRING, description: "Hex color code for the side menus and activity bars" },
        accent: { type: Type.STRING, description: "Highly contrasting vibrant accent hex color code" }
    },
    required: ["background", "foreground", "sidebar", "accent"],
};

/**
 * Communicates with Gemini to fetch theme colors.
 * @param userPrompt The string describing the theme vibe.
 * @param apiKey The secured API key retrieved from VS Code's secrets vault.
 */
export async function generateThemeColors(userPrompt: string, apiKey: string) {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a gorgeous, highly cohesive color palette for a code editor based entirely on this theme description: "${userPrompt}".`,
        config: {
            responseMimeType: "application/json",
            responseSchema: ThemeSchema,
        },
    });

    if (!response.text) {
        throw new Error("Empty response from Gemini AI");
    }

    return JSON.parse(response.text);
}