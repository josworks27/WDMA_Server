const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.status(200).json('good job');
});

app.listen(app.get('port'), () =>
  console.log(`WDMA app listening at http://localhost:${PORT}`)
);
