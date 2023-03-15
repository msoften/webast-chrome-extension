(function () {
	function onDOMContentLoaded() {
		const API_URL = 'https://irewagd7e2.execute-api.us-east-1.amazonaws.com/dev/v1';

		//* Pages
		if (window.location.href.includes('login')) {
			// If logged in redirect to dash
			if(localStorage.getItem('webast-token') && localStorage.getItem('webast-email')) {
				window.location = "dash.html";
			}

			const loginButton = document.getElementById('loginButton');
			const registerButton = document.getElementById('registerButton');
	
			const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
	
			registerButton.addEventListener('click', function (event) {
				register(event)
			});

			loginButton.addEventListener('click', function (event) {
				login(event);
			});
	
			//* Functions.
			async function register(event) {
				// TODO: add loader indicator.
				const emailInput = document.getElementById('email');
				const passwordInput = document.getElementById('password');
	
				// get the values from the form inputs
				const email = emailInput.value;
				const password = passwordInput.value;
	
				//TODO: Validate email input.
				if (email === '')
					emailInput.classList.add('is-invalid');
	
				//TODO: Validate password input.
				if (password === '')
					passwordInput.classList.add('is-invalid');
	
				const requestOptions = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						"email": email,
						"password": password
					}),
					redirect: 'follow'
				};
	
				try {
					const response = await fetch(`${API_URL}/auth/register`, requestOptions);
					const json = await response.json();
	
					if (!response.ok) {
						throw new Error(json.message);
					}
	
					if (json) {
						localStorage.setItem("webast-email", email);
						localStorage.setItem("webast-token", json.data.token);

						window.location = "dash.html";
					}
				} catch (error) {
					console.log('error: ' + error.message);
					showAlert(error.message, 'danger');
				}
			}

			async function login(event) {
				// TODO: add loader indicator.
				const emailInput = document.getElementById('email');
				const passwordInput = document.getElementById('password');
	
				// get the values from the form inputs
				const email = emailInput.value;
				const password = passwordInput.value;
	
				//TODO: Validate email input.
				if (email === '')
					emailInput.classList.add('is-invalid');
	
				//TODO: Validate password input.
				if (password === '')
					passwordInput.classList.add('is-invalid');
	
				const requestOptions = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						"email": email,
						"password": password
					}),
					redirect: 'follow'
				};
	
				try {
					const response = await fetch(`${API_URL}/auth/login`, requestOptions);
					const json = await response.json();
	
					if (!response.ok) {
						throw new Error(json.message);
					}
	
					if (json) {
						localStorage.setItem("webast-email", email);
						localStorage.setItem("webast-token", json.data.token);

						window.location = "dash.html";
					}
				} catch (error) {
					console.log('error: ' + error.message);
					showAlert(error.message, 'danger');
				}
			}
	
			const showAlert = (message, type) => {
				const wrapper = document.createElement('div')
				wrapper.innerHTML = [
					`<div class="alert alert-${type} alert-dismissible" role="alert">`,
					`   <div>${message}</div>`,
					'   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
					'</div>'
				].join('')
	
				alertPlaceholder.append(wrapper)
			}
		}

		if (window.location.href.includes('dash.html')) {
			console.log('+');
			const logoutButton = document.getElementById('logoutButton');

			//* Events.
			// TODO: Use config variables for token names or create commom functions.
			logoutButton.addEventListener('click', function (event) {
				localStorage.removeItem("webast-email");
				localStorage.removeItem("webast-token");

				window.location = "login.html";
			});
		}
	}

	if (document.readyState === 'loading') {
		// The DOM hasn't finished loading yet
		document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
	} else {
		// The DOM has already finished loading
		onDOMContentLoaded();
	}
})();
