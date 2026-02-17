// Load env from server/.env (force path)
require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Debug (remove later)
console.log("ENV FILE PATH:", __dirname + "/.env");
console.log("MONGODB_URI:", process.env.MONGODB_URI);

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// Routes
const userRoutes = require("./routes/users");
const leaveRoutes = require("./routes/leaves");

app.use("/api/users", userRoutes);
app.use("/api/leaves", leaveRoutes);

app.get("/", (req, res) => res.send("API running"));

// Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
