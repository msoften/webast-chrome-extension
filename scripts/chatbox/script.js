const API_URL = 'https://irewagd7e2.execute-api.us-east-1.amazonaws.com/dev/v1';


// TODO: Add bootstrap icons.
// TODO: Add history tab.
/*
 * Views.
 */
const rawHtml = `
<div id="webast-chat-box" class="app-chatbox position-fixed bottom-0 end-0 bg-primary-subtle app-chatbox-maximize m-2">
	<ul class="nav nav-tabs" id="myTab" role="tablist">
		<!--<li class="nav-item" role="presentation">
			<button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">History</button>
		</li>-->

		<li class="nav-item webast-nav-item-chat" role="presentation">
			<button class="nav-link active" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Chat</button>
		</li>

		<li class="nav-item" role="presentation">
			<button class="nav-link disabled" id="webast-tokens-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Tokens: 0</button>
		</li>

		<li class="nav-item position-absolute end-0" role="presentation">
			<button id="webast-chat-box-close-button" class="nav-link" id="min-tab" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">X</button>
		</li>
	</ul>

	<div class="tab-content p-3 webast-tab-content" id="myTabContent">
		<!--<div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
			Chat history will appear here.
		</div>-->

		<div class="tab-pane fade show active" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
			<div id="chats" class="app-chats"></div>

			<div class="position-absolute bottom-0 start-0 end-0 p-3">
				<div class="row">
					<div class="col-9">
						<textarea id="appChatTextArea" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
					</div>

					<div class="col-3">
						<button id="clearChatButton" type="submit" class="btn btn-success m-1">Clear</button>
						<br/>
						<button id="sendChatButton" type="submit" class="btn btn-primary m-1">Send</button>
					</div>
				</div>
			  </div>
			</div>
		</div>
	</div>
</div>
`;

document.body.innerHTML = document.body.innerHTML + rawHtml;


/*
 * Variables.
 */
const chats = document.getElementById('chats');
const sendChatButton = document.getElementById('sendChatButton');
const clearChatButton = document.getElementById('clearChatButton');
const appChatTextArea = document.getElementById('appChatTextArea');


// TODO: Convert all references to this format.
const webastChatBox = document.getElementById('webast-chat-box');
const webastChatBoxCloseButton = document.getElementById('webast-chat-box-close-button');
const webastTokensTab = document.getElementById('webast-tokens-tab');

const messages = [];

/*
 * Events.
 */
webastChatBoxCloseButton.addEventListener('click', function (event) {
	toggleChatBoxMaximizeMinimize();
});

// TODO: function docs.
sendChatButton.addEventListener('click', function (event) {
	// TODO: Create function.
	// TODO: Disable until ai responds.
	const message = appChatTextArea.value;
	appChatTextArea.value = '';

	addMessageToMessages({
		role: 'user',
		content: message
	});

	// TODO: Send request to AI.
	getAIChatResponse(messages);
});

// TODO: function docs.
clearChatButton.addEventListener('click', function (event) {
	// Remove all elements.
	messages.splice(0, messages.length);

	chats.innerHTML = '';
});


/*
 * Messaging.
 */
//* Outgoing

// TODO: function docs.
const getAIChatResponse = async (messages) => {
	// const response = await chrome.runtime.sendMessage(messages);
	// console.log(response);

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"messages": JSON.stringify(messages),
			// TODO: Get email from service worker which gets from popup
			"email": "hello@hello.com"
		}),
		redirect: 'follow',
	};

	try {
		const response = await fetch(`${API_URL}/ai/chat`, requestOptions);
		const json = await response.json();

		if (!response.ok) {
			throw new Error(json.message);
		}

		if (json) {
			console.log(json);
			addMessageToMessages(json.data);
		}
	} catch (error) {
		console.log('error: ' + error.message);
	}
};



/*
 * Handle incoming messages.
 */
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {

		console.log(`Chatbox script message: ${JSON.stringify(request)}`);

		switch (request.target) {
			case 'webast-chatbox-textarea':
				appChatTextArea.value = request.message;
				break;
			default:
			// code block
		}

		sendResponse({farewell: "goodbye"});
	}
);


/*
 * Functions
 */
// TODO: Add docs.
const addMessageToMessages = (message) => {
	messages.push(message);
	chats.innerHTML = chats.innerHTML + `<div>${message.content}</div>`;
};

const toggleChatBoxMaximizeMinimize = () => {
	if (webastChatBox.classList.contains('app-chatbox-minimize')) {
		webastChatBox.classList.add('app-chatbox-maximize');
		webastChatBox.classList.remove('app-chatbox-minimize');
	} else {
		webastChatBox.classList.add('app-chatbox-minimize');
		webastChatBox.classList.remove('app-chatbox-maximize');
	}
};


// TODO: add function doc
const getUserTokens = async () => {
	const requestOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			// TODO: Get token from localstorage in popup page.
			'Authorization': `Bearer token-here`
		},
		redirect: 'follow',
	};

	try {
		// TODO: Get email from localsotrage popup page.
		const response = await fetch(`${API_URL}/tokens/user?email=hello@hello.com`, requestOptions);
		const json = await response.json();

		if (!response.ok) {
			throw new Error(json.message);
		}

		if (json) {
			console.log(typeof json.data);
			// TODO: format tokens to kb, mb
			webastTokensTab.innerHTML = `Tokens: ${json.data}`;
		}
	} catch (error) {
		console.log('error: ' + error.message);
	}
};

getUserTokens();
