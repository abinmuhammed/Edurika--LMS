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
const {intitalizeSocket}=require("./Socket/socket")
const path=require('path')

const server = http.createServer(app);
intitalizeSocket(server)
const port = process.env.port || 4000;
dbconnect();
app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use("/api", require("./Routes/Student"));
app.use("/api", require("./Routes/mentorRoutes"));
app.use("/api", require("./Routes/AdminRoutes"));
app.use("/api", require("./Routes/Chat"));
app.use(ErrorHandler);
app.use(express.static(path.join(__dirname,"public")))

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

app.get("/", (req, res) => res.send("Hello World!"));
