"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
function activate(context) {
  console.log("AI Theme Generator is officially active!");
  const generateThemeCommand = vscode.commands.registerCommand("ai-theme-generator.generate", async () => {
    const userPrompt = await vscode.window.showInputBox({
      placeHolder: "e.g., Neon Cyberpunk, Pastel Lavender, Dark Forest",
      prompt: "What kind of theme vibe do you want to generate?"
    });
    if (!userPrompt) {
      vscode.window.showWarningMessage("Theme generation cancelled.");
      return;
    }
    vscode.window.showInformationMessage(`Generating your "${userPrompt}" theme colors...`);
    const fakeAIColors = {
      background: "#0d1117",
      // Dark slate gray
      foreground: "#58a6ff",
      // Neon blue text
      sidebar: "#161b22",
      // Slightly darker panel gray
      accent: "#ff7b72"
      // Coral pink highlight
    };
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
    const themeFilePath = path.join(context.extensionPath, "ai-generated-theme.json");
    fs.writeFileSync(themeFilePath, JSON.stringify(themeContent, null, 4), "utf8");
    const config = vscode.workspace.getConfiguration("workbench");
    await config.update("colorTheme", "AI Generated Theme", vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(`Switched to your custom "${userPrompt}" theme!`);
  });
  context.subscriptions.push(generateThemeCommand);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
