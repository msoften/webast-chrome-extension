/*
 * On installing plugin.
 */
chrome.runtime.onInstalled.addListener(() => {
	/*
	 *  Context menus
	 */
	chrome.contextMenus.create({
		"id": "webast-copy-to-chatbox",
		"title": "Copy to chatbox",
		"contexts": ["selection"]
	});
});


/*
 * Context menu events listeners.
 */
chrome.contextMenus.onClicked.addListener((clickData) => {
	console.log(clickData);

	/*
	 * Handle clicks for Helper - Answer question.
	 */
	if (clickData.menuItemId === "webast-copy-to-chatbox") {
		sendMessageToHelperScript({target: 'webast-chatbox-textarea', message: clickData.selectionText});
	}
});


/*
 * Send message to helper script
 */
const sendMessageToHelperScript = (message) => {
	// (async () => {
	// 	const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});

	// 	const response = await chrome.tabs.sendMessage(tab.id, message);
	// 	// do something with response here, not outside the function
	// 	console.log('background.js: ' + response);

	// 	return response;
	// })();

	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
			console.log('background.js: ' + response.farewell);
		});
	});
};
