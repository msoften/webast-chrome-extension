(function () {
	function onDOMContentLoaded() {
		const API_URL = 'https://irewagd7e2.execute-api.us-east-1.amazonaws.com/dev/v1';
		const STORAGE_TOKEN_KEY = 'webast-token';
		const STORAGE_EMAIL_KEY = 'webast-email';

		// Global functions.
		const showAlert = (message, type) => {
			const wrapper = document.createElement('div');
			wrapper.innerHTML = [
				`<div class="alert alert-${type} alert-dismissible" role="alert">`,
				`   <div>${message}</div>`,
				'   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
				'</div>'
			].join('');

			alertPlaceholder.append(wrapper);
		}

		//* Pages
		if (window.location.href.includes('login')) {
			// If logged in redirect to dash
			if (localStorage.getItem(STORAGE_TOKEN_KEY) && localStorage.getItem(STORAGE_EMAIL_KEY)) {
				window.location = "dash.html";
			}

			const loginButton = document.getElementById('loginButton');
			const registerButton = document.getElementById('registerButton');

			const alertPlaceholder = document.getElementById('liveAlertPlaceholder');

			registerButton.addEventListener('click', function (event) {
				register(event);
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
						localStorage.setItem(STORAGE_EMAIL_KEY, email);
						localStorage.setItem(STORAGE_TOKEN_KEY, json.data.token);

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
		}

		if (window.location.href.includes('dash.html')) {
			const logoutButton = document.getElementById('logoutButton');
			const webastSubscriptions = document.getElementById('webast-subscriptions');
			const webastUserTokens = document.getElementById('webast-user-tokens');

			//* Events.
			// TODO: Use config variables for token names or create commom functions.
			logoutButton.addEventListener('click', function (event) {
				localStorage.removeItem(STORAGE_EMAIL_KEY);
				localStorage.removeItem(STORAGE_TOKEN_KEY);

				window.location = "login.html";
			});


			// TODO: add function doc
			const getSubscriptions = async () => {
				const requestOptions = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${localStorage.getItem(STORAGE_TOKEN_KEY)}`
					},
					redirect: 'follow',
				};

				try {
					const response = await fetch(`${API_URL}/subscriptions`, requestOptions);
					const json = await response.json();

					if (!response.ok) {
						throw new Error(json.message);
					}

					if (json) {
						console.log(typeof json.data);

						json.data.forEach(subscription => {
							// TODO: Use subscription id for button id
							webastSubscriptions.innerHTML = webastSubscriptions.innerHTML + `
								<li>
									${subscription.description}
									<br/>
									<a id="subscription-button-${subscription.price}" href="checkout.html?sub=${encodeURIComponent(JSON.stringify(subscription))}" class="btn btn-primary">buy $${subscription.price}/-</a>
								</li>
							`;
						});

						// json.data.forEach(subscription => {
						// 	document.getElementById(`subscription-button-${subscription.price}`).addEventListener('click', function (event) {
						// 		subscibe(subscription);
						// 	});
						// });
					}
				} catch (error) {
					console.log('error: ' + error.message);
				}
			};

			getSubscriptions();


			// TODO: add function doc
			const getUserTokens = async () => {
				const requestOptions = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${localStorage.getItem(STORAGE_TOKEN_KEY)}`
					},
					redirect: 'follow',
				};

				try {
					const response = await fetch(`${API_URL}/tokens/user?email=${localStorage.getItem(STORAGE_EMAIL_KEY)}`, requestOptions);
					const json = await response.json();

					if (!response.ok) {
						throw new Error(json.message);
					}

					if (json) {
						console.log(typeof json.data);
						webastUserTokens.innerHTML = `Tokens: ${json.data}`;
					}
				} catch (error) {
					console.log('error: ' + error.message);
				}
			};

			getUserTokens();
		}

		if (window.location.href.includes('checkout')) {
			console.log('+');
			const urlParams = new URLSearchParams(window.location.search);
			const subscription = JSON.parse(urlParams.get('sub'));
			console.log(subscription);

			const subscibe = async (paymentReference) => {
				const requestOptions = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						"email": localStorage.getItem(STORAGE_EMAIL_KEY),
						"targetSubscription": subscription,
						"paymentReference": paymentReference
					  }),
					redirect: 'follow'
				};

				try {
					const response = await fetch(`${API_URL}/subscriptions/user`, requestOptions);


					if (!response.ok) {
						throw new Error(json.message);
					}

					window.location = "dash.html";
				} catch (error) {
					console.log('error: ' + error.message);
					showAlert(error.message, 'danger');
				}
			};

			/*
			 * Paypal
			 */
			paypal.Buttons(
				{
					createOrder: function (data, actions) {
						// This function sets up the details of the transaction, including the amount and line item details.
						return actions.order.create({
							purchase_units: [{
								reference_id: self.order_id,
								description: "Order id: " + self.order_id,
								amount: {
									value: subscription.price
								}
							}],
							application_context: {shipping_preference: 'NO_SHIPPING'}
						});
					},
					onApprove: function (data, actions) {
						// This function captures the funds from the transaction.
						return actions.order.capture().then(function (details) {
							//  This function shows a transaction success message to your buyer.
							//  alert('Transaction completed by ' + details.payer.name.given_name);

							console.log(details.purchase_units[0].payments.captures[0].id);

							subscibe(details.purchase_units[0].payments.captures[0].id);

						});
					}
				}
			).render('#paypal-button-container');
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
