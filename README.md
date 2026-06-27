# ai-theme-generator

A VS Code extension that generates a new editor theme based on text descriptions using Google Gemini AI.

## Features

* Mood-driven styling: Type text prompts like "cyberpunk neon cyan" or "cozy matcha latte" to update your workspace colors.

* Light and Dark modes: Choose whether you want a light or dark layout foundation before generating the colors.

* Universal color mapping: Automatically sets cohesive colors for code syntax like functions, strings, and comments across different programming languages.

* Secure storage: Your API key is stored safely in your operating system's native keychain using the VS Code secrets vault. It is never exposed in your git history or code repository.

## Installation

1. Open VS Code.
2. Click on the Extensions icon in the Activity Bar on the side of the window 
   (or press `Ctrl+Shift+X` / `Cmd+Shift+X`).
3. Search for `AI Theme Generator`.
4. Click **Install**.

## How to Use It

1. Get a free API Key from **[Google AI Studio](https://aistudio.google.com/)**.
2. Open your VS Code Command Palette (`Ctrl + Shift + P` or `Cmd + Shift + P`).
3. Search for and select: **`AI Theme: Generate a New Theme`**.
4. Paste your API key when prompted (you only have to do this once).
5. Pick your mode (Dark/Light), describe how you want your theme to look like, and hit Enter!

## Built With

* TypeScript
* VS Code Extension API
* Google Gen AI SDK