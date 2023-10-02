const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5500;

// Allow all origins for development/testing, replace '*' with your app's origin in production.
const allowedOrigin = '*';

app.use(cors({
  origin: allowedOrigin,
}));

const fs = require('fs');

app.get('/budget', (req, res) => {
  fs.readFile('./budget-data.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading data');
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseError) {
      res.status(500).send('Error parsing data');
    }
  });
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`API served at http://localhost:${port}`);
});
