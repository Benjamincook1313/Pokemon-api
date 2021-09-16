require('dotenv').config();
const express = require('express');

const app = express();
const { PORT } = process.env;

app.use(express.json());

app.get('/api/get', (req, res) => {
  res.status(200).send({message: 'Its Working - Anakin Skywalker'})
});

app.listen(PORT, () => console.log(`Listening on port ${ PORT }`));