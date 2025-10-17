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
        if (editor.document.languageId !== 'ask') {
            vscode.window.showErrorMessage('Active file is not a .ask file.');
            return;
        }
		const folderPath = vscode.workspace.rootPath;
		const filePath = editor.document.uri.fsPath;
		editor.document.save();
		exec(`ask "${filePath}"`, (error, stdout, stderr) => {
					if (error) {
						vscode.window.showErrorMessage(`Error running Ask script: ${stderr}, have you installed ask?`);
						return;
					}
					editor.edit(builder => {
						const doc = editor.document;
						builder.replace(new vscode.Range(doc.lineAt(0).range.start, doc.lineAt(doc.lineCount - 1).range.end), stdout);
					});
				});
	});
		

	// Below was the code for installing a prebuilt version of ask, i have since removed this feature as it required constant maintenence and was very shoddy at best. instead you must install ask yourself

	// const setupCommand = vscode.commands.registerCommand("ask-mode.setupCommand", () =>{
	// 	vscode.window.withProgress({
    //         location: vscode.ProgressLocation.Notification,
    //         title: 'Installing Ask...',
    //         cancellable: false
    //     }, async (progress) => {
    //         try {
	// 			const folderPath = vscode.workspace.rootPath;
	// 			switch(process.platform) {
	// 				case ("win32"): {
	// 					exec(`mkdir ask && cd ask && curl -o ask.zip "https://raw.githubusercontent.com/etmclovin/vscode-ask-mode/refs/heads/binary/ask.zip" && tar -xf ask.zip && del ask.zip`,(error, stdout, stderr) => {
	// 						if (error) {
	// 							vscode.window.showErrorMessage(`Error installing ask: ${stderr}`);
	// 							return;
	// 						}
	// 						vscode.window.showInformationMessage(`installing ask: ${stdout}`);
	// 					});
	// 					vscode.window.showInformationMessage('Ask installed successfully!');
	// 					break;
	// 				}
	// 				case ("darwin"): {
	// 					exec(`cd ${folderPath} ; mkdir .askignore ; cd .askignore ; curl -o ask.zip "https://raw.githubusercontent.com/etmclovin/vscode-ask-mode/refs/heads/binary/mac.zip" ; tar -xf ask.zip ; rm ask.zip`, (error, stdout, stderr) => {
	// 						if (error) {
	// 							vscode.window.showErrorMessage(`Error installing ask: ${stderr}`);
	// 							return;
	// 						}
	// 					});
	// 					vscode.window.showInformationMessage('Ask installed successfully!');
	// 					break;
	// 				}
	// 				case ("linux"): {
	// 					exec(`cd ${folderPath} ; mkdir .askignore ; cd .askignore ; curl -o ask.zip "https://raw.githubusercontent.com/etmclovin/vscode-ask-mode/refs/heads/binary/linux.zip" ; tar -xf ask.zip ; rm ask.zip`, (error, stdout, stderr) => {
	// 						if (error) {
	// 							vscode.window.showErrorMessage(`Error installing ask: ${stderr}`);
	// 							return;
	// 						}
	// 					});
	// 					vscode.window.showInformationMessage('Ask installed successfully!');
	// 					break;
	// 				}
	// 				default: {
	// 					vscode.window.showErrorMessage(`Operating system not supported`);
	// 					return;
	// 				}
	// 			}
	// 		} catch (err: unknown) {
	// 			const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
	// 			vscode.window.showErrorMessage(`An error occurred: ${errorMessage}`);
	// 		}
	// 	});
	// });
};