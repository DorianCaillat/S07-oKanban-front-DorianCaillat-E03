require('dotenv').config();
const express = require('express');

const app = express();

app.use(express.static('public'));

// Middleware pour activer CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`App running at http://localhost:${PORT}`);
});