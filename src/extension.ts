import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { generateThemeColors } from './aiService';

export function activate(context: vscode.ExtensionContext) {
	console.log('AI Theme Generator is officially active!');


	const generateThemeCommand = vscode.commands.registerCommand('ai-theme-generator.generate', async () => {

		let apiKey = await context.secrets.get('gemini-api-key');

		if (!apiKey) {
			apiKey = await vscode.window.showInputBox({
				prompt: "Enter your Google AI Studio API Key (Saved securely inside your OS Keychain)",
				password: true // Hides characters like a password field
			});

			if (!apiKey) {
				vscode.window.showWarningMessage("API Key is required to run AI generations.");
				return;
			}


			// Store it securely so they don't have to input it again next time
			await context.secrets.store('gemini-api-key', apiKey);
			vscode.window.showInformationMessage("API Key saved securely!");
		}

		const selectedType = await vscode.window.showQuickPick(['Dark Theme', 'Light Theme'], {
			placeHolder: 'Choose the fundamental base layout style for your AI theme'
		});

		// If they press Escape, stop execution smoothly
		if (!selectedType) return;

		// Convert the selection into clean internal string tokens: 'dark' or 'light'
		const themeTypeToken = selectedType === 'Dark Theme' ? 'dark' : 'light';

		const userPrompt = await vscode.window.showInputBox({
			placeHolder: "e.g., Neon Cyberpunk, Pastel Lavender, Dark Forest",
			prompt: "What kind of theme vibe do you want to generate?"
		});

		// 3. Handle if the user hits Escape or leaves it blank
		if (!userPrompt) {
			vscode.window.showWarningMessage("Theme generation cancelled.");
			return;
		}

		// 4. Temporarily show a message confirming it received your input
		vscode.window.showInformationMessage(`Generating your "${userPrompt}" theme colors...`);


		// 4. Inject these colors directly into VS Code's live configuration engine


		// To be absolutely safe, let's build the exact object structure VS Code expects
		try {

			const generatedColors = await generateThemeColors(userPrompt, apiKey, themeTypeToken);

			const themeContent = {
				name: "AI Generated Theme",
				type: "themeTypeToken",
				colors: {
					// Massive UI Chrome coverage from just 3 structural anchors!
					"editor.background": generatedColors.background,
					"editor.foreground": generatedColors.foreground,
					"editor.lineHighlightBackground": generatedColors.activeLine,
					"activityBar.background": generatedColors.sidebar,
					"sideBar.background": generatedColors.sidebar,
					"sideBarSectionHeader.background": generatedColors.background,
					"statusBar.background": generatedColors.keywords, // Use keyword color as UI pop
					"statusBar.foreground": generatedColors.background,
					"titleBar.activeBackground": generatedColors.sidebar,
					"tab.activeBackground": generatedColors.background,
					"tab.inactiveBackground": generatedColors.sidebar
				},
				tokenColors: [
					// Standard TextMate scopes mapping code constructs across ALL languages
					{
						name: "Comments",
						scope: ["comment", "punctuation.definition.comment"],
						settings: { foreground: generatedColors.comments, fontStyle: "italic" }
					},
					{
						name: "Keywords & Flow Control",
						scope: ["keyword", "storage.type", "storage.modifier"],
						settings: { foreground: generatedColors.keywords, fontStyle: "bold" }
					},
					{
						name: "Strings",
						scope: ["string", "punctuation.definition.string"],
						settings: { foreground: generatedColors.strings }
					},
					{
						name: "Functions & Methods",
						scope: ["entity.name.function", "support.function", "meta.function-call"],
						settings: { foreground: generatedColors.functions }
					},
					{
						name: "Variables & Parameters",
						scope: ["variable", "meta.parameter"],
						settings: { foreground: generatedColors.foreground }
					},
					{
						name: "Constants & Numbers",
						scope: ["constant.numeric", "constant.language", "support.constant"],
						settings: { foreground: generatedColors.functions } // Re-use colors cohesively
					}
				]
			};

			const themeFilePath = path.join(context.extensionPath, 'ai-generated-theme.json');
			fs.writeFileSync(themeFilePath, JSON.stringify(themeContent, null, 4), 'utf8');

			const config = vscode.workspace.getConfiguration('workbench');
			await config.update('colorTheme', 'AI Generated Theme', vscode.ConfigurationTarget.Global);

			vscode.window.showInformationMessage(`Switched to your custom "${userPrompt}" theme!`);
		} catch (error: any) {
			vscode.window.showErrorMessage(`Generation Error: ${error.message}`);
		}
	});

	context.subscriptions.push(generateThemeCommand);
}

export function deactivate() { }
