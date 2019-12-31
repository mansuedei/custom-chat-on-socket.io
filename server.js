const io = require("socket.io")(3000);
const users = {};

io.on("connection", socket => {
	const totalUsers = Object.keys(io.engine.clients);
	io.sockets.emit("users-total", totalUsers);

	socket.on("new-user", username => {
		users[socket.id] = username;
		socket.broadcast.emit("user-connected", username);
	});
	// socket.emit(
	// 	"chat-message",
	// 	"Добро пожаловать в чат! Лучше поздно, чем никогда :D"
	// );
	socket.on("send-chat-message", message => {
		socket.broadcast.emit("chat-message", message);
	});

	socket.on("send-chat-message", username => {
		io.sockets.emit("username", username);
	});

	socket.on("send-chat-message", timestamp => {
		io.sockets.emit("timestamp", timestamp);
	});

	socket.on("disconnect", () => {
		const totalUsers = Object.keys(io.engine.clients);
		io.sockets.emit("users-total", totalUsers);
	});
});

//используй io.sockets.emit вместо socket.broadcast.emit чтобы отправить сообщение всем пользователяем, включая отправителя
