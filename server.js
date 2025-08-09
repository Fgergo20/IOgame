const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("New player:", socket.id);

    socket.on("move", (data) => {
        // broadcast player movement to others
        socket.broadcast.emit("playerMoved", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);
        io.emit("playerLeft", socket.id);
    });
});

http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
