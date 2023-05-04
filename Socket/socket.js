const socketio = require("socket.io");
const cors = require("cors");

function intitalizeSocket(server) {
  const io = new socketio.Server(server, {
    cors: {
      origin: process.env.FRONTEND_CONNECTION,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("a user is connected..!");

    // send and get message
    socket.on("sendMessage", ({ senderId, recieverId, text }) => {
      try {
        io.emit("getMessage", {
          recieverId,
          senderId,
          text,
        });
      } catch (error) {
        console.error("An error occurred while sending message:", error);
      }
    });

    //showing the notification

    socket.on("course_disabled", ({ Title, Author }) => {
      console.log(Title, Author, "jk");
      try {
        console.log(
          `${Title}-course by ${Author} has been currently blocked by Admin`
        );
        io.emit("get_course_disabled_notify", {
          text: `${Title}-course by ${Author} has been currently blocked by Admin`,
        });
      } catch (error) {
        console.log("notification error :", error);
      }
    });

    // showing notification to user when a new course is added

    socket.on("New_course_added", ({ Title, Author }) => {
      console.log(Title, Author);
      try {
        io.emit("get_course_added", {
          text: ` ${Title} course by ${Author} has been added. Check it out now for free`,
        });
      } catch (error) {
        console.log("notification Error:", error);
      }
    });
    // showing notification to Mentor when a new course is blocked

    socket.on(
      "course_disabled_for_specific_Mentor",
      ({ Title, Author, userID }) => {
        try {
          io.emit("get_course_disabled_for_specific_Mentor", {
            userID:userID,
            text: `Due to our policies,${Title}-course by ${Author} has been blocked by Admin`,
          });
        } catch (error) {
          console.log("notification Error:".error);
        }
      }
    );

    socket.on("disconnected", () => {
      console.log("a user disconnected!");
    });
  });
}

module.exports = { intitalizeSocket };
