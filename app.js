// app.js

const express = require('express');
const connectDB = require('./config/db');
const eventRoutes = require("./routes/api/events");
const registrationRoutes = require("./routes/api/registration");
const adminRoutes = require("./routes/api/admin");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/events", eventRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/admin", adminRoutes);

connectDB();

app.get('/', (req, res) => res.send('Hello World!'));

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server is running on port ${port}`));

