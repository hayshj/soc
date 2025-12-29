// app.js

const express = require('express');
const connectDB = require('./config/db');
const eventRoutes = require("./routes/api/events");
const registrationRoutes = require("./routes/api/registration");
const adminRoutes = require("./routes/api/admin");
const forumRoutes = require("./routes/api/forum");
const cors = require("cors");

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/events", eventRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/forum", forumRoutes);

connectDB();

// ✅ Serve frontend last (Vite uses 'dist'; CRA uses 'build')
const frontendPath = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(frontendPath));

// ✅ Frontend fallback (only for non-API routes)
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const port = process.env.PORT || 3002;

app.listen(port, () => console.log(`Server is running on port ${port}`));