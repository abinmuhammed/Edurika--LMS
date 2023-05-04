const express = require("express");
const app = express();
const dotenv = require("dotenv");
const http = require("http");
const ErrorHandler = require("./middlewares/ErrorHandler");
const dbconnect = require("./config/dbconnection");
dotenv.config();
const socketio = require("socket.io");
const cors = require("cors");
const logger = require("morgan");
const {intitalizeSocket}=require("../Backend/Socket/socket")
const path=require('path')

const server = http.createServer(app);
intitalizeSocket(server)
const port = process.env.port || 4000;
dbconnect();
app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use("", require("./Routes/Student"));
app.use("", require("./Routes/mentorRoutes"));
app.use("", require("./Routes/AdminRoutes"));
app.use("", require("./Routes/Chat"));
app.use(ErrorHandler);
app.use(express.static(path.join(__dirname,"public")))

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

app.get("/", (req, res) => res.send("Hello World!"));
