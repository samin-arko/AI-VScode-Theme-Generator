import { GoogleGenAI, Type } from '@google/genai';

const ThemeSchema = {
    type: Type.OBJECT,
    properties: {
        background: { type: Type.STRING, description: "Deep dark background" },
        sidebar: { type: Type.STRING, description: "Slightly darker contrast background for menus" },
        activeLine: { type: Type.STRING, description: "Subtle highlight color for the current active line row" },

        foreground: { type: Type.STRING, description: "Standard text color (usually white/off-white)" },
        comments: { type: Type.STRING, description: "Muted color for code comments" },
        keywords: { type: Type.STRING, description: "Vibrant color for flow statements like if, return, for" },
        functions: { type: Type.STRING, description: "Color for function declarations and calls" },
        strings: { type: Type.STRING, description: "Distinct color for string literals and quotes" }
    },
    required: ["background", "sidebar", "activeLine", "foreground", "comments", "keywords", "functions", "strings"],
};

/**
 * Communicates with Gemini to fetch theme colors.
 * @param userPrompt The string describing the theme vibe.
 * @param apiKey The secured API key retrieved from VS Code's secrets vault.
 */
export async function generateThemeColors(userPrompt: string, apiKey: string, themeType: string) {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a gorgeous, highly cohesive color palette for a code editor. 
                   The theme type MUST be exclusively a ${themeType} theme based on this vibe: "${userPrompt}"`,
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