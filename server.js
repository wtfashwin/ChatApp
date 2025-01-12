const express = require("express");
const session = require("express-session");
const cors = require("cors");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const PORT = process.env.PORT || 3001;
const handlebars = exphbs.create({});
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
require("dotenv").config();
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const sess = {
  secret: process.env.DB_SECRET_SESSION,
  cookie: { maxAge: 30 * 1000 },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.use(cors());

app.use(express.static(path.join(__dirname, "Public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const botName = "TalkIO Bot";
app.use(routes);

io.on("connection", (socket) => {
  console.log("new connection");
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to TalkIO!"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
});

sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => console.log("Now listening on port " + PORT));
});
