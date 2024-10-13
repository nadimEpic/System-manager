import express from "express";
import con from "../utils/db.js";

import http from "http";
import { Server } from "socket.io";

const router = express.Router();


router.get("/history", (req, res) => {
    const sql = `
    SELECT messages.content, employee.name AS senderId, 'employee' AS senderType, messages.created_at
  FROM messages
  INNER JOIN employee ON messages.senderId = employee.name
  UNION
  SELECT messages.content, admin.username AS senderId, 'admin' AS senderType, messages.created_at
  FROM messages
  INNER JOIN admin ON messages.senderId = admin.username
  ORDER BY created_at
  `;
  con.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true, messages: result });
  });
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sendMessage", (message) => {
    console.log("Message received:", message); 
    const sql = "INSERT INTO messages (content, senderId) VALUES (?, ?)";
    con.query(sql, [message.content, message.senderId], (err, result) => {
      if (err) {
        console.error("Database error:", err); 
        throw err;
      }
      io.emit("receiveMessage", {
        content: message.content,
        senderId: message.senderId,
      }); 
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

export { router as ChatRouter, server as chatServer };
