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
			console.log("================= MY AI PROMPT =================");
			console.log(userPrompt);
			console.log("================================================");

			const generatedColors = await generateThemeColors(userPrompt, apiKey);


			console.log("================= GEMINI RESPONSE =================");
			console.log(JSON.stringify(generatedColors, null, 2));
			console.log("===================================================");


			const themeContent = {
				name: "AI Generated Theme",
				type: "dark",
				colors: {
					"editor.background": generatedColors.background,
					"editor.foreground": generatedColors.foreground,
					"activityBar.background": generatedColors.sidebar,
					"sideBar.background": generatedColors.sidebar,
					"statusBar.background": generatedColors.accent,
					"statusBar.foreground": "#000000"
				}
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
