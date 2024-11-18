import * as vscode from 'vscode';
import { exec, spawn } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
	console.log('ask-mode is now active!');

	const runCommand = vscode.commands.registerCommand('ask-mode.runCommand', () => {
		console.log("run comand");
		const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }

        if (editor.document.languageId !== 'ask') {
            vscode.window.showErrorMessage('Active file is not a .ask file.');
            return;
        }
		const folderPath = vscode.workspace.rootPath;
		const filePath = editor.document.uri.fsPath;
		editor.document.save();
		if (process.platform === "win32") {
			exec(`cd ${folderPath}/.askignore && ask "${filePath}"`, (error, stdout, stderr) => {
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
		}
		else if (process.platform === "darwin") {
			exec(`cd ${folderPath}/.askignore && ./ask "${filePath}"`, (error, stdout, stderr) => {
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
		}
		else if (process.platform === "linux") {
			exec(`cd ${folderPath}/.askignore && ask "${filePath}"`, (error, stdout, stderr) => {
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
		}
	});
	const setupCommand = vscode.commands.registerCommand("ask-mode.setupCommand", () =>{
		vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Installing Ask...',
            cancellable: false
        }, async (progress) => {
            try {
				const folderPath = vscode.workspace.rootPath;
				if (process.platform === "win32") {
					const child = spawn('powershell.exe', ['-c', `cd ${folderPath} ; mkdir .askignore ; cd .askignore ; curl -o ask.zip "https://raw.githubusercontent.com/etmclovin/vscode-ask-mode/refs/heads/binary/ask.zip" ; tar -xf ask.zip ; del ask.zip`]);

					child.stdout.on('data', (data: any) => {
						console.log(`Powershell Output: ${data}`);
					});

					child.stderr.on('error', (error: any) => {
						vscode.window.showErrorMessage(`Error installing Ask: ${error}`);
						return;
					});

					vscode.window.showInformationMessage('Ask installed successfully!');
				}
				else if (process.platform === "darwin") {
					exec(`cd ${folderPath} ; mkdir .askignore ; cd .askignore ; curl -o ask.zip "https://raw.githubusercontent.com/etmclovin/vscode-ask-mode/refs/heads/binary/mac.zip" ; tar -xf ask.zip ; rm ask.zip`, (error, stdout, stderr) => {
						if (error) {
							vscode.window.showErrorMessage(`Error installing ask: ${stderr}`);
							return;
						}
					});
				}
				else if (process.platform === "linux") {
					exec(`cd ${folderPath} ; mkdir .askignore ; cd .askignore ; curl -o ask.zip "https://raw.githubusercontent.com/etmclovin/vscode-ask-mode/refs/heads/binary/linux.zip" ; tar -xf ask.zip ; rm ask.zip`, (error, stdout, stderr) => {
						if (error) {
							vscode.window.showErrorMessage(`Error installing ask: ${stderr}`);
							return;
						}
					});
				}
				else {
					vscode.window.showErrorMessage(`Operating system not supported`);
					return;
				}

			} catch (err: unknown) {
				const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
				vscode.window.showErrorMessage(`An error occurred: ${errorMessage}`);
			}
		});
	});
}