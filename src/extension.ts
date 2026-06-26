import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	console.log('AI Theme Generator is officially active!');

	// 1. Register our theme generator trigger command
	const generateThemeCommand = vscode.commands.registerCommand('ai-theme-generator.generate', async () => {

		// 2. Pop up an interactive input box asking the user for a prompt
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

		const fakeAIColors = {
			background: "#0d1117", // Dark slate gray
			foreground: "#58a6ff", // Neon blue text
			sidebar: "#161b22",    // Slightly darker panel gray
			accent: "#ff7b72"      // Coral pink highlight
		};

		// 4. Inject these colors directly into VS Code's live configuration engine


		// To be absolutely safe, let's build the exact object structure VS Code expects
		const themeContent = {
			name: "AI Generated Theme",
			type: "dark",
			colors: {
				"editor.background": fakeAIColors.background,
				"editor.foreground": fakeAIColors.foreground,
				"activityBar.background": fakeAIColors.sidebar,
				"sideBar.background": fakeAIColors.sidebar,
				"statusBar.background": fakeAIColors.accent,
				"statusBar.foreground": "#000000"
			}
		};

		const themeFilePath = path.join(context.extensionPath, 'ai-generated-theme.json');
		fs.writeFileSync(themeFilePath, JSON.stringify(themeContent, null, 4), 'utf8');

		const config = vscode.workspace.getConfiguration('workbench');
		await config.update('colorTheme', 'AI Generated Theme', vscode.ConfigurationTarget.Global);

		vscode.window.showInformationMessage(`Switched to your custom "${userPrompt}" theme!`);

	});

	context.subscriptions.push(generateThemeCommand);
}

export function deactivate() { }
