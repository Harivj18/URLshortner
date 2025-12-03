const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/connection');
const urlRoutes = require('./routes/urlRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`👉 Request handled by POD: ${process.env.HOSTNAME} | URL: ${req.method} ${req.url}`);
  next();
});

app.use('/api', urlRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Kubernetes Server running on http://localhost:${PORT}`);
});