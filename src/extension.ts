import * as vscode from 'vscode';
import { exec, spawn } from 'child_process';

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
				vscode.window.showErrorMessage(`Error running Ask script: ${stderr}`);
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

				const child = spawn('powershell.exe', ['-c', 'cd c:/ ; mkdir ask ; cd ask ; curl -o ask.zip "https://raw.githubusercontent.com/etmclovin/vscode-ask-mode/refs/heads/binary/ask.zip" ; tar -xf ask.zip ; $Env:Foo = (Get-ItemProperty HKCU:\Environment).PATH ; [Environment]::SetEnvironmentVariable("Path", "$env:Foo;C:/ask", "User")']);

				child.stdout.on('data', (data: any) => {
					console.log(`Powershell Output: ${data}`);
				});

				child.stderr.on('error', (error: any) => {
					vscode.window.showErrorMessage(`Error installing Ask: ${error}`);
					return;
				});

				vscode.window.showInformationMessage('Ask installed successfully!, Reload Vscode to use it!');

			} catch (err: unknown) {
				const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
				vscode.window.showErrorMessage(`An error occurred: ${errorMessage}`);
			}
		});
	});
}
