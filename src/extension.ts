import * as vscode from 'vscode';
import { generateThemeColors } from './aiService';

export function activate(context: vscode.ExtensionContext) {
	console.log('AI Theme Generator is officially active!');

	const generateThemeCommand = vscode.commands.registerCommand('ai-theme-generator.generate', async () => {

		let apiKey = await context.secrets.get('gemini-api-key');

		if (!apiKey) {
			apiKey = await vscode.window.showInputBox({
				prompt: "Enter your Google AI Studio API Key (Saved securely inside your OS Keychain)",
				password: true
			});

			if (!apiKey) {
				vscode.window.showWarningMessage("API Key is required to run AI generations.");
				return;
			}

			await context.secrets.store('gemini-api-key', apiKey);
			vscode.window.showInformationMessage("API Key saved securely!");
		}

		const selectedType = await vscode.window.showQuickPick(['Dark Theme', 'Light Theme'], {
			placeHolder: 'Choose the fundamental base layout style for your AI theme'
		});

		if (!selectedType) return;

		const themeTypeToken = selectedType === 'Dark Theme' ? 'dark' : 'light';

		const userPrompt = await vscode.window.showInputBox({
			placeHolder: "e.g., Neon Cyberpunk, Pastel Lavender, Dark Forest",
			prompt: "What kind of theme vibe do you want to generate?"
		});

		if (!userPrompt) {
			vscode.window.showWarningMessage("Theme generation cancelled.");
			return;
		}

		vscode.window.showInformationMessage(`Generating your "${userPrompt}" theme colors...`);

		try {
			const generatedColors = await generateThemeColors(userPrompt, apiKey, themeTypeToken);
			const config = vscode.workspace.getConfiguration();

			const uiColors = {
				"editor.background": generatedColors.background,
				"editor.foreground": generatedColors.foreground,
				"editor.lineHighlightBackground": generatedColors.activeLine,
				"activityBar.background": generatedColors.sidebar,
				"sideBar.background": generatedColors.sidebar,
				"sideBarSectionHeader.background": generatedColors.background,
				"statusBar.background": generatedColors.keywords,
				"statusBar.foreground": generatedColors.background,
				"titleBar.activeBackground": generatedColors.sidebar,
				"tab.activeBackground": generatedColors.background,
				"tab.inactiveBackground": generatedColors.sidebar
			};

			const tokenColors = [
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
					settings: { foreground: generatedColors.functions }
				}
			];

			const currentUiConfigs = config.get<{ [key: string]: any }>('workbench.colorCustomizations') || {};
			const currentTokenConfigs = config.get<{ [key: string]: any }>('editor.tokenColorCustomizations') || {};

			currentUiConfigs["[AI Generated Theme]"] = uiColors;
			currentTokenConfigs["[AI Generated Theme]"] = { textMateRules: tokenColors };

			await config.update('workbench.colorCustomizations', currentUiConfigs, vscode.ConfigurationTarget.Global);
			await config.update('editor.tokenColorCustomizations', currentTokenConfigs, vscode.ConfigurationTarget.Global);

			await config.update('workbench.colorTheme', 'AI Generated Theme', vscode.ConfigurationTarget.Global);

			vscode.window.showInformationMessage(`Switched to your custom "${userPrompt}" theme!`);
		} catch (error: any) {
			vscode.window.showErrorMessage(`Generation Error: ${error.message}`);
		}
	});

	context.subscriptions.push(generateThemeCommand);
}

export function deactivate() { }