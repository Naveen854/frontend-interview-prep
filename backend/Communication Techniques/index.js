require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/long-poll',require('./Long-Polling'))
app.use('/short-poll',require('./Short-Polling'))

app.listen(PORT, () => {
  console.log(`Application Running on port: ${PORT}`);
});
