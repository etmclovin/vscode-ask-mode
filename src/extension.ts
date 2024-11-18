import * as vscode from 'vscode';
import { exec, spawn } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
	// const editor = vscode.window.activeTextEditor;
	// if (editor === undefined){
	// 	return;
	// }
	// else if (editor.document.languageId === 'ask') {
	// 	vscode.window.showInformationMessage('Active file is a .ask file.');
	// 	const folderPath = vscode.workspace.rootPath;
	// 	console.log(folderPath);
	// 	if (process.platform==="win32") {
	// 		exec("mkdir '.askignore'", (error, stdout, stderr) => {
	// 			if (error) {
	// 				vscode.window.showInformationMessage(`Ask extension inititalised`);
	// 			}
	// 			else{	
	// 			console.log("windows detected");
	// 			exec(`cd ${folderPath} && cd .askignore && curl -o ask.zip "https://raw.githubusercontent.com/etmclovin/vscode-ask-mode/refs/heads/binary/ask.zip" && tar -xf ask.zip`, (error, stdout, stderr) => {
	// 				if (error) {
	// 					vscode.window.showErrorMessage(`Error initialising ask extension: ${stderr}`);
	// 					return;
	// 				}
	// 				const output = stdout;
	// 			});
	// 			}
	// 		});
	// 	}
	// 	else if (process.platform === "darwin"){
			
	// 	}
	// 	else{
	// 		const osPlatform = "linux";
	// 	}
	// }
	// else{
	// 	return;
	// }


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

		const filePath = editor.document.uri.fsPath;
		editor.document.save();
		exec(`cd ask && ask "${filePath}"`, (error, stdout, stderr) => {
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
				if (process.platform === "win32") {
					const child = spawn('powershell.exe', ['-c', 'mkdir ask ; cd ask ; curl -o ask.zip "https://raw.githubusercontent.com/etmclovin/vscode-ask-mode/refs/heads/binary/ask.zip" ; tar -xf ask.zip ; del ask.zip']);

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
					exec(`mkdir ask ; cd ask ; curl -o ask.zip "https://raw.githubusercontent.com/etmclovin/vscode-ask-mode/refs/heads/binary/mac.zip ; tar -xf ask.zip ; rm ask.zip`, (error, stdout, stderr) => {
						if (error) {
							vscode.window.showErrorMessage(`Error installing ask: ${stderr}`);
							return;
						}
					});
				}
				else if (process.platform === "linux") {
					exec(`mkdir ask ; cd ask ; curl -o ask.zip "https://raw.githubusercontent.com/etmclovin/vscode-ask-mode/refs/heads/binary/linux.zip ; tar -xf ask.zip ; rm ask.zip`, (error, stdout, stderr) => {
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