// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {

	console.log('ask-mode is now active!');

	const runCommand = vscode.commands.registerCommand('ask-mode.runCommand', () => {
		const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }

        const document = editor.document;
        if (document.languageId !== 'ask') {
            vscode.window.showErrorMessage('Active file is not a .ask file.');
            return;
        }

		const filePath = document.uri.fsPath;
		editor.document.save();

		exec(`ask "${filePath}"`, (error, stdout, stderr) => {
			if (error) {
				vscode.window.showErrorMessage(`Error running Syrup script: ${stderr}`);
				return;
			}
			const output = stdout;
		
		editor.edit(builder => {
			const doc = editor.document;
			builder.replace(new vscode.Range(doc.lineAt(0).range.start, doc.lineAt(doc.lineCount - 1).range.end), output);
		});
		});
	});

	const setupCommand = vscode.commands.registerCommand("ask-mode.setupCommand", () =>{
		vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Installing Ask...',
            cancellable: false
        }, async (progress) => {
            try {
				exec("cd %HOMEPATH% && mkdir ask && cd ask && wget -o ask.zip https://drive.usercontent.google.com/u/0/uc?id=1Rr19yiz1mK3_Eiukc3KjkrbRLd8BqE20&export=download && tar -xf ask.zip && setx /M PATH '%PATH%;%HOMEPATH%/ask'")
			}
	});
};

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('Ask-mode extension deactivated.');
}
