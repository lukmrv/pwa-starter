const notificationButton = document.querySelector(".notification-button");
let swRegistration = null;

initializeApp();

// registering service worker
function initializeApp() {
	if ("serviceWorker" in navigator) {
		console.log("SW", "serviceWorker" in navigator, "push", "PushManager" in window);
		//Register the service worker
		navigator.serviceWorker
			.register("./swrCacheAndFetch.js", {
				scope: ".",
			})
			.then((swReg) => {
				console.log("Service Worker is registered", swReg);

				swRegistration = swReg;
				initializeUi();
			})
			.catch((error) => {
				console.error("Service Worker Error", error);
			});
	}

	if ("PushManager" in window) {
		console.warn("Push messaging is supported");
	} else {
		console.warn("Push messaging is not supported");
		notificationButton.textContent = "Push Not Supported";
	}
}

// listetinng to notification button after app launch
function initializeUi() {
	notificationButton.addEventListener("click", () => {
		displayNotification();
	});
}

function displayNotification() {
	if (window.Notification && Notification.permission === "granted") {
		notification();
	}
	// If the user hasn't told if he wants to be notified or not
	// Note: because of Chrome, we are not sure the permission property
	// is set, therefore it's unsafe to check for the "default" value.
	else if (window.Notification && Notification.permission !== "denied") {
		Notification.requestPermission((status) => {
			if (status === "granted") {
				notification();
			} else {
				alert("You denied or dismissed permissions to notifications.");
			}
		});
	} else {
		// If the user refuses to get notified
		alert(
			"You denied permissions to notifications. Please go to your browser or phone setting to allow notifications."
		);
	}
}

function notification() {
	const timestamp = new Date(Date.now());

	hours = timestamp.getHours() < 10 ? `0${timestamp.getHours()}` : timestamp.getHours();
	minutes = timestamp.getMinutes() < 10 ? `0${timestamp.getMinutes()}` : timestamp.getMinutes();

	const options = {
		body: `The time is: ${hours}:${minutes}`,
		icon: "./icon.png",
	};
	swRegistration.showNotification("", options);
}
