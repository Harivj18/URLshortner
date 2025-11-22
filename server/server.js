const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/connection');
const urlRoutes = require('./routes/urlRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api', urlRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});