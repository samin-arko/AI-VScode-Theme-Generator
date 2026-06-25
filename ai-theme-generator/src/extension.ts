import * as vscode from 'vscode';

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
	});

	context.subscriptions.push(generateThemeCommand);
}

export function deactivate() { }
