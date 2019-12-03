// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
var path = require("path");

var regexPanel;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "regexper-unofficial" is now active!');
	const extensionPath = context.extensionPath;
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('regexper.showRegEx', function () {
		const currDoc = vscode.window.activeTextEditor;
		if(!currDoc) {
			vscode.window.showInformationMessage('select a text document');
			return; 
		}
		var regex; // = "\\s*((?:proc(?:e(?:d(?:u(?:r(?:e)?)?)?)?)?)|func(?:t(?:i(?:o(?:n)?)?)?)?)\\s+([a-z_][a-z0-9_]*)\\s*(?:\\(([^\\)]*)\\))?";
		if(currDoc.selection.isEmpty) {
			var currLine = currDoc.document.lineAt(currDoc.selection.start.line).text;
			var start = currDoc.selection.start.character;
			var end = start;
			var delimits = ['"',"'","/"]
			while(start>=0 && delimits.indexOf(currLine[start])<0) start--;
			while(end<currLine.length && delimits.indexOf(currLine[end])<0) end++;
			regex = currLine.substring(start+1,end);
		} else {
			regex = currDoc.document.getText(currDoc.selection);
		}
		var panel = regexPanel;
		if(!panel) {
			panel = vscode.window.createWebviewPanel("rexeper","Regex "+regex,{}, {
				// Enable javascript in the webview
				enableScripts: true,

				// And restrict the webview to only loading content from our extension's `media` directory.
				localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'regexper'))]
			});
		}
		regexPanel = panel;
		panel.title = regex;
		const webView = panel.webview;
		webView.html = `<!DOCTYPE html>
		<html><body>
			<main id="content">
				<div class="application"> </div>
				<div class="results">
					<p id="regexp-expression" style="display: none;">${regex}</p>
				<div id="error"></div>
				<ul id="warnings"></ul>
				<div id="regexp-render" style="text-align: center;"></div>
				</div>
			</main>
		
			<footer>
				<script type="text/html" id="svg-container-base">
				  <div class="svg">
					<svg
					  xmlns="http://www.w3.org/2000/svg"
					  xmlns:cc="http://creativecommons.org/ns#"
					  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
					  version="1.1">
					  <defs>
						<style type="text/css">svg {
					background-color: var(--vscode-editor-background); }
				  
				  .root text,
				  .root tspan {
					font-size: 12px;
					font-family: var(--vscode-editor-font-family); 
					fill: var(--vscode-editor-foreground);
				}
				  
				  .root path {
					fill-opacity: 0;
					stroke-width: 2px;
					stroke: var(--vscode-icon-foreground); }
				  
				  .root circle {
					fill: #6b6659;
					stroke-width: 2px;
					stroke: var(--vscode-icon-foreground); }
				  
				  .anchor text, .any-character text {
					fill: var(--vscode-editor-foreground); }
				  
				  .anchor rect, .any-character rect {
					fill: #6b6659; }
				  
				  .escape text, .charset-escape text {
					fill: var(--vscode-editor-wordHighlightForeground); }
				  
				  .escape rect, .charset-escape rect {
					fill: var(--vscode-editor-wordHighlightBackground); }

					.literal text {
						fill: var(--vscode-editor-foreground); }

				  .literal rect {
					fill: var(--vscode-editor-selectionBackground); }
				  
				  .charset .charset-box {
					fill: var(--vscode-editor-findMatchBackground); }
				  
				  .subexp .subexp-label tspan,
				  .charset .charset-label tspan,
				  .match-fragment .repeat-label tspan {
					font-size: 10px; 
				}
				  
				  .repeat-label {
					cursor: help; }
				  
				  .subexp .subexp-label tspan,
				  .charset .charset-label tspan {
					dominant-baseline: text-after-edge; }
				  
				  .subexp .subexp-box {
					stroke: var(--vscode-editor-wordHighlightBackground);
					stroke-dasharray: 6,2;
					stroke-width: 2px;
					fill-opacity: 0; }
				  
				  .quote {
					fill: var(--vscode-editor-selectionForeground); }
				  </style>
					  </defs>
					  <metadata>
						<rdf:RDF>
						  <cc:License rdf:about="http://creativecommons.org/licenses/by/3.0/">
							<cc:permits rdf:resource="http://creativecommons.org/ns#Reproduction" />
							<cc:permits rdf:resource="http://creativecommons.org/ns#Distribution" />
							<cc:requires rdf:resource="http://creativecommons.org/ns#Notice" />
							<cc:requires rdf:resource="http://creativecommons.org/ns#Attribution" />
							<cc:permits rdf:resource="http://creativecommons.org/ns#DerivativeWorks" />
						  </cc:License>
						</rdf:RDF>
					  </metadata>
					</svg>
				  </div>
				  <div class="progress">
					<div style="width:0;"></div>
				  </div>
				</script>
		
				<script src="${webView.asWebviewUri(vscode.Uri.file(path.join(extensionPath, 'regexper', 'main.js')))}" async defer></script>
			</footer>
		  </body>
		</html>`
		//const parser = require('./regexper/main.js');
		//const inset = vscode.window.createWebviewTextEditorInset(currDoc,currDoc.selection.start.line,3);
		//inset.webview.html="<html><body>ciao</body></html>";
		//var ret = parser.parse(";(\/\*.*\*\/)*((\/\/|&&).*)?[\\r\\n]{1,2}$");
	});

	context.subscriptions.push(disposable);
};
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
