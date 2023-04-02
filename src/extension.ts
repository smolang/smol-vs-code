import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    const command = 'smol.runRepl';

    const commandHandler = () => {
        const config = vscode.workspace.getConfiguration('smol');
        const jarPath = config.get<string>('smolJarPath');
        if (!jarPath) {
            vscode.window.showErrorMessage('SMOL JAR file path is not set. Go to settings to set the path.',
                                           {title: 'Open Settings'})
                .then((selection) => {
                    if (selection) {
                        vscode.commands.executeCommand('workbench.action.openSettings', 'smol.smolJarPath');
                    }});
            return;
        }
        if (!fs.existsSync(jarPath)) {
            vscode.window.showErrorMessage(`SMOL JAR file '${jarPath}' does not exist. Go to settings to modify the path.`,
                                           {title: 'Open Settings'})
                .then((selection: any) => {
                    if (selection) {
                        vscode.commands.executeCommand('workbench.action.openSettings', 'smol.smolJarPath');
                    }
                });
            return;
        }
        // TODO(rudi): try to find the absolute path of the Java executable,
        // or possibly make it a configuration option (or use JAVA_HOME)
        const javaCmd = 'java' + (process.platform === 'win32' ? '.exe' : '');
        const args:string[] = ["-jar", jarPath];
        vscode.window.createTerminal({
            name: 'SMOL REPL',
            shellPath: javaCmd,
            shellArgs: args
        }).show();
    };

    context.subscriptions.push(
        vscode.commands.registerCommand(command, commandHandler)
    );
}

export function deactivate() {}
