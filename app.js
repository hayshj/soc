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

app.get('/', (req, res) => res.send('Hello World!'));

const port = process.env.PORT || 3002;

app.listen(port, () => console.log(`Server is running on port ${port}`));

