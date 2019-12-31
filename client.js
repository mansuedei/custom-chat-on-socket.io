const socket = io("http://localhost:3000");

const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const messageList = document.getElementById("message-list");

const usersList = document.getElementById("users-list");

const username = sessionStorage.getItem("user_name");
const avatar = sessionStorage.getItem("avatar");
socket.emit("new-user", username);
window.onload = () => {
	appendMessage("Вы присоединились к чату");
	addUserToList(username);

	const modal = document.getElementById("myModal");
	const modalOpenButton = document.getElementById("user-avatar");
	const modalCancelButton = document.getElementById("cancel-image-button");
	const modalSubmitButton = document.getElementById("submit-image-button");

	modalOpenButton.onclick = () => {
		modal.style.display = "block";
	};

	modalCancelButton.onclick = () => {
		modal.style.display = "none";
	};

	modalSubmitButton.onclick = () => {
		const userAvatarImage = document.getElementById("user-avatar__image");
		userAvatarImage.setAttribute("src", `${avatar}`);
		modal.style.display = "none";
	};
};

socket.on("connection"),
	socket.on("chat-message", data => {
		appendMessage(data);
	});

socket.on("user-connected", username => {
	appendMessage(`К чату присоединился новый участник: ${username}`);
	addUserToList(username);
});

socket.on("users-total", totalUsers => {
	totalUsersConnected(totalUsers);
	function totalUsersConnected(totalUsers) {
		const usersCounter = document.getElementById("ParticipantsNum");
		const correctedCounter = totalUsers.length - 1;

		if (correctedCounter > 1 && correctedCounter < 5) {
			usersCounter.innerHTML = `${correctedCounter} участника`;
		} else if (correctedCounter > 5) {
			usersCounter.innerHTML = `${correctedCounter.length} участников`;
		} else {
			usersCounter.innerHTML = "1 участник";
		}
	}
});

messageForm.addEventListener("submit", e => {
	e.preventDefault();
	const message = messageInput.value;
	const d = new Date();
	const mins = ("0" + d.getMinutes()).slice(-2);
	const timestamp = d.getHours() + ":" + mins;
	socket.emit("send-chat-message", message);
	socket.emit("send-username", username);
	socket.emit("send-timestamp", timestamp);
	messageInput.value = "";
	displayMyMessage(message);

	function displayMyMessage(message) {
		const messageItem = document.createElement("li");
		messageItem.setAttribute("id", "my-message-item");

		const messageAvatar = document.createElement("div");
		messageAvatar.setAttribute("id", "my-message-avatar");

		const messageAvatarImage = document.createElement("img");
		messageAvatarImage.setAttribute("id", "message-avatar__image");
		messageAvatarImage.setAttribute(
			"src",
			"https://www.travelcontinuously.com/wp-content/uploads/2018/04/empty-avatar.png"
		);

		const messageText = document.createElement("div");
		messageText.setAttribute("id", "my-message-text");
		messageText.innerText = message;

		const messageTime = document.createElement("div");
		messageTime.setAttribute("id", "my-message-time");
		messageTime.innerText = timestamp;

		messageList.appendChild(messageItem);

		messageItem.append(messageAvatar, messageText);

		messageAvatar.append(messageAvatarImage);

		messageText.append(messageTime);
	}
});

function appendMessage(message) {
	const d = new Date();
	const mins = ("0" + d.getMinutes()).slice(-2);
	const timestamp = d.getHours() + ":" + mins;

	const messageItem = document.createElement("li");
	messageItem.setAttribute("id", "message-item");

	const messageAvatar = document.createElement("div");
	messageAvatar.setAttribute("id", "message-avatar");

	const messageAvatarImage = document.createElement("img");
	messageAvatarImage.setAttribute("id", "message-avatar__image");
	messageAvatarImage.setAttribute(
		"src",
		"https://www.travelcontinuously.com/wp-content/uploads/2018/04/empty-avatar.png"
	);

	const messageText = document.createElement("div");
	messageText.setAttribute("id", "message-text");
	messageText.innerText = message;

	const messageTime = document.createElement("div");
	messageTime.setAttribute("id", "message-time");
	messageTime.innerText = timestamp;

	messageList.appendChild(messageItem);

	messageItem.append(messageAvatar, messageText);

	messageAvatar.append(messageAvatarImage);

	messageText.append(messageTime);
}

function addUserToList(username) {
	const userItem = document.createElement("li");
	userItem.setAttribute("id", "user-item");

	const userAvatar = document.createElement("button");
	userAvatar.setAttribute("id", "user-avatar");

	const userAvatarImage = document.createElement("img");
	userAvatarImage.setAttribute("id", "user-avatar__image");
	userAvatarImage.setAttribute(
		"src",
		"https://www.travelcontinuously.com/wp-content/uploads/2018/04/empty-avatar.png"
	);

	const userInfo = document.createElement("div");
	userInfo.setAttribute("id", "user-info");

	const userName = document.createElement("div");
	userName.setAttribute("id", "user-name");
	userName.innerText = username;

	const lastMessage = document.createElement("div");
	lastMessage.setAttribute("id", "last-message");

	usersList.appendChild(userItem);

	userItem.append(userAvatar, userInfo);

	userAvatar.append(userAvatarImage);

	userInfo.append(userName);
}

const dropZone = document.getElementById("drop-zone");

["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
	dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
	e.preventDefault();
	e.stopPropagation();
}

["dragenter", "dragover"].forEach(eventName => {
	dropZone.addEventListener(eventName, highlight, false);
});
["dragleave", "drop"].forEach(eventName => {
	dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
	dropZone.classList.add("highlight");
}

function unhighlight(e) {
	dropZone.classList.remove("highlight");
}

dropZone.addEventListener("drop", handleDrop, false);

function handleDrop(e) {
	let dt = e.dataTransfer;

	if (dt.files && dt.files.length) {
		const fd = new FormData();

		for (const file of dt.files) {
			fd.append("files", file);

			const reader = new FileReader();

			reader.readAsDataURL(file);
			reader.addEventListener("load", () => {
				const item = createItem(reader.result);
				dropZone.appendChild(item);
			});
		}

		fetch("/foo", { method: "POST", body: fd });
	}
}

function createItem(background) {
	const newDiv = document.createElement("div");
	newDiv.style.background = `url(${background})`;
	newDiv.style.backgroundSize = `cover`;
	newDiv.classList.add("image-preview");
	sessionStorage.setItem("avatar", background);

	return newDiv;
}
