const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {
    console.log("Új játékos csatlakozott:", socket.id);

    // név beállítása
    socket.on("setName", (name) => {
        players[socket.id] = {
            x: 100, y: 100,
            color: getRandomColor(),
            name: name || "Névtelen"
        };
        socket.emit("currentPlayers", players);
        socket.broadcast.emit("newPlayer", { id: socket.id, ...players[socket.id] });
    });

    // mozgás
    socket.on("move", (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            io.emit("playerMoved", { id: socket.id, x: data.x, y: data.y });
        }
    });

    // chat
    socket.on("chatMessage", (msg) => {
        if (players[socket.id]) {
            io.emit("chatMessage", { name: players[socket.id].name, text: msg });
        }
    });

    // lelépés
    socket.on("disconnect", () => {
        console.log("Játékos lelépett:", socket.id);
        delete players[socket.id];
        io.emit("playerLeft", socket.id);
    });
});

http.listen(PORT, () => {
    console.log(`Szerver fut a ${PORT} porton`);
});

function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
