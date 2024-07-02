require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const slackRoutes = require('./src/routes/slackRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/slack', slackRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
