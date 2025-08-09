const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

let users = {}; // socket.id -> name

io.on("connection", (socket) => {
    console.log("Új felhasználó:", socket.id);

    socket.on("setName", (name) => {
        users[socket.id] = name || "Névtelen";
        io.emit("systemMessage", `${users[socket.id]} csatlakozott a chathez`);
    });

    socket.on("chatMessage", (msg) => {
        if (users[socket.id]) {
            // Csak MÁSIK felhasználóknak küldjük
            socket.broadcast.emit("chatMessage", { name: users[socket.id], text: msg });
        }
    });

    socket.on("disconnect", () => {
        if (users[socket.id]) {
            io.emit("systemMessage", `${users[socket.id]} kilépett`);
            delete users[socket.id];
        }
    });
});

http.listen(PORT, () => {
    console.log(`Chat szerver fut a ${PORT} porton`);
});
